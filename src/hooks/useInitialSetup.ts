
import { useEffect, useRef } from 'react';
import { useCategories } from './useCategories';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_EXPENSE_CATEGORIES = [
  // 자주 사용하는 카테고리 상단 배치
  { name: '교통비', is_deductible: true, sort_order: 1, transaction_type: 'expense' as const },
  { name: '식비/다과비', is_deductible: true, sort_order: 2, transaction_type: 'expense' as const },
  { name: '소프트웨어/구독료', is_deductible: true, sort_order: 3, transaction_type: 'expense' as const },
  { name: '장비 구입비', is_deductible: true, sort_order: 4, transaction_type: 'expense' as const },
  
  // 업무 운영비
  { name: '통신비', is_deductible: true, sort_order: 5, transaction_type: 'expense' as const },
  { name: '사무실 임차료/공유오피스', is_deductible: true, sort_order: 6, transaction_type: 'expense' as const },
  { name: '인쇄/복사/우편', is_deductible: true, sort_order: 7, transaction_type: 'expense' as const },
  
  // 활동 직접 비용
  { name: '재료비/소모품', is_deductible: true, sort_order: 8, transaction_type: 'expense' as const },
  { name: '외주비/프리랜서 비용', is_deductible: true, sort_order: 9, transaction_type: 'expense' as const },
  { name: '콘텐츠 제작비', is_deductible: true, sort_order: 10, transaction_type: 'expense' as const },
  
  // 금융·세무비
  { name: '수수료', is_deductible: true, sort_order: 11, transaction_type: 'expense' as const },
  { name: '세무/회계 서비스', is_deductible: true, sort_order: 12, transaction_type: 'expense' as const },
  
  // 교육·자기계발
  { name: '교육비/세미나', is_deductible: true, sort_order: 13, transaction_type: 'expense' as const },
  { name: '도서 구입비', is_deductible: true, sort_order: 14, transaction_type: 'expense' as const },
  
  // 접대비
  { name: '접대비', is_deductible: true, sort_order: 15, transaction_type: 'expense' as const },
  
  // 기타 (항상 마지막)
  { name: '기타', is_deductible: true, sort_order: 99, transaction_type: 'expense' as const },
];

const DEFAULT_INCOME_CATEGORIES = [
  { name: '프로젝트 매출', is_deductible: false, sort_order: 1, transaction_type: 'income' as const },
  { name: '컨설팅/강의료', is_deductible: false, sort_order: 2, transaction_type: 'income' as const },
  { name: '저작권·인세 수입', is_deductible: false, sort_order: 3, transaction_type: 'income' as const },
  { name: '플랫폼 매출(국내)', is_deductible: false, sort_order: 4, transaction_type: 'income' as const },
  { name: '플랫폼 매출(해외)', is_deductible: false, sort_order: 5, transaction_type: 'income' as const },
  { name: '광고/스폰서 수입', is_deductible: false, sort_order: 6, transaction_type: 'income' as const },
  { name: '기타 수입', is_deductible: false, sort_order: 7, transaction_type: 'income' as const },
  { name: '보조금/지원금', is_deductible: false, sort_order: 8, transaction_type: 'income' as const },
];

export const useInitialSetup = () => {
  const { user } = useAuth();
  const { categories, createCategory, updateCategory, isLoading } = useCategories();
  const setupAttempted = useRef(false);
  const setupCompleted = useRef(false);
  const migrationAttempted = useRef(false);

  useEffect(() => {
    const setupCategories = async () => {
      // Wait for categories to load completely
      if (isLoading) {
        console.log('Categories still loading, waiting...');
        return;
      }

      // Only run setup if user is logged in and hasn't already attempted setup
      if (!user || setupAttempted.current || setupCompleted.current) {
        return;
      }

      console.log('Checking category setup for user:', user.id, 'Total categories:', categories.length);

      // Check if we have categories of each type
      const expenseCategories = categories.filter(cat => cat.transaction_type === 'expense');
      const incomeCategories = categories.filter(cat => cat.transaction_type === 'income');
      
      console.log('Expense categories found:', expenseCategories.length, 'Income categories found:', incomeCategories.length);
      

      setupAttempted.current = true;
      console.log('Starting initial category setup for user:', user.id);

      // Small delay to ensure user profile is created
      setTimeout(async () => {
        try {
          // Handle migration for existing users with categories
          if (expenseCategories.length > 0 && !migrationAttempted.current) {
            console.log('Running category migration for existing user...');
            migrationAttempted.current = true;
            
            // Update existing category names
            const categoryNameUpdates = [
              { oldName: '식비', newName: '식비/다과비' },
              { oldName: '임대료', newName: '사무실 임차료/공유오피스' }
            ];
            
            for (const update of categoryNameUpdates) {
              const existingCategory = expenseCategories.find(cat => cat.name === update.oldName);
              if (existingCategory) {
                console.log(`Updating category: ${update.oldName} → ${update.newName}`);
                updateCategory({ 
                  id: existingCategory.id, 
                  updates: { name: update.newName } 
                });
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }
            
            // Add missing new categories
            for (const category of DEFAULT_EXPENSE_CATEGORIES) {
              const existingCategory = categories.find(cat => 
                cat.name === category.name && cat.transaction_type === category.transaction_type
              );
              
              if (!existingCategory) {
                console.log('Adding new expense category:', category.name);
                createCategory({ ...category, is_default: true });
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            }
            
            // Update sort orders for deprecated categories (move to bottom)
            const deprecatedCategories = ['사무용품', '마케팅비', '개인경비'];
            let bottomSortOrder = 80;
            
            for (const deprecatedName of deprecatedCategories) {
              const deprecatedCategory = expenseCategories.find(cat => cat.name === deprecatedName);
              if (deprecatedCategory) {
                console.log(`Moving deprecated category to bottom: ${deprecatedName}`);
                updateCategory({ 
                  id: deprecatedCategory.id, 
                  updates: { sort_order: bottomSortOrder++ } 
                });
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }
          }
          // Create categories for completely new users
          else if (expenseCategories.length === 0) {
            console.log('Creating default expense categories for new user...');
            for (const category of DEFAULT_EXPENSE_CATEGORIES) {
              const existingCategory = categories.find(cat => 
                cat.name === category.name && cat.transaction_type === category.transaction_type
              );
              
              if (!existingCategory) {
                console.log('Creating expense category:', category.name);
                createCategory({ ...category, is_default: true });
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            }
          }

          // Ensure default income categories exist (add only missing)
          console.log('Ensuring default income categories exist...');
          for (const category of DEFAULT_INCOME_CATEGORIES) {
            const existingCategory = categories.find(cat => 
              cat.name === category.name && cat.transaction_type === category.transaction_type
            );
            
            if (!existingCategory) {
              console.log('Creating income category:', category.name);
              createCategory({ ...category, is_default: true });
              await new Promise(resolve => setTimeout(resolve, 50));
            }
          }

          setupCompleted.current = true;
          console.log('Setup and migration completed successfully');
          
        } catch (error) {
          console.error('Error during setup/migration:', error);
          setupAttempted.current = false;
          migrationAttempted.current = false; // Allow retry on error
        }
      }, 200);
    };

    setupCategories();
  }, [user, categories, createCategory, updateCategory, isLoading]);

  // Reset setup flags when user changes
  useEffect(() => {
    if (!user) {
      setupAttempted.current = false;
      setupCompleted.current = false;
      migrationAttempted.current = false;
    }
  }, [user]);

  return { 
    isSetupComplete: categories.length > 0,
    setupAttempted: setupAttempted.current,
    setupCompleted: setupCompleted.current
  };
};
