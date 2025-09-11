import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Receipt = Database['public']['Tables']['receipts']['Row'];
type ReceiptInsert = Database['public']['Tables']['receipts']['Insert'];
type ReceiptUpdate = Database['public']['Tables']['receipts']['Update'];
type Transaction = Database['public']['Tables']['transactions']['Row'];

export interface ReceiptWithTransaction extends Receipt {
  transaction?: Transaction;
}

export const useReceipts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const receiptsQuery = useQuery({
    queryKey: ['receipts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('receipts')
        .select(`
          *,
          transactions (*)
        `)
        .eq('user_id', user.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data.map(receipt => ({
        ...receipt,
        transaction: receipt.transactions?.[0] || null
      })) as ReceiptWithTransaction[];
    },
    enabled: !!user?.id,
  });

  const uploadReceipt = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

      // Create receipt record
      const { data, error } = await supabase
        .from('receipts')
        .insert([{
          user_id: user.id,
          file_url: publicUrl,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          ocr_status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast({
        title: '영수증이 업로드되었습니다',
        description: 'OCR 처리가 진행 중입니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '업로드 실패',
        description: '영수증 업로드 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Receipt upload error:', error);
    },
  });

  const updateReceipt = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ReceiptUpdate }) => {
      const { data, error } = await supabase
        .from('receipts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
    },
    onError: (error) => {
      toast({
        title: '수정 실패',
        description: '영수증 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Receipt update error:', error);
    },
  });

  const linkToTransaction = useMutation({
    mutationFn: async ({ receiptId, transactionId }: { receiptId: string; transactionId: string }) => {
      const { data, error } = await supabase
        .from('receipts')
        .update({ 
          transaction_id: transactionId,
          match_confidence: 1.0 // Manual match = 100% confidence
        })
        .eq('id', receiptId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: '연결 완료',
        description: '영수증이 거래에 성공적으로 연결되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '연결 실패',
        description: '영수증 연결 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Receipt link error:', error);
    },
  });

  const deleteReceipt = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('receipts')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      toast({
        title: '영수증이 삭제되었습니다',
        description: '영수증이 성공적으로 삭제되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '삭제 실패',
        description: '영수증 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Receipt deletion error:', error);
    },
  });

  // Get receipts by status
  const getReceiptsByStatus = (status?: string) => {
    if (!status) return receiptsQuery.data || [];
    
    return (receiptsQuery.data || []).filter(receipt => {
      switch (status) {
        case 'matched':
          return receipt.transaction_id;
        case 'needs-matching':
          return !receipt.transaction_id && receipt.ocr_status === 'done';
        case 'failed':
          return receipt.ocr_status === 'failed';
        case 'pending':
          return receipt.ocr_status === 'pending';
        default:
          return true;
      }
    });
  };

  return {
    receipts: receiptsQuery.data || [],
    isLoading: receiptsQuery.isLoading,
    isError: receiptsQuery.isError,
    getReceiptsByStatus,
    uploadReceipt: uploadReceipt.mutate,
    updateReceipt: updateReceipt.mutate,
    linkToTransaction: linkToTransaction.mutate,
    deleteReceipt: deleteReceipt.mutate,
    isUploading: uploadReceipt.isPending,
    isUpdating: updateReceipt.isPending,
    isLinking: linkToTransaction.isPending,
    isDeleting: deleteReceipt.isPending,
  };
};