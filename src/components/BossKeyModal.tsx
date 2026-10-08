'use client';

import React, { useState, useEffect } from 'react';
import { EyeOff, X } from 'lucide-react';

interface BossKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BossKeyModal({ isOpen, onClose }: BossKeyModalProps) {
  const [viewMode, setViewMode] = useState<'excel' | 'wiki'>('excel');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.key === 'Escape' || e.key === '`' || e.key === '~')) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-white text-slate-800 flex flex-col font-sans select-none overflow-hidden"
      onClick={onClose}
      title="화면 아무 곳이나 클릭하거나 ESC를 누르면 지뢰찾기로 복귀합니다."
    >
      {/* Stealth Floating Dismiss Bar (Discreet at top right) */}
      <div
        className="absolute top-2 right-4 z-50 flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-600 shadow-sm cursor-pointer transition opacity-30 hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <EyeOff className="w-3.5 h-3.5" />
        <span>게임 복귀 (ESC / 클릭)</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setViewMode(viewMode === 'excel' ? 'wiki' : 'excel');
          }}
          className="ml-2 font-bold text-blue-600 underline"
        >
          {viewMode === 'excel' ? '위키백과로 전환' : '엑셀로 전환'}
        </button>
      </div>

      {viewMode === 'excel' ? (
        /* Real-Looking Microsoft Excel 365 / Hancom Spreadsheet */
        <div className="flex-1 flex flex-col h-full bg-[#f3f2f1] text-[13px]">
          {/* Top Title Bar */}
          <div className="bg-[#107c41] text-white px-4 py-2 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm">Excel</span>
              <span className="text-white/80">Q3_2026_재무제표_매출비용분석_최종본.xlsx - 저장됨</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="bg-white/20 px-3 py-1 rounded">자동 저장 켬</span>
              <span>홍길동 (기획팀)</span>
            </div>
          </div>

          {/* Ribbon Menu Tabs */}
          <div className="bg-[#f3f2f1] border-b border-slate-300 px-3 py-1 flex gap-4 text-xs text-slate-700">
            <span className="text-[#107c41] font-bold border-b-2 border-[#107c41] pb-1">홈</span>
            <span className="hover:text-black">삽입</span>
            <span className="hover:text-black">페이지 레이아웃</span>
            <span className="hover:text-black">수식</span>
            <span className="hover:text-black">데이터</span>
            <span className="hover:text-black">검토</span>
            <span className="hover:text-black">보기</span>
          </div>

          {/* Formula Bar */}
          <div className="bg-white border-b border-slate-300 px-3 py-1.5 flex items-center gap-2 text-xs">
            <span className="font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 border border-slate-300 rounded">
              D14
            </span>
            <span className="text-slate-400 italic">fx</span>
            <span className="font-mono text-slate-800 flex-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              =SUM(D5:D13) * 1.085
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
          <div className="bg-[#f3f2f1] border-t border-slate-300 px-3 py-1 flex items-center gap-2 text-xs font-medium">
            <span className="bg-white border-t-2 border-[#107c41] px-4 py-1 rounded-t text-[#107c41] font-bold">
              3분기_손익집계
            </span>
            <span className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded">부서별_비용</span>
            <span className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded">원가_상세</span>
            <span className="text-slate-400 ml-4">준비 완료 | 평균: 89,450 | 개수: 44 | 합계: 3,935,800</span>
          </div>
        </div>
      ) : (
        /* Real-Looking Wikipedia Academic Document */
        <div className="flex-1 overflow-auto bg-white p-8 max-w-4xl mx-auto text-slate-900 leading-relaxed font-serif">
          <div className="border-b border-slate-300 pb-3 mb-6">
            <h1 className="text-3xl font-normal font-sans text-slate-900">경제학 원론 (Principles of Economics)</h1>
            <p className="text-xs font-sans text-slate-500 mt-1">위키백과, 우리 모두의 백과사전.</p>
          </div>
          <div className="space-y-4 text-sm font-sans">
            <p>
              <strong>경제학(Economics)</strong>은 인간이 희소한 자원을 효율적으로 배분하고 생산, 분배, 소비하는 제반
              활동과 그 사회적 관계를 연구하는 사회과학의 한 분야이다. 근대 경제학은 아담 스미스(Adam Smith)의 《국부론》(1776)을
              효시로 하며, 자본주의 시장 경제의 메커니즘과 자율적 가격 조정 기구를 중심 테마로 다룬다.
            </p>
            <h2 className="text-xl font-bold font-sans border-b border-slate-300 pb-1 mt-6">1. 미시경제학과 거시경제학</h2>
            <p>
              경제학은 크게 개별 경제주체(가계, 기업)의 합리적 선택과 개별 시장의 가격 결정을 다루는 <em>미시경제학(Microeconomics)</em>과,
              국민경제 전체의 총생산, 물가수준, 실업률, 경제성장률 등 총량 변수를 분석하는 <em>거시경제학(Macroeconomics)</em>으로 대별된다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
