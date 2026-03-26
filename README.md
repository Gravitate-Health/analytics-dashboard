# Gravitate Health – Analytics Dashboard

This repository contains the source code for the **Gravitate Health Dashboard**, a web application developed to view and analyze telemetry events collected via **Firebase Analytics (Google Analytics 4)** originating from the project's mobile apps (iOS and Android).

The implemented approach allows viewing advanced usage metrics in real-time **without going through BigQuery** and without requiring any prior modifications to the existing mobile apps.

---

## 🏗 Project Structure and Architecture

The system is split into two main components, designed to collaborate securely using a Backend-For-Frontend (BFF) pattern:

1. **`frontend/` (Web Dashboard)**:
   - Developed in **React 19** and **TypeScript**.
   - **Routing:** Managed by `react-router-dom` v7 (Pages: Home, Dashboard, Medication List, Medication Detail).
   - **Styling:** Responsive interface built with **TailwindCSS**.
   - **Data Visualization:** Dynamic charts built with **Recharts** (timelines, bar charts, pie charts).
   - **Exporting:** PDF report exporting functionality via `jspdf`.
   - **Security:** Integrated authentication module (`AuthProvider` and `ProtectedRoute`) to restrict access to authorized users only.

2. **`backend/` (Data Bridge API)**:
   - Developed in **Node.js** and **Express** with **TypeScript**.
   - **Integrations:** Uses `@google-analytics/data` and `firebase-admin` to securely query GA4 APIs.
   - **Security:** Hides authentication logic towards Google Cloud from the frontend (using a `Service Account Key`).
   - Exposes RESTful endpoints (e.g., `/api/eventi`, `/api/medications`, `/api/medication`) to return aggregated data. No telemetry data is saved in a local database.

---

## 🚀 Key Features

* 📈 **Time trends:** Visualization of events over time using line charts.
* 📊 **Event types:** Bar charts to analyze the frequency of specific actions.
* 🥧 **Platforms (OS):** Pie charts to segment the user base between Android and iOS.
* 🎯 **Interactive filters:** Selectors to analyze a single specific event.
* 📅 **Time ranges:** Default 30-day view, with filtering capabilities.
* 📄 **PDF Export:** Ability to download data and rendered charts as a convenient document report.

---

## ⚙️ Local Setup Instructions

### 1. Backend Configuration
The backend needs to be authorized to read Google Analytics data associated with Firebase.
1. Obtain or create a **Service Account** on Google Cloud Platform with "Viewer" permissions on the relevant GA4 property.
2. Download the JSON key and name it `gravitate-service-account.json`. Place the file inside the `backend/` folder.
3. Create a `.env` file inside `backend/`:
   ```env
   PORT=3001
   GA4_PROPERTY_ID=INSERT_YOUR_GA4_PROPERTY_ID
   SERVICE_ACCOUNT_PATH=./gravitate-service-account.json
   ```

### 2. Frontend Configuration
The frontend needs to know where to contact the backend APIs.
1. Create a `.env` file inside `frontend/`:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```
*(Note: The activation of the login system can be verified/modified via the `ENABLE_LOGIN` parameter in the `src/utils/constants.ts` file).*

---

## 🐳 Running with Docker (Recommended)

The project is fully containerized and ready to run.
In the project root, run:

```bash
docker compose up -d --build
```

This command will simultaneously start:
- **Frontend App:** Accessible at `http://localhost:3000` (exposed via Nginx web server).
- **Backend API:** Accessible at `http://localhost:3001`.

---

## 🌍 Internationalization (i18n)

The user interface natively supports multilanguage thanks to **`react-i18next`**, allowing "lazy" (asynchronous) loading of translations to avoid bloating the initial application bundle.


---

© 2025 Gravitate Health
