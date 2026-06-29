'use client';

import type { StickerResult } from './types';

interface StickerResultModalProps {
  result: StickerResult;
  onClose: () => void;
}

export function StickerResultModal({ result, onClose }: StickerResultModalProps) {
  const { sticker, isNew } = result;
  const rarityColor =
    sticker.rarity === 'legendary'
      ? 'var(--primary)'
      : sticker.rarity === 'epic'
        ? 'var(--purple)'
        : sticker.rarity === 'rare'
          ? 'var(--green-light)'
          : 'var(--blue)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal">
        <div style={{ textAlign: 'center', padding: 20 }}>
          <div className="modal-title">🎁 스티커 뽑기!</div>
          <div style={{ width: 120, height: 120, margin: '0 auto' }}>
            <img
              src={`/api/sticker-image?id=${sticker.id}`}
              alt={sticker.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div style={{ fontWeight: 900, fontSize: '1.2em', margin: '10px 0' }}>{sticker.name}</div>
          <div style={{ color: rarityColor, fontWeight: 700, textTransform: 'capitalize' }}>
            {sticker.rarity}
          </div>
          {isNew ? (
            <div style={{ color: 'var(--primary)', fontWeight: 700, marginTop: 8 }}>✨ 신규 획득!</div>
          ) : (
            <div style={{ color: 'var(--text-light)', fontSize: '0.85em', marginTop: 8 }}>이미 보유 중</div>
          )}
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}