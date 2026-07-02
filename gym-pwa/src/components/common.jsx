import React from 'react';
import { X } from 'lucide-react';

export function Card({ children, onClick, style, className = '' }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag className={`card ${className}`} onClick={onClick} style={{ ...style, ...(onClick ? { textAlign: 'left', width: '100%' } : {}) }}>
      {children}
    </Tag>
  );
}

export function Badge({ children, color = 'var(--accent)' }) {
  return (
    <span className="badge" style={{ background: `${color}22`, color }}>
      {children}
    </span>
  );
}

export function Btn({ children, onClick, secondary, small, style, className = '', disabled }) {
  return (
    <button
      className={`btn ${secondary ? 'secondary' : ''} ${small ? 'small' : ''} ${className}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >{children}</button>
  );
}

export function Ring({ percent = 0, color = 'var(--accent)', size = 80, strokeWidth = 7, children }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(Math.max(percent, 0), 100) / 100);

  return (
    <div className="ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div className="ring-content">{children}</div>
    </div>
  );
}

export function Modal({ visible, onClose, title, children }) {
  if (!visible) return null;
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-dim)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
