import path from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Interaction, MedicationDetails, MedicationSummary, LanguageCounts, Question } from './utils/types';

const serviceAccountPath = path.resolve(process.env.SERVICE_ACCOUNT_PATH || '');
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccountPath),
  });
}
const db = getFirestore();

const INTERACTION_COLLECTIONS = [
  'medication_leaflet',
  'medication_focused_leaflet',
  'medication_summary_leaflet',
  'medication_support_material',
];

export const getMedicationSummaryList = async (): Promise<MedicationSummary[]> => {
  const queryPromises = INTERACTION_COLLECTIONS.map(name => db.collectionGroup(name).get());
  const snapshots = await Promise.all(queryPromises);

  const summaryMap: Map<string, number> = new Map();

  snapshots.forEach(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.medication_name) {
        const currentCount = summaryMap.get(data.medication_name) || 0;
        //const interactionsToAdd = data.count || 0;
        const interactionsToAdd = (data.count_en || 0) + (data.count_es || 0);
        //const interactionsToAdd = (data.count_en || 0) + (data.count_es || data.count || 0); // se vogliamo considerare count come count_es
        summaryMap.set(data.medication_name, currentCount + interactionsToAdd);
      }
    });
  });

  return Array.from(summaryMap, ([name, totalInteractions]) => ({ name, totalInteractions }))
    .sort((a, b) => b.totalInteractions - a.totalInteractions);
};

/**
 * This function queries multiple Firestore collections in parallel to gather interaction
 * data associated with a given medication name. It then aggregates the counts
 * by language for each interaction type.
 *
 * @param medicationName - The name of the medication to search for.
 * @returns A promise that resolves to a {@link MedicationDetails} object, containing
 * the medication name and a list of its interactions with language-specific counts.
 */
export const getMedicationDetails = async (medicationName: string): Promise<MedicationDetails> => {
  const interactionPromises = INTERACTION_COLLECTIONS.map(collectionName =>
    db.collection(collectionName).where('medication_name', '==', medicationName).get()
  );

  const questionsPromise = db.collection('chat_questions').where('medication_name', '==', medicationName).get();

  // `Promise.all` resolves an array of promises. It maintains the original order,
  // meaning the `snapshots` array will correspond directly to the order of `queryPromises`
  // generated from the `INTERACTION_COLLECTIONS.map()` call. This allows us to
  // safely use the index to get the correct collection name later on.
  const [interactionSnapshots, questionsSnapshot] = await Promise.all([Promise.all(interactionPromises), questionsPromise]);

  const interactions: Interaction[] = interactionSnapshots.map((snapshot, index) => {
    const collectionName = INTERACTION_COLLECTIONS[index];
    const type = collectionName.split('_')[1] || collectionName.split('_')[0]; // (es. leaflet, summary, suppport)
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

    const counts: LanguageCounts = { total: 0 };

    // The `snapshot` variable is a `QuerySnapshot` object returned by the Firestore `.get()` method.
    // This object represents a collection of documents. Its `forEach` method iterates
    // through each `QueryDocumentSnapshot` (i.e., each document) within the result set.
    snapshot.forEach(doc => {
      const data = doc.data();
      //counts.total += data.count || 0;
      const countEn = data.count_en || 0;
      const countEs = data.count_es || 0;
      //const countEs = data.count_es || data.count || 0; // se vogliamo trattare count come count_es

      counts['en'] = (counts['en'] || 0) + countEn;
      counts['es'] = (counts['es'] || 0) + countEs;
    /*
      Object.keys(data).forEach(key => {
        if (key.startsWith('count_')) {
          const lang = key.split('_')[1];
          counts[lang] = (counts[lang] || 0) + data[key]; // from count_it to it
        }
      });*/
      counts.total += countEn + countEs;
    });
    

    return { type: formattedType, counts }; // (es. [{ type: "Leaflet", counts: {total: 42, en: 30, it: 12}}, {...}]
  });
  const filteredInteractions = interactions.filter(interaction => interaction.counts.total > 0);

  const questions: Question[] = questionsSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      question: data.question || 'Text not available',
      lang: data.language || 'N/A',
      timestamp: data.timestamp?.toDate() || new Date()
    }
  })

  return { name: medicationName, interactions: filteredInteractions, questions };
};