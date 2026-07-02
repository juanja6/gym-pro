import React, { useState } from 'react';
import { Card, Badge, Btn } from '../components/common';
import { Pencil, Sparkles, Download, Save, Upload, LogOut } from 'lucide-react';
import storage from '../services/storage';

export default function ProfileScreen({ state, actions }) {
  const { profile, streaks, workoutLog, user } = state;
  const { saveProfile, getAITips, logout } = actions;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [importMode, setImportMode] = useState(false);
  const tips = getAITips();

  const tmb = Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age + (profile.sex === 'Hombre' ? 5 : -161));
  const mult = { 'Sedentario': 1.2, 'Ligero (1-3 días)': 1.375, 'Moderado (3-5 días)': 1.55, 'Activo (4-5 días)': 1.55, 'Muy activo (6-7 días)': 1.725 };
  const tdee = Math.round(tmb * (mult[profile.activity] || 1.55));

  const saveP = () => {
    const updated = {
      ...form,
      age: parseInt(form.age) || profile.age, height: parseInt(form.height) || profile.height,
      weight: parseFloat(form.weight) || profile.weight, calTarget: parseInt(form.calTarget) || profile.calTarget,
      pTarget: parseInt(form.pTarget) || profile.pTarget, cTarget: parseInt(form.cTarget) || profile.cTarget,
      fTarget: parseInt(form.fTarget) || profile.fTarget, waterTarget: parseFloat(form.waterTarget) || profile.waterTarget,
    };
    saveProfile(updated);
    setEditing(false);
  };

  const exportData = async () => {
    const data = await storage.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `gympro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      if (await storage.importAll(ev.target.result)) {
        window.location.reload();
      } else {
        alert('Error al importar datos');
      }
    };
    reader.readAsText(file);
  };

  const handleLogout = async () => {
    if (confirm('¿Cerrar sesión?')) {
      await logout();
    }
  };

  const achievements = [
    { name: 'Primera Sesión', done: workoutLog.length >= 1, icon: '🎯' },
    { name: 'Racha de 7', done: streaks.best >= 7, icon: '🔥' },
    { name: '10 Entrenos', done: workoutLog.length >= 10, icon: '💪' },
    { name: 'Racha de 30', done: streaks.best >= 30, icon: '⚡' },
    { name: '50 Entrenos', done: workoutLog.length >= 50, icon: '🏆' },
    { name: 'Iron Will', done: workoutLog.length >= 100, icon: '🦾' },
  ];

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32, fontWeight: 800, color: 'var(--bg)' }}>
          {profile.name[0]}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{profile.name}</div>
        <div className="text-dim text-sm" style={{ marginBottom: 6 }}>{user?.email}</div>
        <Badge>{profile.level}</Badge>
      </div>

      {!editing ? (
        <>
          {/* Personal Data */}
          <Card>
            <div className="row-between mb-md">
              <span className="label">Datos Personales</span>
              <button onClick={() => { setForm(profile); setEditing(true); }} style={{ background: 'none', padding: 4 }}>
                <Pencil size={16} color="var(--accent)" />
              </button>
            </div>
            {[
              ['Edad', `${profile.age} años`], ['Altura', `${profile.height} cm`],
              ['Peso', `${profile.weight} kg`], ['Sexo', profile.sex],
              ['Actividad', profile.activity], ['Objetivo', profile.goal],
            ].map(([k, v]) => (
              <div key={k} className="row-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span className="text-dim" style={{ fontSize: 13 }}>{k}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </Card>

          {/* Metabolism */}
          <Card>
            <div className="label mb-md">Metabolismo y Objetivos</div>
            <div className="grid-3">
              {[
                { l: 'TMB', v: tmb, c: 'var(--orange)' },
                { l: 'TDEE', v: tdee, c: 'var(--purple)' },
                { l: 'Objetivo', v: profile.calTarget, c: 'var(--accent)' },
              ].map(m => (
                <div key={m.l} style={{ textAlign: 'center', padding: 10, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div className="text-dim" style={{ fontSize: 10, fontWeight: 600 }}>{m.l}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: m.c, marginTop: 4 }}>{m.v}</div>
                  <div className="text-dim" style={{ fontSize: 9 }}>kcal</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {[
                { l: 'Prot', v: `${profile.pTarget}g`, c: 'var(--blue)' },
                { l: 'Carbs', v: `${profile.cTarget}g`, c: 'var(--orange)' },
                { l: 'Grasa', v: `${profile.fTarget}g`, c: 'var(--red)' },
                { l: 'Agua', v: `${profile.waterTarget}L`, c: 'var(--blue)' },
              ].map(m => (
                <div key={m.l} style={{ flex: 1, textAlign: 'center', padding: 8, background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div className="text-dim" style={{ fontSize: 9 }}>{m.l}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card>
            <div className="row-between mb-md">
              <span className="label">Logros</span>
              <Badge color="var(--purple)">{achievements.filter(a => a.done).length}/{achievements.length}</Badge>
            </div>
            <div className="grid-3">
              {achievements.map(a => (
                <div key={a.name} style={{
                  padding: 12, borderRadius: 10, textAlign: 'center',
                  background: a.done ? 'var(--accent-dim)' : 'var(--bg)',
                  border: `1px solid ${a.done ? 'rgba(0,212,170,0.2)' : 'var(--border)'}`,
                  opacity: a.done ? 1 : 0.4,
                }}>
                  <div style={{ fontSize: 22 }}>{a.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, marginTop: 4 }}>{a.name}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Tips */}
          <Card style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
            <div className="row mb-md" style={{ gap: 8 }}>
              <Sparkles size={18} color="var(--purple)" />
              <span className="label">Recomendaciones IA</span>
            </div>
            {tips.map((tip, i) => (
              <div key={i} className="row" style={{ gap: 10, alignItems: 'flex-start', marginBottom: i < tips.length - 1 ? 10 : 0 }}>
                <span style={{ fontSize: 16 }}>{tip.icon}</span>
                <span style={{ fontSize: 12, lineHeight: 1.6, flex: 1 }}>{tip.text}</span>
              </div>
            ))}
          </Card>

          {/* Data export/import */}
          <Card>
            <div className="label mb-md">Datos</div>
            <Btn secondary onClick={exportData} className="w-full" style={{ marginBottom: 8 }}>
              <Download size={16} /> Exportar datos (JSON)
            </Btn>
            <label className="btn secondary w-full" style={{ display: 'flex', cursor: 'pointer' }}>
              <Upload size={16} /> Importar datos
              <input type="file" accept=".json" onChange={importData} style={{ display: 'none' }} />
            </label>
          </Card>

          {/* Logout */}
          <Card>
            <button onClick={handleLogout} className="btn w-full" style={{ background: 'var(--red-dim)', color: 'var(--red)' }}>
              <LogOut size={16} /> Cerrar Sesión
            </button>
          </Card>
        </>
      ) : (
        <Card>
          <div className="label mb-md">Editar Perfil</div>
          {[
            ['name', 'Nombre', 'text'], ['age', 'Edad', 'number'], ['height', 'Altura (cm)', 'number'],
            ['weight', 'Peso (kg)', 'number'], ['sex', 'Sexo', 'text'], ['goal', 'Objetivo', 'text'],
            ['activity', 'Actividad', 'text'], ['calTarget', 'Calorías Objetivo', 'number'],
            ['pTarget', 'Proteína (g)', 'number'], ['cTarget', 'Carbos (g)', 'number'],
            ['fTarget', 'Grasa (g)', 'number'], ['waterTarget', 'Agua (L)', 'number'],
          ].map(([k, l, t]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <div className="label mb-sm">{l}</div>
              <input type={t} step={t === 'number' ? '0.1' : undefined} value={String(form[k])}
                onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} />
            </div>
          ))}
          <div className="row" style={{ gap: 10, marginTop: 12 }}>
            <Btn secondary onClick={() => setEditing(false)} style={{ flex: 1 }}>Cancelar</Btn>
            <Btn onClick={saveP} style={{ flex: 2 }}><Save size={14} /> Guardar</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}
