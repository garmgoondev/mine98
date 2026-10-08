# 💣 웹지뢰찾기 (Classic Windows 98 Minesweeper Web) - mine98.com

> **"설치 없는 무료 클래식 윈도우 98 지뢰찾기 & 직장인 사내망 안심 보스 키"**  
> 공식 서비스: [https://mine98.com](https://mine98.com) | Edge 배포: [https://mine98.pages.dev](https://mine98.pages.dev)

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed-Cloudflare%20Pages-orange?style=flat&logo=cloudflare)](https://pages.cloudflare.com/)
[![Server Cost](https://img.shields.io/badge/Server%20Cost-$0%20Zero-brightgreen?style=flat)](#)
[![Search Engine](https://img.shields.io/badge/Google%20%26%20Naver-Verified-blue?style=flat)](#)

---

## 1. 서비스 개요 및 프로젝트 소개

**웹지뢰찾기(`mine98.com`)**는 윈도우 98/XP 시절 전 세계를 매료시켰던 원조 지뢰찾기의 손맛과 픽셀 감성을 현대 웹 표준으로 100% 복각한 무설치 웹 브라우저 게임입니다.

- **국내 월간 통합 검색량**: **436,300건** (구글 36.8만 + 네이버 6.8만, PC 비중 80.8%)
- **서버 인프라**: Cloudflare Pages Edge 정적 호스팅 기반 **서버비 완전 0원 ($0 Free Tier)**
- **학교 및 사내망 100% 안전**: 도메인 내 게임 블랙리스트 단어 배제 (`game`, `zone` 등 미포함) + 긴급 엑셀 위장 보스 키 탑재

---

## 2. 핵심 킬러 기능 (Killer Features)

1. **보스 키 (Boss Key / Stealth Mode)**:
   - 게임 도중 언제든 **`ESC`** 또는 **`~` (물결)** 키를 누르면 0.01초 만에 마이크로소프트 365 엑셀 스프레드시트로 화면이 완벽 위장됩니다.
   - 브라우저 탭 타이틀(`통합 문서1 - Excel`)과 파비콘도 즉시 엑셀 초록색 아이콘으로 변경되며 소리가 즉각 음소거됩니다.
2. **첫 클릭 100% 안전 보장 (Zero-Fail Opening)**:
   - 첫 번째 클릭한 위치와 그 주변 8개 칸(총 9칸)에는 절대 지뢰가 생성되지 않도록 지연 맵 생성 알고리즘이 적용되어 시원한 오프닝을 보장합니다.
3. **스피드런 코드 (Chording)**:
   - 숫자가 적힌 칸 주변에 깃발이 숫자만큼 꽂혀있을 때, 해당 숫자를 클릭하면 남은 안전한 칸들이 원터치로 한 번에 개방됩니다.
4. **Web Audio API 8비트 사운드 신시사이저**:
   - 외부 오디오 파일 다운로드 0B. 브라우저 내장 오디오 합성기로 레트로 클릭음, 깃발음, 폭발음, 승리 팡파르를 초고속 재생합니다.
5. **듀얼 테마 지원**:
   - 윈도우 98 클래식 그레이 테마 & 모던 게이밍 다크 테마 완벽 지원.
6. **모바일 최적화**:
   - 터치 모드 퀵 깃발 토글 버튼 및 롱프레스 햅틱 피드백 지원.

---

## 3. 기술 스택 (Tech Stack)

| 영역 | 기술 스택 | 비고 |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.4.0 (Turbopack, React 19) | `output: 'export'` 정적 내보내기 |
| **Styling** | Tailwind CSS v4 | 3D 베벨 유틸리티 클래스 커스텀 구현 |
| **Audio** | Web Audio API Oscillator & Noise Buffer | 0 외부 음원 파일, 0ms 무지연 사운드 |
| **Graphics** | Lucide React + Canvas Confetti | 가벼운 벡터 아이콘 및 클리어 폭죽 효과 |
| **Hosting & DNS** | Cloudflare Registrar + Cloudflare Pages | Apex & www 자동 SSL, DDoS 방어 |
| **Search Engine** | Google Search Console & Naver Search Advisor | 소유권 인증, 사이트맵 등록, 색인 수집 완료 |

---

## 4. 로컬 실행 및 빌드 가이드

```bash
# 1. 의존성 설치
pnpm install

# 2. 로컬 개발 서버 실행 (Turbopack 초고속 HMR)
pnpm dev

# 3. 프로덕션 정적 빌드 검증 (out/ 폴더 생성)
pnpm build
```

---

## 5. 배포 및 검색엔진 색인 현황

- **GitHub Repository**: [https://github.com/garmgoondev/mine98](https://github.com/garmgoondev/mine98)
- `main` 브랜치에 코드를 푸시하면 Cloudflare Pages CI/CD를 통해 약 30초 내에 글로벌 CDN에 자동 반영됩니다.
- **Google Search Console**: `sc-domain:mine98.com` DNS 인증 완료 및 `sitemap.xml` 제출 완료.
- **네이버 서치어드바이저**: 사이트 소유확인 완료, `sitemap.xml` 제출 완료, `/` 수집 요청 완료.

---

## 6. 라이선스

MIT License.
