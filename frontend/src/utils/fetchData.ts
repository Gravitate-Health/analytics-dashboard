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
export const fetchAnalyticsData = async (startDate: string, endDate: string, eventName?: string): Promise<AnalyticsData> => {
  try {
    const params: {startDate: string; endDate: string; name?: string} = {startDate, endDate};
    if (eventName) { 
      params.name = eventName; 
    }

    const response = await axios.get(`${API_URL}/eventi`, {params});
    return response.data;
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    throw error;
  }
};

export const fetchMedicationSummaryList = async (): Promise<MedicationSummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/medications`);
    return response.data;
  } catch (error) {
    console.error('Errore durante il recupero della lista dei farmaci:', error);
    throw error;
  }
};


export const fetchMedicationDetails = async (medicationName: string): Promise<MedicationDetails> => {
  try {
    const response = await axios.get(`${API_URL}/medication`, {
      params: { name: medicationName }
    });
    return response.data;
  } catch (error) {
    console.error('Errore durante il recupero dei dettagli del farmaco:', error);
    throw error;
  }
};