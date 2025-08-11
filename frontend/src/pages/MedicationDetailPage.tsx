import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { fetchMedicationDetails } from '../utils/fetchData';
import type { MedicationDetails, Interaction } from '../utils/types';
import { useApi } from '../hooks/useApi';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import { exportSectionsToCsv, exportSectionsToPdf } from '../utils/export';
import ExportComponent from '../components/ExportComponent';

const LANGUAGE_MAP: { [key: string]: string } = {
  en: 'English',
  es: 'Spanish',
  it: 'Italian',
};

const COLORS: { [key: string]: string } = {
  en: '#8884d8',
  es: '#82ca9d',
  it: '#ffc658',
};

const MedicationDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { name } = useParams<{ name: string }>();
  const [selectedLang, setSelectedLang] = useState<string>('total');
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
    details?.interactions.map(interaction => {
      const entry: { type: string; [lang: string]: number | string } = { type: interaction.type };
      availableLanguages.forEach(lang => { entry[lang] = interaction.counts[lang] || 0; });
      return entry;
    }) || [],
  [details, availableLanguages]);

  const getCountForLang = useCallback((interaction: Interaction) => {
    return interaction.counts[selectedLang] || 0;
  }, [selectedLang]);

  const prepareFullReport = () => {
    if (!details) return [];

    // Section 1: KPI Card data formatted into a table
    const kpiData = details.interactions.map(item => ({
      'Interaction Type': item.type,
      'Total Count': item.counts.total || 0,
      ...availableLanguages.reduce((acc, lang) => {
        acc[LANGUAGE_MAP[lang] || lang.toUpperCase()] = item.counts[lang] || 0;
        return acc;
      }, {} as {[key: string]: number}),
    }));

    // Section 2: User Questions data
    const questionsData = (details.questions || []).map(q => ({
      Question: q.question,
      Language: q.lang.toUpperCase(),
      Date: new Date(q.timestamp).toLocaleDateString('it-IT'),
    }));

    const sections = [];
    if (kpiData.length > 0) {
      sections.push({ title: `Interaction Summary for ${details.name}`, data: kpiData });
    }
    if (questionsData.length > 0) {
      sections.push({ title: 'User Questions', data: questionsData });
    }
    
    return sections;
  };

  const handleExportCsv = () => {
    const reportData = prepareFullReport();
    if (reportData.length > 0) {
      exportSectionsToCsv(reportData, `${decodedName}-full-report`);
    }
  };

  const handleExportPdf = () => {
    const reportData = prepareFullReport();
    if (reportData.length > 0) {
      exportSectionsToPdf(reportData, `${decodedName}-full-report`);
    }
  };

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
          <h2 className='text-xl font-semibold mb-4'>{t('medicationDetailPage.questionsTitle')}</h2>
          <ul className='space-y-4'>
            {details.questions.map(question => (
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
        </div>
      )}
    </div>
  );
};

export default MedicationDetailPage;