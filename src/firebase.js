import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";

// 🔹 Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDryVKU7UBLJZESMR3Ij82NkWvRs3JnWnI",
  authDomain: "gravitate-health-96242.firebaseapp.com",
  projectId: "gravitate-health-96242",
  storageBucket: "gravitate-health-96242.appspot.com",
  messagingSenderId: "1024031756727",
  appId: "1:1024031756727:web:09cbf1dc3f65698bc91832",
  measurementId: "G-L1HFHN7K94",
};

// 🔹 Inizializza Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔹 Funzione per registrare manualmente gli eventi
const trackEvent = (eventName, eventParams = {}) => {
  logEvent(analytics, eventName, eventParams);
  console.log(`✅ Evento registrato: ${eventName}`, eventParams);
};

export { app, analytics, trackEvent };
