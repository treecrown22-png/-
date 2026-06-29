'use client';

import { CATEGORIES, formatMoney, Expense } from '@/store/account-store';
import { calculateMonthStats } from './utils';

interface LedgerPageProps {
  expenses: Expense[];
  onOpenEditModal: (expense: Expense) => void;
  onDeleteExpense: (id: number) => void;
}

export function LedgerPage({ expenses, onOpenEditModal, onDeleteExpense }: LedgerPageProps) {
  const { monthTotal, lastTotal, monthByCategory } = calculateMonthStats(expenses);

  return (
    <>
      <div className="acct-card">
        <div className="card-title">💰 이번 달 지출</div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: '2em', fontWeight: 900, color: 'var(--red)' }}>
            {formatMoney(monthTotal)}
          </div>
          {lastTotal > 0 && (
            <div style={{ fontSize: '0.8em', color: monthTotal > lastTotal ? 'var(--red)' : 'var(--green-light)' }}>
              {monthTotal > lastTotal ? '지난 달보다 증가' : '지난 달보다 감소'}
            </div>
          )}
        </div>
        {Object.entries(monthByCategory)
          .sort(([, a], [, b]) => b - a)
          .map(([k, v]) => {
            const pct = Math.round((v / monthTotal) * 100);
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
                <span style={{ width: 24, textAlign: 'center' }}>{CATEGORIES[k]?.icon}</span>
                <span style={{ width: 60, fontSize: '0.85em', fontWeight: 600 }}>{CATEGORIES[k]?.name}</span>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: CATEGORIES[k]?.color, borderRadius: 4 }} />
                </div>
                <span style={{ width: 60, textAlign: 'right', fontSize: '0.85em', fontWeight: 700 }}>
                  {formatMoney(v)}
                </span>
                <span style={{ width: 35, textAlign: 'right', fontSize: '0.75em', color: 'var(--text-light)' }}>
                  {pct}%
                </span>
              </div>
            );
          })}
      </div>

      <div className="acct-card">
        <div className="card-title">📋 전체 내역</div>
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)' }}>기록이 없어요</div>
        ) : (
          expenses.slice(0, 50).map((e) => (
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