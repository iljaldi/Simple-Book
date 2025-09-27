/**
 * 대시보드 픽스처 데이터 팩토리
 * 시간 이동 및 다양한 시나리오 생성
 */

import { 
  DashboardViewModel, 
  NetProfitViewModel, 
  EstimatedTaxViewModel,
  UnclassifiedViewModel,
  WeeklyTasksViewModel,
  CashFlowViewModel,
  TopExpenseCategoriesViewModel,
  SubscriptionAlertViewModel,
  TaxCalendarViewModel,
  DashboardFilter,
  PeriodFilter,
  BusinessType
} from '@/types/dashboard';
import { CATEGORIES, SUBSCRIPTION_SERVICES, BUSINESS_TAX_RATES, TAX_SCHEDULE } from './constants';

export type BusinessType = 'simple' | 'general' | 'tax_free';

/**
 * 날짜 유틸리티 함수
 */
export class DateUtils {
  static getCurrentDate(): Date {
    return new Date();
  }

  static getMonthStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  static getMonthEnd(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  static getPreviousMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1);
  }

  static getMonthsAgo(date: Date, months: number): Date {
    return new Date(date.getFullYear(), date.getMonth() - months, 1);
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static formatMonth(date: Date): string {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  }

  static getDaysUntilMonthEnd(date: Date): number {
    const monthEnd = this.getMonthEnd(date);
    const today = this.getCurrentDate();
    return Math.max(0, Math.ceil((monthEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }
}

/**
 * 랜덤 데이터 생성 유틸리티
 */
export class RandomUtils {
  static randomChoice<T>(array: readonly T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static randomBoolean(): boolean {
    return Math.random() > 0.5;
  }
}

/**
 * 대시보드 픽스처 데이터 팩토리
 */
export class DashboardFixtureFactory {
  private businessType: BusinessType = 'general';
  private currentDate: Date = DateUtils.getCurrentDate();

  constructor(businessType: BusinessType = 'general', currentDate?: Date) {
    this.businessType = businessType;
    this.currentDate = currentDate || DateUtils.getCurrentDate();
  }

  /**
   * 시간 이동 (이번 달/지난 달/최근 6개월)
   */
  timeShift(period: PeriodFilter): DashboardFixtureFactory {
    const newDate = new Date(this.currentDate);
    
    switch (period) {
      case '이번 달':
        // 현재 월 유지
        break;
      case '지난 달':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case '올해':
        newDate.setMonth(0); // 1월로 설정
        break;
      case '사용자 지정':
        // 기본적으로 현재 월 유지
        break;
    }
    
    return new DashboardFixtureFactory(this.businessType, newDate);
  }

  /**
   * 순이익 위젯 데이터 생성
   */
  createNetProfitData(hasData: boolean = true): NetProfitViewModel {
    if (!hasData) {
      return {
        netProfit: { gross: 0, net: 0, vat: 0, currency: 'KRW' },
        monthOverMonthChange: 0,
        sparklineData: [],
        isEmpty: true,
        emptyMessage: '첫 거래를 추가해보세요',
        actionButtonText: '거래 추가하기'
      };
    }

    const baseAmount = RandomUtils.randomInt(500000, 5000000);
    const monthOverMonthChange = RandomUtils.randomFloat(-20, 30);
    const netProfit = baseAmount + (baseAmount * monthOverMonthChange / 100);

    // 스파크라인 데이터 (최근 12개월)
    const sparklineData = Array.from({ length: 12 }, (_, i) => {
      const monthDate = DateUtils.getMonthsAgo(this.currentDate, 11 - i);
      const variation = RandomUtils.randomFloat(-15, 15);
      const amount = baseAmount + (baseAmount * variation / 100);
      
      return {
        month: DateUtils.formatMonth(monthDate),
        netProfit: Math.max(0, amount)
      };
    });

    return {
      netProfit: { 
        gross: netProfit * 1.1, 
        net: netProfit, 
        vat: netProfit * 0.1, 
        currency: 'KRW' 
      },
      monthOverMonthChange: Math.round(monthOverMonthChange * 10) / 10,
      sparklineData,
      isEmpty: false,
      actionButtonText: '거래내역 보기'
    };
  }

  /**
   * 예상세액 위젯 데이터 생성
   */
  createEstimatedTaxData(hasData: boolean = true): EstimatedTaxViewModel {
    if (!hasData) {
      return {
        vatEstimate: 0,
        incomeTaxEstimate: 0,
        totalTaxEstimate: 0,
        businessType: '사업 유형을 설정해주세요',
        disclaimer: '사업 유형에 따라 세율이 달라집니다',
        isEmpty: true,
        emptyMessage: '사업 유형을 설정해주세요'
      };
    }

    const baseAmount = RandomUtils.randomInt(2000000, 10000000);
    const rates = BUSINESS_TAX_RATES[this.businessType];
    const vatEstimate = Math.round(baseAmount * rates.vat);
    const incomeTaxEstimate = Math.round(baseAmount * rates.incomeTax);
    const totalTaxEstimate = vatEstimate + incomeTaxEstimate;

    const businessTypeNames = {
      simple: '간이과세',
      general: '일반과세',
      tax_free: '면세'
    };

    return {
      vatEstimate,
      incomeTaxEstimate,
      totalTaxEstimate,
      businessType: businessTypeNames[this.businessType],
      disclaimer: '참고용입니다. 정확한 세액은 세무사와 상담하세요.',
      isEmpty: false
    };
  }

  /**
   * 미분류/미증빙 위젯 데이터 생성
   */
  createUnclassifiedData(hasData: boolean = true, hasRepeatingPattern: boolean = false): UnclassifiedViewModel {
    if (!hasData) {
      return {
        unclassifiedCount: 0,
        unreceiptedCount: 0,
        totalPendingCount: 0,
        hasRepeatingPattern: false,
        actionButtonText: '지금 정리'
      };
    }

    const unclassifiedCount = RandomUtils.randomInt(3, 15);
    const unreceiptedCount = RandomUtils.randomInt(2, 12);
    const totalPendingCount = unclassifiedCount + unreceiptedCount;

    return {
      unclassifiedCount,
      unreceiptedCount,
      totalPendingCount,
      hasRepeatingPattern,
      ruleSuggestionMessage: hasRepeatingPattern ? '반복되는 패턴을 발견했습니다. 규칙을 만들어보세요!' : undefined,
      actionButtonText: '지금 정리'
    };
  }

  /**
   * 이번 주 할 일 위젯 데이터 생성
   */
  createWeeklyTasksData(hasData: boolean = true, isMonthEnd: boolean = false): WeeklyTasksViewModel {
    const daysLeft = isMonthEnd ? 3 : DateUtils.getDaysUntilMonthEnd(this.currentDate);
    
    const tasks = [
      {
        id: 'receipt-processing',
        title: '영수증 정리',
        status: 'pending' as const,
        actionUrl: '/receipts'
      },
      {
        id: 'month-end',
        title: '월마감 준비',
        status: daysLeft <= 7 ? 'pending' as const : 'completed' as const,
        dueDate: DateUtils.formatDate(DateUtils.getMonthEnd(this.currentDate))
      },
      {
        id: 'vat-preparation',
        title: '부가세 준비',
        status: RandomUtils.randomChoice(['ready', 'in_progress', 'not_started']) as any
      },
      {
        id: 'income-tax-preparation',
        title: '소득세 준비',
        status: RandomUtils.randomChoice(['ready', 'in_progress', 'not_started']) as any
      }
    ];

    return {
      receiptProcessingCount: hasData ? RandomUtils.randomInt(5, 25) : 0,
      monthEndDaysLeft: daysLeft,
      vatPreparationStatus: tasks.find(t => t.id === 'vat-preparation')?.status || 'not_started',
      incomeTaxPreparationStatus: tasks.find(t => t.id === 'income-tax-preparation')?.status || 'not_started',
      upcomingSubscriptionsCount: hasData ? RandomUtils.randomInt(2, 8) : 0,
      tasks: tasks.map(t => ({
        ...t,
        title: t.id === 'month-end' ? `월마감 D-${daysLeft}` : t.title
      }))
    };
  }

  /**
   * 현금흐름 위젯 데이터 생성 (6개월)
   */
  createCashFlowData(hasData: boolean = true): CashFlowViewModel {
    if (!hasData) {
      return {
        monthlyData: [],
        totalIncome: 0,
        totalExpense: 0,
        totalNetProfit: 0,
        isEmpty: true,
        emptyMessage: '데이터를 축적해보세요'
      };
    }

    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const monthDate = DateUtils.getMonthsAgo(this.currentDate, 5 - i);
      const baseIncome = RandomUtils.randomInt(2000000, 8000000);
      const baseExpense = RandomUtils.randomInt(1000000, 4000000);
      const netProfit = baseIncome - baseExpense;

      return {
        month: DateUtils.formatMonth(monthDate),
        year: monthDate.getFullYear(),
        income: baseIncome,
        expense: baseExpense,
        netProfit
      };
    });

    const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0);
    const totalExpense = monthlyData.reduce((sum, month) => sum + month.expense, 0);
    const totalNetProfit = totalIncome - totalExpense;

    return {
      monthlyData,
      totalIncome,
      totalExpense,
      totalNetProfit,
      isEmpty: false
    };
  }

  /**
   * 지출 Top5 카테고리 위젯 데이터 생성
   */
  createTopExpenseCategoriesData(hasData: boolean = true, hasOverConcentration: boolean = false): TopExpenseCategoriesViewModel {
    if (!hasData) {
      return {
        categories: [],
        totalExpense: 0,
        isEmpty: true,
        emptyMessage: '지출 데이터가 없습니다'
      };
    }

    const categories = CATEGORIES.EXPENSE.slice(0, 5).map((categoryName, index) => {
      let percentage: number;
      
      if (hasOverConcentration && index === 0) {
        // 첫 번째 카테고리가 40% 이상 집중
        percentage = RandomUtils.randomFloat(45, 60);
      } else {
        percentage = RandomUtils.randomFloat(5, 25);
      }

      const amount = RandomUtils.randomInt(100000, 2000000);
      const monthOverMonthChange = RandomUtils.randomFloat(-30, 50);

      return {
        categoryName,
        amount,
        monthOverMonthChange: Math.round(monthOverMonthChange * 10) / 10,
        percentage: Math.round(percentage * 10) / 10,
        isOverConcentrated: percentage > 40
      };
    });

    const totalExpense = categories.reduce((sum, cat) => sum + cat.amount, 0);

    return {
      categories,
      totalExpense,
      isEmpty: false
    };
  }

  /**
   * 정기구독 경고 위젯 데이터 생성
   */
  createSubscriptionAlertData(hasData: boolean = true): SubscriptionAlertViewModel {
    if (!hasData) {
      return {
        upcomingSubscriptions: [],
        totalUpcomingAmount: 0,
        isEmpty: true,
        emptyMessage: '구독 서비스가 없습니다'
      };
    }

    const subscriptionCount = RandomUtils.randomInt(3, 8);
    const upcomingSubscriptions = Array.from({ length: subscriptionCount }, (_, i) => {
      const service = RandomUtils.randomChoice(SUBSCRIPTION_SERVICES);
      const amount = RandomUtils.randomInt(5000, 50000);
      const daysLeft = RandomUtils.randomInt(1, 14);
      const dueDate = new Date(this.currentDate);
      dueDate.setDate(dueDate.getDate() + daysLeft);

      return {
        id: `sub-${i}`,
        name: service,
        amount,
        dueDate: DateUtils.formatDate(dueDate),
        daysLeft,
        status: RandomUtils.randomChoice(['active', 'cancelled', 'paused']) as any,
        memo: RandomUtils.randomBoolean() ? RandomUtils.randomChoice(['해지 예정', '보류', '협상 예정']) : undefined
      };
    });

    const totalUpcomingAmount = upcomingSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);

    return {
      upcomingSubscriptions,
      totalUpcomingAmount,
      isEmpty: false
    };
  }

  /**
   * 세무 캘린더 위젯 데이터 생성
   */
  createTaxCalendarData(hasData: boolean = true, isMonthEnd: boolean = false): TaxCalendarViewModel {
    if (!hasData) {
      return {
        taxSchedule: [],
        overallPreparationRate: 0,
        isEmpty: true,
        emptyMessage: '세무 일정이 없습니다'
      };
    }

    const currentMonth = this.currentDate.getMonth() + 1;
    const currentYear = this.currentDate.getFullYear();

    const taxSchedule = TAX_SCHEDULE.flatMap(schedule => 
      schedule.months.map(month => {
        const dueDate = new Date(currentYear, month - 1, schedule.day);
        const daysLeft = Math.ceil((dueDate.getTime() - this.currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let status: 'upcoming' | 'due_soon' | 'overdue';
        if (daysLeft < 0) status = 'overdue';
        else if (daysLeft <= 7) status = 'due_soon';
        else status = 'upcoming';

        const preparationStatus = RandomUtils.randomChoice(['ready', 'in_progress', 'not_started']) as any;

        return {
          id: `${schedule.name}-${month}`,
          name: schedule.name,
          type: schedule.name.includes('부가세') ? 'vat' as const : 'income_tax' as const,
          dueDate: DateUtils.formatDate(dueDate),
          daysLeft: Math.max(0, daysLeft),
          status,
          preparationStatus
        };
      })
    ).filter(schedule => schedule.daysLeft >= 0 || schedule.status === 'overdue');

    const overallPreparationRate = Math.round(
      taxSchedule.reduce((sum, schedule) => {
        const rate = schedule.preparationStatus === 'ready' ? 100 : 
                    schedule.preparationStatus === 'in_progress' ? 50 : 0;
        return sum + rate;
      }, 0) / Math.max(1, taxSchedule.length)
    );

    const nextDeadline = taxSchedule
      .filter(s => s.status !== 'overdue')
      .sort((a, b) => a.daysLeft - b.daysLeft)[0];

    return {
      taxSchedule,
      overallPreparationRate,
      nextDeadline: nextDeadline ? {
        name: nextDeadline.name,
        dueDate: nextDeadline.dueDate,
        daysLeft: nextDeadline.daysLeft
      } : undefined,
      isEmpty: false
    };
  }

  /**
   * 전체 대시보드 데이터 생성
   */
  createDashboardData(
    filter: DashboardFilter,
    scenario: 'normal' | 'empty' | 'over_concentration' | 'month_end' = 'normal'
  ): DashboardViewModel {
    const hasData = scenario !== 'empty';
    const hasOverConcentration = scenario === 'over_concentration';
    const isMonthEnd = scenario === 'month_end';

    return {
      filter,
      summary: {
        netProfit: this.createNetProfitData(hasData),
        estimatedTax: this.createEstimatedTaxData(hasData)
      },
      tasks: {
        unclassified: this.createUnclassifiedData(hasData, RandomUtils.randomBoolean()),
        weeklyTasks: this.createWeeklyTasksData(hasData, isMonthEnd),
        subscriptionAlert: this.createSubscriptionAlertData(hasData)
      },
      insights: {
        cashFlow: this.createCashFlowData(hasData),
        topExpenseCategories: this.createTopExpenseCategoriesData(hasData, hasOverConcentration),
        taxCalendar: this.createTaxCalendarData(hasData, isMonthEnd)
      },
      lastUpdated: this.currentDate.toISOString(),
      isLoading: false,
      error: undefined
    };
  }
}

/**
 * 편의 함수들
 */
export const createDashboardFixture = (businessType: BusinessType = 'general') => 
  new DashboardFixtureFactory(businessType);

export const createEmptyDashboard = (businessType: BusinessType = 'general') =>
  new DashboardFixtureFactory(businessType).createDashboardData(
    { period: '이번 달' },
    'empty'
  );

export const createOverConcentrationDashboard = (businessType: BusinessType = 'general') =>
  new DashboardFixtureFactory(businessType).createDashboardData(
    { period: '이번 달' },
    'over_concentration'
  );

export const createMonthEndDashboard = (businessType: BusinessType = 'general') =>
  new DashboardFixtureFactory(businessType).createDashboardData(
    { period: '이번 달' },
    'month_end'
  );
