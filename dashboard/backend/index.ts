import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAnalyticsData } from './analytics';

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
    // Periodo predefinito: ultimi 30 giorni
    const startDate = req.query.startDate as string || '30daysAgo';
    const endDate = req.query.endDate as string || 'today';

    const analyticsData = await getAnalyticsData(startDate, endDate);
    res.json(analyticsData);
  } catch (error) {
    console.error('Errore durante il recupero dei dati:', error);
    res.status(500).json({ 
      error: 'Errore durante il recupero dei dati di Analytics',
      message: error instanceof Error ? error.message : 'Errore sconosciuto'
    });
  }
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
