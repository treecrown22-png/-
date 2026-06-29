'use client';

interface PraiseModalProps {
  success: boolean;
  messages: string[];
  onClose: () => void;
}

export function PraiseModal({ success, messages, onClose }: PraiseModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg,#1A1510,#0D1117)',
          border: '2px solid rgba(201,169,97,0.4)',
          borderRadius: 24,
          padding: 30,
          textAlign: 'center',
          maxWidth: 320,
          width: '90%',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(201,169,97,0.3)',
        }}
      >
        <div style={{ fontSize: '4em', marginBottom: 10 }}>
          {success ? '🦁' : '💚'}
        </div>
        <div style={{ fontSize: '0.95em', lineHeight: 1.6, color: 'var(--text)' }}>
          {messages[Math.floor(Math.random() * messages.length)]}
        </div>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onClose}>
          고마워 🧡
        </button>
      </div>
    </div>
  );
}