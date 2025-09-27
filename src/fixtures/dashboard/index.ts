/**
 * 대시보드 픽스처 데이터 진입점
 * 모든 픽스처 데이터와 시나리오를 통합하여 제공
 */

export * from './constants';
export * from './factory';
export * from './scenarios';

// 편의 함수들
export { 
  createDashboardFixture, 
  createEmptyDashboard, 
  createOverConcentrationDashboard, 
  createMonthEndDashboard 
} from './factory';

export { 
  createScenario, 
  scenarios 
} from './scenarios';

// 기본 시나리오 데이터 내보내기
import { scenarios } from './scenarios';

export const defaultScenarios = {
  // 기본 시나리오들
  newUser: scenarios.newUser(),
  normal: scenarios.normal(),
  overConcentration: scenarios.overConcentration(),
  monthEnd: scenarios.monthEnd(),
  
  // 사업 유형별 시나리오
  simpleTax: scenarios.simpleTax(),
  generalTax: scenarios.generalTax(),
  taxFree: scenarios.taxFree(),
  
  // 기간별 시나리오
  lastMonth: scenarios.lastMonth(),
  yearly: scenarios.yearly(),
  
  // 특수 상황 시나리오
  highEarning: scenarios.highEarning(),
  lowEarning: scenarios.lowEarning(),
  subscriptionHeavy: scenarios.subscriptionHeavy(),
  taxDeadline: scenarios.taxDeadline()
};
