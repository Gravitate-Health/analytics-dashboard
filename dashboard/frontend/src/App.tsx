import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import EventChart from './components/EventChart';
import { fetchAnalyticsData } from './utils/fetchData';
import './App.css';

// Interfacce per i tipi di dati
export interface EventByDate {
  date: string;
  count: number;
}

export interface EventByType {
  eventName: string;
  count: number;
}

export interface EventByPlatform {
  platform: string;
  count: number;
}

export interface AnalyticsData {
  eventsByDate: EventByDate[];
  eventsByType: EventByType[];
  eventsByPlatform: EventByPlatform[];
}

function App() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const analyticsData = await fetchAnalyticsData();
        setData(analyticsData);
        setError(null);
      } catch (err) {
        setError('Errore durante il caricamento dei dati. Riprova più tardi.');
        console.error('Errore nel recupero dei dati:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (dateString: string): string => {
    // Formatta date nel formato YYYYMMDD a DD/MM/YYYY
    if (dateString && dateString.length === 8) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  // Formatta i dati per i grafici
  const prepareEventsByDateData = (events: EventByDate[] | undefined) => {
    if (!events) return [];
    return events.map(event => ({
      ...event,
      date: formatDate(event.date)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Errore!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : !data || (
          !data.eventsByDate.length && 
          !data.eventsByType.length && 
          !data.eventsByPlatform.length
        ) ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Nessun dato disponibile.</strong>
            <span className="block sm:inline"> Non ci sono eventi da visualizzare nel periodo selezionato.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Eventi per giorno (Line Chart) */}
            <div className="col-span-1 lg:col-span-3 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Eventi per Giorno</h2>
              <div className="h-64">
                {data.eventsByDate.length > 0 ? (
                  <EventChart 
                    type="line" 
                    data={prepareEventsByDateData(data.eventsByDate)}
                    xKey="date"
                    yKey="count"
                    name="Eventi"
                  />
                ) : (
                  <p className="text-gray-500 text-center mt-10">Nessun dato disponibile</p>
                )}
              </div>
            </div>
            
            {/* Eventi per tipo (Bar Chart) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Eventi per Tipo</h2>
              <div className="h-64">
                {data.eventsByType.length > 0 ? (
                  <EventChart 
                    type="bar" 
                    data={data.eventsByType}
                    xKey="eventName"
                    yKey="count"
                    name="Conteggio"
                  />
                ) : (
                  <p className="text-gray-500 text-center mt-10">Nessun dato disponibile</p>
                )}
              </div>
            </div>
            
            {/* Eventi per piattaforma (Pie Chart) */}
            <div className="col-span-1 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Eventi per Piattaforma</h2>
              <div className="h-64">
                {data.eventsByPlatform.length > 0 ? (
                  <EventChart 
                    type="pie" 
                    data={data.eventsByPlatform}
                    nameKey="platform"
                    dataKey="count"
                  />
                ) : (
                  <p className="text-gray-500 text-center mt-10">Nessun dato disponibile</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
