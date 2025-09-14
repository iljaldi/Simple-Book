import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    dateRange?: DateRange;
    category?: string;
    evidenceType?: string;
    transactionType?: string;
  }>({});
  const { user } = useAuth();
  useInitialSetup(); // Initialize default categories

  // 더미 데이터 생성 제거 - 실제 데이터만 사용

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
      <Helmet>
        <title>거래내역 - 간편장부 | 프리랜서 1인사업자 수입지출 관리</title>
        <meta name="description" content="프리랜서와 1인사업자를 위한 거래내역 관리. 수입·지출을 체계적으로 기록하고 검색하세요. 영수증 첨부와 카테고리 분류 지원!" />
        <meta name="keywords" content="거래내역, 수입지출관리, 프리랜서, 1인사업자, 간편장부, 영수증관리, 카테고리분류, 장부기록" />
        <meta property="og:title" content="거래내역 - 간편장부 | 프리랜서 1인사업자 수입지출 관리" />
        <meta property="og:description" content="프리랜서와 1인사업자를 위한 거래내역 관리. 수입·지출을 체계적으로 기록하고 검색하세요." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://lovable-project-8e6a730d-izb25a1j8-iljaldis-projects.vercel.app/transactions" />
      </Helmet>
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