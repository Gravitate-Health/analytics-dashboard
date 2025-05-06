import { useEffect, useState } from "react";
import { trackEvent } from "./firebase";
import EventChart from "./components/EventChart";

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // 🔹 Tracciare automaticamente l'evento "screen_view"
    trackEvent("screen_view", { screen_name: "HomePage" });

    // 🔹 Simuliamo un listener per ricevere eventi (dato che Firebase Analytics non permette di leggerli direttamente)
    const interval = setInterval(() => {
      const fakeEvent = {
        name: "random_event",
        params: { value: Math.floor(Math.random() * 100) },
      };
      setEvents(prevEvents => [...prevEvents, fakeEvent]);
      console.log("Evento ricevuto:", fakeEvent);
    }, 5000); // 🔹 Simuliamo un evento ogni 5 secondi

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Gravitate Health Dashboard</h1>
      <EventChart events={events} />
    </div>
  );
}

export default App;
