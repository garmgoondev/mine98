'use client';

import React, { useEffect, useRef } from 'react';
import { soundManager } from '../lib/audio';
import { loadSoundMuted } from '../lib/storage';

interface BossKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXCEL_FAVICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23107c41'/><path fill='%23ffffff' d='M8 8h6l4 7 4-7h6l-7 10 7 10h-6l-4-7-4 7H8l7-10z'/></svg>";

export default function BossKeyModal({ isOpen, onClose }: BossKeyModalProps) {
  const originalTitleRef = useRef<string>('');
  const originalIconsRef = useRef<Array<{ element: HTMLLinkElement; href: string }>>([]);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Camouflage document title to Microsoft Excel
    originalTitleRef.current = document.title;
    document.title = '통합 문서1 - Excel';

    // 2. Camouflage all browser favicons to Excel icon
    const existingIcons = Array.from(
      document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']")
    );
    originalIconsRef.current = existingIcons.map((el) => ({
      element: el,
      href: el.href,
    }));

    existingIcons.forEach((el) => {
      el.href = EXCEL_FAVICON;
    });

    // 3. Mute audio immediately (stops all current and future sounds)
    soundManager.setMuted(true);

    // 4. Global keyboard shortcuts to exit stealth mode (ESC / ` / ~)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === '`' || e.key === '~') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);

      // Restore original tab title
      if (originalTitleRef.current) {
        document.title = originalTitleRef.current;
      }

      // Restore all original favicons
      originalIconsRef.current.forEach(({ element, href }) => {
        if (element) element.href = href;
      });

      // Restore user audio mute preference
      soundManager.setMuted(loadSoundMuted());
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#f3f2f1] text-slate-800 flex flex-col font-sans select-none overflow-hidden cursor-default">
      {/* 100% Real-Looking Microsoft Excel 365 Stealth Screen */}
      <div className="flex-1 flex flex-col h-full bg-[#f3f2f1] text-[13px]">
        {/* Top Title Bar */}
        <div className="bg-[#107c41] text-white px-4 py-2 flex items-center justify-between text-xs font-semibold select-none">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm bg-white text-[#107c41] px-1.5 py-0.5 rounded font-mono">
              X
            </span>
            <span className="font-bold text-sm">Excel</span>
            <span className="text-white/80">Q3_2026_재무제표_매출비용분석_최종본.xlsx - 저장됨</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="bg-white/20 px-3 py-1 rounded hidden sm:inline">자동 저장 켬</span>
            <span>홍길동 (기획팀)</span>
            {/* Native-looking Window Controls */}
            <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-white/10 rounded cursor-pointer text-sm"
                aria-label="최소화"
              >
                —
              </button>
              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-white/10 rounded cursor-pointer text-xs"
                aria-label="최대화"
              >
                <div className="w-3 h-3 border border-white" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100 hover:bg-red-600 rounded cursor-pointer font-bold text-sm"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Ribbon Menu Tabs */}
        <div className="bg-[#f3f2f1] border-b border-slate-300 px-3 py-1 flex gap-4 text-xs text-slate-700 select-none">
          <span className="hover:text-black cursor-pointer px-1">파일</span>
          <span className="text-[#107c41] font-bold border-b-2 border-[#107c41] pb-1 px-1 cursor-pointer">
            홈
          </span>
          <span className="hover:text-black cursor-pointer px-1">삽입</span>
          <span className="hover:text-black cursor-pointer px-1">페이지 레이아웃</span>
          <span className="hover:text-black cursor-pointer px-1">수식</span>
          <span className="hover:text-black cursor-pointer px-1">데이터</span>
          <span className="hover:text-black cursor-pointer px-1">검토</span>
          <span className="hover:text-black cursor-pointer px-1">보기</span>
        </div>

        {/* Formula Bar */}
        <div className="bg-white border-b border-slate-300 px-3 py-1.5 flex items-center gap-2 text-xs">
          <span className="font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 border border-slate-300 rounded">
            D12
          </span>
          <span className="text-slate-400 italic font-serif">fx</span>
          <span className="font-mono text-slate-800 flex-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            =SUM(D2:D11)
          </span>
        </div>

        {/* Spreadsheet Table Grid */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full border-collapse text-left font-sans text-xs">
            <thead>
              <tr className="bg-[#f8f9fa] text-slate-600 font-semibold border-b border-slate-300 text-center">
                <th className="w-12 border-r border-slate-300 py-1 bg-[#eaeaea]"></th>
                <th className="w-24 border-r border-slate-300 py-1">A</th>
                <th className="w-48 border-r border-slate-300 py-1">B</th>
                <th className="w-32 border-r border-slate-300 py-1">C</th>
                <th className="w-36 border-r border-slate-300 py-1">D</th>
                <th className="w-32 border-r border-slate-300 py-1">E</th>
                <th className="border-r border-slate-300 py-1">F</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1', '구분', '항목명', '전분기 실적(천원)', '당분기 목표(천원)', '달성률', '비고'],
                ['2', '매출액', '국내 B2B 플랫폼 공급', '142,500', '168,000', '117.8%', '정상 공급 완료'],
                ['3', '매출액', '글로벌 엔터프라이즈 라이선스', '89,400', '105,000', '117.4%', '신규 3개사 체결'],
                ['4', '매출액', '유지보수 및 클라우드 인프라', '34,200', '38,500', '112.5%', '안정적 갱신'],
                ['5', '매출원가', '서버 인프라 및 CDN 대역폭', '12,800', '11,500', '89.8%', '클라우드 비용 절감'],
                ['6', '매출원가', '소프트웨어 라이선스 비용', '8,400', '8,400', '100.0%', '고정 계약'],
                ['7', '판관비', '연구개발(R&D) 인건비', '54,000', '58,000', '107.4%', 'AI 엔지니어 충원'],
                ['8', '판관비', '마케팅 및 브랜딩 집행', '18,500', '15,000', '81.0%', '오가닉 SEO 전환'],
                ['9', '영업이익', '총 영업이익 합산', '172,400', '208,600', '120.9%', '목표치 초과 달성'],
                ['10', '당기순익', '세전 순이익(EBITDA)', '161,200', '196,400', '121.8%', '양호한 현금흐름'],
                ['11', '예산배정', '차기 분기 확장 투자금', '45,000', '50,000', '111.1%', '임원 회의 통과'],
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-200 ${
                    idx === 0
                      ? 'bg-slate-100 font-bold text-slate-700'
                      : idx === 8 || idx === 9
                      ? 'bg-emerald-50 font-bold text-emerald-900'
                      : 'hover:bg-blue-50/50'
                  }`}
                >
                  <td className="bg-[#f8f9fa] text-center text-slate-400 font-mono border-r border-slate-300 py-1.5">
                    {row[0]}
                  </td>
                  <td className="px-3 py-1.5 border-r border-slate-200 font-medium">{row[1]}</td>
                  <td className="px-3 py-1.5 border-r border-slate-200 font-semibold">{row[2]}</td>
                  <td className="px-3 py-1.5 border-r border-slate-200 text-right font-mono">{row[3]}</td>
                  <td className="px-3 py-1.5 border-r border-slate-200 text-right font-mono text-blue-700 font-bold">
                    {row[4]}
                  </td>
                  <td className="px-3 py-1.5 border-r border-slate-200 text-right font-mono text-emerald-600 font-semibold">
                    {row[5]}
                  </td>
                  <td className="px-3 py-1.5 border-r border-slate-200 text-slate-500">{row[6]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Sheet Tabs */}
        <div className="bg-[#f3f2f1] border-t border-slate-300 px-3 py-1 flex items-center justify-between text-xs font-medium select-none">
          <div className="flex items-center gap-2">
            <span className="bg-white border-t-2 border-[#107c41] px-4 py-1 rounded-t text-[#107c41] font-bold">
              3분기_손익집계
            </span>
            <span className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded cursor-pointer">
              부서별_비용
            </span>
            <span className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded cursor-pointer">
              원가_상세
            </span>
          </div>
          <div className="text-slate-500 pr-4 hidden sm:block font-mono text-[11px]">
            준비 완료 | 평균: 89,450 | 개수: 44 | 합계: 859,400
          </div>
        </div>
      </div>
    </div>
  );
}
