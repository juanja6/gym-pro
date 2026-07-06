import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Btn, Modal, Ring } from '../components/common';
import { EXERCISES, MUSCLE_GROUPS, MUSCLE_EMOJI } from '../data/exercises';
import { getExerciseImage, getExerciseImages } from '../data/exerciseImages';
import { Search, ChevronLeft, ChevronRight, Dumbbell, Star, Check, Play, Square, Clock, Upload } from 'lucide-react';
import ImportModal from '../components/ImportModal';

export default function WorkoutScreen({ state, actions }) {
  const { routines, workoutLog, favorites } = state;
  const { saveWorkoutLog, saveStreaks, toggleFav } = actions;
  const [view, setView] = useState('routines');
  const [selEx, setSelEx] = useState(null);
  const [selRt, setSelRt] = useState(null);
  const [activeWk, setActiveWk] = useState(null);
  const [muscleF, setMuscleF] = useState('Todos');
  const [search, setSearch] = useState('');
  const [timer, setTimer] = useState({ active: false, secs: 90, rem: 90 });
  const [now, setNow] = useState(Date.now());
  const [showImport, setShowImport] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timer.active && timer.rem > 0) {
      timerRef.current = setTimeout(() => setTimer(t => ({ ...t, rem: t.rem - 1 })), 1000);
    } else if (timer.rem <= 0 && timer.active) {
      setTimer(t => ({ ...t, active: false }));
      if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
    }
    return () => clearTimeout(timerRef.current);
  }, [timer.active, timer.rem]);

  // Update elapsed time
  useEffect(() => {
    if (!activeWk) return;
    const i = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(i);
  }, [activeWk]);

  const startTimer = (s) => setTimer({ active: true, secs: s, rem: s });
  const filtered = EXERCISES.filter(e =>
    (muscleF === 'Todos' || e.muscle === muscleF) &&
    (!search || e.name.toLowerCase().includes(search.toLowerCase()))
  );

  const startWorkout = (routine) => {
    setActiveWk({
      routineId: routine.id, routineName: routine.name,
      date: new Date().toISOString().split('T')[0], startTime: Date.now(),
      exercises: routine.exercises.map(re => {
        const ex = EXERCISES.find(e => e.id === re.exerciseId);
        const name = ex?.name || re.exerciseId?.replace(/_/g, ' ') || 'Ejercicio';
        return { exerciseId: re.exerciseId, name, rest: re.rest,
          sets: re.sets.map(s => ({ target_r: s.r, target_w: s.w, r: '', w: '', rpe: '', done: false })) };
      }),
    });
    setSelRt(null);
  };

  const updateSet = (exIdx, setIdx, field, val) => {
    setActiveWk(prev => ({
      ...prev,
      exercises: prev.exercises.map((e, ei) => ei === exIdx
        ? { ...e, sets: e.sets.map((s, si) => si === setIdx ? { ...s, [field]: val } : s) } : e),
    }));
  };

  const toggleSetDone = (exIdx, setIdx, rest) => {
    setActiveWk(prev => ({
      ...prev,
      exercises: prev.exercises.map((e, ei) => ei === exIdx
        ? { ...e, sets: e.sets.map((s, si) => si === setIdx ? { ...s, done: !s.done } : s) } : e),
    }));
    if (navigator.vibrate) navigator.vibrate(50);
    startTimer(rest);
  };

  const finishWorkout = () => {
    if (!activeWk) return;
    const duration = Math.round((Date.now() - activeWk.startTime) / 60000);
    const entry = {
      id: Date.now().toString(), date: activeWk.date, routineName: activeWk.routineName, duration,
      exercises: activeWk.exercises.map(e => ({
        name: e.name,
        sets: e.sets.filter(s => s.done).map(s => ({ r: parseInt(s.r) || 0, w: parseFloat(s.w) || 0, rpe: parseInt(s.rpe) || 0 })),
      })),
    };
    const newLog = [...workoutLog, entry];
    saveWorkoutLog(newLog);

    const today = new Date().toISOString().split('T')[0];
    const { streaks } = state;
    const ns = { ...streaks };
    const yd = new Date(); yd.setDate(yd.getDate() - 1);
    if (ns.lastDate === yd.toISOString().split('T')[0]) ns.current = streaks.current + 1;
    else if (ns.lastDate !== today) ns.current = 1;
    ns.lastDate = today;
    if (ns.current > ns.best) ns.best = ns.current;
    saveStreaks(ns);

    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);
    setActiveWk(null);
  };

  // ── ACTIVE WORKOUT ──
  if (activeWk) {
    const elapsed = Math.round((now - activeWk.startTime) / 60000);
    const totalSets = activeWk.exercises.reduce((s, e) => s + e.sets.length, 0);
    const doneSets = activeWk.exercises.reduce((s, e) => s + e.sets.filter(ss => ss.done).length, 0);

    return (
      <div className="screen">
        <div className="row-between mb-lg">
          <div>
            <div className="label text-accent">ENTRENO ACTIVO</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{activeWk.routineName}</div>
          </div>
          <Btn small onClick={finishWorkout}><Check size={14} /> Terminar</Btn>
        </div>

        {/* Stats */}
        <div className="grid-3 mb-lg">
          <Card style={{ textAlign: 'center', padding: 12 }}>
            <div className="text-dim text-xs">Tiempo</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>{elapsed} min</div>
          </Card>
          <Card style={{ textAlign: 'center', padding: 12 }}>
            <div className="text-dim text-xs">Series</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--purple)' }}>{doneSets}/{totalSets}</div>
          </Card>
          <Card style={{ textAlign: 'center', padding: 12 }}>
            <div className="text-dim text-xs">Progreso</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--orange)' }}>{totalSets ? Math.round(doneSets / totalSets * 100) : 0}%</div>
          </Card>
        </div>

        {/* Timer */}
        <Card style={{ textAlign: 'center', marginBottom: 16 }}>
          <div className="label mb-sm">⏱️ DESCANSO</div>
          <div className="timer-display" style={{ color: timer.active ? 'var(--accent)' : 'var(--text-dim)' }}>
            {Math.floor(timer.rem / 60)}:{String(timer.rem % 60).padStart(2, '0')}
          </div>
          <div className="timer-presets">
            {[30, 60, 90, 120, 180].map(s => (
              <button key={s} className="timer-preset" onClick={() => startTimer(s)}>{s}s</button>
            ))}
            {timer.active && <button className="timer-preset" onClick={() => setTimer(t => ({ ...t, active: false, rem: 0 }))} style={{ borderColor: 'var(--red)', color: 'var(--red)' }}>Parar</button>}
          </div>
        </Card>

        {/* Exercises */}
        {activeWk.exercises.map((ex, exIdx) => (
          <Card key={exIdx}>
            <div className="row" style={{ gap: 8, marginBottom: 10 }}>
              <Dumbbell size={16} color="var(--accent)" />
              <span style={{ fontWeight: 700, fontSize: 15 }}>{ex.name}</span>
            </div>
            <div className="set-row header">
              <span>SET</span><span>KG</span><span>REPS</span><span>RPE</span><span></span>
            </div>
            {ex.sets.map((set, si) => (
              <div key={si} className="set-row">
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{si + 1}</span>
                <input className="set-input" type="number" placeholder={String(set.target_w)}
                  value={set.w} onChange={e => updateSet(exIdx, si, 'w', e.target.value)} />
                <input className="set-input" type="number" placeholder={String(set.target_r)}
                  value={set.r} onChange={e => updateSet(exIdx, si, 'r', e.target.value)} />
                <input className="set-input" type="number" placeholder="7"
                  value={set.rpe} onChange={e => updateSet(exIdx, si, 'rpe', e.target.value)} />
                <button className={`check-btn ${set.done ? 'done' : ''}`}
                  onClick={() => toggleSetDone(exIdx, si, ex.rest)}>
                  {set.done && <Check size={14} color="var(--bg)" />}
                </button>
              </div>
            ))}
          </Card>
        ))}
      </div>
    );
  }

  // ── EXERCISE DETAIL ──
  if (selEx) {
    return (
      <div className="screen">
        <button className="row mb-lg" onClick={() => setSelEx(null)} style={{ background: 'none', color: 'var(--text-dim)', gap: 4 }}>
          <ChevronLeft size={18} /> Volver
        </button>
        <div style={{ width: '100%', height: 180, background: 'var(--card)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {getExerciseImage(selEx.name) ? (
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              {getExerciseImages(selEx.name).map((src, i) => (
                <img key={i} src={src} alt={`${selEx.name} ${i+1}`}
                  style={{ flex: 1, height: '100%', objectFit: 'cover' }}
                  onError={e => e.target.style.display = 'none'} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 48 }}>{selEx.emoji || '🏋️'}</span>
              <div className="text-dim text-sm" style={{ marginTop: 4 }}>{selEx.muscle}</div>
            </div>
          )}
        </div>
        <div className="row-between mb-sm">
          <h2 style={{ fontSize: 22, fontWeight: 800, flex: 1 }}>{selEx.name}</h2>
          <button onClick={() => toggleFav(selEx.id)} style={{ background: 'none', padding: 8 }}>
            <Star size={20} color="var(--orange)" fill={favorites.includes(selEx.id) ? 'var(--orange)' : 'none'} />
          </button>
        </div>
        <div className="row mb-md" style={{ gap: 8 }}>
          <Badge>{selEx.muscle}</Badge>
          <Badge color="var(--text-dim)">{selEx.level}</Badge>
          <Badge color="var(--blue)">{selEx.type}</Badge>
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text)', marginBottom: 16 }}>{selEx.desc}</p>

        <Card>
          <div className="label mb-sm" style={{ color: 'var(--blue)' }}>TÉCNICA</div>
          {selEx.tech.map((t, i) => (
            <div key={i} className="row" style={{ gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: 'var(--blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--blue)' }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: 13 }}>{t}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div className="label mb-sm" style={{ color: 'var(--red)' }}>ERRORES COMUNES</div>
          {selEx.errors.map((e, i) => (
            <div key={i} className="row" style={{ gap: 8, marginBottom: 4 }}>
              <span style={{ color: 'var(--red)' }}>✕</span>
              <span style={{ fontSize: 13 }}>{e}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div className="label mb-sm" style={{ color: 'var(--accent)' }}>CONSEJOS</div>
          {selEx.tips.map((t, i) => (
            <div key={i} className="row" style={{ gap: 8, marginBottom: 4 }}>
              <span style={{ color: 'var(--accent)' }}>💡</span>
              <span style={{ fontSize: 13 }}>{t}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div className="label mb-sm" style={{ color: 'var(--orange)' }}>RESPIRACIÓN</div>
          <div className="row" style={{ gap: 8 }}>
            <span>🌬️</span>
            <span style={{ fontSize: 13 }}>{selEx.breath}</span>
          </div>
        </Card>

        {selEx.equip && (
          <Card>
            <div className="label mb-sm">EQUIPAMIENTO</div>
            <div className="row" style={{ gap: 8 }}>
              <span>🏋️</span><span style={{ fontSize: 13 }}>{selEx.equip}</span>
            </div>
            {selEx.secondary && <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-dim)' }}>Secundario: {selEx.secondary}</div>}
          </Card>
        )}
      </div>
    );
  }

  // ── ROUTINE DETAIL ──
  if (selRt) {
    return (
      <div className="screen">
        <button className="row mb-lg" onClick={() => setSelRt(null)} style={{ background: 'none', color: 'var(--text-dim)', gap: 4 }}>
          <ChevronLeft size={18} /> Volver
        </button>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{selRt.name}</h2>
        <div className="text-dim text-sm mb-md">{selRt.muscles} · {selRt.duration}</div>
        <Btn className="w-full mb-lg" onClick={() => startWorkout(selRt)}>
          <Play size={16} /> Empezar Entrenamiento
        </Btn>
        {selRt.exercises.map((re, i) => {
          const ex = EXERCISES.find(e => e.id === re.exerciseId);
          const name = ex?.name || re.exerciseId?.replace(/_/g, ' ') || `Ejercicio ${i+1}`;
          return (
            <Card key={i}>
              <div className="row-between">
                <div className="row" style={{ gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Dumbbell size={16} color="var(--accent)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
                    <div className="text-dim text-xs">{re.sets.length} series · Desc: {re.rest}s</div>
                  </div>
                </div>
              </div>
              <div className="set-row header" style={{ marginTop: 8 }}>
                <span>SET</span><span>KG</span><span>REPS</span><span>RPE</span><span></span>
              </div>
              {re.sets.map((s, si) => (
                <div key={si} className="set-row">
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{si + 1}</span>
                  <span>{s.w} kg</span><span>{s.r}</span><span>{s.rpe}</span><span></span>
                </div>
              ))}
            </Card>
          );
        })}
      </div>
    );
  }

  // ── MAIN VIEW ──
  return (
    <div className="screen">
      <h1 className="title">Entreno</h1>

      {/* Tab bar */}
      <div style={{ display: 'flex', background: 'var(--card)', borderRadius: 12, padding: 3, marginBottom: 16, border: '1px solid var(--border)' }}>
        {[['routines', 'Rutinas'], ['library', 'Ejercicios'], ['history', 'Historial']].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)}
            style={{ flex: 1, padding: '10px 0', borderRadius: 10, background: view === id ? 'var(--accent)' : 'transparent', color: view === id ? 'var(--bg)' : 'var(--text-dim)', fontWeight: 600, fontSize: 13 }}>
            {label}
          </button>
        ))}
      </div>

      {view === 'routines' && (
        <>
          <Btn secondary onClick={() => setShowImport(true)} className="w-full" style={{ marginBottom: 12 }}>
            <Upload size={16} /> Importar Rutina (IA / archivo)
          </Btn>
          {routines.map(r => (
            <Card key={r.id || r.name} onClick={() => setSelRt(r)}>
              <div className="row-between">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{r.name}</div>
                  <div className="text-dim text-sm" style={{ marginBottom: 8 }}>{r.muscles || `${r.exercises.length} ejercicios`}</div>
                  <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                    {r.day && <Badge color="var(--blue)">{r.day}</Badge>}
                    {r.duration && <Badge color="var(--text-dim)">{r.duration}</Badge>}
                    <Badge>{r.exercises.length} ej.</Badge>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--text-dim)" />
              </div>
            </Card>
          ))}
        </>
      )}

      {view === 'library' && (
        <>
          <div className="search-box">
            <Search size={16} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ejercicio..." />
          </div>
          <div className="chips-row">
            {MUSCLE_GROUPS.map(m => (
              <button key={m} className={`chip ${muscleF === m ? 'active' : ''}`} onClick={() => setMuscleF(m)}>
                {MUSCLE_EMOJI[m] || '💪'} {m}
              </button>
            ))}
          </div>
          {filtered.map(ex => (
            <Card key={ex.id} onClick={() => setSelEx(ex)}>
              <div className="row" style={{ gap: 12 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                  {getExerciseImage(ex.name) ? (
                    <img src={getExerciseImage(ex.name)} alt={ex.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML=`<span style="font-size:24px">${ex.emoji||'🏋️'}</span>`; }} />
                  ) : (
                    <span style={{ fontSize: 24 }}>{ex.emoji || '🏋️'}</span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{ex.name}</div>
                  <div className="row" style={{ gap: 8, marginTop: 4 }}>
                    <Badge>{ex.muscle}</Badge>
                    <Badge color="var(--text-dim)">{ex.level}</Badge>
                  </div>
                </div>
                {favorites.includes(ex.id) && <Star size={14} color="var(--orange)" fill="var(--orange)" />}
                <ChevronRight size={18} color="var(--text-dim)" />
              </div>
            </Card>
          ))}
        </>
      )}

      {view === 'history' && (
        workoutLog.length === 0 ? (
          <div className="empty-state">
            <Dumbbell />
            <span>Sin entrenos registrados aún</span>
          </div>
        ) : workoutLog.slice().reverse().map(w => (
          <Card key={w.id}>
            <div className="row-between mb-sm">
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{w.routineName}</div>
                <div className="text-dim text-sm" style={{ marginTop: 2 }}>{w.date} · {w.duration} min</div>
              </div>
              <Badge>{w.exercises.reduce((s, e) => s + e.sets.length, 0)} series</Badge>
            </div>
            {w.exercises.map((e, i) => (
              <div key={i} className="text-dim text-sm" style={{ marginTop: 2 }}>
                {e.name}: {e.sets.length} sets{e.sets[0]?.w ? ` · Max ${Math.max(...e.sets.map(s => s.w))}kg` : ''}
              </div>
            ))}
          </Card>
        ))
      )}

      <ImportModal
        visible={showImport}
        onClose={() => setShowImport(false)}
        type="routine"
        onImport={(imported) => {
          const newRoutines = imported.map((r, i) => ({
            id: `imported_${Date.now()}_${i}`,
            name: r.name,
            muscles: r.exercises.map(e => e.name).slice(0, 3).join(', '),
            duration: `~${Math.round(r.exercises.length * 5)} min`,
            exercises: r.exercises.map(e => ({
              exerciseId: e.name.toLowerCase().replace(/\s+/g, '_'),
              rest: e.rest || 90,
              sets: e.sets,
            })),
          }));
          const updated = [...routines, ...newRoutines];
          if (actions.saveRoutines) actions.saveRoutines(updated);
        }}
      />
    </div>
  );
}
