import React, { useState, useEffect } from 'react';
import { Card, Btn, Modal, Ring } from './common';
import { Calculator, Target, TrendingDown, Dumbbell, TrendingUp, Scale, Zap } from 'lucide-react';

const GOALS = [
  { id: 'cut', label: 'Perder Grasa', icon: '🔥', desc: 'Déficit calórico para quemar grasa preservando músculo', factor: -0.20, color: 'var(--red)' },
  { id: 'recomp', label: 'Recomposición', icon: '⚡', desc: 'Mantener peso, ganar músculo y perder grasa a la vez', factor: 0, color: 'var(--accent)' },
  { id: 'lean_bulk', label: 'Volumen Limpio', icon: '💪', desc: 'Superávit moderado para ganar músculo minimizando grasa', factor: 0.10, color: 'var(--blue)' },
  { id: 'bulk', label: 'Volumen', icon: '🏋️', desc: 'Superávit alto para máximo crecimiento muscular', factor: 0.20, color: 'var(--purple)' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentario', desc: 'Trabajo de oficina, sin ejercicio', factor: 1.2 },
  { id: 'light', label: 'Ligero', desc: '1-3 días/semana', factor: 1.375 },
  { id: 'moderate', label: 'Moderado', desc: '3-5 días/semana', factor: 1.55 },
  { id: 'active', label: 'Activo', desc: '4-5 días intenso', factor: 1.65 },
  { id: 'very_active', label: 'Muy Activo', desc: '6-7 días/semana', factor: 1.725 },
  { id: 'athlete', label: 'Atleta', desc: '2x/día o trabajo físico', factor: 1.9 },
];

function calcTMB(weight, height, age, sex) {
  // Mifflin-St Jeor
  if (sex === 'Mujer') return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
}

function calcMacros(calories, weight, goalId) {
  // Protein: 1.8-2.2g/kg depending on goal
  let proteinPerKg;
  switch (goalId) {
    case 'cut': proteinPerKg = 2.2; break;     // High protein to preserve muscle
    case 'recomp': proteinPerKg = 2.0; break;
    case 'lean_bulk': proteinPerKg = 1.8; break;
    case 'bulk': proteinPerKg = 1.6; break;
    default: proteinPerKg = 2.0;
  }

  const protein = Math.round(weight * proteinPerKg);
  const proteinCal = protein * 4;

  // Fat: 25-30% of calories
  const fatPercent = goalId === 'cut' ? 0.25 : 0.30;
  const fatCal = Math.round(calories * fatPercent);
  const fat = Math.round(fatCal / 9);

  // Carbs: remaining calories
  const carbCal = calories - proteinCal - fatCal;
  const carbs = Math.round(Math.max(carbCal, 0) / 4);

  return { protein, carbs, fat };
}

export default function GoalCalculator({ visible, onClose, profile, onSave }) {
  const [weight, setWeight] = useState(profile.weight || 78);
  const [height, setHeight] = useState(profile.height || 178);
  const [age, setAge] = useState(profile.age || 28);
  const [sex, setSex] = useState(profile.sex || 'Hombre');
  const [activityIdx, setActivityIdx] = useState(3);
  const [goalIdx, setGoalIdx] = useState(0);
  const [step, setStep] = useState('data'); // data | goal | result

  const activity = ACTIVITY_LEVELS[activityIdx];
  const goal = GOALS[goalIdx];

  const tmb = calcTMB(weight, height, age, sex);
  const tdee = Math.round(tmb * activity.factor);
  const targetCal = Math.round(tdee * (1 + goal.factor));
  const macros = calcMacros(targetCal, weight, goal.id);
  const waterTarget = Math.round(weight * 0.035 * 10) / 10;

  const handleSave = () => {
    onSave({
      ...profile,
      weight, height, age, sex,
      activity: activity.label,
      goal: goal.label,
      calTarget: targetCal,
      pTarget: macros.protein,
      cTarget: macros.carbs,
      fTarget: macros.fat,
      waterTarget,
    });
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Calculadora de Objetivos">
      {step === 'data' && (
        <>
          <Card style={{ borderColor: 'rgba(0,212,170,0.15)' }}>
            <div className="row" style={{ gap: 8, marginBottom: 12 }}>
              <Scale size={18} color="var(--accent)" />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Tus Datos</span>
            </div>

            <div className="grid-2" style={{ marginBottom: 12 }}>
              <div>
                <div className="label mb-sm">Peso (kg)</div>
                <input type="number" step="0.1" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <div className="label mb-sm">Altura (cm)</div>
                <input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value) || 0)} />
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: 12 }}>
              <div>
                <div className="label mb-sm">Edad</div>
                <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <div className="label mb-sm">Sexo</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Hombre', 'Mujer'].map(s => (
                    <button key={s} onClick={() => setSex(s)}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${sex === s ? 'var(--accent)' : 'var(--border)'}`, background: sex === s ? 'var(--accent-dim)' : 'var(--bg)', color: sex === s ? 'var(--accent)' : 'var(--text-dim)', fontSize: 13, fontWeight: 600 }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="label mb-md">Nivel de Actividad</div>
            {ACTIVITY_LEVELS.map((a, i) => (
              <button key={a.id} onClick={() => setActivityIdx(i)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${activityIdx === i ? 'var(--accent)' : 'var(--border)'}`, background: activityIdx === i ? 'var(--accent-dim)' : 'transparent', marginBottom: 6, textAlign: 'left' }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: activityIdx === i ? 'var(--accent)' : 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: activityIdx === i ? 'var(--accent)' : 'var(--text)' }}>{a.label}</div>
                  <div className="text-dim" style={{ fontSize: 11 }}>{a.desc}</div>
                </div>
              </button>
            ))}
          </Card>

          <Btn onClick={() => setStep('goal')} className="w-full">
            Siguiente → Elegir Objetivo
          </Btn>
        </>
      )}

      {step === 'goal' && (
        <>
          <Card>
            <div className="label mb-md">¿Cuál es tu objetivo?</div>
            {GOALS.map((g, i) => (
              <button key={g.id} onClick={() => setGoalIdx(i)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '14px 12px', borderRadius: 12, border: `1px solid ${goalIdx === i ? g.color : 'var(--border)'}`, background: goalIdx === i ? `${g.color}15` : 'transparent', marginBottom: 8, textAlign: 'left' }}>
                <span style={{ fontSize: 24 }}>{g.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: goalIdx === i ? g.color : 'var(--text)' }}>{g.label}</div>
                  <div className="text-dim" style={{ fontSize: 11, marginTop: 2 }}>{g.desc}</div>
                </div>
              </button>
            ))}
          </Card>

          <div style={{ display: 'flex', gap: 10 }}>
            <Btn secondary onClick={() => setStep('data')} style={{ flex: 1 }}>Atrás</Btn>
            <Btn onClick={() => setStep('result')} style={{ flex: 2 }}>
              <Calculator size={16} /> Calcular
            </Btn>
          </div>
        </>
      )}

      {step === 'result' && (
        <>
          {/* Summary */}
          <Card style={{ textAlign: 'center', borderColor: `${goal.color}30` }}>
            <span style={{ fontSize: 28 }}>{goal.icon}</span>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4, color: goal.color }}>{goal.label}</div>
            <div className="text-dim text-sm" style={{ marginTop: 4 }}>
              {goal.factor < 0 ? `Déficit del ${Math.abs(goal.factor * 100)}%` :
               goal.factor > 0 ? `Superávit del ${goal.factor * 100}%` :
               'Mantenimiento'}
            </div>
          </Card>

          {/* Math breakdown */}
          <Card>
            <div className="label mb-md">Cómo se calcula</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { l: 'TMB (Mifflin-St Jeor)', v: `${tmb} kcal`, c: 'var(--text-dim)' },
                { l: `× ${activity.factor} (${activity.label})`, v: '', c: 'var(--text-dim)' },
                { l: 'TDEE (Gasto diario)', v: `${tdee} kcal`, c: 'var(--blue)' },
                { l: `${goal.factor >= 0 ? '+' : ''}${Math.round(goal.factor * 100)}% (${goal.label})`, v: `${goal.factor >= 0 ? '+' : ''}${Math.round(tdee * goal.factor)} kcal`, c: goal.color },
              ].map((row, i) => (
                <div key={i} className="row-between" style={{ padding: '6px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 12, color: row.c }}>{row.l}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: row.c }}>{row.v}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Target calories */}
          <Card style={{ textAlign: 'center' }}>
            <div className="label">Tu Objetivo Diario</div>
            <div style={{ fontSize: 42, fontWeight: 800, color: goal.color, marginTop: 8 }}>{targetCal}</div>
            <div className="text-dim" style={{ fontSize: 14 }}>kcal / día</div>
          </Card>

          {/* Macros */}
          <Card>
            <div className="label mb-md">Reparto de Macros</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { l: 'Proteína', v: macros.protein, u: 'g', ratio: `${(macros.protein * 4 / targetCal * 100).toFixed(0)}%`, c: 'var(--blue)', note: `${(macros.protein / weight).toFixed(1)}g/kg` },
                { l: 'Carbos', v: macros.carbs, u: 'g', ratio: `${(macros.carbs * 4 / targetCal * 100).toFixed(0)}%`, c: 'var(--orange)', note: '' },
                { l: 'Grasas', v: macros.fat, u: 'g', ratio: `${(macros.fat * 9 / targetCal * 100).toFixed(0)}%`, c: 'var(--red)', note: '' },
              ].map(m => (
                <div key={m.l} style={{ flex: 1, textAlign: 'center', padding: 12, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: m.c }}>{m.v}</div>
                  <div className="text-dim" style={{ fontSize: 10, marginTop: 2 }}>{m.u} ({m.ratio})</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: m.c, marginTop: 4 }}>{m.l}</div>
                  {m.note && <div className="text-dim" style={{ fontSize: 9, marginTop: 2 }}>{m.note}</div>}
                </div>
              ))}
            </div>
          </Card>

          {/* Water */}
          <Card>
            <div className="row-between">
              <div className="row" style={{ gap: 8 }}>
                <span>💧</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>Agua recomendada</span>
              </div>
              <span style={{ color: 'var(--blue)', fontWeight: 700 }}>{waterTarget} L/día</span>
            </div>
          </Card>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Btn secondary onClick={() => setStep('goal')} style={{ flex: 1 }}>Atrás</Btn>
            <Btn onClick={handleSave} style={{ flex: 2 }}>
              <Target size={16} /> Aplicar Objetivos
            </Btn>
          </div>
        </>
      )}
    </Modal>
  );
}
