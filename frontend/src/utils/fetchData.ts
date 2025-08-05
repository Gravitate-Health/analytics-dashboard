import axios from 'axios';

import { AnalyticsData, MedicationDetails, MedicationSummary } from './types';

// URL del backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Recupera i dati di analytics dal backend
 * @param startDate Data di inizio (formato: 'YYYY-MM-DD' o '30daysAgo')
 * @param endDate Data di fine (formato: 'YYYY-MM-DD' o 'today')
 * @returns Dati di analytics
 */
export const fetchAnalyticsData = async (
  startDate: string = '30daysAgo',
  endDate: string = 'today'
): Promise<AnalyticsData> => {
  try {
    const response = await axios.get(`${API_URL}/api/eventi`, {
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    throw error;
  }
};

export const fetchMedicationSummaryList = async (): Promise<MedicationSummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/medications`);
    return response.data;
  } catch (error) {
    console.error('Errore durante il recupero della lista dei farmaci:', error);
    throw error;
  }
};


export const fetchMedicationDetails = async (medicationName: string): Promise<MedicationDetails> => {
  try {
    const encodedName = encodeURIComponent(medicationName);
    const response = await axios.get(`${API_URL}/api/medication/${encodedName}`);
    return response.data;
  } catch (error) {
    console.error('Errore durante il recupero dei dettagli del farmaco:', error);
    throw error;
  }
};