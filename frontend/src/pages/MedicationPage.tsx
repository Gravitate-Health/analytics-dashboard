import React, { useEffect, useState } from 'react'

import EventChart from '../components/EventChart';
import { fetchMedicationData } from '../utils/fetchData';
import type { MedicationData } from '../utils/types';

const MedicationPage: React.FC = () => {
    const [data, setData] = useState<MedicationData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
     const loadData = async () => {
       try {
         setLoading(true);
         const medicationData = await fetchMedicationData();
         setData(medicationData);
         setError(null);
       } catch (err) {
         setError('Errore durante il caricamento dei dati. Riprova più tardi.');
       } finally {
         setLoading(false);
       }
    };

    loadData();
  }, []);

   if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Errore!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Utilizzo Farmaci (da Firestore)</h2>
      <div className="h-96">
        {data.length > 0 ? (
          <EventChart type="bar" data={data} xKey="medication_name" yKey="count" name="Conteggio"/>
        ) : (
          <p className="text-gray-500 text-center mt-10">Nessun dato sui farmaci disponibile.</p>
        )}
      </div>
    </div>
  );
};

export default MedicationPage;