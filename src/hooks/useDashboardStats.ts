import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  monthlyIncome: number;
  monthlyExpenses: number;
  netProfit: number;
  totalTransactions: number;
  unprocessedReceipts: number;
  estimatedTax: number;
  previousMonthNetProfit: number;
  profitChangePercent: number;
  incomeChangePercent: number;
  expenseChangePercent: number;
}

export const useDashboardStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) {
        return {
          monthlyIncome: 0,
          monthlyExpenses: 0,
          netProfit: 0,
          totalTransactions: 0,
          unprocessedReceipts: 0,
          estimatedTax: 0,
          previousMonthNetProfit: 0,
          profitChangePercent: 0,
          incomeChangePercent: 0,
          expenseChangePercent: 0,
        };
      }

      // Get current month's start and end dates
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Get previous month's start and end dates
      const prevStartOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevEndOfMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch monthly transactions
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select('type, amount_gross')
        .eq('user_id', user.id)
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0]);

      if (transactionError) throw transactionError;

      // Calculate monthly income and expenses
      const monthlyIncome = transactions
        ?.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount_gross || 0), 0) || 0;

      const monthlyExpenses = transactions
        ?.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount_gross || 0), 0) || 0;

      // Fetch previous month transactions for comparison
      const { data: prevTransactions, error: prevTransactionError } = await supabase
        .from('transactions')
        .select('type, amount_gross')
        .eq('user_id', user.id)
        .gte('date', prevStartOfMonth.toISOString().split('T')[0])
        .lte('date', prevEndOfMonth.toISOString().split('T')[0]);

      if (prevTransactionError) throw prevTransactionError;

      const prevMonthlyIncome = prevTransactions
        ?.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount_gross || 0), 0) || 0;

      const prevMonthlyExpenses = prevTransactions
        ?.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount_gross || 0), 0) || 0;

      const prevNetProfit = prevMonthlyIncome - prevMonthlyExpenses;
      const currentNetProfit = monthlyIncome - monthlyExpenses;

      // Get total transaction count
      const { count: totalTransactions } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get unprocessed receipts count
      const { count: unprocessedReceipts } = await supabase
        .from('receipts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('transaction_id', null);

      // Calculate estimated tax (simplified: 10% of net profit if positive)
      const estimatedTax = currentNetProfit > 0 ? currentNetProfit * 0.1 : 0;

      // Calculate percentage changes
      const profitChangePercent = prevNetProfit !== 0 ? ((currentNetProfit - prevNetProfit) / Math.abs(prevNetProfit)) * 100 : 0;
      const incomeChangePercent = prevMonthlyIncome !== 0 ? ((monthlyIncome - prevMonthlyIncome) / prevMonthlyIncome) * 100 : 0;
      const expenseChangePercent = prevMonthlyExpenses !== 0 ? ((monthlyExpenses - prevMonthlyExpenses) / prevMonthlyExpenses) * 100 : 0;

      return {
        monthlyIncome,
        monthlyExpenses,
        netProfit: currentNetProfit,
        totalTransactions: totalTransactions || 0,
        unprocessedReceipts: unprocessedReceipts || 0,
        estimatedTax,
        previousMonthNetProfit: prevNetProfit,
        profitChangePercent,
        incomeChangePercent,
        expenseChangePercent,
      };
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false, // 윈도우 포커스 시 리페치 비활성화
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하게 유지
  });
};