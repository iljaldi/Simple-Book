# 대시보드 테스트 가이드

## 개요

이 디렉토리는 PRD 10장 "수락 기준(제품 관점 체크리스트)"를 Playwright 테스트로 변환한 것입니다.

## 테스트 구조

### 파일 구성
- `acceptance-criteria.spec.ts` - 메인 테스트 파일
- `fixtures.ts` - 테스트용 픽스처 데이터 및 헬퍼 함수
- `playwright.config.ts` - Playwright 설정

### 테스트 태그

#### @widget_id 태그
- `@widget_id:all` - 모든 위젯에 적용
- `@widget_id:net-profit` - 순이익 위젯
- `@widget_id:unclassified` - 미분류/미증빙 위젯
- `@widget_id:estimated-tax` - 예상세액 위젯
- `@widget_id:cashflow` - 현금흐름 위젯
- `@widget_id:top-expenses` - 지출 Top5 위젯
- `@widget_id:tax-calendar` - 세무 캘린더 위젯
- `@widget_id:global-cta` - 전역 스티키 CTA

#### @scenario_id 태그
- `@scenario_id:normal` - 일반 사용자
- `@scenario_id:new-user` - 신규 사용자
- `@scenario_id:empty` - 데이터 없음
- `@scenario_id:over-concentration` - 카테고리 과대집중
- `@scenario_id:month-end` - 월말 D-3
- `@scenario_id:high-earning` - 고수익 프리랜서
- `@scenario_id:low-earning` - 저수익/손실

## 테스트 실행

### 전체 테스트 실행
```bash
npx playwright test
```

### 특정 위젯 테스트 실행
```bash
npx playwright test --grep "@widget_id:net-profit"
```

### 특정 시나리오 테스트 실행
```bash
npx playwright test --grep "@scenario_id:new-user"
```

### 모바일 테스트 실행
```bash
npx playwright test --project="Mobile Chrome"
```

## 테스트 시나리오

### 1. 전역 기간 필터 일관성
- **목적**: 전역 기간을 바꾸면 모든 위젯 수치와 목록이 일관되게 바뀐다
- **테스트**: 기간 필터 변경 시 모든 위젯의 데이터 일관성 확인

### 2. 위젯 액션 기능
- **목적**: 모든 위젯에는 명확한 1차 액션이 존재하고, 클릭 시 관련 화면으로 이동한다
- **테스트**: 각 위젯의 액션 버튼 클릭 시 올바른 페이지 이동 확인

### 3. 신규 사용자 경험
- **목적**: 신규 사용자라도 대시보드가 무의미한 빈 화면이 아니라 다음 행동을 제시한다
- **테스트**: 빈 상태에서도 적절한 가이드와 CTA 제공 확인

### 4. 세무 관련 카피
- **목적**: 세무 관련 카피는 참고용 안내가 분명하고 과도한 공포/혼란을 유발하지 않는다
- **테스트**: 세무 관련 텍스트의 톤앤매너 확인

### 5. 모바일 반응형
- **목적**: 모바일(1열)에서도 스크롤 순서가 논리적이고 버튼이 겹치지 않는다
- **테스트**: 모바일 뷰포트에서 레이아웃과 접근성 확인

### 6. 접근성
- **목적**: 키보드 접근 가능하고 적절한 ARIA 라벨을 가진다
- **테스트**: 키보드 네비게이션과 스크린리더 지원 확인

## GIVEN-WHEN-THEN 패턴

모든 테스트는 GIVEN-WHEN-THEN 패턴을 사용합니다:

```typescript
test('위젯 액션 테스트', async ({ page }) => {
  // GIVEN: 특정 조건이 설정되어 있다
  await expect(page.locator('[data-testid="widget"]')).toBeVisible();
  
  // WHEN: 사용자가 특정 액션을 수행한다
  await page.click('[data-testid="action-button"]');
  
  // THEN: 예상되는 결과가 발생한다
  await expect(page).toHaveURL('/expected-page');
});
```

## 픽스처 데이터

테스트는 백엔드 없이 픽스처 데이터를 사용합니다:

```typescript
// 시나리오 데이터 주입
await injectFixtureData(page, 'new-user');
await page.goto('/dashboard');
```

## 디버깅

### 테스트 실행 중 스크린샷 확인
```bash
npx playwright test --headed
```

### 실패한 테스트 디버깅
```bash
npx playwright test --debug
```

### 테스트 리포트 확인
```bash
npx playwright show-report
```

## 주의사항

1. **data-testid 속성**: 모든 테스트 가능한 요소에 `data-testid` 속성을 추가해야 합니다.
2. **픽스처 데이터**: 실제 API 호출 대신 픽스처 데이터를 사용합니다.
3. **비동기 처리**: 모든 DOM 조작은 `await`를 사용하여 비동기적으로 처리합니다.
4. **접근성**: 모든 테스트에서 접근성 요구사항을 확인합니다.
