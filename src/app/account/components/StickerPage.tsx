'use client';

import { STICKERS, EVENTS } from '@/store/account-store';

interface StickerPageProps {
  collectedStickers: string[];
  drawProgress: number;
  monthlyOtaku: number;
  onDrawSticker: () => void;
}

export function StickerPage({
  collectedStickers,
  drawProgress,
  monthlyOtaku,
  onDrawSticker,
}: StickerPageProps) {
  const evtProgress = Math.min(monthlyOtaku, EVENTS[0].target);

  return (
    <>
      <div className="acct-card">
        <div className="card-title">
          🎯 스티커 도감{' '}
          <span style={{ fontSize: '0.8em', color: 'var(--text-light)' }}>
            {collectedStickers.length}/{STICKERS.length}
          </span>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: '0.85em', color: 'var(--text-light)' }}>
            기록 5개마다 랜덤 스티커를 뽑을 수 있어요!
          </div>
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={onDrawSticker} disabled={drawProgress < 5}>
              🎁 스티커 뽑기 ({drawProgress}/5)
            </button>
          </div>
        </div>
        <div className="sticker-grid">
          {STICKERS.map((s) => {
            const collected = collectedStickers.includes(s.id);
            return (
              <div key={s.id} className={`sticker-slot ${collected ? 'collected' : 'locked'}`} title={collected ? s.name : '???'}>
                {collected ? (
                  <img
                    src={`/api/sticker-image?id=${s.id}`}
                    alt={s.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    loading="lazy"
                  />
                ) : (
                  ''
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="acct-card">
        <div className="card-title">🏆 월별 한정 스티커</div>
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: '2em', marginBottom: 8 }}>
            {evtProgress >= EVENTS[0].target ? '👑' : '🔒'}
          </div>
          <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{EVENTS[0].title}</div>
          <div style={{ fontSize: '0.85em', color: 'var(--text-light)', margin: '4px 0' }}>
            {EVENTS[0].desc}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', height: 8, borderRadius: 4, margin: '8px 0', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(evtProgress / EVENTS[0].target) * 100}%`,
                background: 'var(--primary)',
                borderRadius: 4,
                transition: 'width 0.5s',
              }}
            />
          </div>
          <div style={{ fontSize: '0.8em', color: 'var(--text-light)' }}>
            {evtProgress}/{EVENTS[0].target}
          </div>
        </div>
      </div>
    </>
  );
}