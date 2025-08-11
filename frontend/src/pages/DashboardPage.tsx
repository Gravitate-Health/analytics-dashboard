import React, { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import EventChart from '../components/EventChart';
import EventSelector from '../components/EventSelector';
import { fetchAnalyticsData } from '../utils/fetchData';
import { formatDate, getPeriodDates, prepareEventsByDateData } from '../utils/helpers';
import PeriodSelector from '../components/PeriodSelector';
import { useApi } from '../hooks/useApi';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import ExportComponent from '../components/ExportComponent';
import { ReportSection, useReportExporter } from '../hooks/useReportExporter';
import { AnalyticsData } from '../utils/types';

const prepareDashboardReport = (data: AnalyticsData, t: (key: string) => string): ReportSection[] => {
  const prepareEventsByDateData = (events: AnalyticsData['eventsByDate']) => {
    if (!events || events.length === 0) {
      return [];
    }
    return events.map(event => ({
      'Date': formatDate(event.date),
      'Count': event.count,
    }));
  };

  return [
    {
      title: t('charts.lineChartTitle'),
      data: prepareEventsByDateData(data.eventsByDate),
    },
    {
      title: t('charts.barChartTitle'),
      data: data.eventsByType.map(({ eventName, count }) => ({
        'Event Type': eventName,
        'Occurrences': count,
      })),
    },
    {
      title: t('charts.pieChartDefault'),
      data: data.eventsByPlatform.map(({ platform, count }) => ({
        'Platform': platform,
        'Count': count,
      })),
    },
  ];
};

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last30days');
  const { startDate, endDate } = useMemo(() => getPeriodDates(selectedPeriod), [selectedPeriod]);
  
  const { data, loading, error } = useApi(
    () => fetchAnalyticsData(startDate, endDate, selectedEvent),
    [startDate, endDate, selectedEvent]
  );

  const { handleExportCsv, handleExportPdf } = useReportExporter({
    data: data,
    prepareReportFn: (apiData) => prepareDashboardReport(apiData, t),
    filenamePrefix: `dashboard-report-${selectedPeriod}`
  });
  
  if (loading) return <Loading />;
  if (error) return <ErrorDisplay message={error} />;

  if (!data && selectedEvent.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('charts.noDataAvailable')}</strong>
          <span className="block sm:inline">{t('charts.noEventAvailable')}</span>
      </div>
    );
  }


return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ margin: '3rem' }}>

    <div className="col-span-full flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{t('dashboardPage.title')}</h1>
        <ExportComponent onExportCsv={handleExportCsv} onExportPdf={handleExportPdf} isDisabled={!data} />
      </div>


      {/* Line Chart */}
      <div className="col-span-full lg:col-span-3 bg-white rounded-lg shadow p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('charts.lineChartTitle')}</h2>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
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
          {data && data.eventsByDate.length > 0 
            ? <EventChart type='line' data={prepareEventsByDateData(data.eventsByDate)} xKey='date' yKey='count' name={selectedEvent || t('charts.allEvents')} />
            : <p className='text-gray-500 text-center mt-10'>{t('charts.noDataAvailable')}</p>
          }
        </div>
      </div>

      {/* Bar Chart */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('charts.barChartTitle')}</h2>
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
          {data && data.eventsByPlatform.length > 0 
          ? <EventChart type="pie" data={data.eventsByPlatform} nameKey="platform" dataKey="count" />
          : <p className="text-gray-500 text-center mt-10"> {selectedEvent ? t('charts.noPlatformEventDataAvailable') : t('charts.noPlatformDataAvailable')} </p>
          }
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;