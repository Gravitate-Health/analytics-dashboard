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
