import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export const useTransactions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const transactionsQuery = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          receipts (
            id,
            file_url,
            original_filename,
            ocr_status
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data.map(transaction => ({
        ...transaction,
        receipts: transaction.receipts || []
      })) as (Transaction & { receipts: any[] })[];
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false, // 윈도우 포커스 시 리페치 비활성화
    staleTime: 2 * 60 * 1000, // 2분간 데이터를 신선하게 유지
  });

  const createTransaction = useMutation({
    mutationFn: async (transaction: Omit<TransactionInsert, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: '거래가 등록되었습니다',
        description: '새로운 거래 내역이 성공적으로 추가되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '거래 등록 실패',
        description: '거래 등록 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Transaction creation error:', error);
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: TransactionUpdate }) => {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: '거래가 수정되었습니다',
        description: '거래 내역이 성공적으로 업데이트되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '거래 수정 실패',
        description: '거래 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Transaction update error:', error);
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: '거래가 삭제되었습니다',
        description: '거래 내역이 성공적으로 삭제되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '거래 삭제 실패',
        description: '거래 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Transaction deletion error:', error);
    },
  });

  return {
    transactions: transactionsQuery.data || [],
    isLoading: transactionsQuery.isLoading,
    isError: transactionsQuery.isError,
    createTransaction: createTransaction.mutate,
    updateTransaction: updateTransaction.mutate,
    deleteTransaction: deleteTransaction.mutate,
    isCreating: createTransaction.isPending,
    isUpdating: updateTransaction.isPending,
    isDeleting: deleteTransaction.isPending,
  };
};