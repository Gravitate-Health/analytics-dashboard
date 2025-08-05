# Gravitate Health – Firebase Analytics Dashboard

This dashboard visualizes analytics events collected from Firebase Analytics (Google Analytics 4) for mobile apps (iOS and Android), **without using BigQuery** and **without requiring changes to the mobile apps**.

---

## 🧱 Project Structure

The project is divided into two services:

- `gravitate-health-backend`: Node.js + TypeScript + Google Analytics Data API
- `gravitate-health-frontend`: React + TypeScript + TailwindCSS + Recharts


---

## 🚀 Features

- 📈 Events over time (line chart)
- 📊 Event types (bar chart)
- 🥧 Platforms (pie chart)
- 🎯 Event selector to filter specific event
- ✅ 30-day default range
- 🔐 Secure read-only access using Google Service Account
- 🔌 Fully Dockerized (frontend + backend)

---

## ⚙️ Setup Instructions

### 1. Backend

1. Provide a Firebase-linked Google Analytics 4 property ID
2. Create a Google Cloud **Service Account**, add it as a Viewer in GA4, and download `gravitate-service-account.json`
3. Place the file in `backend/` and create `.env`:

```
PORT=3001
GA4_PROPERTY_ID=YOUR_GA4_ID
SERVICE_ACCOUNT_PATH=./gravitate-service-account.json
```

4. Backend will expose `/api/eventi` and support `/api/eventi?nome=EVENT_NAME`

---

### 2. Frontend

1. Create a `.env` in `frontend/`:

```
REACT_APP_API_URL=http://localhost:3001
```

2. If you build with Docker, this will be embedded into the compiled JS bundle.

---

### 3. Run everything with Docker Compose

```bash
docker compose up -d --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/eventi

---

## 🌍 Internationalization (i18n)

The frontend is built with localization using **`react-i18next`**. This setup allows for easy addition of new languages and lazy-loads translation files, keeping the initial bundle size small.

### How it Works

- Translation files are stored as static JSON files in `frontend/public/locales/`.
- Each language has its own folder (e.g., `en` for English).
- The main configuration can be found in `frontend/src/i18n.ts`.

### Adding a New Language

Adding a new language is a simple 3-step process. Let's use **German (`de`)** as an example:

1.  **Create the Translation File**
    Create a new folder and file: `frontend/public/locales/de/translation.json`. 

2.  **Update i18next Configuration**
    Add the new language code to the `supportedLngs` array in `frontend/src/i18n.ts` to make the system aware of it.
    ```typescript
    supportedLngs: ['en', 'de'], // Add 'de'
    ```

---

---

## 🔐 Notes

- The frontend is statically built using React and served via Nginx
- The backend uses `@google-analytics/data` to retrieve aggregated GA4 data (not raw event logs)
- No data is stored locally; everything is fetched live from GA4

---

© 2025 Gravitate Health
