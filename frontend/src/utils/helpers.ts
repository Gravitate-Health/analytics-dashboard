import type { EventByDate, Interaction, LanguageCounts } from './types';

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

/**
 * Transforms a single interaction object into a data entry for a chart.
 * It ensures a count of 0 is present for any language that is missing.
 *
 * @param {object} interaction - The interaction object, e.g., { type: 'app_open', counts: { en: 10 } }.
 * @param {string[]} availableLanguages - An array of language codes, e.g., ['en', 'it'].
 * @returns {object} A chart-ready object, e.g., { type: 'app_open', en: 10, it: 0 }.
 */
export const transformInteractionData = (interaction: Interaction, availableLanguages: string[]) => {
  const entry: { type: string; [key: string]: string | number } = {
    type: interaction.type,
  };

  availableLanguages.forEach(lang => {
    entry[lang] = interaction.counts?.[lang] || 0;
  });

  return entry;
};
