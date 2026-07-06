import React, { useState, useRef } from 'react';
import { Card, Btn, Modal } from '../components/common';
import { Camera, Trash2, ChevronLeft, Calendar, Image, Upload } from 'lucide-react';

export default function ProgressPhotos({ state, actions }) {
  const { progressPhotos = [] } = state;
  const { saveProgressPhotos } = actions;
  const [showCamera, setShowCamera] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareIdx, setCompareIdx] = useState([0, null]);
  const [viewPhoto, setViewPhoto] = useState(null);
  const [photoLabel, setPhotoLabel] = useState('Frente');
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  const handlePhoto = (e) => {
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
      saveProgressPhotos([...progressPhotos, entry]);
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
            {[0, 1].map(side => {
              const idx = side === 0 ? compareIdx[0] : (compareIdx[1] ?? progressPhotos.length - 1);
              return (
                <div key={side} style={{ flex: 1 }}>
                  <div className="text-dim text-xs text-center mb-sm">{side === 0 ? 'Antes' : 'Después'}</div>
                  <select value={idx}
                    onChange={e => {
                      const v = parseInt(e.target.value);
                      setCompareIdx(side === 0 ? [v, compareIdx[1]] : [compareIdx[0], v]);
                    }}
                    style={{ width: '100%', marginBottom: 8, padding: 8, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 12 }}>
                    {progressPhotos.map((p, i) => (
                      <option key={p.id} value={i}>{p.date} - {p.label}</option>
                    ))}
                  </select>
                  <img src={progressPhotos[idx]?.data} alt={side === 0 ? 'Antes' : 'Después'}
                    style={{ width: '100%', borderRadius: 10, aspectRatio: '3/4', objectFit: 'cover' }} />
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        /* Gallery Mode */
        dates.length === 0 ? (
          <div className="empty-state">
            <Camera size={40} />
            <span>Sin fotos de progreso aún</span>
            <span className="text-dim text-sm" style={{ textAlign: 'center' }}>Sácate una foto cada semana para ver tu transformación</span>
            <Btn onClick={() => setShowCamera(true)} style={{ marginTop: 12 }}>
              <Camera size={16} /> Añadir primera foto
            </Btn>
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

      {/* Camera/Gallery Modal */}
      <Modal visible={showCamera} onClose={() => setShowCamera(false)} title="Nueva Foto de Progreso">
        <div className="label mb-sm">Ángulo de la foto</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['Frente', 'Lateral', 'Espalda'].map(l => (
            <button key={l} onClick={() => setPhotoLabel(l)}
              style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: `2px solid ${photoLabel === l ? 'var(--accent)' : 'var(--border)'}`, background: photoLabel === l ? 'var(--accent-dim)' : 'var(--bg)', color: photoLabel === l ? 'var(--accent)' : 'var(--text-dim)', fontSize: 14, fontWeight: 700 }}>
              {l === 'Frente' ? '🧍' : l === 'Lateral' ? '🧍‍♂️' : '🔙'} {l}
            </button>
          ))}
        </div>

        {/* BIG centered buttons */}
        <Btn onClick={() => cameraRef.current?.click()} className="w-full" style={{ padding: 16, fontSize: 16, marginBottom: 10 }}>
          <Camera size={20} /> Abrir Cámara
        </Btn>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: 'none' }} />

        <Btn secondary onClick={() => galleryRef.current?.click()} className="w-full" style={{ padding: 16, fontSize: 16, marginBottom: 16 }}>
          <Image size={20} /> Elegir de Galería
        </Btn>
        <input ref={galleryRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />

        <div style={{ textAlign: 'center', padding: '12px 0', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <div className="text-dim text-sm" style={{ lineHeight: 1.6 }}>
            💡 <strong>Consejos:</strong><br/>
            Misma posición · Misma luz · Ropa interior o bañador
          </div>
        </div>
      </Modal>

      {/* View Photo Modal - fullscreen */}
      {viewPhoto && (
        <div className="modal-overlay" onClick={() => setViewPhoto(null)}
          style={{ alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ width: '100%', maxWidth: 420, position: 'relative' }} onClick={e => e.stopPropagation()}>
            <img src={viewPhoto.data} alt={viewPhoto.label}
              style={{ width: '100%', borderRadius: 16, marginBottom: 12 }} />
            <div className="row-between" style={{ marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: 'white' }}>{viewPhoto.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{viewPhoto.date}</div>
              </div>
            </div>
            {/* BIG centered delete button */}
            <Btn onClick={() => deletePhoto(viewPhoto.id)} className="w-full"
              style={{ background: 'var(--red-dim)', color: 'var(--red)', padding: 14, fontSize: 15 }}>
              <Trash2 size={18} /> Eliminar Foto
            </Btn>
            <Btn secondary onClick={() => setViewPhoto(null)} className="w-full"
              style={{ marginTop: 8, padding: 14, color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              Cerrar
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
