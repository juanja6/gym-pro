import React, { useState, useRef } from 'react';
import { Card, Btn, Modal } from '../components/common';
import { Camera, Trash2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function ProgressPhotos({ state, actions }) {
  const { progressPhotos = [] } = state;
  const { saveProgressPhotos } = actions;
  const [showCamera, setShowCamera] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIdx, setCompareIdx] = useState([0, null]);
  const [viewPhoto, setViewPhoto] = useState(null);
  const [photoLabel, setPhotoLabel] = useState('Frente');
  const fileRef = useRef(null);

  const takePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const entry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        label: photoLabel,
        data: ev.target.result,
      };
      const updated = [...progressPhotos, entry];
      saveProgressPhotos(updated);
      setShowCamera(false);
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = (id) => {
    if (confirm('¿Eliminar esta foto?')) {
      saveProgressPhotos(progressPhotos.filter(p => p.id !== id));
      setViewPhoto(null);
    }
  };

  const grouped = {};
  progressPhotos.forEach(p => {
    if (!grouped[p.date]) grouped[p.date] = [];
    grouped[p.date].push(p);
  });
  const dates = Object.keys(grouped).sort().reverse();

  return (
    <div className="screen">
      <div className="row-between mb-lg">
        <h1 className="title" style={{ marginBottom: 0 }}>Progreso</h1>
        <div className="row" style={{ gap: 8 }}>
          {progressPhotos.length >= 2 && (
            <Btn small secondary onClick={() => setCompareMode(!compareMode)}>
              {compareMode ? 'Galería' : 'Comparar'}
            </Btn>
          )}
          <Btn small onClick={() => setShowCamera(true)}>
            <Camera size={14} /> Foto
          </Btn>
        </div>
      </div>

      {/* Compare Mode */}
      {compareMode && progressPhotos.length >= 2 ? (
        <Card>
          <div className="label mb-md text-center">Antes vs Después</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ flex: 1 }}>
              <div className="text-dim text-xs text-center mb-sm">Antes</div>
              <select
                value={compareIdx[0]}
                onChange={e => setCompareIdx([parseInt(e.target.value), compareIdx[1]])}
                style={{ width: '100%', marginBottom: 8, padding: '8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }}
              >
                {progressPhotos.map((p, i) => (
                  <option key={p.id} value={i}>{p.date} - {p.label}</option>
                ))}
              </select>
              <img
                src={progressPhotos[compareIdx[0]]?.data}
                alt="Antes"
                style={{ width: '100%', borderRadius: 10, aspectRatio: '3/4', objectFit: 'cover' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div className="text-dim text-xs text-center mb-sm">Después</div>
              <select
                value={compareIdx[1] ?? progressPhotos.length - 1}
                onChange={e => setCompareIdx([compareIdx[0], parseInt(e.target.value)])}
                style={{ width: '100%', marginBottom: 8, padding: '8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }}
              >
                {progressPhotos.map((p, i) => (
                  <option key={p.id} value={i}>{p.date} - {p.label}</option>
                ))}
              </select>
              <img
                src={progressPhotos[compareIdx[1] ?? progressPhotos.length - 1]?.data}
                alt="Después"
                style={{ width: '100%', borderRadius: 10, aspectRatio: '3/4', objectFit: 'cover' }}
              />
            </div>
          </div>
        </Card>
      ) : (
        /* Gallery Mode */
        dates.length === 0 ? (
          <div className="empty-state">
            <Camera size={40} />
            <span>Sin fotos de progreso aún</span>
            <span className="text-dim text-sm">Sácate una foto cada semana para ver tu transformación</span>
          </div>
        ) : dates.map(date => (
          <div key={date} style={{ marginBottom: 16 }}>
            <div className="row mb-sm" style={{ gap: 6 }}>
              <Calendar size={14} color="var(--accent)" />
              <span className="label">{date}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {grouped[date].map(photo => (
                <button key={photo.id} onClick={() => setViewPhoto(photo)}
                  style={{ background: 'none', padding: 0, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                  <img src={photo.data} alt={photo.label}
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 6px', background: 'rgba(0,0,0,0.6)', fontSize: 10, color: 'white', fontWeight: 600 }}>
                    {photo.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Camera Modal */}
      <Modal visible={showCamera} onClose={() => setShowCamera(false)} title="Nueva Foto">
        <div className="label mb-sm">Ángulo</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {['Frente', 'Lateral', 'Espalda'].map(l => (
            <button key={l} onClick={() => setPhotoLabel(l)}
              style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${photoLabel === l ? 'var(--accent)' : 'var(--border)'}`, background: photoLabel === l ? 'var(--accent-dim)' : 'var(--bg)', color: photoLabel === l ? 'var(--accent)' : 'var(--text-dim)', fontSize: 13, fontWeight: 600 }}>
              {l}
            </button>
          ))}
        </div>
        <Btn onClick={() => fileRef.current?.click()} className="w-full">
          <Camera size={16} /> Abrir Cámara
        </Btn>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={takePhoto} style={{ display: 'none' }} />
        <p className="text-dim text-sm text-center" style={{ marginTop: 12 }}>
          Consejos: misma posición, misma luz, ropa interior o bañador
        </p>
      </Modal>

      {/* View Photo Modal */}
      <Modal visible={!!viewPhoto} onClose={() => setViewPhoto(null)} title={viewPhoto?.label || ''}>
        {viewPhoto && (
          <>
            <img src={viewPhoto.data} alt={viewPhoto.label}
              style={{ width: '100%', borderRadius: 12, marginBottom: 12 }} />
            <div className="row-between">
              <span className="text-dim text-sm">{viewPhoto.date}</span>
              <button onClick={() => deletePhoto(viewPhoto.id)}
                style={{ background: 'none', color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                <Trash2 size={14} /> Eliminar
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
