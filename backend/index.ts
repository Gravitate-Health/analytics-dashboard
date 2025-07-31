import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAnalyticsData, getEventDetails } from './analytics';
import { getMedicationDetails, getMedicationSummaryList } from './medication-analytics';

// Carica le variabili d'ambiente dal file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Endpoint per recuperare i dati degli eventi
app.get('/api/eventi', async (req, res) => {
  try {
    const startDate = req.query.startDate as string || '30daysAgo';
    const endDate = req.query.endDate as string || 'today';
    const eventName = req.query.nome as string;

    if (eventName) {
      const { eventsByDate, eventsByPlatform } = await getEventDetails(eventName, startDate, endDate);
      return res.json({ eventsByDate, eventsByPlatform });
    }

    const analyticsData = await getAnalyticsData(startDate, endDate);
    res.json(analyticsData);
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    res.status(500).json({
      error: 'Errore durante il recupero dei dati di Analytics',
      message: error instanceof Error ? error.message : 'Errore sconosciuto',
    });
  }
});

app.get('/api/medications', async (req, res) => {
  try {
    const data = await getMedicationSummaryList(); 
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medication list', error: (error as Error).message });
  }
});

// TODO: controllo se non esiste il farmaco
app.get('/api/medication/:name', async (req, res) => {
  try {
    const medicationName = decodeURIComponent(req.params.name);
    const data = await getMedicationDetails(medicationName);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medication details', error: (error as Error).message });
  }
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
