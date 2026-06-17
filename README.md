# Analytics Dashboard – Firebase GA4

A web application for viewing and analyzing Firebase Analytics (GA4) telemetry events collected from mobile apps (iOS and Android), built without BigQuery and without requiring any changes to the existing apps.

---

## Architecture

The system follows a **Backend-For-Frontend (BFF)** pattern split into two components:

1. **`frontend/`** — React 19 + TypeScript web app
   - Routing: `react-router-dom` v7 (Home, Dashboard, Medication List, Medication Detail)
   - Styling: TailwindCSS
   - Charts: Recharts (line, bar, pie)
   - Export: PDF and CSV via `jspdf`
   - i18n: `react-i18next` with lazy-loaded translations (EN, ES, IT)
   - Auth: optional login system (`AuthProvider` + `ProtectedRoute`), toggled via `ENABLE_LOGIN` in `src/utils/constants.ts`

2. **`backend/`** — Node.js + Express + TypeScript API
   - Integrations: `@google-analytics/data` and `firebase-admin` to query GA4 APIs
   - Hides Google Cloud credentials from the frontend (Service Account key stays server-side)
   - RESTful endpoints: `/api/eventi`, `/api/medications`, `/api/medication`
   - Stateless: no local database, all data is fetched live from GA4

---

## Features

### Dashboard
- **Line chart** — event occurrences over time, filterable by event type and date range
- **Bar chart** — frequency breakdown of all tracked event types (with human-readable labels)
- **Pie chart** — platform split between Android and iOS
- **Interactive filters** — event selector and time range selector (default: last 30 days)
- **Export** — download current view as PDF or CSV

### Medication Analytics
- **Medication list** — searchable table showing all tracked medications and their total interaction counts
- **Medication detail** — per-medication breakdown with:
  - KPI cards per interaction type (Leaflet, Summary Leaflet, Focused Leaflet, Support Material, Chat)
  - Bar chart of interactions broken down by language (English, Spanish, Italian)
  - Language toggle to switch between total and per-language counts
  - **Chat questions** — full list of questions users asked via the in-app chat, with:
    - Full-text search
    - Language filter
    - Date range filter (from / to)
    - Sort by newest or oldest
    - Pagination (20 questions per page)
  - **Export** — download medication report as PDF or CSV

---

## Local Setup

### Backend

1. Create a **Service Account** on Google Cloud Platform with Viewer access to the GA4 property.
2. Download the JSON key and save it as `gravitate-service-account.json` inside `backend/`.
3. Create `backend/.env`:
   ```env
   PORT=3001
   GA4_PROPERTY_ID=YOUR_GA4_PROPERTY_ID
   SERVICE_ACCOUNT_PATH=./gravitate-service-account.json
   ```

### Frontend

1. Create `frontend/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```

> The login system is disabled by default. To enable it, set `ENABLE_LOGIN = true` in `frontend/src/utils/constants.ts`.

---

## Running with Docker (Recommended)

```bash
docker compose up -d --build
```

- **Frontend:** `http://localhost:3000` (served via Nginx)
- **Backend API:** `http://localhost:3001`

---

