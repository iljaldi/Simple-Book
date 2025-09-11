import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { useTransactions } from '@/hooks/useTransactions';

const EditTransaction: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { transactions } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  useEffect(() => {
    if (id && transactions) {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setEditingTransaction(transaction);
      } else {
        // 거래를 찾을 수 없으면 거래 목록으로 리디렉션
        navigate('/transactions');
      }
    }
  }, [id, transactions, navigate]);

  const handleFormSuccess = () => {
    navigate('/transactions');
  };

  const handleContinueAdding = () => {
    // 폼은 초기화되고 계속 추가할 수 있도록 유지
  };

  if (!editingTransaction) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">거래 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4 max-w-7xl">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/transactions')}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">거래 수정</h1>
              <p className="text-gray-600">거래 정보를 수정하세요</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-border/20">
          <div className="p-6">
            <TransactionForm 
              onSuccess={handleFormSuccess}
              onContinueAdding={handleContinueAdding}
              editingTransaction={editingTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTransaction;
