
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import { useRef } from 'react';

type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

export type TransactionType = 'income' | 'expense';

export const useCategories = (transactionType?: TransactionType) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const errorShown = useRef(false);

  const categoriesQuery = useQuery({
    queryKey: ['categories', user?.id, transactionType],
    queryFn: async () => {
      if (!user?.id) return [];
      
      let query = supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id);

      if (transactionType) {
        query = query.eq('transaction_type', transactionType);
      }

      const { data, error } = await query.order('sort_order', { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user?.id,
  });

  const createCategory = useMutation({
    mutationFn: async (categoryData: Omit<CategoryInsert, 'user_id'> & { is_default?: boolean }) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Creating category:', categoryData, 'for user:', user.id);

      const { is_default, ...category } = categoryData;

      const { data, error } = await supabase
        .from('categories')
        .insert([{ ...category, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Category creation error:', error);
        throw error;
      }
      return { data, is_default };
    },
    onSuccess: ({ data, is_default }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      console.log('Category created successfully:', data);
      
      // Only show success toast for user-initiated actions (not default categories)
      if (!is_default) {
        toast({
          title: '카테고리가 생성되었습니다',
          description: '새로운 카테고리가 성공적으로 추가되었습니다.',
        });
      }
    },
    onError: (error: any) => {
      console.error('Category creation failed:', error);
      
      // Check if it's a duplicate key error (unique constraint violation)
      const isDuplicateError = error?.code === '23505' || error?.message?.includes('duplicate key');
      
      if (isDuplicateError) {
        console.log('Category already exists, skipping error toast');
        return; // Don't show toast for duplicate categories
      }
      
      // Only show error toast once during initial setup for real errors
      if (!errorShown.current) {
        errorShown.current = true;
        toast({
          title: '카테고리 생성 실패',
          description: '카테고리 생성 중 오류가 발생했습니다. 페이지를 새로고침 해주세요.',
          variant: 'destructive',
        });
        
        // Reset error flag after some time
        setTimeout(() => {
          errorShown.current = false;
        }, 5000);
      }
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Category> }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  // Reset error flag when user changes
  if (!user) {
    errorShown.current = false;
  }

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    createCategory: createCategory.mutate,
    isCreating: createCategory.isPending,
    updateCategory: updateCategory.mutate,
    isUpdating: updateCategory.isPending,
  };
};
