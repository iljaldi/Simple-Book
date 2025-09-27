/**
 * 대시보드 시나리오별 픽스처 데이터
 * 다양한 엣지 케이스와 비즈니스 상황 시뮬레이션
 */

import { DashboardViewModel, DashboardFilter, PeriodFilter } from '@/types/dashboard';
import { DashboardFixtureFactory, createDashboardFixture } from './factory';

/**
 * 시나리오별 대시보드 데이터 생성
 */
export class DashboardScenarios {
  private factory: DashboardFixtureFactory;

  constructor(businessType: 'simple' | 'general' | 'tax_free' = 'general') {
    this.factory = createDashboardFixture(businessType);
  }

  /**
   * 신규 사용자 시나리오 (데이터 없음)
   */
  createNewUserScenario(): DashboardViewModel {
    const filter: DashboardFilter = {
      period: '이번 달',
      projectType: '프리랜서'
    };

    return this.factory.createDashboardData(filter, 'empty');
  }

  /**
   * 일반 사용자 시나리오 (정상 데이터)
   */
  createNormalUserScenario(period: PeriodFilter = '이번 달'): DashboardViewModel {
    const filter: DashboardFilter = {
      period,
      projectType: '프리랜서'
    };

    return this.factory.timeShift(period).createDashboardData(filter, 'normal');
  }

  /**
   * 카테고리 과대집중 시나리오 (40% 이상)
   */
  createOverConcentrationScenario(): DashboardViewModel {
    const filter: DashboardFilter = {
      period: '이번 달',
      projectType: '프리랜서'
    };

    return this.factory.createDashboardData(filter, 'over_concentration');
  }

  /**
   * 월말 D-3 시나리오 (마감 임박)
   */
  createMonthEndScenario(): DashboardViewModel {
    const filter: DashboardFilter = {
      period: '이번 달',
      projectType: '프리랜서'
    };

    return this.factory.createDashboardData(filter, 'month_end');
  }

  /**
   * 간이과세 사업자 시나리오
   */
  createSimpleTaxScenario(): DashboardViewModel {
    const factory = createDashboardFixture('simple');
    const filter: DashboardFilter = {
      period: '이번 달',
      projectType: '개인사업'
    };

    return factory.createDashboardData(filter, 'normal');
  }

  /**
   * 일반과세 사업자 시나리오
   */
  createGeneralTaxScenario(): DashboardViewModel {
    const factory = createDashboardFixture('general');
    const filter: DashboardFilter = {
      period: '이번 달',
      projectType: '스튜디오'
    };

    return factory.createDashboardData(filter, 'normal');
  }

  /**
   * 면세 사업자 시나리오
   */
  createTaxFreeScenario(): DashboardViewModel {
    const factory = createDashboardFixture('tax_free');
    const filter: DashboardFilter = {
      period: '이번 달',
      projectType: '개인사업'
    };

    return factory.createDashboardData(filter, 'normal');
  }

  /**
   * 지난 달 데이터 시나리오
   */
  createLastMonthScenario(): DashboardViewModel {
    const filter: DashboardFilter = {
      period: '지난 달',
      projectType: '프리랜서'
    };

    return this.factory.timeShift('지난 달').createDashboardData(filter, 'normal');
  }

  /**
   * 올해 데이터 시나리오
   */
  createYearlyScenario(): DashboardViewModel {
    const filter: DashboardFilter = {
      period: '올해',
      projectType: '프리랜서'
    };

    return this.factory.timeShift('올해').createDashboardData(filter, 'normal');
  }

  /**
   * 사용자 지정 기간 시나리오
   */
  createCustomPeriodScenario(startDate: string, endDate: string): DashboardViewModel {
    const filter: DashboardFilter = {
      period: '사용자 지정',
      customPeriod: { startDate, endDate },
      projectType: '프리랜서'
    };

    return this.factory.createDashboardData(filter, 'normal');
  }

  /**
   * 고수익 프리랜서 시나리오
   */
  createHighEarningScenario(): DashboardViewModel {
    const factory = createDashboardFixture('general');
    const filter: DashboardFilter = {
      period: '이번 달',
      projectType: '스튜디오'
    };

    // 고수익 시나리오를 위한 커스텀 데이터
    const data = factory.createDashboardData(filter, 'normal');
    
    // 수익을 2-3배 증가
    data.summary.netProfit.netProfit.net *= 2.5;
    data.summary.netProfit.netProfit.gross *= 2.5;
    data.summary.netProfit.netProfit.vat *= 2.5;
    data.summary.netProfit.monthOverMonthChange *= 1.5;

    // 현금흐름도 비례 증가
    data.insights.cashFlow.monthlyData.forEach(month => {
      month.income *= 2.5;
      month.expense *= 1.8;
      month.netProfit = month.income - month.expense;
    });

    data.insights.cashFlow.totalIncome *= 2.5;
    data.insights.cashFlow.totalExpense *= 1.8;
    data.insights.cashFlow.totalNetProfit = data.insights.cashFlow.totalIncome - data.insights.cashFlow.totalExpense;

    return data;
  }

  /**
   * 저수익/손실 시나리오
   */
  createLowEarningScenario(): DashboardViewModel {
    const factory = createDashboardFixture('general');
    const filter: DashboardFilter = {
      period: '이번 달',
      projectType: '프리랜서'
    };

    const data = factory.createDashboardData(filter, 'normal');
    
    // 수익을 50% 감소, 지출은 유지
    data.summary.netProfit.netProfit.net *= 0.5;
    data.summary.netProfit.netProfit.gross *= 0.5;
    data.summary.netProfit.netProfit.vat *= 0.5;
    data.summary.netProfit.monthOverMonthChange = -30; // 30% 감소

    // 현금흐름도 비례 조정
    data.insights.cashFlow.monthlyData.forEach(month => {
      month.income *= 0.5;
      month.netProfit = month.income - month.expense;
    });

    data.insights.cashFlow.totalIncome *= 0.5;
    data.insights.cashFlow.totalNetProfit = data.insights.cashFlow.totalIncome - data.insights.cashFlow.totalExpense;

    return data;
  }

  /**
   * 구독 서비스 과다 시나리오
   */
  createSubscriptionHeavyScenario(): DashboardViewModel {
    const factory = createDashboardFixture('general');
    const filter: DashboardFilter = {
      period: '이번 달',
      projectType: '프리랜서'
    };

    const data = factory.createDashboardData(filter, 'normal');
    
    // 구독 서비스를 2배 증가
    const originalSubscriptions = data.tasks.subscriptionAlert.upcomingSubscriptions;
    const additionalSubscriptions = originalSubscriptions.map(sub => ({
      ...sub,
      id: `sub-${Date.now()}-${Math.random()}`,
      amount: sub.amount * 1.5
    }));

    data.tasks.subscriptionAlert.upcomingSubscriptions = [
      ...originalSubscriptions,
      ...additionalSubscriptions
    ];

    data.tasks.subscriptionAlert.totalUpcomingAmount = 
      data.tasks.subscriptionAlert.upcomingSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);

    return data;
  }

  /**
   * 세무 마감 임박 시나리오
   */
  createTaxDeadlineScenario(): DashboardViewModel {
    const factory = createDashboardFixture('general');
    const filter: DashboardFilter = {
      period: '이번 달',
      projectType: '프리랜서'
    };

    const data = factory.createDashboardData(filter, 'normal');
    
    // 세무 일정을 D-3으로 설정
    data.insights.taxCalendar.taxSchedule.forEach(schedule => {
      schedule.daysLeft = 3;
      schedule.status = 'due_soon';
      schedule.preparationStatus = 'in_progress';
    });

    data.insights.taxCalendar.overallPreparationRate = 60;
    data.insights.taxCalendar.nextDeadline = {
      name: '부가세 신고',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysLeft: 3
    };

    return data;
  }
}

/**
 * 편의 함수들
 */
export const createScenario = (businessType: 'simple' | 'general' | 'tax_free' = 'general') => 
  new DashboardScenarios(businessType);

export const scenarios = {
  newUser: () => new DashboardScenarios().createNewUserScenario(),
  normal: (period: PeriodFilter = '이번 달') => new DashboardScenarios().createNormalUserScenario(period),
  overConcentration: () => new DashboardScenarios().createOverConcentrationScenario(),
  monthEnd: () => new DashboardScenarios().createMonthEndScenario(),
  simpleTax: () => new DashboardScenarios().createSimpleTaxScenario(),
  generalTax: () => new DashboardScenarios().createGeneralTaxScenario(),
  taxFree: () => new DashboardScenarios().createTaxFreeScenario(),
  lastMonth: () => new DashboardScenarios().createLastMonthScenario(),
  yearly: () => new DashboardScenarios().createYearlyScenario(),
  highEarning: () => new DashboardScenarios().createHighEarningScenario(),
  lowEarning: () => new DashboardScenarios().createLowEarningScenario(),
  subscriptionHeavy: () => new DashboardScenarios().createSubscriptionHeavyScenario(),
  taxDeadline: () => new DashboardScenarios().createTaxDeadlineScenario()
};
