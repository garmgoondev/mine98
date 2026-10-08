# mine98.com (`웹지뢰찾기`) - Project Agent Instructions

---

## 1. Project Identity & Purpose

- **서비스명**: 웹지뢰찾기 (Classic Windows 98 Minesweeper Web)
- **도메인**: `https://mine98.com` (Apex & `www` 지원, Cloudflare Pages Edge 호스팅)
- **GitHub 저장소**: `https://github.com/garmgoondev/mine98`
- **프로젝트 위치**: `D:\Dev\mine98` (별칭 심볼릭 링크: `D:\Dev\webminesweeper`)
- **네트워크 소속**: WebGame Network 2호 사이트 (`D:\Dev\WebGame_Network\sites\02-minesweeper`)
- **목적**: 설치·로그인 없는 초경량 브라우저 윈도우 98 지뢰찾기 복각 및 사내망/학교 방화벽 우회 유틸리티 제공. 국내 월간 검색량 43.6만 건을 공략하여 막대한 오가닉 트래픽 창출 및 애드센스 수익화.

---

## 2. 절대 원칙 및 테크니컬 가이드라인

### ① 절대 원칙: 가상/임의(Mock) 데이터 사용 금지 (Strict No-Mock Policy)
- 모든 지표, SEO 순위, 방문자 수, 레이팅 데이터 수집 시 임의의 더미 수치나 보간 데이터를 절대 포함하지 않는다.
- 데이터가 미수집된 항목은 `0`, `-`, 또는 `데이터 수집 대기 중`으로 정직하게 표기한다.

### ② 0원 서버비 인프라 (Zero-Server-Cost Architecture)
- Next.js 정적 내보내기(`output: 'export'`)를 기본 유지한다.
- 서버 컴포넌트 전용 동적 SSR/API 라우트를 추가하지 않으며, 클라이언트 사이드 상태(`'use client'`, `localStorage`, Web Audio API)로 모든 게임 인터랙션을 구동한다.
- 변경 사항을 `origin main`에 `git push`하면 Cloudflare Pages 빌드 파이프라인(`pnpm build`)을 통해 수십 초 내에 글로벌 Edge CDN에 전면 배포된다.

### ③ 킬러 피처 "보스 키 (Boss Key / Stealth Mode)" 보존
- `ESC` 또는 `~` (물결) 키 입력 시 0.01초 만에 마이크로소프트 365 엑셀 위장 화면으로 전환되는 기능(`BossKeyModal.tsx`)을 절대 훼손하거나 제거하지 않는다.
- 브라우저 탭 타이틀(`통합 문서1 - Excel`)과 파비콘도 엑셀로 자동 위장되며 오디오가 즉각 음소거되어야 한다.

### ④ 사운드 및 에셋 독립성
- 사운드는 무거운 외부 `.mp3`/`.wav` 다운로드 없이 브라우저 내장 `Web Audio API` 오실레이터 합성(`src/lib/audio.ts`)으로만 구현하여 네트워크 트래픽 0B와 즉시 로딩을 유지한다.

---

## 3. 핵심 파일 및 디렉토리 구조

```
D:\Dev\mine98/
├── README.md                      # 프로젝트 메인 안내서 및 개발/배포 가이드
├── AGENTS.md                      # AI 에이전트 작업 지침 (본 문서)
├── docs/                          # 프로젝트 상세 기획 및 전략 문서
│   ├── BLUEPRINT.md               # 아키텍처 및 상세 기획서
│   ├── SEO_STRATEGY.md            # 구글/네이버 키워드 및 SERP 침투 전략
│   ├── PROJECT_PROFILE.json       # 프로젝트 메타데이터 및 인증 현황
│   └── CHANGELOG.md               # 버전 릴리즈 노트
├── public/                        # 정적 웹 에셋 (파비콘, OG 이미지, sitemap, robots)
│   ├── favicon.ico
│   ├── og-image.png               # 카카오톡/SNS 공유용 오픈그래프 이미지 (1200x630)
│   ├── robots.txt
│   ├── sitemap.xml
│   └── naver558add9994e9d65dd003ff6014f2ecee.html # 네이버 소유확인 파일
├── src/
│   ├── app/
│   │   ├── globals.css            # Tailwind CSS v4 스타일링 및 3D 베벨 유틸
│   │   ├── layout.tsx             # 메타데이터, Schema.org 구조화 데이터
│   │   └── page.tsx               # 메인 게임 루프, 단축키, 상호 교차 링크
│   ├── components/
│   │   ├── MinesweeperBoard.tsx   # 지뢰찾기 격자 그리드 및 터치/클릭 조작
│   │   ├── DigitDisplay.tsx       # 7세그먼트 붉은색 레트로 LED 카운터
│   │   ├── FaceButton.tsx         # 스마일/놀람/선글라스/해골 표정 버튼
│   │   ├── BossKeyModal.tsx       # 0.01초 엑셀/위키백과 위장 모달
│   │   ├── GameResultModal.tsx    # 승리/패배 결과, 기록 달성, 공유 모달
│   │   ├── BrandLogo.tsx          # mine98 브랜드 로고
│   │   └── SeoGuideSection.tsx    # 1-2-1 공략법, 고수 공식, FAQ 아코디언
│   └── lib/
│       ├── minesweeper.ts         # 지뢰 배치, 100% 안전 오프닝, 코드(Chording) 알고리즘
│       ├── audio.ts               # Web Audio API 8비트 레트로 신시사이저
│       ├── storage.ts             # 로컬스토리지 최고 기록 및 환경설정 영속화
│       └── types.ts               # 난이도, 셀 상태, 게임 상태 타입 정의
```

---

## 4. 자주 사용하는 개발 명령어

```bash
# 로컬 개발 서버 실행 (Turbopack)
pnpm dev

# 정적 빌드 및 TypeScript 무결성 검증 (out/ 폴더 생성)
pnpm build

# 변경사항 커밋 및 프로덕션 자동 배포
git add .
git commit -m "feat/fix: 작업 내용 명시"
git push origin main
```
