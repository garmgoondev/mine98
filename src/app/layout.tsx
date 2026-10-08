import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '웹지뢰찾기 - mine98.com | 설치 없는 무료 클래식 윈도우 98 지뢰찾기',
  description:
    '별도 설치나 로그인 없이 브라우저에서 바로 즐기는 무료 온라인 지뢰찾기 게임입니다. 윈도우 98 정통 클래식 손맛, 첫 클릭 100% 안전 보장, 직장인·학생 사내망 특화 보스 키(ESC 위장 기능) 및 스피드런 기록 측정을 완벽 지원합니다.',
  keywords: [
    '지뢰찾기',
    '지뢰찾기 게임',
    '온라인 지뢰찾기',
    '무설치 지뢰찾기',
    '구글 지뢰찾기',
    '윈도우 지뢰찾기',
    '지뢰찾기 룰',
    '지뢰찾기 공략',
    '보스 키',
    'mine98',
    'mine98.com',
    'minesweeper',
    'webminesweeper',
  ],
  authors: [{ name: 'WebGame Network' }],
  creator: 'WebGame Network',
  metadataBase: new URL('https://mine98.com'),
  alternates: {
    canonical: 'https://mine98.com',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    url: 'https://mine98.com',
    title: '웹지뢰찾기 (mine98.com) - 윈도우 98 클래식 지뢰찾기',
    description: '초고속 무설치 로딩, 윈도우 98 정통 손맛, 사내망 특화 보스 키(ESC 위장) 및 스피드런 기록 측정 지원.',
    siteName: '웹지뢰찾기 - mine98.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '웹지뢰찾기 (mine98.com)',
      },
    ],
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '웹지뢰찾기 (mine98.com) - 윈도우 98 클래식 지뢰찾기',
    description: '초고속 무설치 로딩, 윈도우 정통 손맛, 사내망 특화 보스 키(ESC 위장) 지원.',
    images: ['/og-image.png'],
  },
  verification: {
    other: {
      'naver-site-verification': 'd603e628b40f166395aeb6ee8842e8a527cc0177',
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#124b55',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-[#11454f] dark:bg-slate-950 transition-colors">
        {children}
      </body>
    </html>
  );
}
