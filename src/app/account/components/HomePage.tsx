'use client';

import { useRef } from 'react';
import { CATEGORIES, PRAISE_MESSAGES, formatMoney } from '@/store/account-store';
import { Expense } from '@/store/account-store';
import { getNightMessage, calculateTodayStats } from './utils';

interface HomePageProps {
  expenses: Expense[];
  nightStreak: number;
  receiptLoading: boolean;
  onOpenModal: (modal: string) => void;
  onReceiptScan: (file: File) => void;
  onOpenEditModal: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
}

export function HomePage({
  expenses,
  nightStreak,
  receiptLoading,
  onOpenModal,
  onReceiptScan,
  onOpenEditModal,
  onDeleteExpense,
}: HomePageProps) {
  const nightMsg = getNightMessage(nightStreak, PRAISE_MESSAGES);
  const { todayExpenses, todayTotal, todayByCategory } = calculateTodayStats(expenses);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="acct-card">
        <div className="card-title">📝 지출 기록하기</div>
        <div style={{ textAlign: 'center', marginTop: 12, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onOpenModal('add')}>
            ✏️ 직접 입력하기
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => fileInputRef.current?.click()} 
            disabled={receiptLoading}
          >
            {receiptLoading ? '🔄 인식 중...' : '📷 영수증 스캔'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) onReceiptScan(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <div className="acct-card">
        <div className="card-title">📊 오늘 지출 요약</div>
        {todayExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)' }}>
            <div style={{ fontSize: '2em', marginBottom: 8 }}>🦁</div>
            아직 오늘 지출이 없어요!
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', fontSize: '1.5em', fontWeight: 900, color: 'var(--red)', marginBottom: 12 }}>
              {formatMoney(todayTotal)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
              {Object.entries(todayByCategory).map(([k, v]) => (
                <span key={k} className={`cat-tag ${CATEGORIES[k]?.cls || 'cat-etc'}`}>
                  {CATEGORIES[k]?.icon} {formatMoney(v)}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="acct-card">
        <div className="card-title">📝 최근 기록</div>
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)' }}>
            아직 기록이 없어요
          </div>
        ) : (
          expenses.slice(0, 5).map((e) => (
            <div key={e.id} className="expense-item">
              <div className="expense-icon">{CATEGORIES[e.category]?.icon || '📦'}</div>
              <div className="expense-info">
                <div className="expense-name">{e.name}</div>
                <div className="expense-meta">{e.date} {e.time}</div>
              </div>
              <div className="expense-amount minus">-{formatMoney(e.amount)}</div>
              <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
                <button 
                  onClick={() => onOpenEditModal(e)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em', padding: '4px' }} 
                  title="수정"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => onDeleteExpense(e.id)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1em', padding: '4px' }} 
                  title="삭제"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}