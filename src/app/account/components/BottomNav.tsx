'use client';

import type { PageType } from './types';

interface BottomNavProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const pages: { id: PageType; label: string; icon: string }[] = [
  { id: 'home', label: '홈', icon: '🏠' },
  { id: 'ledger', label: '가계부', icon: '📒' },
  { id: 'sticker', label: '스티커', icon: '🎨' },
  { id: 'village', label: '마을', icon: '🏘️' },
  { id: 'mypage', label: '마이', icon: '🦁' },
];

export function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  return (
    <div className="bottom-nav">
      {pages.map((p) => (
        <button
          key={p.id}
          className={`nav-item ${currentPage === p.id ? 'active' : ''}`}
          onClick={() => onPageChange(p.id)}
        >
          <div className="nav-icon">{p.icon}</div>
          {p.label}
        </button>
      ))}
    </div>
  );
}