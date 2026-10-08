# [마스터 기획서] 웹지뢰찾기 (Classic Windows 98 Minesweeper Web)

- **작성일**: 2026-10-08
- **서비스명**: 웹지뢰찾기
- **공식 도메인**: `https://mine98.com`
- **코드 저장소**: `D:\Dev\mine98` (`https://github.com/garmgoondev/mine98`)
- **타겟 유저**: PC 직장인 및 학생 (사내망/컴퓨터실 무설치 브라우저 유저)
- **네트워크 위치**: WebGame Network 2호 사이트

---

## 1. 아키텍처 및 시스템 설계

### ① 프론트엔드 컴포넌트 구조
```
App Root (page.tsx)
 ├── Header (BrandLogo, BossKey Trigger, Theme Toggle, Mute Toggle)
 ├── CrossPromotionBanner (Link to 1호 webomok.com)
 ├── Main Game Container
 │    ├── DifficultyBar (초급 9x9/10, 중급 16x16/40, 고급 30x16/99)
 │    ├── BestRecordPill (개인 최고 기록 표시)
 │    ├── MobileFlagToggle (모바일 퀵 깃발 토글 버튼)
 │    ├── WindowFrame (윈도우 98 3D 베벨 프레임)
 │    │    ├── StatusHeader (DigitDisplay 잔여지뢰, FaceButton 스마일리, DigitDisplay 타이머)
 │    │    └── MinesweeperBoard (격자 판, 좌클릭 열기, 우클릭 깃발, 코드 Chording)
 │    └── ControlsFooter (클릭 수, 단축키 F2/ESC, 결과 다시 보기 버튼)
 ├── SeoGuideSection (1-2-1 / 1-2-2-1 공략 가이드, FAQ 아코디언)
 ├── BossKeyModal (0.01초 엑셀/위키백과 위장 모달)
 └── GameResultModal (클리어/폭발 결과, 개인 최고 기록, 공유하기, 둘러보기)
```

### ② 상태 머신 및 라이프사이클
```
[idle] ──(첫 클릭)──> [playing] ──(지뢰 폭발)──> [lost]
                           │
                           └──(전체 지뢰 제외 칸 개방)──> [won]
```
- **idle**: 빈 보드 표시. 첫 클릭 시 `populateMines(board, cols, rows, mines, startX, startY)` 실행하여 첫 클릭 좌표 주변 9칸을 100% 안전 보장 후 지뢰 무작위 배치.
- **playing**: 타이머(1초 간격 증가, 최대 999초) 동작. 클릭 수 누적.
- **lost**: 지뢰 전체 공개. 클릭한 지뢰 빨간색 강조, 잘못 꽂은 깃발 X 표시. 스마일리 표정 `dead(😵)`. 폭발음 재생. 0.6초 후 `GameResultModal` 자동 오픈.
- **won**: 깃발 자동 완성. 스마일리 표정 `cool(😎)`. 승리 팡파르 및 폭죽(Canvas Confetti) 발사. 최고 기록 갱신 여부 판별 후 로컬스토리지 저장. 0.5초 후 `GameResultModal` 자동 오픈.

### ③ Web Audio API 사운드 합성기
외부 오디오 에셋을 다운로드받지 않고, Web Audio API를 활용해 즉각 소리를 합성합니다:
- **클릭음**: 짧은 감쇠 정현파(Sine Wave, 400Hz → 200Hz, 30ms).
- **깃발음**: 경쾌한 복합 사각파(Square Wave, 600Hz → 900Hz, 50ms).
- **코드음**: 시원한 3화음 아르페지오 (440Hz - 554Hz - 659Hz).
- **폭발음**: 저주파 화이트 노이즈 버퍼 + 저역 통과 필터(Low-pass filter, 800ms 감쇠).
- **승리음**: 고전 아케이드 브라스 4화음 팡파르 (C5 - E5 - G5 - C6).

---

## 2. 킬러 기능 상세 명세

### ① 보스 키 (Boss Key / Stealth Mode)
- **트리거**: 키보드 `ESC` 또는 `~` (물결) 키 입력 또는 우측 상단 "보스 키" 버튼 클릭.
- **화면 위장**: 0.01초 만에 화면 전체가 실제 마이크로소프트 365 엑셀 스프레드시트로 변경.
- **탭 메타 위장**: 브라우저 탭 제목이 `통합 문서1 - Excel`로 변경되며 파비콘도 엑셀 초록색 아이콘으로 즉시 교체.
- **음소거**: 모든 게임 사운드 즉각 차단.
- **복귀**: 위장 화면 아무 곳이나 클릭하거나 다시 `ESC`를 누르면 즉시 지뢰찾기로 안전 복귀.

### ② 스피드런 코드 (Chording)
- 이미 열린 숫자 칸 주변에 해당 숫자와 동일한 개수의 깃발이 꽂혀 있는 경우, 해당 숫자를 클릭하면 아직 열리지 않은 주변 칸들이 한 번에 개방.
- 만약 깃발 위치가 잘못되어 지뢰가 개방되면 즉시 패배 처리.

### ③ 1-2-1 및 1-2-2-1 패턴 온페이지 SEO
- 초보자와 고수 유저 모두를 체류시키기 위해 페이지 하단에 지뢰찾기 핵심 공식인 **1-2-1 패턴**과 **1-2-2-1 패턴**의 시각화 다이어그램 및 원리를 마크다운으로 상세히 탑재.
- 지뢰찾기 규칙, 안전한 첫 수 요령, 모바일 조작법을 FAQ 아코디언으로 구성해 네이버/구글 검색엔진 풍부한 스니펫(Rich Snippet) 색인 유도.
