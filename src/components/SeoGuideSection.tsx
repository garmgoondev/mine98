'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { ThemeMode } from '../lib/types';

interface SeoGuideSectionProps {
  theme?: ThemeMode;
}

export default function SeoGuideSection({ theme = 'classic' }: SeoGuideSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isDark = theme === 'dark';

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: '지뢰찾기 첫 번째 클릭에서 지뢰가 터질 수도 있나요?',
      a: '웹지뢰찾기(WebMinesweeper)는 100% 안전한 첫 클릭 보장(Zero-Fail Opening) 알고리즘을 사용합니다. 사용자가 첫 번째로 클릭한 칸과 그 주변 8개 칸(총 3x3 영역)에는 절대로 지뢰가 배치되지 않으므로, 첫 수에 지뢰가 터지는 불합리한 경우는 절대 발생하지 않습니다.',
    },
    {
      q: '회사나 학교에서 몰래 할 때 보스 키(Boss Key)는 어떻게 쓰나요?',
      a: '게임 중 키보드의 ESC 키나 물결(` / ~) 키를 누르거나 화면 우측 상단의 "보스 키" 버튼을 클릭하면 즉시 화면 전체가 실시간 마이크로소프트 엑셀(Excel 365) 화면으로 위장됩니다. 브라우저 탭 타이틀과 파비콘도 엑셀로 변경되며 오디오가 음소거됩니다. 엑셀 우측 상단의 닫기(✕) 버튼을 누르거나 다시 ESC를 누르면 즉시 지뢰찾기로 안전하게 복귀합니다.',
    },
    {
      q: '지뢰찾기 숫자(1~8)는 무엇을 의미하나요?',
      a: '칸을 열었을 때 나타나는 숫자는 해당 칸을 중심으로 상하좌우 및 대각선으로 인접한 총 8개 칸에 숨겨져 있는 지뢰의 정확한 개수를 의미합니다. 예를 들어 숫자 1 주변 8칸 중 지뢰는 정확히 1개만 존재합니다.',
    },
    {
      q: '코드(Chording) 단축 기능은 어떻게 사용하나요?',
      a: '이미 열려 있는 숫자 칸 주변에 지뢰 수만큼 깃발(우클릭)을 모두 꽂았다면, 해당 숫자 칸을 다시 클릭하거나 좌우 동시 클릭하면 깃발이 꽂히지 않은 나머지 안전한 칸들이 한 번에 자동으로 모두 열립니다. 클리어 시간을 단축하는 필수 기술입니다.',
    },
    {
      q: '모바일 스마트폰이나 태블릿에서도 원활하게 플레이할 수 있나요?',
      a: '네, 반응형 모바일 터치 인터페이스를 완벽하게 지원합니다. 게임 화면의 "모바일 터치 모드: 🚩 깃발 꽂기 켬" 토글 버튼을 켜면 한 번 터치로 간편하게 깃발을 꽂을 수 있어 스마트폰에서도 쾌적하게 플레이할 수 있습니다.',
    },
  ];

  return (
    <section
      className={`w-full max-w-4xl mx-auto px-4 py-12 mt-8 border-t space-y-12 transition-colors ${
        isDark
          ? 'border-slate-800 text-slate-300'
          : 'border-slate-300/80 text-slate-800'
      }`}
    >
      {/* 1. Header Intro */}
      <div className="text-center space-y-3">
        <h2
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 shrink-0" />
          <span>웹지뢰찾기(WebMinesweeper) 공식 가이드: 규칙 &amp; 1-2-1 필승 공략</span>
        </h2>
        <p
          className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          별도 설치나 회원가입 없이 브라우저에서 바로 즐기는 무료 온라인 지뢰찾기 게임입니다. 윈도우 정통 클래식 손맛과
          사내망 특화 보스 키, 개인 최고 기록 측정을 완벽하게 제공합니다.
        </p>
      </div>

      {/* 2. Core Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          className={`rounded-2xl p-5 space-y-2.5 transition shadow-sm border ${
            isDark
              ? 'bg-slate-900/90 border-slate-800'
              : 'bg-white border-slate-200 shadow-slate-100'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            초고속 무설치 즉시 로딩
          </h3>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Cloudflare 글로벌 엣지 네트워크를 기반으로 브라우저를 열자마자 지연 없이 즉시 판이 펼쳐집니다. 0원 서버비
            정적 기술로 가볍고 쾌적합니다.
          </p>
        </div>

        <div
          className={`rounded-2xl p-5 space-y-2.5 transition shadow-sm border ${
            isDark
              ? 'bg-slate-900/90 border-slate-800'
              : 'bg-white border-slate-200 shadow-slate-100'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            직장인·학생 전용 보스 키
          </h3>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            상사나 선생님이 다가올 때 ESC 키나 물결(~) 키를 누르면 즉시 화면 전체가 마이크로소프트 엑셀(Excel) 결산표로
            전환되며 오디오가 음소거됩니다.
          </p>
        </div>

        <div
          className={`rounded-2xl p-5 space-y-2.5 transition shadow-sm border ${
            isDark
              ? 'bg-slate-900/90 border-slate-800'
              : 'bg-white border-slate-200 shadow-slate-100'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            첫 클릭 100% 안전 보장
          </h3>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            첫 수에 허무하게 폭발하지 않도록 첫 클릭 위치 주변 9칸을 안전지대로 보정하여 항상 시원한 오프닝 영역을
            열어줍니다.
          </p>
        </div>
      </div>

      {/* 3. Minesweeper Master Strategies (1-2-1 & 1-2-2-1 Patterns) */}
      <div
        className={`rounded-3xl p-6 sm:p-8 space-y-6 border shadow-sm transition ${
          isDark
            ? 'bg-slate-900/80 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          🧠 지뢰찾기 고수들의 핵심 추리 공식 2가지
        </h3>
        <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          지뢰찾기는 단순한 운 게임이 아닌 100% 논리 연역 퍼즐입니다. 가장 빈번하게 등장하는 두 가지 핵심 패턴만 숙지해도
          고급 난이도의 클리어 성공률을 극적으로 높일 수 있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Pattern 1 */}
          <div
            className={`rounded-2xl p-5 space-y-3 border ${
              isDark
                ? 'bg-slate-950 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="inline-block bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-black px-2.5 py-1 rounded-md">
              공식 1: 1-2-1 패턴
            </div>
            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              벽면에 1-2-1이 나란히 있을 때
            </h4>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              직선 벽면에 숫자 <strong>[ 1 ] - [ 2 ] - [ 1 ]</strong>이 연속으로 배치되어 있다면,{' '}
              <strong className={isDark ? 'text-amber-300' : 'text-amber-700'}>
                양쪽 끝 [ 1 ]의 맞은편 칸이 100% 지뢰(💣)
              </strong>이며, 가운데 [ 2 ]의 맞은편 칸은 안전한 빈칸입니다.
            </p>
            <div
              className={`p-3 rounded-lg font-mono text-center text-xs tracking-wider border ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-300'
                  : 'bg-white border-slate-300 text-slate-800 font-bold'
              }`}
            >
              [ 💣 지뢰 ] [ ◯ 안전 ] [ 💣 지뢰 ]<br />
              <span className="text-slate-500 dark:text-slate-400">[ 1 ] [ 2 ] [ 1 ]</span>
            </div>
          </div>

          {/* Pattern 2 */}
          <div
            className={`rounded-2xl p-5 space-y-3 border ${
              isDark
                ? 'bg-slate-950 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="inline-block bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-black px-2.5 py-1 rounded-md">
              공식 2: 1-2-2-1 패턴
            </div>
            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              벽면에 1-2-2-1이 나란히 있을 때
            </h4>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              벽면에 <strong>[ 1 ] - [ 2 ] - [ 2 ] - [ 1 ]</strong>이 배치된 경우,{' '}
              <strong className={isDark ? 'text-blue-300' : 'text-blue-700'}>
                가운데 두 개의 [ 2 ] 맞은편 칸이 100% 지뢰(💣)
              </strong>이며, 양쪽 끝 [ 1 ]의 맞은편 칸은 안전한 빈칸입니다.
            </p>
            <div
              className={`p-3 rounded-lg font-mono text-center text-xs tracking-wider border ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-blue-300'
                  : 'bg-white border-slate-300 text-slate-800 font-bold'
              }`}
            >
              [ ◯ 안전 ] [ 💣 지뢰 ] [ 💣 지뢰 ] [ ◯ 안전 ]<br />
              <span className="text-slate-500 dark:text-slate-400">[ 1 ] [ 2 ] [ 2 ] [ 1 ]</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Official FAQ Accordion (Answers preserved in static DOM for SEO indexing) */}
      <div className="space-y-4">
        <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          자주 묻는 질문 (FAQ)
        </h3>
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className={`w-full px-5 py-4 flex items-center justify-between text-left text-sm sm:text-base font-bold transition cursor-pointer ${
                    isDark
                      ? 'text-white hover:text-amber-400'
                      : 'text-slate-900 hover:text-amber-600'
                  }`}
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                <div
                  className={`px-5 pb-4 text-xs sm:text-sm leading-relaxed border-t pt-3 ${
                    isOpen ? 'block' : 'hidden'
                  } ${
                    isDark
                      ? 'text-slate-300 border-slate-800/60'
                      : 'text-slate-600 border-slate-100'
                  }`}
                >
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. JSON-LD Structured Data Schema for Google (WebApplication & FAQPage) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebApplication',
                name: '웹지뢰찾기 - mine98.com (Windows 98 Classic Minesweeper)',
                url: 'https://mine98.com',
                description:
                  '설치 없이 브라우저에서 바로 즐기는 무료 온라인 지뢰찾기 게임. 윈도우 클래식 감성, 첫 클릭 안전 보장, 직장인 사내망 특화 보스 키(ESC 위장 기능) 및 스피드런 기록 측정 지원.',
                applicationCategory: 'GameApplication',
                operatingSystem: 'All',
                inLanguage: 'ko',
                browserRequirements: 'Requires HTML5 support',
                genre: 'Logic Puzzle, Classic Game',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'KRW',
                },
              },
              {
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.a,
                  },
                })),
              },
            ],
          }),
        }}
      />
    </section>
  );
}
