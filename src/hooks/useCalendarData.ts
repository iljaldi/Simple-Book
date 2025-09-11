import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CalendarData {
  date: string;
  income: number;
  expense: number;
  transactionCount: number;
}

export const useCalendarData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['calendar-data', user?.id],
    queryFn: async (): Promise<CalendarData[]> => {
      if (!user?.id) return [];

      // Get current month's data
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const { data: transactions } = await supabase
        .from('transactions')
        .select('date, type, amount_gross')
        .eq('user_id', user.id)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])
        .order('date');

      if (!transactions) return [];

      // Group by date
      const groupedData: { [date: string]: CalendarData } = {};

      transactions.forEach(transaction => {
        const date = transaction.date;
        if (!groupedData[date]) {
          groupedData[date] = {
            date,
            income: 0,
            expense: 0,
            transactionCount: 0,
          };
        }

        groupedData[date].transactionCount += 1;

        if (transaction.type === 'income') {
          groupedData[date].income += transaction.amount_gross || 0;
        } else if (transaction.type === 'expense') {
          groupedData[date].expense += transaction.amount_gross || 0;
        }
      });

      return Object.values(groupedData);
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false, // 윈도우 포커스 시 리페치 비활성화
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하게 유지
  });
};