import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const EventChart = ({ events }) => {
  const eventCounts = events.reduce((acc, event) => {
    acc[event.name] = (acc[event.name] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(eventCounts),
    datasets: [
      {
        label: "Numero di Eventi",
        data: Object.values(eventCounts),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Eventi Tracciati in Firebase",
      },
    },
  };

  return (
    <div>
      <h2>Eventi registrati</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default EventChart;
