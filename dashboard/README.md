# Dashboard Firebase Analytics (GA4)

Questa applicazione permette di visualizzare gli eventi raccolti tramite Firebase Analytics (Google Analytics 4) relativi a un'app mobile (iOS e Android) senza usare BigQuery e senza modificare il codice delle app esistenti.

## Struttura del Progetto

Il progetto è diviso in due parti principali:

### Backend (Node.js + TypeScript)

Responsabile della connessione alla Google Analytics Data API (GA4) e dell'esposizione dei dati attraverso un endpoint REST.

- **File principali**:
  - `index.ts`: Avvia il server Express e definisce l'endpoint `/api/eventi`
  - `analytics.ts`: Contiene la funzione che chiama la Google Analytics Data API
  - `.env`: Contiene GA4_PROPERTY_ID e percorso al file JSON della service account
  - `ga-service-account.json`: File di credenziali Google (fornito esternamente)

### Frontend (React + TypeScript)

Responsabile della visualizzazione dei dati in una dashboard con grafici interattivi.

- **File principali**:
  - `App.tsx`: Punto di ingresso dell'applicazione, layout base
  - `components/EventChart.tsx`: Componente per la visualizzazione dei grafici con Recharts
  - `components/Header.tsx`: Intestazione dell'applicazione
  - `utils/fetchData.ts`: Funzione per interrogare l'API `/api/eventi`

## Funzionalità

La dashboard visualizza i seguenti dati:

1. **Eventi per Giorno** (Line Chart)
   - Mostra il numero di eventi registrati giorno per giorno

2. **Eventi per Tipo** (Bar Chart)
   - Mostra il conteggio dei 10 tipi di eventi più frequenti

3. **Eventi per Piattaforma** (Pie Chart)
   - Mostra la distribuzione degli eventi tra iOS e Android

## Tecnologie Utilizzate

### Backend
- Node.js
- TypeScript
- Express
- Google Analytics Data API (GA4)
- dotenv

### Frontend
- React
- TypeScript
- Recharts (per i grafici)
- TailwindCSS (per lo stile)
- Axios (per le chiamate API)

## Configurazione

### Backend

1. Installare le dipendenze:
   ```
   cd backend
   npm install
   ```

2. Configurare le variabili d'ambiente nel file `.env`:
   ```
   PORT=3001
   GA4_PROPERTY_ID=409463045
   SERVICE_ACCOUNT_PATH=./ga-service-account.json
   ```

3. Inserire il file delle credenziali Google `ga-service-account.json` nella cartella `backend`

4. Avviare il server:
   ```
   npm run dev
   ```

### Frontend

1. Installare le dipendenze:
   ```
   cd frontend
   npm install
   ```

2. Configurare l'URL del backend nel file `.env`:
   ```
   REACT_APP_API_URL=http://localhost:3001
   ```

3. Avviare l'applicazione:
   ```
   npm start
   ```

## Note Importanti

- Questa dashboard accede direttamente ai dati di Firebase Analytics attraverso la Google Analytics Data API, senza richiedere l'uso di BigQuery.
- Non è necessario modificare il codice delle app mobile esistenti.
- Il periodo predefinito per i dati è impostato agli ultimi 30 giorni.
