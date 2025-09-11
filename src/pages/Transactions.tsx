import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TransactionList } from '@/components/lists/TransactionList';
import { SearchFilterBar } from '@/components/ui/SearchFilterBar';
import { useInitialSetup } from '@/hooks/useInitialSetup';
import { useAuth } from '@/contexts/AuthContext';
import { generateDummyTransactions } from '@/utils/dummyData';
import { DateRange } from 'react-day-picker';

const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    dateRange?: DateRange;
    category?: string;
    evidenceType?: string;
    transactionType?: string;
  }>({});
  const { user } = useAuth();
  useInitialSetup(); // Initialize default categories

  // 컴포넌트 마운트 시 더미 데이터 자동 생성 (기존 데이터 삭제 후 새로 생성)
  useEffect(() => {
    const generateData = async () => {
      if (user?.id) {
        console.log('Transactions 컴포넌트에서 더미 데이터 생성 시도 - 사용자 ID:', user.id);
        try {
          await generateDummyTransactions(user.id);
          console.log('Transactions 컴포넌트에서 더미 데이터 생성 완료');
        } catch (error) {
          console.error('Transactions 컴포넌트에서 더미 데이터 생성 실패:', error);
        }
      } else {
        console.log('사용자 ID가 없어서 더미 데이터를 생성하지 않습니다.');
      }
    };

    generateData();
  }, [user?.id]);

  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
  };

  const handleFilterChange = (newFilters: {
    dateRange?: DateRange;
    category?: string;
    evidenceType?: string;
    transactionType?: string;
    period?: string;
  }) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({});
  };

  const handleEditTransaction = (transaction: any) => {
    navigate(`/transactions/edit/${transaction.id}`);
  };

  const handleAddTransaction = () => {
    navigate('/transactions/add');
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4 max-w-7xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">거래 관리</h1>
              <p className="text-gray-600">수입과 지출을 기록하고 관리하세요</p>
            </div>
            
            {/* Desktop Add Button */}
            <div className="flex items-center gap-2">
            <Button
             onClick={handleAddTransaction}
             className="bg-black text-white hover:bg-gray-800 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
              <Plus className="h-4 w-4 mr-2" />
              새 거래 추가
            </Button>
            </div>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="mb-4">
            <SearchFilterBar
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl pb-24 sm:pb-6">
        <TransactionList 
          searchQuery={searchQuery}
          filters={filters}
          onEditTransaction={handleEditTransaction}
        />
      </div>

      {/* Mobile Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow z-50 transition-bounce hover:scale-110 sm:hidden gradient-primary"
        onClick={handleAddTransaction}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Transactions;