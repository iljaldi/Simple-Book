import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TransactionForm } from '@/components/forms/TransactionForm';

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();

  const handleFormSuccess = () => {
    navigate('/transactions');
  };

  const handleContinueAdding = () => {
    // 폼은 초기화되고 계속 추가할 수 있도록 유지
  };

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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">새 거래 추가</h1>
              <p className="text-gray-600">수입과 지출을 기록하세요</p>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
