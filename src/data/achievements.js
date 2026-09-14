// Achievement definitions. `check` receives the lifetime stats object (see
// src/utils/lifetimeStats.js) and returns whether the achievement is earned.
export const ACHIEVEMENTS = [
  {
    id: 'first_shift',
    icon: '🎖️',
    title: 'Erste Schicht',
    description: 'Schließe deine erste Schicht ab.',
    check: (s) => s.shiftsCompleted >= 1,
  },
  {
    id: 'streak_10',
    icon: '🔥',
    title: 'Auf einer Rolle',
    description: 'Erreiche eine Serie von 10 richtigen Antworten in Folge.',
    check: (s) => s.bestStreakEver >= 10,
  },
  {
    id: 'streak_20',
    icon: '⚡',
    title: 'Unaufhaltsam',
    description: 'Erreiche eine Serie von 20 richtigen Antworten in Folge.',
    check: (s) => s.bestStreakEver >= 20,
  },
  {
    id: 'perfect_shift',
    icon: '💯',
    title: 'Fehlerfreie Schicht',
    description: 'Schließe eine Schicht mit mindestens 10 Vorfällen und 100% Trefferquote ab.',
    check: (s) => s.perfectShifts >= 1,
  },
  {
    id: 'hundred_correct',
    icon: '📈',
    title: 'Erfahrener Analyst',
    description: 'Beantworte insgesamt 100 Vorfälle richtig.',
    check: (s) => s.totalCorrect >= 100,
  },
  {
    id: 'ten_shifts',
    icon: '🗓️',
    title: 'Stammkraft',
    description: 'Schließe 10 Schichten ab.',
    check: (s) => s.shiftsCompleted >= 10,
  },
  {
    id: 'cloud_expert',
    icon: '☁️',
    title: 'Cloud-Experte',
    description: "Löse 10 Vorfälle der Kategorie 'Cloud' richtig.",
    check: (s) => (s.categoryCorrect.Cloud || 0) >= 10,
  },
  {
    id: 'network_specialist',
    icon: '🌐',
    title: 'Netzwerk-Spezialist',
    description: "Löse 10 Vorfälle der Kategorie 'Netzwerk' richtig.",
    check: (s) => (s.categoryCorrect.Netzwerk || 0) >= 10,
  },
  {
    id: 'hardcore_survivor',
    icon: '🛡️',
    title: 'Hardcore überlebt',
    description: 'Schließe eine komplette Hardcore-Schicht ab, ohne ein Game Over zu kassieren.',
    check: (s) => s.hardcoreShiftsSurvived >= 1,
  },
  {
    id: 'lead_responder',
    icon: '👑',
    title: 'Lead Incident Responder',
    description: 'Erreiche Level 5 (1000 XP).',
    check: (s) => s.maxScore >= 1000,
  },
];
