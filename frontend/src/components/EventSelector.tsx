import React from 'react';

interface Props {
  eventList: string[];
  selectedEvent: string;
  onChange: (eventName: string) => void;
}

const EventSelector: React.FC<Props> = ({ eventList, selectedEvent, onChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-2">
         Select an event
      </label>
      <select
        id="event-select"
        className="border border-gray-300 rounded px-4 py-2 text-sm w-full"
        value={selectedEvent}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All events (aggregates)</option>
        {eventList.map((event) => (
          <option key={event} value={event}>
            {event}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EventSelector;
