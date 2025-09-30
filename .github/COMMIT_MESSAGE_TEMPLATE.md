# 커밋 메시지 템플릿

## Conventional Commits 형식

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## 타입 (Type)

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드 프로세스, 도구 변경

## 스코프 (Scope)

대시보드 관련 커밋은 `dashboard` 스코프 사용:

- `feat(dashboard):` - 대시보드 새 기능
- `fix(dashboard):` - 대시보드 버그 수정
- `refactor(dashboard):` - 대시보드 리팩토링
- `test(dashboard):` - 대시보드 테스트

## 설명 (Description)

- 첫 글자는 소문자
- 마침표로 끝나지 않음
- 명령형으로 작성 (예: "add" not "added")
- 50자 이내

## 예시

### 기능 추가
```
feat(dashboard): add net profit widget with sparkline chart

- Implement NetProfitWidget component
- Add month-over-month comparison
- Include sparkline visualization placeholder
- Add analytics tracking for widget clicks
```

### 버그 수정
```
fix(dashboard): resolve unclassified widget urgency level calculation

- Fix urgency level logic for high priority state
- Update color scheme for better visibility
- Add proper ARIA labels for screen readers
```

### 리팩토링
```
refactor(dashboard): extract widget components to separate files

- Move NetProfitWidget to widgets/SummaryWidgets.tsx
- Move UnclassifiedWidget to widgets/TaskWidgets.tsx
- Update imports and exports
- Maintain existing functionality
```

### 테스트 추가
```
test(dashboard): add Playwright tests for acceptance criteria

- Add comprehensive E2E tests for PRD requirements
- Include mobile responsive testing
- Add accessibility test cases
- Cover all widget interaction scenarios
```

### 문서 업데이트
```
docs(dashboard): update PRD acceptance criteria checklist

- Map PRD sections to test cases
- Add widget-specific test scenarios
- Include accessibility requirements
- Document fixture data usage
```

## 브랜치명 규칙

### 메인 브랜치
- `feat/dashboard-refactor/layout` - 레이아웃 리팩토링
- `feat/dashboard-refactor/widgets` - 위젯 컴포넌트 리팩토링
- `feat/dashboard-refactor/filters` - 필터 시스템 리팩토링
- `feat/dashboard-refactor/analytics` - 분석 시스템 추가
- `feat/dashboard-refactor/accessibility` - 접근성 개선
- `feat/dashboard-refactor/responsive` - 반응형 개선
- `feat/dashboard-refactor/testing` - 테스트 추가
- `feat/dashboard-refactor/fixtures` - 픽스처 데이터 추가

### 세부 브랜치
- `feat/dashboard-refactor/layout/3-column-grid` - 3열 그리드 레이아웃
- `feat/dashboard-refactor/widgets/net-profit` - 순이익 위젯
- `feat/dashboard-refactor/widgets/unclassified` - 미분류 위젯
- `feat/dashboard-refactor/filters/period-chip` - 기간 필터 칩
- `feat/dashboard-refactor/analytics/events` - 분석 이벤트
- `feat/dashboard-refactor/accessibility/aria-labels` - ARIA 라벨
- `feat/dashboard-refactor/responsive/mobile` - 모바일 반응형
- `feat/dashboard-refactor/testing/playwright` - Playwright 테스트

## 커밋 메시지 예시

### 1. 레이아웃 리팩토링
```
feat(dashboard): implement 3-column responsive layout

- Add DashboardLayout component with 3 sections
- Implement responsive grid (desktop 3-col, tablet 2-col, mobile 1-col)
- Add proper ARIA landmarks for accessibility
- Include period filter chip in navigation area
```

### 2. 위젯 컴포넌트 추가
```
feat(dashboard): add NetProfitWidget with analytics integration

- Create NetProfitWidget component with empty state handling
- Add month-over-month comparison display
- Implement click tracking for analytics
- Include proper ARIA labels and keyboard navigation
```

### 3. 필터 시스템 구현
```
feat(dashboard): implement period filter chip component

- Add PeriodFilterChip with active state display
- Support custom period selection
- Include clear filter functionality
- Add keyboard navigation support
```

### 4. 분석 시스템 추가
```
feat(dashboard): add analytics event tracking system

- Implement analytics service with event tracking
- Add widget click tracking (widget_id, filter_state)
- Include todo quick action tracking
- Support dashboard viewed events
```

### 5. 접근성 개선
```
feat(dashboard): enhance accessibility with ARIA labels

- Add comprehensive ARIA labels for all widgets
- Implement keyboard navigation support
- Include screen reader friendly descriptions
- Add focus management for interactive elements
```

### 6. 테스트 추가
```
test(dashboard): add comprehensive Playwright test suite

- Convert PRD acceptance criteria to test cases
- Add widget-specific test scenarios
- Include mobile responsive testing
- Cover accessibility requirements
```

### 7. 픽스처 데이터 추가
```
feat(dashboard): add comprehensive fixture data system

- Create realistic test data for all scenarios
- Support time-shifting for different periods
- Include edge cases (empty, over-concentration, month-end)
- Add business type variations (simple, general, tax-free)
```

## 커밋 메시지 검증

### 필수 요소
- [ ] 타입이 올바른지 확인
- [ ] 스코프가 `dashboard`인지 확인
- [ ] 설명이 명령형으로 작성되었는지 확인
- [ ] 50자 이내인지 확인

### 권장 사항
- [ ] 본문에 변경 사항 상세 설명
- [ ] 관련 이슈 번호 포함
- [ ] Breaking changes 명시 (있는 경우)
- [ ] 테스트 커버리지 정보 포함

## 예시: 완전한 커밋 메시지

```
feat(dashboard): add NetProfitWidget with empty state handling

Implement NetProfitWidget component following PRD 4.1 requirements:
- Display current month net profit with formatting
- Show month-over-month comparison with trend indicators
- Include sparkline chart placeholder for future implementation
- Handle empty state with appropriate CTA for new users
- Add analytics tracking for widget interactions
- Ensure proper accessibility with ARIA labels

Closes #123
Related to #456

Co-authored-by: Developer <dev@example.com>
```
