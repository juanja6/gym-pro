import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

let currentUid = null;

function userDoc(collection) {
  if (!currentUid) throw new Error('No user logged in');
  return doc(db, 'users', currentUid, 'data', collection);
}

async function get(collection, defaultValue = null) {
  try {
    const snap = await getDoc(userDoc(collection));
    return snap.exists() ? snap.data().value : defaultValue;
  } catch (e) {
    console.error('Firestore get error:', collection, e);
    return defaultValue;
  }
}

async function set(collection, value) {
  try {
    await setDoc(userDoc(collection), { value, updatedAt: Date.now() });
    return true;
  } catch (e) {
    console.error('Firestore set error:', collection, e);
    return false;
  }
}

export const storage = {
  setUser: (uid) => { currentUid = uid; },
  getUser: () => currentUid,

  getProfile: (d) => get('profile', d),
  setProfile: (v) => set('profile', v),
  getRoutines: (d) => get('routines', d),
  setRoutines: (v) => set('routines', v),
  getWorkoutLog: (d = []) => get('workoutLog', d),
  setWorkoutLog: (v) => set('workoutLog', v),
  getBodyLog: (d = []) => get('bodyLog', d),
  setBodyLog: (v) => set('bodyLog', v),
  getMeals: (d = {}) => get('meals', d),
  setMeals: (v) => set('meals', v),
  getWater: (d = {}) => get('water', d),
  setWater: (v) => set('water', v),
  getFavorites: (d = []) => get('favorites', d),
  setFavorites: (v) => set('favorites', v),
  getStreaks: (d = { current: 0, best: 0, lastDate: '' }) => get('streaks', d),
  setStreaks: (v) => set('streaks', v),
  getSettings: (d = { notifications: true }) => get('settings', d),
  setSettings: (v) => set('settings', v),
  getProgressPhotos: (d = []) => get('progressPhotos', d),
  setProgressPhotos: (v) => set('progressPhotos', v),

  exportAll: async () => {
    const keys = ['profile', 'routines', 'workoutLog', 'bodyLog', 'meals', 'water', 'favorites', 'streaks', 'settings'];
    const data = {};
    for (const k of keys) data[k] = await get(k);
    return JSON.stringify(data, null, 2);
  },

  importAll: async (json) => {
    try {
      const data = JSON.parse(json);
      for (const [k, v] of Object.entries(data)) {
        if (v !== undefined && v !== null) await set(k, v);
      }
      return true;
    } catch { return false; }
  }
};

export default storage;
