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

export interface LanguageCounts {
  [language: string]: number;
}

export interface Interaction {
  type: string;
  counts: LanguageCounts;
}

export interface Question {
  id: string;
  question: string;
  lang: string;
  timestamp: Date;
}

export interface MedicationDetails {
  name: string;
  interactions: Interaction[];
  questions: Question[];
}

export interface MedicationSummary {
  name: string;
  totalInteractions: number;
}

export interface SidebarProps {
  isOpen: boolean;
}

export interface HeaderProps {
  toggleSidebar: () => void;
}