import React, { useState } from 'react';
import { Modal, Btn, Card } from './common';
import { Upload, FileText, ClipboardPaste, Check, AlertCircle, Dumbbell, UtensilsCrossed } from 'lucide-react';
import {
  parseRoutineText, parseDietText, readFileAsText,
  parseCSV, csvToRoutine, csvToDiet,
} from '../services/importParser';

export default function ImportModal({ visible, onClose, type, onImport }) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState('input'); // input | preview

  const isRoutine = type === 'routine';
  const title = isRoutine ? 'Importar Rutina' : 'Importar Dieta';

  const reset = () => {
    setText('');
    setPreview(null);
    setError('');
    setStep('input');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');

    try {
      const content = await readFileAsText(file);
      const ext = file.name.split('.').pop().toLowerCase();

      if (ext === 'csv' || ext === 'tsv') {
        const rows = parseCSV(content);
        const result = isRoutine ? csvToRoutine(rows) : csvToDiet(rows);
        if (result.length > 0) {
          setPreview(result);
          setStep('preview');
        } else {
          setError('No se encontraron datos válidos en el archivo.');
        }
      } else {
        setText(content);
        parseText(content);
      }
    } catch {
      setError('Error al leer el archivo.');
    }
  };

  const parseText = (input) => {
    const t = input || text;
    if (!t.trim()) { setError('Pega o escribe el contenido.'); return; }
    setError('');

    const result = isRoutine ? parseRoutineText(t) : parseDietText(t);
    if (result.length > 0) {
      setPreview(result);
      setStep('preview');
    } else {
      setError('No se pudo detectar un formato válido. Revisa el ejemplo de abajo.');
    }
  };

  const handleImport = () => {
    if (preview) {
      onImport(preview);
      handleClose();
    }
  };

  const handlePaste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      setText(t);
      parseText(t);
    } catch {
      setError('No se pudo acceder al portapapeles. Pega manualmente.');
    }
  };

  return (
    <Modal visible={visible} onClose={handleClose} title={title}>
      {step === 'input' && (
        <>
          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <label style={styles.fileBtn}>
              <Upload size={16} />
              <span>Subir archivo</span>
              <input type="file" accept=".txt,.csv,.tsv,.md" onChange={handleFile} style={{ display: 'none' }} />
            </label>
            <button onClick={handlePaste} style={styles.fileBtn}>
              <ClipboardPaste size={16} />
              <span>Pegar</span>
            </button>
          </div>

          {/* Text area */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={isRoutine ? ROUTINE_PLACEHOLDER : DIET_PLACEHOLDER}
            style={styles.textarea}
            rows={10}
          />

          {error && (
            <div style={styles.error}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <Btn onClick={() => parseText()} className="w-full" style={{ marginTop: 12 }}>
            <FileText size={16} /> Analizar contenido
          </Btn>

          {/* Format example */}
          <div style={styles.example}>
            <div className="label mb-sm">{isRoutine ? 'FORMATO EJEMPLO RUTINA' : 'FORMATO EJEMPLO DIETA'}</div>
            <pre style={styles.examplePre}>
              {isRoutine ? ROUTINE_EXAMPLE : DIET_EXAMPLE}
            </pre>
          </div>
        </>
      )}

      {step === 'preview' && preview && (
        <>
          <div style={{ marginBottom: 12, color: 'var(--accent)', fontSize: 13, fontWeight: 600 }}>
            ✓ Se {isRoutine ? 'detectaron' : 'detectaron'} {preview.length} {isRoutine ? 'rutina(s)' : 'comida(s)'}
          </div>

          {isRoutine && preview.map((r, ri) => (
            <Card key={ri} style={{ marginBottom: 8 }}>
              <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                <Dumbbell size={16} color="var(--accent)" />
                <span style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</span>
                <span className="badge" style={{ marginLeft: 'auto' }}>{r.exercises.length} ej.</span>
              </div>
              {r.exercises.map((ex, ei) => (
                <div key={ei} style={{ padding: '4px 0', fontSize: 13, color: 'var(--text-dim)', borderTop: ei > 0 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--text)' }}>{ex.name}</span>
                  <span style={{ marginLeft: 8 }}>{ex.sets.length}x{ex.sets[0]?.r} {ex.sets[0]?.w > 0 ? `@ ${ex.sets[0].w}kg` : ''}</span>
                </div>
              ))}
            </Card>
          ))}

          {!isRoutine && preview.map((m, mi) => (
            <Card key={mi} style={{ marginBottom: 8 }}>
              <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                <UtensilsCrossed size={16} color="var(--accent)" />
                <span style={{ fontWeight: 700, fontSize: 15 }}>{m.name}</span>
              </div>
              {m.items.map((item, ii) => (
                <div key={ii} style={{ padding: '4px 0', fontSize: 13, borderTop: ii > 0 ? '1px solid var(--border)' : 'none' }}>
                  <span>{item.name}</span>
                  {item.cal > 0 && (
                    <span className="text-dim" style={{ marginLeft: 8, fontSize: 11 }}>
                      {item.cal}kcal · P:{item.p}g · C:{item.c}g · G:{item.f}g
                    </span>
                  )}
                </div>
              ))}
            </Card>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <Btn secondary onClick={() => setStep('input')} style={{ flex: 1 }}>Volver</Btn>
            <Btn onClick={handleImport} style={{ flex: 2 }}>
              <Check size={16} /> Importar
            </Btn>
          </div>
        </>
      )}
    </Modal>
  );
}

const ROUTINE_PLACEHOLDER = `Pega aquí tu rutina generada por ChatGPT, Gemini o Claude...

Acepta formatos como:
- Press Banca: 4x10 80kg
- Sentadilla 4 series de 8 repeticiones con 100kg
- Peso Muerto: 12, 10, 8, 6 - 120kg`;

const DIET_PLACEHOLDER = `Pega aquí tu dieta generada por ChatGPT, Gemini o Claude...

Acepta formatos como:
Desayuno
- 100g Avena (350 kcal, 12g P, 60g C, 7g G)
- 3 Huevos enteros (210 kcal, 18g P, 1g C, 15g G)`;

const ROUTINE_EXAMPLE = `Día 1 - Push (Empuje)
- Press Banca: 4x10 80kg
- Press Inclinado Mancuernas: 3x12 30kg
- Aperturas: 3x15 14kg
- Press Militar: 4x10 40kg
- Elevaciones Laterales: 3x15 10kg
- Fondos en Paralelas: 3x12

Día 2 - Pull (Tirón)
- Dominadas: 4x8
- Remo con Barra: 4x10 70kg
- Jalón al Pecho: 3x12 60kg`;

const DIET_EXAMPLE = `Desayuno
- 100g Avena (350 kcal, 12g P, 60g C, 7g G)
- 3 Huevos enteros (210 kcal, 18g P, 1g C, 15g G)
- 1 Plátano (90 kcal, 1g P, 23g C, 0g G)

Comida
- 200g Pechuga de pollo (330 kcal, 62g P, 0g C, 7g G)
- 150g Arroz cocido (195 kcal, 4g P, 43g C, 0g G)`;

const styles = {
  fileBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    color: 'var(--text)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    minHeight: 200,
    padding: 14,
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text)',
    fontSize: 13,
    lineHeight: 1.6,
    resize: 'vertical',
    fontFamily: 'inherit',
    outline: 'none',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    padding: '8px 12px',
    borderRadius: 8,
    background: 'var(--red-dim)',
    color: 'var(--red)',
    fontSize: 12,
    fontWeight: 600,
  },
  example: {
    marginTop: 16,
    padding: 12,
    background: 'var(--bg)',
    borderRadius: 10,
    border: '1px solid var(--border)',
  },
  examplePre: {
    fontSize: 11,
    color: 'var(--text-dim)',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.5,
    margin: 0,
    fontFamily: 'inherit',
  },
};
