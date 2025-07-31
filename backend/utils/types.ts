export interface MedicationData {
    medication_name: string;
    count: number;
}

export interface LanguageCounts {
    [language: string]: number; // es: { en: 10, es: 5, total: 15 }
}
  
export interface Interaction {
    type: string;          // es: 'Click', 'Focus'
    counts: LanguageCounts;
}

export interface Question {
    question: string;
    timestamp: any;
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