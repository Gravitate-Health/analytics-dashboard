import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMedicationSummaryList } from '../utils/fetchData';
import type { MedicationSummary } from '../utils/types';

const MedicationPage: React.FC = () => {
  const [summaryList, setSummaryList] = useState<MedicationSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchMedicationSummaryList();
        setSummaryList(data);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Riepilogo Farmaci</h1>
      {/* Search bar */}
      <div className='mb-4'>
        <input 
          type='text' 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search...'
          className='w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      {/* Medication table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Farmaco</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interazioni Totali</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summaryList
              .filter((summary => summary.name.toLowerCase().includes(searchTerm.toLowerCase())))
              .map((summary) => (
                <tr key={summary.name}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    <Link 
                      to={`/medication/${encodeURIComponent(summary.name)}`}
                      className="text-current cursor-pointer"
                      >{summary.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{summary.totalInteractions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/medication/${encodeURIComponent(summary.name)}`} 
                    className="text-indigo-600 hover:text-indigo-900"
                    >Vedi Dettagli
                  </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicationPage;