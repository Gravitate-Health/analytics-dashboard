export const LANGUAGE_MAP: { [key: string]: string } = {
    en: 'English',
    es: 'Spanish',
    it: 'Italian',
  };
  
export const COLORS: { [key: string]: string } = {
    en: '#8884d8',
    es: '#82ca9d',
    it: '#ffc658',
  };

// Abilita/disabilita il sistema di login
// Impostare a false per rimuovere completamente l'autenticazione
export const ENABLE_LOGIN = false;

const EVENT_LABELS: Record<string, string> = {
  screen_view: 'Screen View',
  user_engagement: 'Engagement',
  app_open: 'App Open',
  medication_focused_leaflet_section: 'Focused Leaflet',
  medication_leaflet_section: 'Leaflet',
  session_start: 'Session Start',
  search: 'Search',
  medication_summary_leaflet_section: 'Summary Leaflet',
  medication_support_material_section: 'Support material',
  chat_question_asked: 'Chat Question',
  first_open: 'First Open',
  app_remove: 'App Remove',
  os_update: 'OS Update',
  app_update: 'App update',
};

export const EVENT_DESCRIPTIONS: Record<string, string> = {
  screen_view: 'Counts how many times a page or screen in the app is opened and shown to the user.',
  user_engagement: 'Measures how long people actively use the app, not just open it.',
  app_open: 'Counts how many times the app is opened by a user.',
  medication_focused_leaflet_section: 'Tracks visits to the focused leaflet info section.', 
  medication_leaflet_section: 'Tracks visits to the general leaflet info section.',
  session_start: 'Marks the beginning of a user’s activity session — essentially when a user starts doing something inside the app.',
  search: 'Tracks how often users use the search feature within the app.',
  medication_summary_leaflet_section: 'Tracks visits to the summary leaflet info section.',
  medication_support_material_section: 'Tracks visits to the support material section of the app.',
  chat_question_asked: 'Counts how many questions users ask through the in-app chat feature.',
  first_open: 'Records when a user opens the app for the very first time after installing it.',
  app_remove: 'Tracks when users uninstall the app from their device.',
  os_update: 'Monitors when users update their device’s operating system.',
  app_update: 'Tracks when users update the app to a newer version.',
};

export const getEventLabel = (raw: string) => EVENT_LABELS[raw] ?? raw;