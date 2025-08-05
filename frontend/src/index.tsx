import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </React.StrictMode>
);
