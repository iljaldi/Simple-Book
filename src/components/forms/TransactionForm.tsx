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
      <Tabs value={activeTab} onValueChange={editingTransaction ? undefined : (value) => setActiveTab(value as 'income' | 'expense')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 rounded-lg p-1">
          <TabsTrigger 
            value="income" 
            className={`rounded-md h-10 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 font-medium ${
              editingTransaction && editingTransaction.type !== 'income' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={editingTransaction && editingTransaction.type !== 'income'}
          >
            수입
          </TabsTrigger>
          <TabsTrigger 
            value="expense" 
            className={`rounded-md h-10 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 font-medium ${
              editingTransaction && editingTransaction.type !== 'expense' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={editingTransaction && editingTransaction.type !== 'expense'}
          >
            지출
          </TabsTrigger>
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