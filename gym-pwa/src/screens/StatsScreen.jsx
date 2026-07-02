import React, { useState } from 'react';
import { Card, Badge, Btn, Modal } from '../components/common';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Trophy, Save } from 'lucide-react';

export default function StatsScreen({ state, actions }) {
  const { profile, bodyLog, workoutLog } = state;
  const { saveBodyLog, saveProfile } = actions;
  const [statTab, setStatTab] = useState('peso');
  const [addBody, setAddBody] = useState(false);
  const [bf, setBf] = useState({ weight: '', fat: '', muscle: '', waist: '', chest: '', arm: '', leg: '' });

  const saveBodyEntry = () => {
    const entry = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(bf.weight) || 0, fat: parseFloat(bf.fat) || 0,
      muscle: parseFloat(bf.muscle) || 0, waist: parseFloat(bf.waist) || 0,
      chest: parseFloat(bf.chest) || 0, arm: parseFloat(bf.arm) || 0, leg: parseFloat(bf.leg) || 0,
    };
    saveBodyLog([...bodyLog, entry]);
    if (entry.weight > 0) saveProfile({ ...profile, weight: entry.weight });
    setAddBody(false);
    setBf({ weight: '', fat: '', muscle: '', waist: '', chest: '', arm: '', leg: '' });
  };

  const lastBody = bodyLog.length > 0 ? bodyLog[bodyLog.length - 1] : null;
  const weightChartData = bodyLog.slice(-10).filter(b => b.weight > 0).map(b => ({ name: b.date.slice(5), peso: b.weight }));

  const getMaxWeight = (name) => {
    let max = 0;
    workoutLog.forEach(w => w.exercises.forEach(e => {
      if (e.name === name) e.sets.forEach(s => { if (s.w > max) max = s.w; });
    }));
    return max;
  };

  return (
    <div className="screen">
      <div className="row-between mb-lg">
        <h1 className="title" style={{ marginBottom: 0 }}>Estadísticas</h1>
        <Btn small onClick={() => setAddBody(true)}><Plus size={14} /> Registro</Btn>
      </div>

      {/* Tabs */}
      <div className="chips-row" style={{ marginBottom: 16 }}>
        {[['peso', 'Peso'], ['fuerza', 'Fuerza'], ['body', 'Composición'], ['calendar', 'Calendario']].map(([id, l]) => (
          <button key={id} className={`chip ${statTab === id ? 'active' : ''}`} onClick={() => setStatTab(id)}>{l}</button>
        ))}
      </div>

      {statTab === 'peso' && (
        <>
          <Card>
            <div className="row-between">
              <div>
                <div className="label">Peso Actual</div>
                <div style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 800 }}>{lastBody?.weight || profile.weight}</span>
                  <span className="text-dim" style={{ fontSize: 16 }}> kg</span>
                </div>
              </div>
              {bodyLog.length >= 2 && (
                <Badge>{(bodyLog[0].weight - (lastBody?.weight || 0) > 0 ? '▼' : '▲')} {Math.abs(bodyLog[0].weight - (lastBody?.weight || 0)).toFixed(1)} kg</Badge>
              )}
            </div>
            {weightChartData.length > 1 && (
              <div style={{ marginTop: 16, height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-dim)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: 'var(--text-dim)', fontSize: 10 }} axisLine={{ stroke: 'var(--border)' }} />
                    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
                    <Line type="monotone" dataKey="peso" stroke="var(--accent)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {lastBody && (
            <Card>
              <div className="label mb-md">Últimas Medidas ({lastBody.date})</div>
              <div className="grid-3">
                {[
                  ['Cintura', lastBody.waist, 'cm'], ['Pecho', lastBody.chest, 'cm'],
                  ['Brazo', lastBody.arm, 'cm'], ['Pierna', lastBody.leg, 'cm'],
                  ['% Grasa', lastBody.fat, '%'], ['Músculo', lastBody.muscle, 'kg'],
                ].filter(([_, v]) => v > 0).map(([l, v, u]) => (
                  <div key={l} style={{ padding: 10, background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
                    <div className="text-dim" style={{ fontSize: 9 }}>{l}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>{v}{u}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {statTab === 'fuerza' && (
        <>
          <Card>
            <div className="label mb-md">Récords Personales</div>
            {['Press Banca', 'Sentadilla', 'Peso Muerto', 'Press Militar', 'Dominadas'].map(name => {
              const max = getMaxWeight(name);
              if (max === 0) return null;
              return (
                <div key={name} className="row-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div className="row" style={{ gap: 8 }}>
                    <Trophy size={16} color="var(--orange)" />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{name}</span>
                  </div>
                  <span style={{ color: 'var(--accent)', fontSize: 16, fontWeight: 800 }}>{max} kg</span>
                </div>
              );
            })}
            {workoutLog.length === 0 && (
              <div className="text-dim text-center" style={{ padding: 20 }}>Completa entrenos para ver tus PRs</div>
            )}
          </Card>

          <Card>
            <div className="label mb-md">Resumen</div>
            <div className="grid-3">
              {[
                { l: 'Entrenos', v: workoutLog.length, c: 'var(--accent)' },
                { l: 'Series totales', v: workoutLog.reduce((s, w) => s + w.exercises.reduce((a, e) => a + e.sets.length, 0), 0), c: 'var(--purple)' },
                { l: 'Vol. total (kg)', v: workoutLog.reduce((s, w) => s + w.exercises.reduce((a, e) => a + e.sets.reduce((b, ss) => b + ss.w * ss.r, 0), 0), 0).toLocaleString(), c: 'var(--orange)' },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center', padding: 12, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div className="text-dim" style={{ fontSize: 9 }}>{s.l}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.c, marginTop: 4 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {statTab === 'body' && (
        <div className="grid-2">
          {[
            { l: '% Grasa', v: lastBody?.fat || '--', c: 'var(--red)' },
            { l: 'Músculo', v: lastBody?.muscle ? `${lastBody.muscle} kg` : '--', c: 'var(--accent)' },
            { l: 'IMC', v: lastBody ? (lastBody.weight / ((profile.height / 100) ** 2)).toFixed(1) : '--', c: 'var(--blue)' },
            { l: 'TMB', v: Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5), c: 'var(--orange)' },
            { l: 'TDEE', v: Math.round((10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5) * 1.55), c: 'var(--purple)' },
            { l: 'Agua', v: lastBody?.fat ? `${Math.round(100 - lastBody.fat - 15)}%` : '--', c: 'var(--blue)' },
          ].map(s => (
            <Card key={s.l} style={{ textAlign: 'center', padding: 16 }}>
              <div className="label">{s.l}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.c, marginTop: 6 }}>{s.v}</div>
            </Card>
          ))}
        </div>
      )}

      {statTab === 'calendar' && (
        <Card>
          <div className="label mb-md">Historial de Actividad</div>
          {(() => {
            const now = new Date();
            const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const workDates = new Set(workoutLog.map(w => w.date));
            const bodyDates = new Set(bodyLog.map(b => b.date));
            const today = now.toISOString().split('T')[0];

            return (
              <>
                <div className="cal-grid">
                  {Array.from({ length: days }, (_, i) => {
                    const dd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                    const hasW = workDates.has(dd);
                    const hasB = bodyDates.has(dd) && !hasW;
                    return (
                      <div key={i} className={`cal-day ${hasW ? 'workout' : ''} ${hasB ? 'body' : ''} ${dd === today ? 'today' : ''}`}>
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="row mt-md" style={{ gap: 16 }}>
                  <div className="row" style={{ gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 4, background: 'var(--accent-dim)' }} />
                    <span className="text-dim text-xs">Entreno</span>
                  </div>
                  <div className="row" style={{ gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 4, background: 'var(--blue-dim)' }} />
                    <span className="text-dim text-xs">Medidas</span>
                  </div>
                </div>
              </>
            );
          })()}
        </Card>
      )}

      {/* Add Body Log Modal */}
      <Modal visible={addBody} onClose={() => setAddBody(false)} title="Registrar Medidas">
        {[
          ['weight', 'Peso (kg)'], ['fat', '% Grasa'], ['muscle', 'Masa muscular (kg)'],
          ['waist', 'Cintura (cm)'], ['chest', 'Pecho (cm)'], ['arm', 'Brazo (cm)'], ['leg', 'Pierna (cm)'],
        ].map(([k, l]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <div className="label mb-sm">{l}</div>
            <input type="number" step="0.1" value={bf[k]} onChange={e => setBf(p => ({ ...p, [k]: e.target.value }))} placeholder={l} />
          </div>
        ))}
        <Btn onClick={saveBodyEntry} className="w-full">
          <Save size={14} /> Guardar
        </Btn>
      </Modal>
    </div>
  );
}
