import React, { useCallback, useMemo, useState } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { fetchMedicationDetails } from '../utils/fetchData';
import type { MedicationDetails, Interaction } from '../utils/types';
import { useApi } from '../hooks/useApi';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import ExportComponent from '../components/ExportComponent';
import { ReportSection, useReportExporter } from '../hooks/useReportExporter';
import { COLORS, LANGUAGE_MAP } from '../utils/constants';
import { transformInteractionData } from '../utils/helpers';



const prepareMedicationReport = (details: MedicationDetails, availableLanguages: string[], t: (key: string) => string): ReportSection[] => {
  const sections: ReportSection[] = [];

  // Section 1: Interaction Summary (KPIs)
  if (details.interactions && details.interactions.length > 0) {
    const interactionData = details.interactions.map(item => {
      const languageCounts = availableLanguages.reduce((acc, lang) => {
        const langName = LANGUAGE_MAP[lang] || lang.toUpperCase();
        acc[langName] = item.counts[lang] || 0;
        return acc;
      }, {} as { [key: string]: number });

      return {
        'Interaction Type': item.type,
        'Total Count': item.counts.total || 0,
        ...languageCounts,
      };
    });
    sections.push({ title: `Interaction Summary for ${details.name}`, data: interactionData });
  }

  // Section 2: User Questions
  if (details.questions && details.questions.length > 0) {
    const questionsData = details.questions.map(q => ({
      'Question': q.question,
      'Language': LANGUAGE_MAP[q.lang] || q.lang.toUpperCase(),
      'Date': new Date(q.timestamp).toLocaleDateString('it-IT'),
    }));
    sections.push({ title: t('medicationDetailPage.questionsTitle'), data: questionsData });
  }

  return sections;
};

const MedicationDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { name } = useParams<{ name: string }>();
  const [selectedLang, setSelectedLang] = useState<string>('total');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterLang, setFilterLang] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const questionsPerPage = 20;
  const decodedName = useMemo(() => (name ? decodeURIComponent(name) : ''), [name]);

  const { data: details, loading, error } = useApi(
    () => fetchMedicationDetails(decodedName),
    [decodedName]
  );

    // Tutte le lingue uniche escludendo total
  {/*
    interactions: [
      { counts: { total: 10, en: 8, it: 2 } }, // da Leaflet
      { counts: { total: 5, en: 5 } }           // da Summary
    ]
    
    .flatMap() -> ['total', 'en', 'it', 'total', 'en']
    new Set() -> { 'total', 'en', 'it' }
    Array.from() -> ['total', 'en', 'it']
    .filter() -> ['en', 'it']
    */}
  const availableLanguages = useMemo(() => {
    if (!details) {
      return [];
    }

    // Get all language keys from all interactions, including duplicates
    const allLanguageKeys = details.interactions.flatMap(interaction => 
      Object.keys(interaction.counts)
    );

    const uniqueLanguageKeys = Array.from(new Set(allLanguageKeys));
    const specificLanguages = uniqueLanguageKeys.filter(lang => lang !== 'total');

    return specificLanguages;
  }, [details]);

  const chartData = useMemo(() =>
    details?.interactions?.map(interaction =>
      transformInteractionData(interaction, availableLanguages)
    ) || [],
  [details, availableLanguages]
);

  const getCountForLang = useCallback((interaction: Interaction) => {
    return interaction.counts[selectedLang] || 0;
  }, [selectedLang]);

  // Lingue disponibili nelle domande
  const questionLanguages = useMemo(() => {
    if (!details?.questions) return [];
    const langs = Array.from(new Set(details.questions.map(q => q.lang)));
    return langs.sort();
  }, [details?.questions]);

  // Filtro e paginazione delle domande
  const filteredQuestions = useMemo(() => {
    if (!details?.questions) return [];
    
    const filtered = details.questions.filter(q => {
      // Filtro per testo
      if (searchQuery.trim() && !q.question.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filtro per lingua
      if (filterLang !== 'all' && q.lang !== filterLang) {
        return false;
      }
      
      // Filtro per data
      const questionDate = new Date(q.timestamp);
      if (filterStartDate && questionDate < new Date(filterStartDate)) {
        return false;
      }
      if (filterEndDate) {
        const endDate = new Date(filterEndDate);
        endDate.setHours(23, 59, 59, 999); // Include l'intera giornata finale
        if (questionDate > endDate) {
          return false;
        }
      }
      
      return true;
    });

    // Ordinamento cronologico
    return filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [details?.questions, searchQuery, filterLang, filterStartDate, filterEndDate, sortOrder]);

  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);
  
  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, currentPage, questionsPerPage]);

  // Reset alla prima pagina quando cambiano i filtri
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterLang, filterStartDate, filterEndDate, sortOrder]);

  // Reset di tutti i filtri
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterLang('all');
    setFilterStartDate('');
    setFilterEndDate('');
    setSortOrder('newest');
  };

  const { handleExportCsv, handleExportPdf } = useReportExporter({
    data: details,
    prepareReportFn: (medData) => prepareMedicationReport(medData, availableLanguages, t),
    filenamePrefix: `${decodedName}-full-report`
  });

    if (loading) return <Loading />;
    if (error) return <ErrorDisplay message={error} />;
    if (!details) return <p>{t('charts.noDataAvailable')}</p>;

  return (
    <div className="space-y-6" style={{ margin: '3rem' }}>
      <Link 
        to="/medications" 
        className='inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200'
      >
        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
          {t('medicationDetailPage.back')}
        </Link>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{details.name}</h1>
        <ExportComponent 
          onExportCsv={handleExportCsv}
          onExportPdf={handleExportPdf}
          isDisabled={!details}
        />
      </div>
      
      {/* Filtro Lingua */}
      <div className="flex items-center space-x-2 p-1 bg-gray-200 rounded-lg w-max">
        <button 
          onClick={() => setSelectedLang('total')} 
          className={`px-4 py-1 rounded-md ${selectedLang === 'total' ? 'bg-white shadow' : ''}`}
          >
            {t('medicationDetailPage.languageFilterButton')}
          </button>
        {availableLanguages.map(lang => (
            <button 
              key={lang} 
              onClick={() => setSelectedLang(lang)} className={`px-4 py-1 rounded-md ${selectedLang === lang ? 'bg-white shadow' : ''}`}
              >
                {LANGUAGE_MAP[lang] || lang.toUpperCase()}
              </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {details.interactions.map(item => (
          <div key={item.type} className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-gray-500 text-sm">{item.type}</p>
            <p className="text-3xl font-bold">{getCountForLang(item)}</p>
          </div>
        ))}
      </div>

      {/* Grafico */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">{t('medicationDetailPage.graphTitle')}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            {availableLanguages.map(lang => (
              <Bar key={lang} dataKey={lang} fill={COLORS[lang] || '#8884d8'} name={LANGUAGE_MAP[lang] || lang.toUpperCase()} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Questions */}
      {details.questions && details.questions.length > 0 && (
        <div className='bg-white p-6 rounded-lg shadow'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold'>{t('medicationDetailPage.questionsTitle')}</h2>
            <div className='text-sm text-gray-500'>
              {filteredQuestions.length} {filteredQuestions.length === 1 ? t('medicationDetailPage.question') : t('medicationDetailPage.questions')}
            </div>
          </div>
          
          {/* Filtri */}
          <div className='mb-4 space-y-3'>
            {/* Search bar */}
            <input 
              type='text' 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('medicationDetailPage.searchQuestions')}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            
            {/* Filtri lingua e data */}
            <div className='flex flex-wrap gap-3 items-end'>
              <div className='flex-1 min-w-[150px]'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('medicationDetailPage.filterByLanguage')}
                </label>
                <select 
                  value={filterLang}
                  onChange={(e) => setFilterLang(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='all'>{t('medicationDetailPage.allLanguages')}</option>
                  {questionLanguages.map(lang => (
                    <option key={lang} value={lang}>{LANGUAGE_MAP[lang] || lang.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              
              <div className='flex-1 min-w-[150px]'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('medicationDetailPage.sortBy')}
                </label>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                  <option value='newest'>{t('medicationDetailPage.newestFirst')}</option>
                  <option value='oldest'>{t('medicationDetailPage.oldestFirst')}</option>
                </select>
              </div>
              
              <div className='flex-1 min-w-[150px]'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('medicationDetailPage.filterFromDate')}
                </label>
                <input 
                  type='date'
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              
              <div className='flex-1 min-w-[150px]'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  {t('medicationDetailPage.filterToDate')}
                </label>
                <input 
                  type='date'
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              
              <button
                onClick={handleResetFilters}
                className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
              >
                {t('medicationDetailPage.resetFilters')}
              </button>
            </div>
          </div>

          {/* Questions list */}
          {paginatedQuestions.length > 0 ? (
            <>
              <ul className='space-y-4'>
                {paginatedQuestions.map(question => (
                  <li key={question.id} className='border-b border-gray-200 pb-3'>
                    <p className='text-gray-800'>{question.question}</p>
                    <div className='text-xs text-gray-400 mt-1 flex items-center space-x-2'>
                      <span>Language: {question.lang.toUpperCase()}</span>
                      <span>-</span>
                      <span>{new Date(question.timestamp).toLocaleDateString('it-IT')}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='mt-6 flex justify-center items-center space-x-2'>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className='px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'
                  >
                    &lt;
                  </button>
                  
                  <span className='text-sm text-gray-600'>
                    {t('medicationDetailPage.page')} {currentPage} {t('medicationDetailPage.of')} {totalPages} ({questionsPerPage} {t('medicationDetailPage.perPage')})
                  </span>
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className='px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100'
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className='text-gray-500 text-center py-4'>{t('medicationDetailPage.noQuestionsFound')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicationDetailPage;