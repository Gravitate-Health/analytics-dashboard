export interface EventByDate {
  date: string;
  count: number;
}

export interface EventByType {
  eventName: string;
  count: number;
}

export interface EventByPlatform {
  platform: string;
  count: number;
}

export interface AnalyticsData {
  eventsByDate: EventByDate[];
  eventsByType: EventByType[];
  eventsByPlatform: EventByPlatform[];
}

export interface MedicationData {
  medication_name: string;
  count: number;
}