import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { EVENT_DESCRIPTIONS } from '../utils/constants';

// Array di colori per i grafici
const COLORS = ['#00B4B4', '#00AEEF', '#003865', '#7ED6DF', '#EAB543'];

interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  xKey?: string;
  yKey?: string;
  nameKey?: string;
  dataKey?: string;
  name?: string;
}

/**
 * Custom tooltip for the bar chart.
 *
 * Recharts' default Tooltip component cannot access or format additional custom fields
 * such as a pretty display name or an explanatory description.
 *
 * A custom tooltip is therefore required to show a human-friendly description for each event.
 */
const BarTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  const rawName = item.rawEventName ?? item.eventName;
  const description = EVENT_DESCRIPTIONS[rawName] ?? '';

  return (
    <div className="bg-white rounded shadow p-2 text-xs max-w-[200px] whitespace-normal">
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-blue-600 font-semibold">
        Occurrences: {payload[0].value}
      </p>
      {description && <p className="mt-1 text-gray-600">{description}</p>}
    </div>
  );
};

const EventChart: React.FC<ChartProps> = ({ type, data, xKey, yKey, nameKey, dataKey, name }) => {
  // Funzione per generare slice di colori diversi nella pie chart
  const renderCustomizedLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}`;
  };

  switch (type) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={xKey} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickMargin={10}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line 
              type="monotone" 
              dataKey={yKey} 
              name={name || yKey}
              stroke="#00B4B4" 
              strokeWidth={2}
              dot={{ fill: '#00B4B4', r: 4 }}
              activeDot={{ r: 6, stroke: '#003865', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={xKey} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickMargin={10}
              axisLine={{ stroke: '#d1d5db' }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <Tooltip content={<BarTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey={yKey ?? 'count'}
              name={name ?? yKey ?? 'Valore'}
              fill="#00AEEF"
              radius={[4, 4, 0, 0]}
            />

          </BarChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Pie
              dataKey={dataKey ?? 'count'}
              nameKey={nameKey ?? 'event'}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={3}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
              formatter={(value, name) => [`${value}`, `${name}`]}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return <div>Tipo di grafico non supportato</div>;
  }
};

export default EventChart;
