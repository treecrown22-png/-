import type { Metadata, Viewport } from 'next';
import './globals.css';
import ChatBot from '@/components/ChatBot';

export const metadata: Metadata = {
  title: '마이 AI - 과제 퀘스트 RPG & 나니아 가계부',
  description: '실생활 과제를 게임처럼 즐기며 습관을 만들어보세요',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Jua&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <ChatBot />
      </body>
    </html>
  );
}