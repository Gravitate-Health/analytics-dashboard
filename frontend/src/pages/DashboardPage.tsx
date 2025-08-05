import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';

import EventChart from '../components/EventChart';
import EventSelector from '../components/EventSelector';
import { fetchAnalyticsData } from '../utils/fetchData';
import { getPeriodDates, prepareEventsByDateData } from '../utils/helpers';
import type { AnalyticsData, EventByDate, EventByPlatform } from '../utils/types';
import PeriodSelector from '../components/PeriodSelector';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last30days');
  const [filteredEventData, setFilteredEventData] = useState<EventByDate[]>([]);
  const [filteredPlatformData, setFilteredPlatformData] = useState<EventByPlatform[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { startDate, endDate } = getPeriodDates(selectedPeriod);
        const params = new URLSearchParams({startDate, endDate});
        let apiUrl = `${process.env.REACT_APP_API_URL}/api/eventi`;

        if (selectedEvent) {
          params.append('nome', selectedEvent);
          const response = await axios.get(`${apiUrl}?${params.toString()}`);
          setFilteredEventData(response.data.eventsByDate);
          setFilteredPlatformData(response.data.eventsByPlatform);
        } else {
          const response = await axios.get(`${apiUrl}?${params.toString()}`);
          setData(response.data);
          setFilteredEventData([]);
          setFilteredPlatformData([]);
        }

        setError(null);
      } catch (err) {
        setError(t('errors.loadDataError'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedEvent, selectedPeriod, t]);

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

  if (!data && filteredEventData.length === 0) {
     return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">{t('charts.noDataAvailable')}</strong>
            <span className="block sm:inline">{t('charts.noEventAvailable')}</span>
        </div>
     );
  }

return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ margin: '3rem' }}>

      {/* Line Chart */}
      <div className="col-span-1 lg:col-span-3 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('charts.lineChartTitle')}</h2>
        <div className='flex justify-between items-center gap-4'>
          <div className='w-1/2'>
            <EventSelector
              eventList={data?.eventsByType.map(e => e.eventName) || []}
              selectedEvent={selectedEvent}
              onChange={setSelectedEvent}
            />
          </div>
          <div className='w-1/2'>
            <PeriodSelector selectedPeriod={selectedPeriod} onChange={setSelectedPeriod} />
          </div>
        </div>
        <div className="h-64 mt-4">
          {
            filteredEventData.length > 0 
            ? ( <EventChart type="line" data={prepareEventsByDateData(filteredEventData)} xKey="date" yKey="count" name={selectedEvent} /> ) 
            : (data && data.eventsByDate.length > 0) 
            ? ( <EventChart type="line" data={prepareEventsByDateData(data.eventsByDate)} xKey="date" yKey="count" name="All Events" /> ) 
            : ( <p className="text-gray-500 text-center mt-10">{t('charts.noDataAvailable')}</p>)
          }
        </div>
      </div>

      {/* Bar Chart */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Events by Type</h2>
        <div className="h-64">
          {(data && data.eventsByType.length > 0) ? (
            <EventChart type="bar" data={data.eventsByType} xKey="eventName" yKey="count" name="Occurrences" />
          ) : (
            <p className="text-gray-500 text-center mt-10">{t('charts.noDataAvailable')}</p>
          )}
        </div>
      </div>

      {/* Pie Chart */}
      <div className="col-span-1 lg:col-span-3 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {selectedEvent 
            ? t('charts.pieChartEventSelected', { eventName: selectedEvent }) 
            : t('charts.pieChartDefault')
          }
        </h2>
        <div className="h-64">
          {filteredPlatformData.length > 0 ? (
            <EventChart type="pie" data={filteredPlatformData} nameKey="platform" dataKey="count" />
          ) : (data && data.eventsByPlatform.length > 0 && !selectedEvent) ? (
            <EventChart type="pie" data={data.eventsByPlatform} nameKey="platform" dataKey="count" />
          ) : (
            <p className="text-gray-500 text-center mt-10">
              {selectedEvent ? 'No platform data for this event.' : 'No platform data available.'}
            </p>
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;