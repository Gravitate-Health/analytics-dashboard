import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchMedicationDetails } from '../utils/fetchData';
import type { MedicationDetails, Interaction } from '../utils/types';

const LANGUAGE_MAP: { [key: string]: string } = {
  en: 'Inglese',
  es: 'Spagnolo',
  it: 'Italiano',
};

const COLORS: { [key: string]: string } = {
  en: '#8884d8',
  es: '#82ca9d',
  it: '#ffc658',
};

const MedicationDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [details, setDetails] = useState<MedicationDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>('total');

  useEffect(() => {
    if (!name) return;
    const decodedName = decodeURIComponent(name);
    fetchMedicationDetails(decodedName)
      .then(data => {
        setDetails(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Impossibile caricare i dati.');
        setLoading(false);
      });
  }, [name]);
  
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
  const availableLanguages = details ? 
    Array.from(new Set(details.interactions.flatMap(i => Object.keys(i.counts))))
    .filter(lang => lang !== 'total') : [];

  const getCountForLang = (interaction: Interaction) => {
    return interaction.counts[selectedLang] || 0;
  };

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

  if (!details) return <p>Nessun dato disponibile.</p>;

  const chartData = details.interactions.map(interaction => {
      const entry: { type: string; [lang: string]: number | string } = { type: interaction.type };
      availableLanguages.forEach(lang => {
        entry[lang] = interaction.counts[lang] || 0;
      });
      return entry;
  });

  return (
    <div className="space-y-6" style={{ margin: '3rem' }}>
      <Link 
        to="/medications" 
        className='inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200'
      >
        <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
          Torna alla lista
        </Link>
      <h1 className="text-3xl font-bold text-gray-800">{details.name}</h1>
      
      {/* Filtro Lingua */}
      <div className="flex items-center space-x-2 p-1 bg-gray-200 rounded-lg w-max">
        <button onClick={() => setSelectedLang('total')} className={`px-4 py-1 rounded-md ${selectedLang === 'total' ? 'bg-white shadow' : ''}`}>Aggregato</button>
        {availableLanguages.map(lang => (
            <button key={lang} onClick={() => setSelectedLang(lang)} className={`px-4 py-1 rounded-md ${selectedLang === lang ? 'bg-white shadow' : ''}`}>{LANGUAGE_MAP[lang] || lang.toUpperCase()}</button>
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
        <h2 className="text-xl font-semibold mb-4">Riepilogo Interazioni per Lingua</h2>
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
          <h2 className='text-xl font-semibold mb-4'> User questions</h2>
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