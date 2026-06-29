'use client';

import Link from 'next/link';

interface HeaderProps {
  coins: number;
  gems: number;
  nightStreak: number;
}

export function Header({ coins, gems, nightStreak }: HeaderProps) {
  return (
    <div className="acct-header">
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div className="acct-title" style={{ cursor: 'pointer' }}>
          🦁 나니아 가계부 <span>황금시대의 기록</span>
        </div>
      </Link>
      <div className="acct-header-stats">
        <div className="header-stat">🪙 {coins}</div>
        <div className="header-stat">💎 {gems}</div>
        <div className="header-stat">🔥 {nightStreak}</div>
      </div>
    </div>
  );
}