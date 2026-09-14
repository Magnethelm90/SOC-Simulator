import { ACHIEVEMENTS } from '../data/achievements';

const STORAGE_KEY = 'soc_simulator_lifetime';

export const DEFAULT_LIFETIME_STATS = {
  totalCorrect: 0,
  totalWrong: 0,
  shiftsCompleted: 0,
  bestStreakEver: 0,
  perfectShifts: 0,
  hardcoreShiftsSurvived: 0,
  maxScore: 0,
  categoryCorrect: {},
  unlocked: [],
};

export const loadLifetimeStats = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LIFETIME_STATS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_LIFETIME_STATS, ...parsed, categoryCorrect: { ...parsed.categoryCorrect } };
  } catch {
    return DEFAULT_LIFETIME_STATS;
  }
};

export const saveLifetimeStats = (stats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage can be unavailable (private mode, quota) - lifetime stats and
    // achievements just won't persist across sessions, which is fine.
  }
};

// Given the previous stats and updated stats, returns the achievements that
// just became true and weren't already unlocked, plus the stats object with
// `unlocked` updated to include them. Pure function - callers persist the
// result themselves.
export const checkNewAchievements = (stats) => {
  const alreadyUnlocked = new Set(stats.unlocked);
  const newlyUnlocked = ACHIEVEMENTS.filter(
    (a) => !alreadyUnlocked.has(a.id) && a.check(stats)
  );
  if (newlyUnlocked.length === 0) {
    return { stats, newlyUnlocked: [] };
  }
  return {
    stats: { ...stats, unlocked: [...stats.unlocked, ...newlyUnlocked.map((a) => a.id)] },
    newlyUnlocked,
  };
};
