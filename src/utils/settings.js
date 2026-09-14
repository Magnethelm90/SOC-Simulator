const STORAGE_KEY = 'soc_simulator_settings';

export const DEFAULT_SETTINGS = {
  difficulty: 'normal', // 'normal' | 'hardcore'
  timerEnabled: false, // ignored (always true) when difficulty is 'hardcore'
  soundEnabled: true,
  excludedCategories: [], // categories to leave out of the shift
};

export const loadSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be unavailable (private mode, quota) - settings just
    // won't persist across sessions, which is fine.
  }
};

// Timer durations in seconds. Hardcore always runs against the clock;
// in normal mode the timer is opt-in via settings.timerEnabled.
export const TIMER_SECONDS = {
  normal: 30,
  hardcore: 20,
};

export const getTimerSeconds = (settings) => {
  if (settings.difficulty === 'hardcore') return TIMER_SECONDS.hardcore;
  if (settings.timerEnabled) return TIMER_SECONDS.normal;
  return null;
};

// Categorizes every scenario (scenarios without an explicit `category`
// field fall into a shared "Allgemein" bucket) and returns a list of
// { name, count } sorted with "Allgemein" first, then alphabetically.
export const getCategoryBreakdown = (scenarios) => {
  const counts = new Map();
  scenarios.forEach((s) => {
    const name = s.category || 'Allgemein';
    counts.set(name, (counts.get(name) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (a.name === 'Allgemein') return -1;
      if (b.name === 'Allgemein') return 1;
      return a.name.localeCompare(b.name, 'de');
    });
};
