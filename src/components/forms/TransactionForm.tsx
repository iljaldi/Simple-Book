import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { SimpleIncomeForm } from './SimpleIncomeForm';
import { SimpleExpenseForm } from './SimpleExpenseForm';

interface TransactionFormProps {
  onSuccess: () => void;
  onContinueAdding?: () => void;
  editingTransaction?: any;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ 
  onSuccess, 
  onContinueAdding,
  editingTransaction
}) => {
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>(
    editingTransaction ? editingTransaction.type : 'income'
  );

  const handleSuccess = () => {
    onSuccess();
  };

  const handleContinueAdding = () => {
    onContinueAdding?.();
  };

  return (
    <div className="w-full space-y-4">
      {/* 사용 가이드 */}
      <Alert className="border-primary/20 bg-primary/5">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm text-muted-foreground">
          필수 정보만 입력해도 거래를 저장할 수 있습니다. 
          추가 옵션은 "상세 정보" 섹션에서 설정하세요.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'income' | 'expense')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="income">수입</TabsTrigger>
          <TabsTrigger value="expense">지출</TabsTrigger>
        </TabsList>
        
        <TabsContent value="income" className="mt-6">
          <SimpleIncomeForm 
            onSuccess={handleSuccess}
            onContinueAdding={editingTransaction ? undefined : handleContinueAdding}
            initialData={editingTransaction?.type === 'income' ? editingTransaction : undefined}
          />
        </TabsContent>
        
        <TabsContent value="expense" className="mt-6">
          <SimpleExpenseForm 
            onSuccess={handleSuccess}
            onContinueAdding={editingTransaction ? undefined : handleContinueAdding}
            initialData={editingTransaction?.type === 'expense' ? editingTransaction : undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};