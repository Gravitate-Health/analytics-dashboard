import path from 'path';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { MedicationSummary } from './utils/types';

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