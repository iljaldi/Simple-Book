/**
 * 대시보드 관련 TypeScript 타입 정의
 * PRD 기반 데이터 계약 및 메트릭 정의
 */

// ============================================================================
// 기본 차원(Dimensions)
// ============================================================================

/** 기간 필터 타입 */
export type PeriodFilter = 
  | '이번 달'
  | '지난 달' 
  | '올해'
  | '사용자 지정';

/** 거래 유형 */
export type TransactionType = 'income' | 'expense';

/** 카테고리 타입 */
export type CategoryType = 
  | '수입' 
  | '지출'
  | '고정비'
  | '변동비'
  | '세금'
  | '기타';

/** 결제 수단 */
export type PaymentMethod = 
  | '현금'
  | '카드'
  | '계좌이체'
  | '간편결제'
  | '기타';

/** 증빙 유형 */
export type ReceiptType = 
  | '영수증'
  | '계산서'
  | '세금계산서'
  | '신용카드전표'
  | '현금영수증'
  | '기타';

/** 과세 구분 */
export type TaxType = 
  | '과세'
  | '비과세'
  | '면세'
  | '영세';

/** 프로젝트/장부 구분 */
export type ProjectType = 
  | '개인사업'
  | '프리랜서'
  | '스튜디오'
  | '기타';

// ============================================================================
// 기본 메트릭(Metrics)
// ============================================================================

/** 금액 정보 */
export interface AmountInfo {
  /** 총액 (gross) */
  gross: number;
  /** 순액 (net) */
  net: number;
  /** 부가세 (VAT) */
  vat: number;
  /** 통화 단위 */
  currency: 'KRW' | 'USD' | 'EUR';
}

/** 건수 정보 */
export interface CountInfo {
  /** 총 건수 */
  total: number;
  /** 수입 건수 */
  income: number;
  /** 지출 건수 */
  expense: number;
}

/** 비교 정보 (전월/전년 대비) */
export interface ComparisonInfo {
  /** 전월 대비 변화율 (%) */
  monthOverMonth: number;
  /** 전년 대비 변화율 (%) */
  yearOverYear: number;
  /** 전월 대비 절대 변화량 */
  monthOverMonthAmount: number;
  /** 전년 대비 절대 변화량 */
  yearOverYearAmount: number;
}

/** 누적 정보 */
export interface CumulativeInfo {
  /** 누적 금액 */
  cumulativeAmount: number;
  /** 누적 건수 */
  cumulativeCount: number;
  /** 시작일 */
  startDate: string;
  /** 종료일 */
  endDate: string;
}

// ============================================================================
// 전역 필터 타입
// ============================================================================

/** 대시보드 전역 필터 */
export interface DashboardFilter {
  /** 기간 필터 */
  period: PeriodFilter;
  /** 사용자 지정 기간 (period가 '사용자 지정'일 때) */
  customPeriod?: {
    startDate: string;
    endDate: string;
  };
  /** 선택된 프로젝트/장부 */
  projectId?: string;
  /** 프로젝트 타입 */
  projectType?: ProjectType;
}

// ============================================================================
// 위젯별 뷰 모델
// ============================================================================

/** 순이익 카드 뷰 모델 */
export interface NetProfitViewModel {
  /** 순이익 금액 */
  netProfit: AmountInfo;
  /** 전월 대비 변화율 */
  monthOverMonthChange: number;
  /** 스파크라인 데이터 (최근 12개월) */
  sparklineData: Array<{
    month: string;
    netProfit: number;
  }>;
  /** 빈 상태 여부 */
  isEmpty: boolean;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
  /** 액션 버튼 텍스트 */
  actionButtonText: string;
}

/** 예상세액 카드 뷰 모델 */
export interface EstimatedTaxViewModel {
  /** 부가세 추정치 */
  vatEstimate: number;
  /** 소득세 추정치 */
  incomeTaxEstimate: number;
  /** 총 예상세액 */
  totalTaxEstimate: number;
  /** 사용자 사업 유형 */
  businessType: string;
  /** 참고용 안내 메시지 */
  disclaimer: string;
  /** 빈 상태 여부 */
  isEmpty: boolean;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
}

/** 미분류/미증빙 카드 뷰 모델 */
export interface UnclassifiedViewModel {
  /** 미분류 거래 건수 */
  unclassifiedCount: number;
  /** 미증빙 거래 건수 */
  unreceiptedCount: number;
  /** 총 처리 필요 건수 */
  totalPendingCount: number;
  /** 반복 패턴 발견 여부 */
  hasRepeatingPattern: boolean;
  /** 규칙 만들기 제안 메시지 */
  ruleSuggestionMessage?: string;
  /** 액션 버튼 텍스트 */
  actionButtonText: string;
}

/** 이번 주 할 일 뷰 모델 */
export interface WeeklyTasksViewModel {
  /** 영수증 정리 건수 */
  receiptProcessingCount: number;
  /** 월마감 D-Day */
  monthEndDaysLeft: number;
  /** 부가세 준비 상태 */
  vatPreparationStatus: 'ready' | 'in_progress' | 'not_started';
  /** 소득세 준비 상태 */
  incomeTaxPreparationStatus: 'ready' | 'in_progress' | 'not_started';
  /** 예정 구독 건수 */
  upcomingSubscriptionsCount: number;
  /** 할 일 목록 */
  tasks: Array<{
    id: string;
    title: string;
    status: 'pending' | 'completed';
    dueDate?: string;
    actionUrl?: string;
  }>;
}

/** 현금흐름 뷰 모델 (6개월) */
export interface CashFlowViewModel {
  /** 월별 현금흐름 데이터 */
  monthlyData: Array<{
    month: string;
    year: number;
    income: number;
    expense: number;
    netProfit: number;
  }>;
  /** 총 수입 */
  totalIncome: number;
  /** 총 지출 */
  totalExpense: number;
  /** 총 순이익 */
  totalNetProfit: number;
  /** 빈 상태 여부 */
  isEmpty: boolean;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
}

/** 지출 Top5 카테고리 뷰 모델 */
export interface TopExpenseCategoriesViewModel {
  /** 카테고리별 지출 데이터 */
  categories: Array<{
    categoryName: string;
    amount: number;
    monthOverMonthChange: number;
    percentage: number;
    isOverConcentrated: boolean; // 40% 이상 집중 시 true
  }>;
  /** 총 지출 금액 */
  totalExpense: number;
  /** 빈 상태 여부 */
  isEmpty: boolean;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
}

/** 정기구독 경고 뷰 모델 */
export interface SubscriptionAlertViewModel {
  /** 14일 내 결제 예정 구독 목록 */
  upcomingSubscriptions: Array<{
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    daysLeft: number;
    status: 'active' | 'cancelled' | 'paused';
    memo?: string;
  }>;
  /** 총 예정 결제 금액 */
  totalUpcomingAmount: number;
  /** 빈 상태 여부 */
  isEmpty: boolean;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
}

/** 세무 캘린더 뷰 모델 */
export interface TaxCalendarViewModel {
  /** 주요 세무 일정 */
  taxSchedule: Array<{
    id: string;
    name: string;
    type: 'vat' | 'income_tax' | 'other';
    dueDate: string;
    daysLeft: number;
    status: 'upcoming' | 'due_soon' | 'overdue';
    preparationStatus: 'ready' | 'in_progress' | 'not_started';
  }>;
  /** 전체 준비도 (0-100) */
  overallPreparationRate: number;
  /** 다음 마감일 */
  nextDeadline?: {
    name: string;
    dueDate: string;
    daysLeft: number;
  };
}

// ============================================================================
// 대시보드 전체 뷰 모델
// ============================================================================

/** 대시보드 전체 뷰 모델 */
export interface DashboardViewModel {
  /** 전역 필터 */
  filter: DashboardFilter;
  /** 요약 영역 위젯들 */
  summary: {
    netProfit: NetProfitViewModel;
    estimatedTax: EstimatedTaxViewModel;
  };
  /** 작업 영역 위젯들 */
  tasks: {
    unclassified: UnclassifiedViewModel;
    weeklyTasks: WeeklyTasksViewModel;
    subscriptionAlert: SubscriptionAlertViewModel;
  };
  /** 인사이트/일정 영역 위젯들 */
  insights: {
    cashFlow: CashFlowViewModel;
    topExpenseCategories: TopExpenseCategoriesViewModel;
    taxCalendar: TaxCalendarViewModel;
  };
  /** 마지막 업데이트 시간 */
  lastUpdated: string;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 상태 */
  error?: string;
}

// ============================================================================
// 유틸리티 타입
// ============================================================================

/** 위젯 액션 타입 */
export type WidgetAction = 
  | 'view_transactions'
  | 'view_receipts'
  | 'add_transaction'
  | 'add_receipt'
  | 'view_reports'
  | 'view_tax_simulation'
  | 'create_rule'
  | 'manage_subscriptions'
  | 'start_tax_wizard';

/** 위젯 상태 타입 */
export type WidgetStatus = 
  | 'loading'
  | 'loaded'
  | 'empty'
  | 'error';

/** 날짜 범위 타입 */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/** 통계 요약 타입 */
export interface StatsSummary {
  /** 총 수입 */
  totalIncome: AmountInfo;
  /** 총 지출 */
  totalExpense: AmountInfo;
  /** 순이익 */
  netProfit: AmountInfo;
  /** 건수 요약 */
  counts: CountInfo;
  /** 비교 정보 */
  comparison: ComparisonInfo;
  /** 누적 정보 */
  cumulative: CumulativeInfo;
}
