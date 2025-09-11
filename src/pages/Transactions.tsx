import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Plus, Search } from 'lucide-react';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { TransactionList } from '@/components/lists/TransactionList';
import { SearchFilterBar } from '@/components/ui/SearchFilterBar';
import { useInitialSetup } from '@/hooks/useInitialSetup';
import { DateRange } from 'react-day-picker';

const Transactions: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    dateRange?: DateRange;
    category?: string;
    evidenceType?: string;
    transactionType?: string;
  }>({});
  
  useInitialSetup(); // Initialize default categories

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

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleContinueAdding = () => {
    // 폼은 열린 상태로 유지하고, 폼 내부에서 초기화 처리
    // 성공 메시지는 각 폼에서 처리
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
             onClick={() => setShowForm(true)}
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
        onClick={() => setShowForm(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Transaction Form Drawer */}
      <Drawer open={showForm} onOpenChange={setShowForm}>
        <DrawerContent className="max-h-[90vh] sm:max-h-[85vh]">
          <DrawerHeader className="text-center border-b border-border/20 pb-4">
            <DrawerTitle className="text-xl font-bold text-foreground">
              {editingTransaction ? '거래 수정' : '새 거래 추가'}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 sm:px-6 pb-4 overflow-y-auto">
            <TransactionForm 
              onSuccess={handleFormSuccess}
              onContinueAdding={() => setShowForm(true)}
              editingTransaction={editingTransaction}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Transactions;