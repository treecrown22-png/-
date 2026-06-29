'use client';

import { useState } from 'react';
import { CATEGORIES, getCategory } from '@/store/account-store';

interface ExpenseModalProps {
  mode: 'add' | 'edit';
  initialData?: { name: string; amount: string; category: string; memo: string };
  onSave: (name: string, amount: string, category: string, memo: string) => void;
  onClose: () => void;
}

export function ExpenseModal({ mode, initialData, onSave, onClose }: ExpenseModalProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [category, setCategory] = useState(initialData?.category || 'etc');
  const [memo, setMemo] = useState(initialData?.memo || '');

  const handleSubmit = () => {
    if (!name.trim() || !amount) return;
    onSave(name.trim(), amount, category, memo);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">
          {mode === 'edit' ? '✏️ 내역 수정하기' : '📝 지출 기록하기'}
        </div>
        <div className="form-group">
          <label className="form-label">내용</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setCategory(getCategory(e.target.value));
            }}
            placeholder="무엇을 사셨나요?"
          />
        </div>
        <div className="form-group">
          <label className="form-label">금액</label>
          <input
            className="form-input"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="금액을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label className="form-label">카테고리</label>
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.icon} {v.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">메모 (선택)</label>
          <input
            className="form-input"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="특별한 메모가 있다면"
          />
        </div>
        {mode === 'edit' ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              취소
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
              💾 수정하기
            </button>
          </div>
        ) : (
          <button className="btn btn-primary btn-full" onClick={handleSubmit}>
            💾 저장하기
          </button>
        )}
      </div>
    </div>
  );
}