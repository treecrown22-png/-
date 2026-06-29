'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(40,30,15,0.8), transparent 70%), radial-gradient(ellipse at 80% 50%, rgba(30,20,10,0.6), transparent 70%), #0d0a06',
        padding: '20px',
      }}
    >
      {/* Particles */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              background: '#d4a017',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
              animation: `particleFloat 8s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 600, width: '100%' }}>
        {/* Title */}
        <h1
          style={{
            fontSize: '2.5em',
            fontWeight: 900,
            background: 'linear-gradient(180deg, #f0d060, #d4a017, #8b6914)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 10,
          }}
        >
          ⚔️ 마이 AI ⚔️
        </h1>
        <p style={{ color: '#8a7a5a', marginBottom: 40, fontSize: '1.1em' }}>
          두 가지冒险가 당신을 기다리고 있습니다
        </p>

        {/* App Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          {/* Quest RPG */}
          <Link href="/quest" style={{ textDecoration: 'none' }}>
            <div
              onMouseEnter={() => setHovered('quest')}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: 'linear-gradient(135deg, rgba(26,21,16,0.95), rgba(20,15,10,0.95))',
                border: `2px solid ${hovered === 'quest' ? '#d4a017' : '#5a4a2a'}`,
                borderRadius: 12,
                padding: 30,
                cursor: 'pointer',
                transition: 'all 0.3s',
                transform: hovered === 'quest' ? 'translateY(-5px)' : 'none',
                boxShadow: hovered === 'quest' ? '0 10px 30px rgba(212,160,23,0.3)' : '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ fontSize: '4em', marginBottom: 15 }}>⚔️</div>
              <h2 style={{ color: '#f0d060', fontSize: '1.4em', marginBottom: 10 }}>과제 퀘스트 RPG</h2>
              <p style={{ color: '#8a7a5a', fontSize: '0.9em', lineHeight: 1.6 }}>
                실생활 과제를 게임처럼 즐기며 습관을 만들어보세요
              </p>
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                <span style={{ background: 'rgba(39,174,96,0.2)', color: '#2ecc71', padding: '4px 10px', borderRadius: 12, fontSize: '0.75em', border: '1px solid rgba(39,174,96,0.3)' }}>
                  📋 퀘스트
                </span>
                <span style={{ background: 'rgba(155,89,182,0.2)', color: '#9b59b6', padding: '4px 10px', borderRadius: 12, fontSize: '0.75em', border: '1px solid rgba(155,89,182,0.3)' }}>
                  ⚡ 스킬
                </span>
                <span style={{ background: 'rgba(230,126,34,0.2)', color: '#e67e22', padding: '4px 10px', borderRadius: 12, fontSize: '0.75em', border: '1px solid rgba(230,126,34,0.3)' }}>
                  ⚔️ 보스
                </span>
              </div>
            </div>
          </Link>

          {/* Account Book */}
          <Link href="/account" style={{ textDecoration: 'none' }}>
            <div
              onMouseEnter={() => setHovered('account')}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: 'linear-gradient(135deg, rgba(22,27,34,0.95), rgba(26,21,16,0.95))',
                border: `2px solid ${hovered === 'account' ? '#C9A961' : 'rgba(201,169,97,0.3)'}`,
                borderRadius: 12,
                padding: 30,
                cursor: 'pointer',
                transition: 'all 0.3s',
                transform: hovered === 'account' ? 'translateY(-5px)' : 'none',
                boxShadow: hovered === 'account' ? '0 10px 30px rgba(201,169,97,0.3)' : '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ fontSize: '4em', marginBottom: 15 }}>🦁</div>
              <h2 style={{ color: '#E8D5A3', fontSize: '1.4em', marginBottom: 10 }}>나니아 가계부</h2>
              <p style={{ color: '#8B8070', fontSize: '0.9em', lineHeight: 1.6 }}>
                황금시대의 기록, 나니아 마을에서 함께하는 가계부
              </p>
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                <span style={{ background: 'rgba(160,82,45,0.2)', color: '#D4956B', padding: '4px 10px', borderRadius: 12, fontSize: '0.75em', border: '1px solid rgba(160,82,45,0.3)' }}>
                  🍔 식비
      </span>
                <span style={{ background: 'rgba(139,111,142,0.2)', color: '#C4A0C7', padding: '4px 10px', borderRadius: 12, fontSize: '0.75em', border: '1px solid rgba(139,111,142,0.3)' }}>
                  🎭 덕질
                </span>
                <span style={{ background: 'rgba(90,122,90,0.2)', color: '#8AAA8A', padding: '4px 10px', borderRadius: 12, fontSize: '0.75em', border: '1px solid rgba(90,122,90,0.3)' }}>
                  🏘️ 마을
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <p style={{ color: '#5a4a2a', marginTop: 40, fontSize: '0.8em' }}>
          ✨ 당신의 모험을 기록하세요 ✨
        </p>
      </div>

      <style jsx global>{`
        @keyframes particleFloat {
          0% { opacity: 0; transform: translateY(100vh) scale(0); }
          20% { opacity: 0.6; }
          80% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-100px) scale(1); }
        }
      `}</style>
    </main>
  );
}