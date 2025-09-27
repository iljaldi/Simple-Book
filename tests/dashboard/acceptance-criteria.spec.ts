/**
 * 대시보드 수락 기준 테스트 (PRD 10장)
 * 제품 관점 체크리스트를 Playwright 테스트로 변환
 */

import { test, expect } from '@playwright/test';
import { scenarios } from '@/fixtures/dashboard';

// 테스트 데이터 설정
const testScenarios = {
  normal: scenarios.normal(),
  newUser: scenarios.newUser(),
  empty: scenarios.newUser(),
  overConcentration: scenarios.overConcentration(),
  monthEnd: scenarios.monthEnd()
};

test.describe('대시보드 수락 기준', () => {
  test.beforeEach(async ({ page }) => {
    // 픽스처 데이터를 페이지에 주입
    await page.addInitScript((scenarioData) => {
      window.__DASHBOARD_FIXTURE__ = scenarioData;
    }, testScenarios.normal);
    
    await page.goto('/dashboard');
  });

  test.describe('전역 기간 필터 일관성', () => {
    test('@widget_id:all @scenario_id:normal - 전역 기간을 바꾸면 모든 위젯 수치와 목록이 일관되게 바뀐다', async ({ page }) => {
      // GIVEN: 대시보드가 로드되어 있고 기본 기간(이번 달)이 선택되어 있다
      await expect(page.locator('[data-testid="period-filter-chip"]')).toContainText('이번 달');
      
      // WHEN: 기간 필터를 "지난 달"로 변경한다
      await page.click('[data-testid="period-filter-chip"]');
      await page.click('[data-testid="period-option-last-month"]');
      
      // THEN: 모든 위젯의 수치와 목록이 지난 달 데이터로 일관되게 변경된다
      await expect(page.locator('[data-testid="net-profit-widget"]')).toContainText('지난 달');
      await expect(page.locator('[data-testid="unclassified-widget"]')).toContainText('지난 달');
      await expect(page.locator('[data-testid="cashflow-widget"]')).toContainText('지난 달');
      await expect(page.locator('[data-testid="top-expenses-widget"]')).toContainText('지난 달');
    });

    test('@widget_id:all @scenario_id:custom-period - 사용자 지정 기간으로 변경 시 모든 위젯이 일관되게 업데이트된다', async ({ page }) => {
      // GIVEN: 대시보드가 로드되어 있다
      await expect(page.locator('[data-testid="dashboard-main"]')).toBeVisible();
      
      // WHEN: 사용자 지정 기간을 선택하고 날짜를 설정한다
      await page.click('[data-testid="period-filter-chip"]');
      await page.click('[data-testid="period-option-custom"]');
      await page.fill('[data-testid="custom-start-date"]', '2024-01-01');
      await page.fill('[data-testid="custom-end-date"]', '2024-01-31');
      await page.click('[data-testid="custom-period-apply"]');
      
      // THEN: 모든 위젯이 2024년 1월 데이터로 일관되게 표시된다
      await expect(page.locator('[data-testid="period-filter-chip"]')).toContainText('1월 1일 - 1월 31일');
      await expect(page.locator('[data-testid="net-profit-widget"]')).toContainText('2024년 1월');
      await expect(page.locator('[data-testid="cashflow-widget"]')).toContainText('2024년 1월');
    });
  });

  test.describe('위젯 액션 기능', () => {
    test('@widget_id:net-profit @scenario_id:normal - 순이익 위젯에 명확한 1차 액션이 존재하고 클릭 시 거래내역으로 이동한다', async ({ page }) => {
      // GIVEN: 순이익 위젯이 표시되어 있다
      await expect(page.locator('[data-testid="net-profit-widget"]')).toBeVisible();
      
      // WHEN: "거래내역 보기" 버튼을 클릭한다
      await page.click('[data-testid="net-profit-action-button"]');
      
      // THEN: 거래내역 페이지로 이동하고 필터 상태가 유지된다
      await expect(page).toHaveURL('/transactions');
      await expect(page.locator('[data-testid="transaction-filter-period"]')).toContainText('이번 달');
    });

    test('@widget_id:unclassified @scenario_id:normal - 미분류 위젯에 명확한 1차 액션이 존재하고 클릭 시 영수증함으로 이동한다', async ({ page }) => {
      // GIVEN: 미분류/미증빙 위젯이 표시되어 있다
      await expect(page.locator('[data-testid="unclassified-widget"]')).toBeVisible();
      
      // WHEN: "지금 정리" 버튼을 클릭한다
      await page.click('[data-testid="unclassified-action-button"]');
      
      // THEN: 영수증함 페이지로 이동하고 미분류/미증빙 필터가 적용된다
      await expect(page).toHaveURL('/receipts');
      await expect(page.locator('[data-testid="receipt-filter-status"]')).toContainText('미분류');
    });

    test('@widget_id:estimated-tax @scenario_id:normal - 예상세액 위젯에 명확한 1차 액션이 존재하고 클릭 시 신고 시뮬레이션으로 이동한다', async ({ page }) => {
      // GIVEN: 예상세액 위젯이 표시되어 있다
      await expect(page.locator('[data-testid="estimated-tax-widget"]')).toBeVisible();
      
      // WHEN: "자세히 보기" 버튼을 클릭한다
      await page.click('[data-testid="estimated-tax-action-button"]');
      
      // THEN: 신고 메뉴의 시뮬레이션으로 이동한다
      await expect(page).toHaveURL('/reports/tax-simulation');
    });

    test('@widget_id:cashflow @scenario_id:normal - 현금흐름 위젯에 명확한 1차 액션이 존재하고 클릭 시 월별 리포트로 이동한다', async ({ page }) => {
      // GIVEN: 현금흐름 위젯이 표시되어 있다
      await expect(page.locator('[data-testid="cashflow-widget"]')).toBeVisible();
      
      // WHEN: "월별 상세 보기" 버튼을 클릭한다
      await page.click('[data-testid="cashflow-action-button"]');
      
      // THEN: 월별 리포트 페이지로 이동한다
      await expect(page).toHaveURL('/reports/monthly');
    });

    test('@widget_id:top-expenses @scenario_id:normal - 지출 Top5 위젯에 명확한 1차 액션이 존재하고 클릭 시 카테고리 분석으로 이동한다', async ({ page }) => {
      // GIVEN: 지출 Top5 위젯이 표시되어 있다
      await expect(page.locator('[data-testid="top-expenses-widget"]')).toBeVisible();
      
      // WHEN: "카테고리 분석" 버튼을 클릭한다
      await page.click('[data-testid="top-expenses-action-button"]');
      
      // THEN: 카테고리 상세 리포트로 이동한다
      await expect(page).toHaveURL('/reports/categories');
    });

    test('@widget_id:tax-calendar @scenario_id:month-end - 세무 캘린더 위젯에 명확한 1차 액션이 존재하고 클릭 시 신고 위저드로 이동한다', async ({ page }) => {
      // GIVEN: 월말 시나리오로 세무 캘린더 위젯이 표시되어 있다
      await page.addInitScript((scenarioData) => {
        window.__DASHBOARD_FIXTURE__ = scenarioData;
      }, testScenarios.monthEnd);
      await page.reload();
      
      // WHEN: "마감 점검 시작" 버튼을 클릭한다
      await page.click('[data-testid="tax-calendar-action-button"]');
      
      // THEN: 신고 메뉴의 위저드로 이동한다
      await expect(page).toHaveURL('/reports/tax-wizard');
    });
  });

  test.describe('신규 사용자 경험', () => {
    test('@widget_id:all @scenario_id:new-user - 신규 사용자라도 대시보드가 무의미한 빈 화면이 아니라 다음 행동을 제시한다', async ({ page }) => {
      // GIVEN: 신규 사용자 시나리오로 대시보드가 로드되어 있다
      await page.addInitScript((scenarioData) => {
        window.__DASHBOARD_FIXTURE__ = scenarioData;
      }, testScenarios.newUser);
      await page.reload();
      
      // WHEN: 대시보드를 확인한다
      await expect(page.locator('[data-testid="dashboard-main"]')).toBeVisible();
      
      // THEN: 빈 상태가 아닌 다음 행동을 제시하는 메시지와 버튼이 표시된다
      await expect(page.locator('[data-testid="net-profit-widget"]')).toContainText('첫 거래를 추가해보세요');
      await expect(page.locator('[data-testid="net-profit-action-button"]')).toContainText('거래 추가하기');
      await expect(page.locator('[data-testid="unclassified-widget"]')).toContainText('정리할 거래가 없습니다');
      await expect(page.locator('[data-testid="cashflow-widget"]')).toContainText('데이터를 축적해보세요');
    });

    test('@widget_id:net-profit @scenario_id:new-user - 순이익 위젯 빈 상태에서 적절한 가이드와 CTA가 제공된다', async ({ page }) => {
      // GIVEN: 신규 사용자로 순이익 위젯이 빈 상태로 표시되어 있다
      await page.addInitScript((scenarioData) => {
        window.__DASHBOARD_FIXTURE__ = scenarioData;
      }, testScenarios.newUser);
      await page.reload();
      
      // WHEN: 순이익 위젯을 확인한다
      await expect(page.locator('[data-testid="net-profit-widget"]')).toBeVisible();
      
      // THEN: 빈 상태 메시지와 첫 거래 추가 버튼이 표시된다
      await expect(page.locator('[data-testid="net-profit-empty-message"]')).toContainText('첫 거래를 추가해보세요');
      await expect(page.locator('[data-testid="net-profit-action-button"]')).toContainText('거래 추가하기');
      await expect(page.locator('[data-testid="net-profit-action-button"]')).toBeEnabled();
    });
  });

  test.describe('세무 관련 카피', () => {
    test('@widget_id:estimated-tax @scenario_id:normal - 예상세액 위젯의 세무 관련 카피가 참고용 안내가 분명하다', async ({ page }) => {
      // GIVEN: 예상세액 위젯이 표시되어 있다
      await expect(page.locator('[data-testid="estimated-tax-widget"]')).toBeVisible();
      
      // WHEN: 예상세액 위젯의 내용을 확인한다
      await expect(page.locator('[data-testid="estimated-tax-disclaimer"]')).toBeVisible();
      
      // THEN: 참고용 안내가 명확히 표시되고 과도한 공포/혼란을 유발하지 않는다
      await expect(page.locator('[data-testid="estimated-tax-disclaimer"]')).toContainText('참고용입니다');
      await expect(page.locator('[data-testid="estimated-tax-disclaimer"]')).toContainText('정확한 세액은 세무사와 상담하세요');
      await expect(page.locator('[data-testid="estimated-tax-disclaimer"]')).not.toContainText('경고');
      await expect(page.locator('[data-testid="estimated-tax-disclaimer"]')).not.toContainText('주의');
    });

    test('@widget_id:tax-calendar @scenario_id:month-end - 세무 캘린더 위젯의 마감 관련 카피가 친절하고 안내적이다', async ({ page }) => {
      // GIVEN: 월말 시나리오로 세무 캘린더 위젯이 표시되어 있다
      await page.addInitScript((scenarioData) => {
        window.__DASHBOARD_FIXTURE__ = scenarioData;
      }, testScenarios.monthEnd);
      await page.reload();
      
      // WHEN: 세무 캘린더 위젯의 내용을 확인한다
      await expect(page.locator('[data-testid="tax-calendar-widget"]')).toBeVisible();
      
      // THEN: 마감 관련 카피가 친절하고 안내적이며 과도한 압박감을 주지 않는다
      await expect(page.locator('[data-testid="tax-calendar-widget"]')).toContainText('마감은 미리 준비하면 평온합니다');
      await expect(page.locator('[data-testid="tax-calendar-widget"]')).not.toContainText('긴급');
      await expect(page.locator('[data-testid="tax-calendar-widget"]')).not.toContainText('즉시');
    });
  });

  test.describe('모바일 반응형', () => {
    test('@widget_id:all @scenario_id:normal - 모바일(1열)에서 스크롤 순서가 논리적이고 버튼이 겹치지 않는다', async ({ page }) => {
      // GIVEN: 모바일 뷰포트로 대시보드가 로드되어 있다
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      
      // WHEN: 대시보드를 스크롤하며 확인한다
      await expect(page.locator('[data-testid="dashboard-main"]')).toBeVisible();
      
      // THEN: 1열 레이아웃으로 표시되고 스크롤 순서가 논리적이다
      await expect(page.locator('[data-testid="summary-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="tasks-section"]')).toBeVisible();
      await expect(page.locator('[data-testid="insights-section"]')).toBeVisible();
      
      // AND: 버튼들이 겹치지 않고 적절한 간격을 유지한다
      const buttons = page.locator('[data-testid$="-action-button"]');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        await expect(button).toBeVisible();
        await expect(button).not.toHaveClass(/overlap/);
      }
    });

    test('@widget_id:global-cta @scenario_id:normal - 모바일에서 전역 CTA가 적절한 위치에 표시되고 다른 요소와 겹치지 않는다', async ({ page }) => {
      // GIVEN: 모바일 뷰포트로 대시보드가 로드되어 있다
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');
      
      // WHEN: 전역 CTA를 확인한다
      await expect(page.locator('[data-testid="global-cta-fab"]')).toBeVisible();
      
      // THEN: 화면 하단 우측에 고정되어 있고 다른 요소와 겹치지 않는다
      const fab = page.locator('[data-testid="global-cta-fab"]');
      const fabBox = await fab.boundingBox();
      expect(fabBox?.x).toBeGreaterThan(300); // 우측에 위치
      expect(fabBox?.y).toBeGreaterThan(600); // 하단에 위치
      
      // AND: 터치 타겟이 충분히 크다 (최소 44px)
      expect(fabBox?.width).toBeGreaterThanOrEqual(44);
      expect(fabBox?.height).toBeGreaterThanOrEqual(44);
    });
  });

  test.describe('접근성', () => {
    test('@widget_id:all @scenario_id:normal - 모든 위젯이 키보드로 접근 가능하고 적절한 ARIA 라벨을 가진다', async ({ page }) => {
      // GIVEN: 대시보드가 로드되어 있다
      await expect(page.locator('[data-testid="dashboard-main"]')).toBeVisible();
      
      // WHEN: Tab 키로 네비게이션한다
      await page.keyboard.press('Tab');
      
      // THEN: 각 위젯이 순서대로 포커스되고 적절한 ARIA 라벨을 가진다
      const focusableElements = [
        '[data-testid="period-filter-chip"]',
        '[data-testid="net-profit-action-button"]',
        '[data-testid="estimated-tax-action-button"]',
        '[data-testid="unclassified-action-button"]',
        '[data-testid="global-cta-fab"]'
      ];
      
      for (const selector of focusableElements) {
        await page.keyboard.press('Tab');
        const element = page.locator(selector);
        await expect(element).toBeFocused();
        await expect(element).toHaveAttribute('aria-label');
      }
    });

    test('@widget_id:unclassified @scenario_id:over-concentration - 미분류 위젯의 긴급 상태가 스크린리더에 적절히 전달된다', async ({ page }) => {
      // GIVEN: 과대집중 시나리오로 미분류 위젯이 표시되어 있다
      await page.addInitScript((scenarioData) => {
        window.__DASHBOARD_FIXTURE__ = scenarioData;
      }, testScenarios.overConcentration);
      await page.reload();
      
      // WHEN: 미분류 위젯을 확인한다
      await expect(page.locator('[data-testid="unclassified-widget"]')).toBeVisible();
      
      // THEN: 긴급 상태가 스크린리더에 적절히 전달된다
      await expect(page.locator('[data-testid="unclassified-widget"]')).toHaveAttribute('role', 'alert');
      await expect(page.locator('[data-testid="unclassified-urgency-message"]')).toContainText('처리 필요 건수가 많습니다');
    });
  });
});
