import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAnalyticsData, getEventDetails } from './analytics';
import { getMedicationAnalytics } from './medication-analytics';

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

app.get('/api/medication', async (req, res) => {
  try {
    const data = await getMedicationAnalytics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Firestore', error: (error as Error).message });
  }
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
