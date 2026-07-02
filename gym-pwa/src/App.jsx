import React, { useState, useEffect, useCallback } from 'react';
import { Home, Dumbbell, UtensilsCrossed, BarChart3, User } from 'lucide-react';
import storage from './services/storage';
import { DEFAULT_ROUTINES } from './data/exercises';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import DietScreen from './screens/DietScreen';
import StatsScreen from './screens/StatsScreen';
import ProfileScreen from './screens/ProfileScreen';

const DEFAULT_PROFILE = {
  name: 'Atleta', age: 28, height: 178, weight: 78, sex: 'Hombre',
  activity: 'Activo (4-5 días)', goal: 'Recomposición', level: 'Intermedio',
  calTarget: 2500, pTarget: 180, cTarget: 280, fTarget: 70, waterTarget: 3,
};

const TABS = [
  { id: 'home', label: 'Inicio', Icon: Home },
  { id: 'workout', label: 'Entreno', Icon: Dumbbell },
  { id: 'diet', label: 'Dieta', Icon: UtensilsCrossed },
  { id: 'stats', label: 'Stats', Icon: BarChart3 },
  { id: 'profile', label: 'Perfil', Icon: User },
];

export default function App() {
  const [tab, setTab] = useState('home');
  const [profile, setProfile] = useState(null);
  const [routines, setRoutines] = useState(DEFAULT_ROUTINES);
  const [workoutLog, setWorkoutLog] = useState([]);
  const [bodyLog, setBodyLog] = useState([]);
  const [mealsData, setMealsData] = useState({});
  const [waterLog, setWaterLog] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [streaks, setStreaks] = useState({ current: 0, best: 0, lastDate: '' });
  const [loaded, setLoaded] = useState(false);

  // Load data on mount
  useEffect(() => {
    setProfile(storage.getProfile(DEFAULT_PROFILE));
    setRoutines(storage.getRoutines(DEFAULT_ROUTINES));
    setWorkoutLog(storage.getWorkoutLog());
    setBodyLog(storage.getBodyLog());
    setMealsData(storage.getMeals());
    setWaterLog(storage.getWater());
    setFavorites(storage.getFavorites());
    setStreaks(storage.getStreaks());
    setLoaded(true);
  }, []);

  // Save helpers
  const saveProfile = useCallback((v) => { setProfile(v); storage.setProfile(v); }, []);
  const saveWorkoutLog = useCallback((v) => { setWorkoutLog(v); storage.setWorkoutLog(v); }, []);
  const saveBodyLog = useCallback((v) => { setBodyLog(v); storage.setBodyLog(v); }, []);
  const saveMeals = useCallback((v) => { setMealsData(v); storage.setMeals(v); }, []);
  const saveWater = useCallback((v) => { setWaterLog(v); storage.setWater(v); }, []);
  const saveFavorites = useCallback((v) => { setFavorites(v); storage.setFavorites(v); }, []);
  const saveStreaks = useCallback((v) => { setStreaks(v); storage.setStreaks(v); }, []);

  const addWater = useCallback((amount) => {
    const todayKey = new Date().toISOString().split('T')[0];
    const updated = { ...waterLog, [todayKey]: (waterLog[todayKey] || 0) + amount };
    saveWater(updated);
  }, [waterLog, saveWater]);

  const toggleFav = useCallback((id) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    saveFavorites(updated);
  }, [favorites, saveFavorites]);

  const getAITips = useCallback(() => {
    const tips = [];
    const todayKey = new Date().toISOString().split('T')[0];
    const todayMeals = (mealsData[todayKey] || { meals: [] }).meals || [];
    const todayCal = todayMeals.reduce((s, m) => s + (m.items || []).reduce((a, i) => a + i.cal, 0), 0);
    const todayP = todayMeals.reduce((s, m) => s + (m.items || []).reduce((a, i) => a + i.p, 0), 0);
    const todayWater = waterLog[todayKey] || 0;
    const p = profile || DEFAULT_PROFILE;

    if (todayCal === 0) {
      tips.push({ icon: '🍽️', text: 'No has registrado comidas hoy. ¡Empieza registrando tu desayuno!' });
    } else if (todayCal < p.calTarget * 0.5) {
      tips.push({ icon: '⚡', text: `Llevas solo ${todayCal} kcal. Te faltan ${p.calTarget - todayCal} para tu objetivo.` });
    } else if (todayCal > p.calTarget) {
      tips.push({ icon: '⚠️', text: `Has superado tu objetivo calórico por ${todayCal - p.calTarget} kcal. Ajusta las próximas comidas.` });
    } else {
      tips.push({ icon: '✅', text: `Buen ritmo nutricional. ${p.calTarget - todayCal} kcal restantes para hoy.` });
    }

    if (todayP < p.pTarget * 0.3) {
      tips.push({ icon: '🥩', text: `Proteína baja (${todayP}g / ${p.pTarget}g). Prioriza alimentos proteicos en tu próxima comida.` });
    }

    if (todayWater < p.waterTarget * 0.5) {
      tips.push({ icon: '💧', text: `Solo ${todayWater.toFixed(1)}L de agua. Hidratación esencial para rendimiento y recuperación.` });
    }

    if (streaks.current >= 7) {
      tips.push({ icon: '🔥', text: `¡${streaks.current} días de racha! Mantén la consistencia, es la clave del progreso.` });
    } else if (workoutLog.length === 0) {
      tips.push({ icon: '🎯', text: 'Tu primer entreno te espera. La consistencia empieza con un solo paso.' });
    }

    return tips.length > 0 ? tips : [{ icon: '💪', text: '¡Sigue así! Cada día cuenta para tu transformación.' }];
  }, [mealsData, waterLog, profile, streaks, workoutLog]);

  if (!loaded || !profile) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏋️</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>GymPro</div>
        <div className="text-dim text-sm" style={{ marginTop: 4 }}>Cargando...</div>
      </div>
    </div>
  );

  const state = { profile, routines, workoutLog, bodyLog, mealsData, waterLog, favorites, streaks };
  const actions = { saveProfile, saveWorkoutLog, saveBodyLog, saveMeals, saveWater, saveFavorites, saveStreaks, addWater, toggleFav, getAITips };

  const screens = {
    home: <HomeScreen state={state} actions={actions} setTab={setTab} />,
    workout: <WorkoutScreen state={state} actions={actions} />,
    diet: <DietScreen state={state} actions={actions} />,
    stats: <StatsScreen state={state} actions={actions} />,
    profile: <ProfileScreen state={state} actions={actions} />,
  };

  return (
    <div className="app">
      {screens[tab]}
      <div className="tab-bar">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} className={`tab-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
