'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, Message } from '@/lib/ai';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: '당신은 도움이 되는 AI 어시스턴트입니다. 한국어로 친절하게 응답해주세요.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages, 
        { role: 'assistant', content: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.' }
      ]);
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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 40px)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            🤖 AI 채팅
          </h1>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
            Gemini 3.1 Flash Lite 모델
          </p>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.filter(m => m.role !== 'system').map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: message.role === 'user' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : '#f1f3f5',
                color: message.role === 'user' ? 'white' : '#333',
                wordBreak: 'break-word',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '4px' }}>
                  {message.role === 'user' ? '나' : 'AI'}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                padding: '12px 16px',
                borderRadius: '16px',
                background: '#f1f3f5',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#667eea', animation: 'bounce 1.4s infinite' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#667eea', animation: 'bounce 1.4s infinite 0.2s' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#667eea', animation: 'bounce 1.4s infinite 0.4s' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid #e0e0e0',
          background: '#fafafa'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '14px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              style={{
                padding: '12px 24px',
                background: isLoading || !input.trim() 
                  ? '#ccc' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading && input.trim()) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
            >
              전송
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}