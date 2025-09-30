/**
 * 대시보드 테스트용 픽스처 데이터 및 헬퍼 함수
 */

import { Page } from '@playwright/test';
import { scenarios } from '@/fixtures/dashboard';

export interface TestScenario {
  id: string;
  name: string;
  data: any;
}

export const testScenarios: Record<string, TestScenario> = {
  normal: {
    id: 'normal',
    name: '일반 사용자',
    data: scenarios.normal()
  },
  newUser: {
    id: 'new-user',
    name: '신규 사용자',
    data: scenarios.newUser()
  },
  empty: {
    id: 'empty',
    name: '데이터 없음',
    data: scenarios.newUser()
  },
  overConcentration: {
    id: 'over-concentration',
    name: '카테고리 과대집중',
    data: scenarios.overConcentration()
  },
  monthEnd: {
    id: 'month-end',
    name: '월말 D-3',
    data: scenarios.monthEnd()
  },
  highEarning: {
    id: 'high-earning',
    name: '고수익 프리랜서',
    data: scenarios.highEarning()
  },
  lowEarning: {
    id: 'low-earning',
    name: '저수익/손실',
    data: scenarios.lowEarning()
  }
};

/**
 * 페이지에 픽스처 데이터를 주입하는 헬퍼 함수
 */
export async function injectFixtureData(page: Page, scenarioId: string) {
  const scenario = testScenarios[scenarioId];
  if (!scenario) {
    throw new Error(`Unknown scenario: ${scenarioId}`);
  }

  await page.addInitScript((data) => {
    window.__DASHBOARD_FIXTURE__ = data;
  }, scenario.data);
}

/**
 * 특정 시나리오로 대시보드를 로드하는 헬퍼 함수
 */
export async function loadDashboardWithScenario(page: Page, scenarioId: string) {
  await injectFixtureData(page, scenarioId);
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
}

/**
 * 위젯이 올바르게 로드되었는지 확인하는 헬퍼 함수
 */
export async function expectWidgetLoaded(page: Page, widgetId: string) {
  await expect(page.locator(`[data-testid="${widgetId}"]`)).toBeVisible();
}

/**
 * 액션 버튼이 클릭 가능한 상태인지 확인하는 헬퍼 함수
 */
export async function expectActionButtonEnabled(page: Page, widgetId: string) {
  const button = page.locator(`[data-testid="${widgetId}-action-button"]`);
  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
}

/**
 * 빈 상태 메시지가 표시되는지 확인하는 헬퍼 함수
 */
export async function expectEmptyStateMessage(page: Page, widgetId: string, expectedMessage: string) {
  const message = page.locator(`[data-testid="${widgetId}-empty-message"]`);
  await expect(message).toBeVisible();
  await expect(message).toContainText(expectedMessage);
}

/**
 * 경고 메시지가 표시되는지 확인하는 헬퍼 함수
 */
export async function expectWarningMessage(page: Page, widgetId: string, expectedMessage: string) {
  const message = page.locator(`[data-testid="${widgetId}-warning-message"]`);
  await expect(message).toBeVisible();
  await expect(message).toContainText(expectedMessage);
}

/**
 * 모바일 뷰포트로 설정하는 헬퍼 함수
 */
export async function setMobileViewport(page: Page) {
  await page.setViewportSize({ width: 375, height: 667 });
}

/**
 * 태블릿 뷰포트로 설정하는 헬퍼 함수
 */
export async function setTabletViewport(page: Page) {
  await page.setViewportSize({ width: 768, height: 1024 });
}

/**
 * 데스크톱 뷰포트로 설정하는 헬퍼 함수
 */
export async function setDesktopViewport(page: Page) {
  await page.setViewportSize({ width: 1280, height: 720 });
}

/**
 * 키보드 네비게이션을 테스트하는 헬퍼 함수
 */
export async function testKeyboardNavigation(page: Page, selectors: string[]) {
  for (const selector of selectors) {
    await page.keyboard.press('Tab');
    const element = page.locator(selector);
    await expect(element).toBeFocused();
  }
}

/**
 * 접근성 속성을 확인하는 헬퍼 함수
 */
export async function expectAccessibilityAttributes(page: Page, selector: string, attributes: Record<string, string>) {
  const element = page.locator(selector);
  for (const [attr, value] of Object.entries(attributes)) {
    await expect(element).toHaveAttribute(attr, value);
  }
}
