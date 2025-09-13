import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Plus, Minus } from 'lucide-react';
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">거래 수정</h1>
            <p className="text-gray-600">거래 정보를 수정하세요</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/transactions')}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            거래내역 돌아가기
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Transaction Form */}
          <div className="lg:col-span-3">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Edit className="h-4 w-4 text-blue-600" />
                  </div>
                  거래 정보 수정
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <TransactionForm 
                  onSuccess={handleFormSuccess}
                  onContinueAdding={handleContinueAdding}
                  editingTransaction={editingTransaction}
                />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">빠른 액션</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-12"
                    onClick={() => navigate('/add-transaction')}
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">새 수입 추가</div>
                      <div className="text-sm text-gray-500">새로운 수입 거래</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-12"
                    onClick={() => navigate('/add-transaction')}
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Minus className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">새 지출 추가</div>
                      <div className="text-sm text-gray-500">새로운 지출 거래</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">💡 수정 팁</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">수정 시 주의사항</p>
                      <p>기존 거래의 세금 계산이 변경될 수 있습니다</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">영수증 첨부</p>
                      <p>수정 후 영수증을 다시 확인하세요</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">카테고리 변경</p>
                      <p>카테고리 변경 시 세금 처리도 확인하세요</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTransaction;
