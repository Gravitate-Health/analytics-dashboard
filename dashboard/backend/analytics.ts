import { BetaAnalyticsDataClient } from '@google-analytics/data';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Verifico che le variabili d'ambiente necessarie siano definite
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const SERVICE_ACCOUNT_PATH = process.env.SERVICE_ACCOUNT_PATH;

if (!GA4_PROPERTY_ID) {
  throw new Error('GA4_PROPERTY_ID non è definito nelle variabili di ambiente');
}

if (!SERVICE_ACCOUNT_PATH) {
  throw new Error('SERVICE_ACCOUNT_PATH non è definito nelle variabili di ambiente');
}

// Percorso assoluto al file delle credenziali
const serviceAccountPath = path.resolve(process.env.SERVICE_ACCOUNT_PATH || '');
if (!serviceAccountPath) {
  throw new Error('SERVICE_ACCOUNT_PATH non è definito o non valido');
}

// Interfacce per i dati restituiti
interface EventByDate {
  date: string;
  count: number;
}

interface EventByType {
  eventName: string;
  count: number;
}

interface EventByPlatform {
  platform: string;
  count: number;
}

interface AnalyticsData {
  eventsByDate: EventByDate[];
  eventsByType: EventByType[];
  eventsByPlatform: EventByPlatform[];
}

export async function getAnalyticsData(startDate: string, endDate: string): Promise<AnalyticsData> {
  try {
    // Inizializza il client GA4 con le credenziali
    const analyticsDataClient = new BetaAnalyticsDataClient({
      keyFilename: serviceAccountPath,
    });

    // 1. Recupera eventi per data
    const eventsByDateResponse = await analyticsDataClient.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'eventCount' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    const eventsByDate: EventByDate[] = eventsByDateResponse[0].rows?.map(row => ({
      date: row.dimensionValues?.[0].value || '',
      count: parseInt(row.metricValues?.[0].value || '0', 10),
    })) || [];

    // 2. Recupera eventi per tipo
    const eventsByTypeResponse = await analyticsDataClient.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      // limit: 10,
    });

    const eventsByType: EventByType[] = eventsByTypeResponse[0].rows?.map(row => ({
      eventName: row.dimensionValues?.[0].value || '',
      count: parseInt(row.metricValues?.[0].value || '0', 10),
    })) || [];

    // 3. Recupera eventi per piattaforma (iOS/Android)
    const eventsByPlatformResponse = await analyticsDataClient.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'platform' }],
      metrics: [{ name: 'eventCount' }],
    });

    const eventsByPlatform: EventByPlatform[] = eventsByPlatformResponse[0].rows?.map(row => ({
      platform: row.dimensionValues?.[0].value || '',
      count: parseInt(row.metricValues?.[0].value || '0', 10),
    })) || [];

    // Restituisci tutti i dati aggregati
    return {
      eventsByDate,
      eventsByType,
      eventsByPlatform,
    };
  } catch (error) {
    console.error('Errore nel recupero dei dati Analytics:', error);
    throw error;
  }
}

export async function getEventDetails(eventName: string, startDate: string, endDate: string) {
  const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: serviceAccountPath,
  });

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${GA4_PROPERTY_ID}`,
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'eventName' },
      { name: 'date' },
      { name: 'platform' }
    ],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        stringFilter: {
          matchType: 'EXACT',
          value: eventName,
        },
      },
    },
  });

  return response.rows?.map(row => ({
    date: row.dimensionValues?.[1]?.value || '',
    platform: row.dimensionValues?.[2]?.value || '',
    count: parseInt(row.metricValues?.[0]?.value || '0', 10),
  })) || [];
}
