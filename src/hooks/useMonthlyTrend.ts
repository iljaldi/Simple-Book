import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MonthlyTrendData {
  month: string;
  income: number;
  expense: number;
  profit: number;
}

export const useMonthlyTrend = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['monthly-trend', user?.id],
    queryFn: async (): Promise<MonthlyTrendData[]> => {
      if (!user?.id) return [];

      // Get last 6 months data
      const months: MonthlyTrendData[] = [];
      const now = new Date();

      for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

        const { data: transactions } = await supabase
          .from('transactions')
          .select('type, amount_gross')
          .eq('user_id', user.id)
          .gte('date', startOfMonth.toISOString().split('T')[0])
          .lte('date', endOfMonth.toISOString().split('T')[0]);

        const income = transactions
          ?.filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (t.amount_gross || 0), 0) || 0;

        const expense = transactions
          ?.filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (t.amount_gross || 0), 0) || 0;

        months.push({
          month: targetDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' }),
          income,
          expense,
          profit: income - expense,
        });
      }

      return months;
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false, // 윈도우 포커스 시 리페치 비활성화
    staleTime: 10 * 60 * 1000, // 10분간 데이터를 신선하게 유지
  });
};