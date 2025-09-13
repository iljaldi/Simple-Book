import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Lightbulb } from 'lucide-react';
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">새 거래 추가</h1>
            <p className="text-gray-600">수입과 지출을 기록하세요</p>
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
                <CardTitle className="text-gray-900">
                  거래 정보 입력
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <TransactionForm 
                  onSuccess={handleFormSuccess}
                  onContinueAdding={handleContinueAdding}
                />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Tips */}
          <div className="space-y-6">

            {/* Tips */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  팁
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">카테고리 분류</p>
                      <p>수입과 지출을 명확히 구분하여 기록하세요</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">세금 계산</p>
                      <p>부가세 포함 여부를 정확히 표시하세요</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">영수증 첨부</p>
                      <p>증빙 자료를 함께 보관하세요</p>
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

export default AddTransaction;
