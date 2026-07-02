const PREFIX = 'gympro_';

const KEYS = {
  PROFILE: PREFIX + 'profile',
  ROUTINES: PREFIX + 'routines',
  WORKOUT_LOG: PREFIX + 'workoutlog',
  BODY_LOG: PREFIX + 'bodylog',
  MEALS: PREFIX + 'meals',
  WATER: PREFIX + 'water',
  FAVORITES: PREFIX + 'favorites',
  STREAKS: PREFIX + 'streaks',
  SETTINGS: PREFIX + 'settings',
};

function get(key, defaultValue = null) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : defaultValue;
  } catch { return defaultValue; }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch { return false; }
}

function remove(key) {
  try { localStorage.removeItem(key); return true; } catch { return false; }
}

// Convenience
export const storage = {
  getProfile: (d) => get(KEYS.PROFILE, d),
  setProfile: (v) => set(KEYS.PROFILE, v),
  getRoutines: (d) => get(KEYS.ROUTINES, d),
  setRoutines: (v) => set(KEYS.ROUTINES, v),
  getWorkoutLog: (d = []) => get(KEYS.WORKOUT_LOG, d),
  setWorkoutLog: (v) => set(KEYS.WORKOUT_LOG, v),
  getBodyLog: (d = []) => get(KEYS.BODY_LOG, d),
  setBodyLog: (v) => set(KEYS.BODY_LOG, v),
  getMeals: (d = {}) => get(KEYS.MEALS, d),
  setMeals: (v) => set(KEYS.MEALS, v),
  getWater: (d = {}) => get(KEYS.WATER, d),
  setWater: (v) => set(KEYS.WATER, v),
  getFavorites: (d = []) => get(KEYS.FAVORITES, d),
  setFavorites: (v) => set(KEYS.FAVORITES, v),
  getStreaks: (d = { current: 0, best: 0, lastDate: '' }) => get(KEYS.STREAKS, d),
  setStreaks: (v) => set(KEYS.STREAKS, v),
  getSettings: (d = { notifications: true }) => get(KEYS.SETTINGS, d),
  setSettings: (v) => set(KEYS.SETTINGS, v),
  exportAll: () => {
    const data = {};
    for (const [name, key] of Object.entries(KEYS)) data[name] = get(key);
    return JSON.stringify(data, null, 2);
  },
  importAll: (json) => {
    try {
      const data = JSON.parse(json);
      for (const [name, key] of Object.entries(KEYS)) {
        if (data[name] !== undefined && data[name] !== null) set(key, data[name]);
      }
      return true;
    } catch { return false; }
  }
};

export { KEYS };
export default storage;
