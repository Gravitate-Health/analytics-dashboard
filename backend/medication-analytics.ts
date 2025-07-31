import path from 'path';

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export interface MedicationData {
    medication_name: string;
    count: number;
}

const serviceAccountPath = path.resolve(process.env.SERVICE_ACCOUNT_PATH || '');

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccountPath),
  });
}

const db = getFirestore();

export const getMedicationAnalytics = async (): Promise<MedicationData[]> => {
  try {
    // sub-collection 'medication_focused_leaflet'
    const snapshot = await db.collectionGroup('medication_focused_leaflet').get();

    if (snapshot.empty) {
      console.log('medication_focused_leaflet is empty');
      return [];
    }

    const medicationData: MedicationData[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.medication_name && typeof data.count === 'number') {
        medicationData.push({
          medication_name: data.medication_name,
          count: data.count,
        });
      }
    });

    // sort by count
    return medicationData.sort((a, b) => b.count - a.count);

  } catch (error) {
    console.error("Error fetching Firestore:", error);
    throw new Error("It's not possible retrieve data");
  }
};