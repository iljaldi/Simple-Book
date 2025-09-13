import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Receipt = Database['public']['Tables']['receipts']['Row'];
type ReceiptInsert = Database['public']['Tables']['receipts']['Insert'];
type ReceiptUpdate = Database['public']['Tables']['receipts']['Update'];

export interface ReceiptWithTransaction extends Receipt {
  transaction: any;
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
      const dbReceipts = data.map(receipt => ({
        ...receipt,
        transaction: receipt.transactions?.[0] || null
      })) as ReceiptWithTransaction[];

      // 더미 데이터 추가 (개발용)
      const dummyReceipts: ReceiptWithTransaction[] = [
        {
          id: 'dummy-1',
          user_id: user.id,
          file_url: '/images/Receipts.png',
          original_filename: 'Fresh_Mart_영수증_20241026.jpg',
          file_size: 1024000,
          mime_type: 'image/jpeg',
          ocr_status: 'done',
          ocr_text: 'FRESH MART\n123 Green Street, Anytown, CA 91234\n(555) 123-667\n2024-10-26 3:45 PM\n\nOrganic Apples 1.50 lb x $2.99/lb = $4.48\nWhole Milk $4.48\nCheddar Cheese $5.79\nPasta $5.99\nBroccoli Florets $1.89\nTomato Sauce $3.29\nChicken Breast $8.50\n\nSUBTOTAL: $30.13\nTAX: $2.41\nTOTAL: $32.54\nCash Paid: $40.00\nCHANGE: $7.46\n\nTHANK YOU FOR SHOPPING WITH US!',
          transaction_id: 'tx-1',
          match_confidence: 0.95,
          uploaded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          transaction: {
            id: 'tx-1',
            description: 'Fresh Mart 장보기',
            amount_gross: 32540,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            category: '식비',
            counterparty_name: 'Fresh Mart'
          }
        },
        {
          id: 'dummy-2',
          user_id: user.id,
          file_url: '/images/Receipts.png',
          original_filename: 'GS25_편의점_영수증.jpg',
          file_size: 856000,
          mime_type: 'image/jpeg',
          ocr_status: 'done',
          ocr_text: 'GS25 편의점\n삼각김밥 2개\n음료수 1개\n총 금액: 8,500원',
          transaction_id: null,
          match_confidence: null,
          uploaded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          transaction: null
        },
        {
          id: 'dummy-3',
          user_id: user.id,
          file_url: '/images/Receipts.png',
          original_filename: '택시비_영수증_20241130.jpg',
          file_size: 1200000,
          mime_type: 'image/jpeg',
          ocr_status: 'pending',
          ocr_text: null,
          transaction_id: null,
          match_confidence: null,
          uploaded_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          transaction: null
        },
        {
          id: 'dummy-4',
          user_id: user.id,
          file_url: '/images/Receipts.png',
          original_filename: '식당_영수증_20241129.jpg',
          file_size: 950000,
          mime_type: 'image/jpeg',
          ocr_status: 'failed',
          ocr_text: null,
          transaction_id: null,
          match_confidence: null,
          uploaded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          transaction: null
        },
        {
          id: 'dummy-5',
          user_id: user.id,
          file_url: '/images/Receipts.png',
          original_filename: '카페_영수증_20241128.jpg',
          file_size: 780000,
          mime_type: 'image/jpeg',
          ocr_status: 'done',
          ocr_text: '카페베네\n라떼 그란데\n크로와상 1개\n총 금액: 12,000원',
          transaction_id: 'tx-2',
          match_confidence: 0.88,
          uploaded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          transaction: {
            id: 'tx-2',
            description: '카페베네 라떼 + 크로와상',
            amount_gross: 12000,
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            category: '식비',
            counterparty_name: '카페베네'
          }
        }
      ];

      return [...dbReceipts, ...dummyReceipts];
    },
    enabled: !!user?.id,
  });

  const getReceiptsByStatus = (status?: string) => {
    const receipts = receiptsQuery.data || [];
    
    if (!status) return receipts;
    
    switch (status) {
      case 'matched':
        return receipts.filter(receipt => receipt.transaction_id);
      case 'needs-matching':
        return receipts.filter(receipt => 
          receipt.ocr_status === 'done' && !receipt.transaction_id
        );
      case 'failed':
        return receipts.filter(receipt => receipt.ocr_status === 'failed');
      case 'pending':
        return receipts.filter(receipt => receipt.ocr_status === 'pending');
      default:
        return receipts;
    }
  };

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
        description: error.message || '영수증 업로드 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Receipt upload error:', error);
    }
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
      toast({
        title: '영수증이 업데이트되었습니다',
        description: '영수증 정보가 성공적으로 수정되었습니다.',
      });
    },
    onError: (error) => {
      toast({
        title: '업데이트 실패',
        description: error.message || '영수증 업데이트 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Receipt update error:', error);
    }
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
        description: error.message || '영수증 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error('Receipt deletion error:', error);
    }
  });

  return {
    receipts: receiptsQuery.data || [],
    isLoading: receiptsQuery.isLoading,
    isError: receiptsQuery.isError,
    getReceiptsByStatus,
    uploadReceipt: uploadReceipt.mutate,
    updateReceipt: updateReceipt.mutate,
    deleteReceipt: deleteReceipt.mutate,
    isUploading: uploadReceipt.isPending,
    isUpdating: updateReceipt.isPending,
    isDeleting: deleteReceipt.isPending,
  };
};