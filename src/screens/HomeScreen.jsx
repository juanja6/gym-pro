import React from 'react';
import { Card, Badge, Ring } from '../components/common';
import { Flame, Droplets, Trophy, Scale, Dumbbell, Play, Sparkles } from 'lucide-react';

const DAYS = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export default function HomeScreen({ state, actions, setTab }) {
  const { profile, routines, workoutLog, streaks, mealsData, waterLog } = state;
  const { addWater, getAITips } = actions;

  const d = new Date();
  const dateStr = `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const todayKey = d.toISOString().split('T')[0];
  const todayMeals = (mealsData[todayKey] || { meals: [] }).meals || [];
  const todayCal = todayMeals.reduce((s, m) => s + (m.items || []).reduce((a, i) => a + i.cal, 0), 0);
  const todayP = todayMeals.reduce((s, m) => s + (m.items || []).reduce((a, i) => a + i.p, 0), 0);
  const todayC = todayMeals.reduce((s, m) => s + (m.items || []).reduce((a, i) => a + i.c, 0), 0);
  const todayF = todayMeals.reduce((s, m) => s + (m.items || []).reduce((a, i) => a + i.f, 0), 0);
  const todayWater = waterLog[todayKey] || 0;
  const todayRoutine = routines[d.getDay() % routines.length];
  const tips = getAITips();

  return (
    <div className="screen">
      <div className="text-dim text-sm">{dateStr}</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: '4px 0 16px' }}>Hola, {profile.name} 👋</h1>

      {/* AI Coach */}
      <Card style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
        <div className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={20} color="var(--purple)" />
          </div>
          <div>
            <div className="label" style={{ color: 'var(--purple)' }}>ENTRENADOR IA</div>
            <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{tips[0]?.icon} {tips[0]?.text}</div>
          </div>
        </div>
      </Card>

      {/* Today's Workout */}
      <Card onClick={() => setTab('workout')}>
        <div className="row-between" style={{ marginBottom: 10 }}>
          <div>
            <div className="label">Entreno de hoy</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{todayRoutine?.name || 'Sin rutina'}</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Dumbbell size={22} color="var(--accent)" />
          </div>
        </div>
        <div className="row" style={{ gap: 16, marginBottom: 10 }}>
          <span className="text-dim text-sm">🕐 {todayRoutine?.duration}</span>
          <span className="text-dim text-sm">💪 {todayRoutine?.exercises.length} ejercicios</span>
        </div>
        <button className="btn w-full" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', gap: 6 }}>
          <Play size={14} /> Empezar Entrenamiento
        </button>
      </Card>

      {/* Nutrition Ring */}
      <Card>
        <div className="label mb-sm">Nutrición Hoy</div>
        <div className="row" style={{ gap: 20 }}>
          <Ring percent={(todayCal / profile.calTarget) * 100} color="var(--accent)" size={80} strokeWidth={7}>
            <span style={{ fontSize: 18, fontWeight: 800 }}>{Math.max(0, profile.calTarget - todayCal)}</span>
            <span style={{ fontSize: 9, color: 'var(--text-dim)' }}>kcal rest.</span>
          </Ring>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around' }}>
            {[
              { l: 'Prot', v: todayP, t: profile.pTarget, c: 'var(--blue)' },
              { l: 'Carbs', v: todayC, t: profile.cTarget, c: 'var(--orange)' },
              { l: 'Grasa', v: todayF, t: profile.fTarget, c: 'var(--red)' },
            ].map(m => (
              <div key={m.l} style={{ textAlign: 'center' }}>
                <Ring percent={(m.v / m.t) * 100} color={m.c} size={48} strokeWidth={4}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{m.v}</span>
                </Ring>
                <div className="text-dim" style={{ fontSize: 10, marginTop: 4 }}>{m.l}</div>
                <div className="text-muted" style={{ fontSize: 9 }}>{m.v}/{m.t}g</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid-2">
        <Card>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <Scale size={18} color="var(--accent)" />
            <span className="text-dim text-sm font-bold">Peso</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{profile.weight} kg</div>
        </Card>
        <Card>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <Flame size={18} color="var(--orange)" />
            <span className="text-dim text-sm font-bold">Racha</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{streaks.current} días</div>
          <div style={{ fontSize: 12, color: 'var(--orange)', marginTop: 2 }}>Récord: {streaks.best}</div>
        </Card>
        <Card onClick={() => addWater(0.25)}>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <Droplets size={18} color="var(--blue)" />
            <span className="text-dim text-sm font-bold">Agua</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{todayWater.toFixed(1)} L</div>
          <div style={{ fontSize: 12, color: 'var(--blue)', marginTop: 2 }}>Toca +250ml</div>
        </Card>
        <Card>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <Trophy size={18} color="var(--purple)" />
            <span className="text-dim text-sm font-bold">Entrenos</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>{workoutLog.length}</div>
          <div style={{ fontSize: 12, color: 'var(--purple)', marginTop: 2 }}>Total</div>
        </Card>
      </div>

      {/* Water Tracker */}
      <Card>
        <div className="row-between mb-sm">
          <span className="label">Agua Hoy</span>
          <span style={{ color: 'var(--blue)', fontSize: 12, fontWeight: 600 }}>{todayWater.toFixed(1)} / {profile.waterTarget} L</span>
        </div>
        <div className="progress-bg" style={{ marginBottom: 10 }}>
          <div className="progress-fill" style={{ width: `${Math.min((todayWater / profile.waterTarget) * 100, 100)}%`, background: 'var(--blue)' }} />
        </div>
        <div className="row" style={{ gap: 8 }}>
          {[0.25, 0.33, 0.5, 1].map(a => (
            <button key={a} onClick={() => addWater(a)}
              style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 12, fontWeight: 600 }}>
              +{a * 1000 < 1000 ? `${a * 1000}ml` : `${a}L`}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
