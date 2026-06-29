'use client';

import { useState } from 'react';

interface NightEatModalProps {
  onSave: (food: string, quantity: string, time: string, reason: string, emotion: string) => void;
  onClose: () => void;
}

const REASONS = [
  { value: 'stress', label: '😰 스트레스' },
  { value: 'boredom', label: '😑 심심해서' },
  { value: 'habit', label: '🔄 습관적으로' },
  { value: 'hunger', label: '🍽️ 배가 고파서' },
  { value: 'emotion', label: '💔 감정적 이유' },
  { value: 'social', label: '👥 모임/사회적' },
  { value: 'other', label: '📝 기타' },
];

const EMOTIONS = [
  { value: 'guilty', label: '😔 죄책감' },
  { value: 'relieved', label: '😌 해소됨' },
  { value: 'happy', label: '😊 행복' },
  { value: 'anxious', label: '😟 불안' },
  { value: 'neutral', label: '😐 보통' },
  { value: 'regret', label: '😢 후회' },
];

export function NightEatModal({ onSave, onClose }: NightEatModalProps) {
  const [food, setFood] = useState('');
  const [quantity, setQuantity] = useState('');
  const [time, setTime] = useState(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
  const [reason, setReason] = useState('');
  const [emotion, setEmotion] = useState('');

  const handleSubmit = () => {
    if (!food.trim()) return;
    onSave(food.trim(), quantity, time, reason, emotion);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">🌙 야식 기록하기</div>
        <div style={{ fontSize: '0.85em', color: 'var(--text-light)', textAlign: 'center', marginBottom: 16 }}>
          무엇을 먹었는지 솔직하게 기록해보세요
        </div>

        <div className="form-group">
          <label className="form-label">🍽️ 메뉴명</label>
          <input
            className="form-input"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="예: 치킨, 라면, 아이스크림..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">📏 양</label>
          <input
            className="form-input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="예: 한 그릇, 반 마리, 2개..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">🕐 시각</label>
          <input
            className="form-input"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">💭 먹은 이유</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {REASONS.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setReason(r.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 20,
                  border: reason === r.value ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                  background: reason === r.value ? 'rgba(201,169,97,0.2)' : 'rgba(255,255,255,0.05)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '0.85em',
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">💖 먹은 후 감정</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EMOTIONS.map((e) => (
              <button
                key={e.value}
                type="button"
                onClick={() => setEmotion(e.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 20,
                  border: emotion === e.value ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                  background: emotion === e.value ? 'rgba(201,169,97,0.2)' : 'rgba(255,255,255,0.05)',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '0.85em',
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSubmit} style={{ marginTop: 16 }}>
          💾 기록하기
        </button>
      </div>
    </div>
  );
}