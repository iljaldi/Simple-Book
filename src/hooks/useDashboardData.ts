import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  profit: number;
  tax: number;
  income: number;
  expense: number;
  profitChange: number;
  incomeChange: number;
  expenseChange: number;
}

export interface Transaction {
  id: string;
  company: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  description?: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  day: number;
  category: string;
}

interface UseDashboardDataReturn {
  stats: DashboardStats | null;
  transactions: Transaction[];
  fixedExpenses: FixedExpense[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

export const useDashboardData = (period: string, customYear?: string, customMonth?: string): UseDashboardDataReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { user } = useAuth();

  // 기간에 따른 날짜 범위 계산
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case '이번 달':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case '이전 달':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case '사용자 지정':
        if (customYear && customMonth) {
          startDate = new Date(parseInt(customYear), parseInt(customMonth) - 1, 1);
          endDate = new Date(parseInt(customYear), parseInt(customMonth), 0);
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    return { startDate, endDate };
  }, [period, customYear, customMonth]);

  // 통계 데이터 가져오기
  const fetchStats = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      if (!user) return null;

      // 데이터베이스 테이블이 없을 경우를 대비해 더미 데이터 사용
      console.log('통계 데이터 조회 중... (더미 데이터 사용)');
      
      // 더미 데이터 반환 (실제 구현 시 Supabase 쿼리 사용)
      const income = 5130000;
      const expense = 12000;
      const profit = income - expense;
      const tax = Math.round(profit * 0.1); // 10% 세금 가정

      return {
        profit,
        tax,
        income,
        expense,
        profitChange: 675.5, // 이전 기간 대비 변화율 (실제 계산 필요)
        incomeChange: 632.9,
        expenseChange: -70.0
      };
    } catch (err) {
      console.error('통계 데이터 조회 오류:', err);
      return null;
    }
  }, [user]);

  // 거래 내역 가져오기
  const fetchTransactions = useCallback(async (startDate: Date, endDate: Date) => {
    try {
      if (!user) return [];

      console.log('거래 내역 조회 중... (더미 데이터 사용)');
      
      // 더미 거래 내역 데이터
      return [
        { id: '1', company: '컴팩트 소프트', date: '2025. 8. 31.', amount: 5000000, type: 'income' as const },
        { id: '2', company: '네이버', date: '2025. 8. 31.', amount: 70000, type: 'income' as const },
        { id: '3', company: '카카오페이', date: '2025. 8. 30.', amount: 150000, type: 'income' as const },
        { id: '4', company: '토스', date: '2025. 8. 29.', amount: 80000, type: 'income' as const },
        { id: '5', company: '스타벅스', date: '2025. 8. 28.', amount: 15000, type: 'expense' as const },
        { id: '6', company: '쿠팡', date: '2025. 8. 27.', amount: 45000, type: 'expense' as const },
        { id: '7', company: '배달의민족', date: '2025. 8. 26.', amount: 35000, type: 'expense' as const },
        { id: '8', company: '아임웹', date: '2025. 8. 25.', amount: 60000, type: 'expense' as const }
      ];
    } catch (err) {
      console.error('거래 내역 조회 오류:', err);
      return [];
    }
  }, [user]);

  // 고정 지출 가져오기
  const fetchFixedExpenses = useCallback(async () => {
    try {
      if (!user) return [];

      console.log('고정 지출 조회 중... (더미 데이터 사용)');
      
      // 더미 고정 지출 데이터
      return [
        { id: '1', name: '식비/다과비', amount: 200000, day: 1, category: '식비' },
        { id: '2', name: '교통비', amount: 80000, day: 5, category: '교통' },
        { id: '3', name: '소프트웨어/구독료', amount: 150000, day: 10, category: '소프트웨어' },
        { id: '4', name: '통신비', amount: 120000, day: 15, category: '통신' },
        { id: '5', name: '사무실 임차료/공유오피스', amount: 500000, day: 20, category: '임대료' },
        { id: '6', name: '외주비/프리랜서 비용', amount: 300000, day: 25, category: '외주' },
        { id: '7', name: '수수료', amount: 50000, day: 30, category: '기타' }
      ];
    } catch (err) {
      console.error('고정 지출 조회 오류:', err);
      return [];
    }
  }, [user]);

  // 데이터 새로고침
  const refetch = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { startDate, endDate } = getDateRange();

      const [statsData, transactionsData, fixedExpensesData] = await Promise.all([
        fetchStats(startDate, endDate),
        fetchTransactions(startDate, endDate),
        fetchFixedExpenses()
      ]);

      setStats(statsData);
      setTransactions(transactionsData);
      setFixedExpenses(fixedExpensesData);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('대시보드 데이터 로딩 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [user, getDateRange, fetchStats, fetchTransactions, fetchFixedExpenses]);

  // 초기 데이터 로드 및 기간 변경 시 재로드
  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    stats,
    transactions,
    fixedExpenses,
    loading,
    error,
    lastUpdated,
    refetch
  };
};
