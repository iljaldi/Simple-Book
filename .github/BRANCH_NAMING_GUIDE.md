# 브랜치명 규칙 가이드

## 메인 브랜치 구조

### 기본 패턴
```
feat/dashboard-refactor/<scope>
```

### 스코프별 브랜치명

#### 1. 레이아웃 관련
- `feat/dashboard-refactor/layout` - 전체 레이아웃 리팩토링
- `feat/dashboard-refactor/layout/3-column-grid` - 3열 그리드 시스템
- `feat/dashboard-refactor/layout/responsive` - 반응형 레이아웃
- `feat/dashboard-refactor/layout/navigation` - 네비게이션 영역

#### 2. 위젯 관련
- `feat/dashboard-refactor/widgets` - 전체 위젯 시스템
- `feat/dashboard-refactor/widgets/summary` - 요약 영역 위젯들
- `feat/dashboard-refactor/widgets/tasks` - 작업 영역 위젯들
- `feat/dashboard-refactor/widgets/insights` - 인사이트 영역 위젯들
- `feat/dashboard-refactor/widgets/net-profit` - 순이익 위젯
- `feat/dashboard-refactor/widgets/unclassified` - 미분류/미증빙 위젯
- `feat/dashboard-refactor/widgets/estimated-tax` - 예상세액 위젯
- `feat/dashboard-refactor/widgets/cashflow` - 현금흐름 위젯
- `feat/dashboard-refactor/widgets/top-expenses` - 지출 Top5 위젯
- `feat/dashboard-refactor/widgets/tax-calendar` - 세무 캘린더 위젯

#### 3. 필터 시스템
- `feat/dashboard-refactor/filters` - 전체 필터 시스템
- `feat/dashboard-refactor/filters/period` - 기간 필터
- `feat/dashboard-refactor/filters/project` - 프로젝트 필터
- `feat/dashboard-refactor/filters/chip` - 필터 칩 UI
- `feat/dashboard-refactor/filters/state-management` - 필터 상태 관리

#### 4. 분석 시스템
- `feat/dashboard-refactor/analytics` - 전체 분석 시스템
- `feat/dashboard-refactor/analytics/events` - 이벤트 추적
- `feat/dashboard-refactor/analytics/tracking` - 사용자 행동 추적
- `feat/dashboard-refactor/analytics/metrics` - 지표 수집

#### 5. 접근성
- `feat/dashboard-refactor/accessibility` - 전체 접근성 개선
- `feat/dashboard-refactor/accessibility/aria-labels` - ARIA 라벨
- `feat/dashboard-refactor/accessibility/keyboard` - 키보드 네비게이션
- `feat/dashboard-refactor/accessibility/screen-reader` - 스크린리더 지원

#### 6. 반응형
- `feat/dashboard-refactor/responsive` - 전체 반응형 개선
- `feat/dashboard-refactor/responsive/mobile` - 모바일 최적화
- `feat/dashboard-refactor/responsive/tablet` - 태블릿 최적화
- `feat/dashboard-refactor/responsive/desktop` - 데스크톱 최적화

#### 7. 테스트
- `feat/dashboard-refactor/testing` - 전체 테스트 시스템
- `feat/dashboard-refactor/testing/unit` - 단위 테스트
- `feat/dashboard-refactor/testing/integration` - 통합 테스트
- `feat/dashboard-refactor/testing/e2e` - E2E 테스트
- `feat/dashboard-refactor/testing/playwright` - Playwright 테스트

#### 8. 데이터 관리
- `feat/dashboard-refactor/fixtures` - 픽스처 데이터
- `feat/dashboard-refactor/types` - TypeScript 타입 정의
- `feat/dashboard-refactor/data-layer` - 데이터 레이어

#### 9. 전역 CTA
- `feat/dashboard-refactor/global-cta` - 전역 스티키 CTA
- `feat/dashboard-refactor/global-cta/fab` - FAB 컴포넌트
- `feat/dashboard-refactor/global-cta/speed-dial` - 스피드 다이얼
- `feat/dashboard-refactor/global-cta/visibility` - 노출/숨김 로직

## 세부 브랜치명 예시

### 위젯별 세부 브랜치
```
feat/dashboard-refactor/widgets/net-profit/empty-state
feat/dashboard-refactor/widgets/net-profit/sparkline
feat/dashboard-refactor/widgets/net-profit/analytics
feat/dashboard-refactor/widgets/unclassified/urgency-levels
feat/dashboard-refactor/widgets/unclassified/rule-suggestion
feat/dashboard-refactor/widgets/estimated-tax/disclaimer
feat/dashboard-refactor/widgets/cashflow/chart
feat/dashboard-refactor/widgets/top-expenses/over-concentration
feat/dashboard-refactor/widgets/tax-calendar/deadlines
```

### 필터별 세부 브랜치
```
feat/dashboard-refactor/filters/period/preset-options
feat/dashboard-refactor/filters/period/custom-range
feat/dashboard-refactor/filters/period/chip-ui
feat/dashboard-refactor/filters/project/selection
feat/dashboard-refactor/filters/state/persistence
feat/dashboard-refactor/filters/state/synchronization
```

### 접근성별 세부 브랜치
```
feat/dashboard-refactor/accessibility/aria/landmarks
feat/dashboard-refactor/accessibility/aria/labels
feat/dashboard-refactor/accessibility/keyboard/tab-order
feat/dashboard-refactor/accessibility/keyboard/shortcuts
feat/dashboard-refactor/accessibility/screen-reader/announcements
feat/dashboard-refactor/accessibility/screen-reader/descriptions
```

### 테스트별 세부 브랜치
```
feat/dashboard-refactor/testing/playwright/acceptance-criteria
feat/dashboard-refactor/testing/playwright/mobile-responsive
feat/dashboard-refactor/testing/playwright/accessibility
feat/dashboard-refactor/testing/unit/widget-rendering
feat/dashboard-refactor/testing/unit/click-handlers
feat/dashboard-refactor/testing/integration/filter-sync
```

## 브랜치 생성 규칙

### 1. 메인 브랜치에서 생성
```bash
git checkout main
git pull origin main
git checkout -b feat/dashboard-refactor/layout
```

### 2. 세부 브랜치 생성
```bash
git checkout feat/dashboard-refactor/layout
git checkout -b feat/dashboard-refactor/layout/3-column-grid
```

### 3. 브랜치명 검증
- [ ] `feat/dashboard-refactor/` 접두사 사용
- [ ] 스코프가 명확한지 확인
- [ ] 하이픈으로 단어 구분
- [ ] 소문자 사용
- [ ] 50자 이내

## 브랜치 병합 전략

### 1. 세부 브랜치 → 메인 브랜치
```
feat/dashboard-refactor/layout/3-column-grid
↓
feat/dashboard-refactor/layout
```

### 2. 메인 브랜치 → develop
```
feat/dashboard-refactor/layout
↓
develop
```

### 3. develop → main
```
develop
↓
main
```

## 브랜치명 매핑

### PRD 섹션별 브랜치 매핑

| PRD 섹션 | 브랜치명 | 설명 |
|---------|---------|------|
| 3장: 정보 구조 | `feat/dashboard-refactor/layout` | 3영역 레이아웃 구현 |
| 4.1: 순이익 | `feat/dashboard-refactor/widgets/net-profit` | 순이익 위젯 구현 |
| 4.3: 미분류/미증빙 | `feat/dashboard-refactor/widgets/unclassified` | 미분류 위젯 구현 |
| 6장: 전역 필터 | `feat/dashboard-refactor/filters` | 필터 시스템 구현 |
| 8장: 접근성 | `feat/dashboard-refactor/accessibility` | 접근성 개선 |
| 10장: 수락 기준 | `feat/dashboard-refactor/testing` | 테스트 구현 |

### 기능별 우선순위

#### Phase 1: 기본 구조
1. `feat/dashboard-refactor/layout` - 레이아웃 기본 구조
2. `feat/dashboard-refactor/widgets/net-profit` - 순이익 위젯
3. `feat/dashboard-refactor/widgets/unclassified` - 미분류 위젯
4. `feat/dashboard-refactor/filters/period` - 기간 필터

#### Phase 2: 확장 기능
5. `feat/dashboard-refactor/widgets/estimated-tax` - 예상세액 위젯
6. `feat/dashboard-refactor/widgets/cashflow` - 현금흐름 위젯
7. `feat/dashboard-refactor/widgets/top-expenses` - 지출 Top5 위젯
8. `feat/dashboard-refactor/widgets/tax-calendar` - 세무 캘린더 위젯

#### Phase 3: 고도화
9. `feat/dashboard-refactor/analytics` - 분석 시스템
10. `feat/dashboard-refactor/accessibility` - 접근성 개선
11. `feat/dashboard-refactor/responsive` - 반응형 개선
12. `feat/dashboard-refactor/testing` - 테스트 시스템

## 브랜치 정리

### 완료된 브랜치 삭제
```bash
# 로컬 브랜치 삭제
git branch -d feat/dashboard-refactor/layout/3-column-grid

# 원격 브랜치 삭제
git push origin --delete feat/dashboard-refactor/layout/3-column-grid
```

### 브랜치 상태 확인
```bash
# 로컬 브랜치 목록
git branch

# 원격 브랜치 목록
git branch -r

# 병합된 브랜치 확인
git branch --merged main
```

## 예시: 전체 브랜치 구조

```
main
├── develop
    ├── feat/dashboard-refactor/layout
    │   ├── feat/dashboard-refactor/layout/3-column-grid
    │   ├── feat/dashboard-refactor/layout/responsive
    │   └── feat/dashboard-refactor/layout/navigation
    ├── feat/dashboard-refactor/widgets
    │   ├── feat/dashboard-refactor/widgets/net-profit
    │   ├── feat/dashboard-refactor/widgets/unclassified
    │   └── feat/dashboard-refactor/widgets/estimated-tax
    ├── feat/dashboard-refactor/filters
    │   ├── feat/dashboard-refactor/filters/period
    │   └── feat/dashboard-refactor/filters/project
    ├── feat/dashboard-refactor/analytics
    ├── feat/dashboard-refactor/accessibility
    ├── feat/dashboard-refactor/responsive
    └── feat/dashboard-refactor/testing
```
