import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { fetchMedicationSummaryList } from '../utils/fetchData';
import type { MedicationSummary } from '../utils/types';

const MedicationPage: React.FC = () => {
  const { t } = useTranslation();

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
        setError(t('errors.loadDataError'));
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
        <strong className="font-bold">{t('errors.error')}</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6" style={{ margin: '3rem' }}>
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-2xl font-bold text-gray-800">{t('medicationPage.title')}</h1>
        <div className='grid items-center w-72'>
          <input 
            type='text' 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('medicationPage.search')}
            className='col-start-1 row-start-1 w-full pl-4 pr-12 py-2 bg-[#e0e5e9] text-gray-800 placeholder-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <div className="col-start-1 row-start-1 justify-self-end flex items-center justify-center w-12 h-full bg-hero-bg rounded-r-lg pointer-events-none">
            <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      {/* Medication table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('medicationPage.tableHeaders.medicationName')}
              </th>
              <th className="w-40 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('medicationPage.tableHeaders.interactions')}
              </th>
              <th className="w-32 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('medicationPage.tableHeaders.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summaryList
              .filter((summary => summary.name.toLowerCase().includes(searchTerm.toLowerCase())))
              .map((summary) => (
                <tr key={summary.name}>
                  <td className="max-w-xs px-6 py-4 whitespace-nowrap font-medium text-gray-900 truncate">
                    <Link to={`/medication/${encodeURIComponent(summary.name)}`} className="text-current cursor-pointer">
                      {summary.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{summary.totalInteractions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link 
                    to={`/medication/${encodeURIComponent(summary.name)}`} 
                    className="font-sans font-medium text-sidebar-text hover:text-sidebar-accent transition-colors duration-200 uppercase"
                    >{t('medicationPage.tableContent.details')} &gt;
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