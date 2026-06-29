'use client';

import { CATEGORIES, getCategory, formatMoney } from '@/store/account-store';
import type { ReceiptData } from './types';

interface ReceiptModalProps {
  data: ReceiptData;
  onSave: () => void;
  onClose: () => void;
}

export function ReceiptModal({ data, onSave, onClose }: ReceiptModalProps) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">📷 영수증 인식 결과</div>

        {data.store && (
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: '1.2em', fontWeight: 700, color: 'var(--primary-light)' }}>{data.store}</div>
            {data.date && <div style={{ fontSize: '0.85em', color: 'var(--text-light)' }}>{data.date}</div>}
          </div>
        )}

        {data.items && data.items.length > 0 ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.9em', fontWeight: 600, marginBottom: 8, color: 'var(--text-light)' }}>
              인식된 항목
            </div>
            {data.items.map((item, idx) => {
              const catKey = item.category && CATEGORIES[item.category] ? item.category : getCategory(item.name);
              const catInfo = CATEGORIES[catKey];
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    marginBottom: 4,
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: '1.1em' }}>{catInfo?.icon || '📦'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75em', color: 'var(--text-light)' }}>{catInfo?.name || '기타'}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--red)' }}>{formatMoney(item.amount)}</span>
                </div>
              );
            })}
            {data.total && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'rgba(201,169,97,0.1)',
                  borderRadius: 8,
                  marginTop: 8,
                  borderTop: '2px solid var(--primary)',
                }}
              >
                <span style={{ fontWeight: 700 }}>합계</span>
                <span style={{ fontWeight: 900, fontSize: '1.2em', color: 'var(--red)' }}>
                  {formatMoney(data.total)}
                </span>
              </div>
            )}
          </div>
        ) : data.total ? (
          <div
            style={{
              textAlign: 'center',
              padding: 16,
              background: 'rgba(201,169,97,0.1)',
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: '0.9em', color: 'var(--text-light)', marginBottom: 4 }}>총 금액</div>
            <div style={{ fontSize: '1.5em', fontWeight: 900, color: 'var(--red)' }}>{formatMoney(data.total)}</div>
          </div>
        ) : data.raw ? (
          <div
            style={{
              padding: 12,
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 8,
              marginBottom: 16,
              fontSize: '0.85em',
              color: 'var(--text-light)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {data.raw}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)' }}>
            인식된 데이터가 없습니다
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
            취소
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onSave}>
            💾 저장하기
          </button>
        </div>
      </div>
    </div>
  );
}