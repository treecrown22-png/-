'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '@/lib/ai';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatHistory: Message[] = [
        { role: 'system', content: '당신은 도움이 되는 AI 어시스턴트입니다. 한국어로 친절하게 답변해주세요.' },
        ...messages.map((msg: ChatMessage) => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: input },
      ];

      const response = await sendChatMessage(chatHistory);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev: ChatMessage[]) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages((prev: ChatMessage[]) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d4a017, #8b6914)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 20px rgba(212, 160, 23, 0.4)',
          zIndex: 1000,
          transition: 'transform 0.3s',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '380px',
            height: '500px',
            background: 'linear-gradient(180deg, #1a1510, #0d0a06)',
            borderRadius: '16px',
            border: '2px solid #5a4a2a',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              background: 'linear-gradient(90deg, rgba(212, 160, 23, 0.2), transparent)',
              borderBottom: '1px solid #5a4a2a',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '24px' }}>🤖</span>
            <div>
              <div style={{ fontWeight: 700, color: '#f0d060', fontSize: '14px' }}>AI 어시스턴트</div>
              <div style={{ fontSize: '11px', color: '#8a7a5a' }}>Gemini 3.1 Flash Lite</div>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  color: '#8a7a5a',
                  padding: '40px 20px',
                  fontSize: '14px',
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
                <div>안녕하세요! 무엇을 도와드릴까요?</div>
              </div>
            )}
            {messages.map((msg: ChatMessage) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #d4a017, #8b6914)'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: msg.role === 'user' ? '#0d0a06' : '#e8dcc8',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '16px 16px 16px 4px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#8a7a5a',
                    fontSize: '14px',
                  }}
                >
                  <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                  <span style={{ animation: 'pulse 1s infinite 0.2s', marginLeft: '4px' }}>●</span>
                  <span style={{ animation: 'pulse 1s infinite 0.4s', marginLeft: '4px' }}>●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid #5a4a2a',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #5a4a2a',
                background: 'rgba(0, 0, 0, 0.4)',
                color: '#e8dcc8',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isLoading || !input.trim()
                  ? 'rgba(212, 160, 23, 0.3)'
                  : 'linear-gradient(135deg, #d4a017, #8b6914)',
                color: '#0d0a06',
                fontWeight: 700,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
              }}
            >
              전송
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}