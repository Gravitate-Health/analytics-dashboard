import type { EventByDate } from './types';

export const formatDate = (dateString: string): string => {
    if (dateString && dateString.length === 8) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${day}/${month}/${year}`;
    }
    return dateString;
};

export const prepareEventsByDateData = (events: EventByDate[] | undefined) => {
    if (!events) return [];
    return events.map(event => ({
      ...event,
      date: formatDate(event.date)
    }));
};

interface Period {
  value: string; // ID
  label: string;
  dates: {
    startDate: string;
    endDate: string;
  };
}

export const TIME_PERIODS: Period[] = [
  { value: 'today', label: 'Today', dates: { startDate: 'today', endDate: 'today' } },
  { value: 'yesterday', label: 'Yesterday', dates: { startDate: 'yesterday', endDate: 'yesterday' } },
  { value: 'last7days', label: 'Last 7 days', dates: { startDate: '7daysAgo', endDate: 'today' } },
  { value: 'last30days', label: 'Last 30 days', dates: { startDate: '30daysAgo', endDate: 'today' } },
  { value: 'last90days', label: 'Last 90 days', dates: { startDate: '90daysAgo', endDate: 'today' } },
  { value: 'last12months', label: 'Last 12 months', dates: { startDate: '365daysAgo', endDate: 'today' } },
];

interface DateRange {
  startDate: string;
  endDate: string;
}

export const getPeriodDates = (periodValue: string): DateRange => {
  const period = TIME_PERIODS.find(p => p.value === periodValue);
  
  if (!period) {
    return { startDate: '30daysAgo', endDate: 'today' };
  }
  
  return period.dates;
};
