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
      
      console.log('Fetching transactions for user:', user.id);
      
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

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      
      console.log('Fetched transactions:', data);
      return data.map(transaction => ({
        ...transaction,
        receipts: transaction.receipts || []
      })) as (Transaction & { receipts: any[] })[];
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: true, // 윈도우 포커스 시 리페치 활성화
    staleTime: 0, // 데이터를 즉시 새로고침
  });

  const createTransaction = useMutation({
    mutationFn: async (transaction: Omit<TransactionInsert, 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Creating transaction with data:', { ...transaction, user_id: user.id });

      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Transaction created successfully:', data);
      return data;
    },
    onSuccess: () => {
      // createTransactionAsync에서 처리하므로 여기서는 토스트만 표시
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
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
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
      queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
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

  const createTransactionAsync = async (transaction: Omit<TransactionInsert, 'user_id'>) => {
    if (!user?.id) throw new Error('User not authenticated');

    console.log('🚀 Creating transaction directly with Supabase...');
    console.log('📝 Transaction data:', { ...transaction, user_id: user.id });

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log('✅ Transaction created successfully:', data);
    
    // 즉시 현재 캐시된 데이터 확인
    const currentData = queryClient.getQueryData(['transactions', user.id]);
    console.log('📊 Current cached data before update:', currentData);
    
    // 캐시에 직접 새 거래 추가 (즉시 UI 업데이트)
    queryClient.setQueryData(['transactions', user.id], (oldData: any) => {
      if (!oldData) return [data];
      console.log('🔄 Updating cache with new transaction');
      return [data, ...oldData];
    });
    
    console.log('📊 Cache updated directly');
    
    // 백그라운드에서 쿼리 무효화 및 리페치 (데이터 동기화)
    setTimeout(async () => {
      await queryClient.invalidateQueries({ 
        queryKey: ['transactions', user.id] 
      });
      await queryClient.refetchQueries({ 
        queryKey: ['transactions', user.id] 
      });
      console.log('🔄 Background sync completed');
    }, 100);
    
    // 성공 토스트 표시
    toast({
      title: '거래가 등록되었습니다',
      description: '새로운 거래 내역이 성공적으로 추가되었습니다.',
    });
    
    return data;
  };

  const updateTransactionAsync = async ({ id, updates }: { id: string; updates: TransactionUpdate }) => {
    const result = await updateTransaction.mutateAsync({ id, updates });
    // 수동으로 쿼리 무효화
    queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    return result;
  };

  const deleteTransactionAsync = async (id: string) => {
    const result = await deleteTransaction.mutateAsync(id);
    // 수동으로 쿼리 무효화
    queryClient.invalidateQueries({ queryKey: ['transactions', user?.id] });
    return result;
  };

  // 디버깅: 반환되는 데이터 로그
  const transactionsData = transactionsQuery.data || [];
  console.log('📤 useTransactions returning data:', {
    transactions: transactionsData,
    length: transactionsData.length,
    isLoading: transactionsQuery.isLoading,
    isError: transactionsQuery.isError,
    queryStatus: transactionsQuery.status
  });

  return {
    transactions: transactionsData,
    isLoading: transactionsQuery.isLoading,
    isError: transactionsQuery.isError,
    createTransaction: createTransaction.mutate,
    updateTransaction: updateTransaction.mutate,
    deleteTransaction: deleteTransaction.mutate,
    isCreating: createTransaction.isPending,
    isUpdating: updateTransaction.isPending,
    isDeleting: deleteTransaction.isPending,
    createTransactionAsync,
    updateTransactionAsync,
    deleteTransactionAsync,
  };
};