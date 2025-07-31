import path from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Interaction, MedicationDetails, MedicationSummary, LanguageCounts } from './utils/types';

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
        const interactionsToAdd = data.count || 0;
        summaryMap.set(data.medication_name, currentCount + interactionsToAdd);
      }
    });
  });

  return Array.from(summaryMap, ([name, totalInteractions]) => ({ name, totalInteractions }))
    .sort((a, b) => b.totalInteractions - a.totalInteractions);
};

export const getMedicationDetails = async (medicationName: string): Promise<MedicationDetails> => {
  const queryPromises = INTERACTION_COLLECTIONS.map(collectionName =>
    db.collection(collectionName).where('medication_name', '==', medicationName).get()
  );

  const snapshots = await Promise.all(queryPromises); // spiegare che all e il map con l'index mantengono l'ordine e come

  const interactions: Interaction[] = snapshots.map((snapshot, index) => {
    const collectionName = INTERACTION_COLLECTIONS[index];
    const type = collectionName.split('_')[1] || collectionName.split('_')[0]; // (es. leaflet, summary, suppport)
    const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

    const counts: LanguageCounts = { total: 0 };

    // il metodo get restituisce sempre un oggetto QuerySnapshot che è una lista di risultati
    snapshot.forEach(doc => {
      const data = doc.data();
      counts.total += data.count || 0;

      // Somma i conteggi specifici per lingua (es. count_en, count_it)
      // i dati devono seguire la convenzione count_lingua
      Object.keys(data).forEach(key => {
        if (key.startsWith('count_')) {
          const lang = key.split('_')[1];
          counts[lang] = (counts[lang] || 0) + data[key]; // from count_it to it
        }
      });
    });

    return { type: formattedType, counts }; // array di oggetti (es. [{ type: "Leaflet", counts: {total: 42, en: 30, it: 12}}, {...}]
  });

  const filteredInteractions = interactions.filter(interaction => interaction.counts.total > 0);
  return { name: medicationName, interactions: filteredInteractions, questions: [] };
};