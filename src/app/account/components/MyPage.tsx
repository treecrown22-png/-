'use client';

import { MIND_CARE_MESSAGES, STICKERS, type NightEatRecord } from '@/store/account-store';

interface MyPageProps {
  totalRecords: number;
  nightStreak: number;
  stickers: string[];
  expenses: Array<{ amount: number; category: string }>;
  nightEatRecords: NightEatRecord[];
  onOpenNightEatModal: () => void;
}

const REASON_LABELS: Record<string, string> = {
  stress: '😰 스트레스',
  boredom: '😑 심심해서',
  habit: '🔄 습관적으로',
  hunger: '🍽️ 배가 고파서',
  emotion: '💔 감정적 이유',
  social: '👥 모임/사회적',
  other: '📝 기타',
};

const EMOTION_LABELS: Record<string, string> = {
  guilty: '😔 죄책감',
  relieved: '😌 해소됨',
  happy: '😊 행복',
  anxious: '😟 불안',
  neutral: '😐 보통',
  regret: '😢 후회',
};

export function MyPage({
  totalRecords,
  nightStreak,
  stickers,
  nightEatRecords,
  onOpenNightEatModal,
}: MyPageProps) {
  return (
    <>
      <div className="acct-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3em', marginBottom: 8 }}>🦁</div>
        <div style={{ fontWeight: 900, fontSize: '1.2em', color: 'var(--primary-light)' }}>
          나의 성장 기록
        </div>
        <div style={{ marginTop: 16, fontSize: '0.9em', color: 'var(--text-light)', lineHeight: 1.8 }}>
          <div>총 기록: {totalRecords}회</div>
          <div>야식 참기: {nightStreak}일</div>
          <div>스티커: {stickers.length}개</div>
        </div>
      </div>

      <div className="acct-card">
        <div className="card-title">🧘 마음 돌보기</div>
        <div style={{ fontSize: '0.9em', lineHeight: 1.8 }}>
          <div style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 12, marginBottom: 8 }}>
            {MIND_CARE_MESSAGES[Math.floor(Math.random() * MIND_CARE_MESSAGES.length)]}
          </div>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button className="btn btn-secondary" onClick={onOpenNightEatModal}>
              🌙 야식 먹었어 (기록)
            </button>
          </div>
        </div>
      </div>

      <div className="acct-card">
        <div className="card-title">🌙 야식 기록</div>
        {nightEatRecords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-light)' }}>
            아직 야식 기록이 없어요
          </div>
        ) : (
          nightEatRecords.slice(0, 10).map((record) => (
            <div
              key={record.id}
              style={{
                padding: 12,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 12,
                marginBottom: 8,
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: '1.05em' }}>🍽️ {record.food}</div>
                <div style={{ fontSize: '0.8em', color: 'var(--text-light)' }}>{record.date} {record.time}</div>
              </div>
              {record.quantity && (
                <div style={{ fontSize: '0.85em', color: 'var(--text-light)', marginBottom: 4 }}>
                  📏 양: {record.quantity}
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {record.reason && (
                  <span style={{ padding: '4px 10px', background: 'rgba(201,169,97,0.15)', borderRadius: 12, fontSize: '0.8em' }}>
                    💭 {REASON_LABELS[record.reason] || record.reason}
                  </span>
                )}
                {record.emotion && (
                  <span style={{ padding: '4px 10px', background: 'rgba(100,150,200,0.15)', borderRadius: 12, fontSize: '0.8em' }}>
                    💖 {EMOTION_LABELS[record.emotion] || record.emotion}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}