import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactions } from '@/hooks/useTransactions';
import { Edit, Trash2, TrendingUp, TrendingDown, CheckCircle, Clock, Paperclip, AlertTriangle, ArrowUpDown, Receipt } from 'lucide-react';
import { EvidenceTypeIcon } from '@/components/ui/EvidenceTypeIcon';
import { format, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';

interface TransactionListProps {
  searchQuery?: string;
  filters?: {
    dateRange?: DateRange;
    category?: string;
    evidenceType?: string;
    transactionType?: string;
    period?: string;
  };
  onEditTransaction?: (transaction: any) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  searchQuery = '', 
  filters = {},
  onEditTransaction
}) => {
  const { transactions, isLoading, deleteTransaction, updateTransaction, isDeleting } = useTransactions();
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTaxTypeModal, setShowTaxTypeModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newTaxType, setNewTaxType] = useState('');
  const [displayCount, setDisplayCount] = useState(10);
  const navigate = useNavigate();

  // Prepare filtered list consistently across renders
  const baseTransactions = transactions ?? [];

  const filteredTransactions = useMemo(() => {
    let filtered = baseTransactions;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.counterparty_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateRange?.from) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        if (filters.dateRange?.to) {
          return isWithinInterval(transactionDate, {
            start: filters.dateRange.from!,
            end: filters.dateRange.to
          });
        } else {
          return transactionDate >= filters.dateRange.from!;
        }
      });
    }

    // Transaction type filter
    if (filters.transactionType) {
      filtered = filtered.filter(transaction => transaction.type === filters.transactionType);
    }

    // Evidence type filter
    if (filters.evidenceType) {
      filtered = filtered.filter(transaction => transaction.evidence_type === filters.evidenceType);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(transaction =>
        transaction.category?.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    // 정렬 적용
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = (a.amount_gross || 0) - (b.amount_gross || 0);
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [baseTransactions, searchQuery, filters, sortBy, sortOrder]);

  // 요약 정보 계산
  const summary = useMemo(() => {
    const totalCount = filteredTransactions.length;
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount_gross || 0), 0);
    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')  
      .reduce((sum, t) => sum + (t.amount_gross || 0), 0);
    const netAmount = totalIncome - totalExpense;

    return { totalCount, totalIncome, totalExpense, netAmount };
  }, [filteredTransactions]);

  // 다중 선택 핸들러
  const handleSelectTransaction = (transactionId: string, checked: boolean) => {
    if (checked) {
      setSelectedTransactions(prev => [...prev, transactionId]);
    } else {
      setSelectedTransactions(prev => prev.filter(id => id !== transactionId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  // 다중 선택 액션 핸들러들
  const handleBulkCategoryEdit = () => {
    if (selectedTransactions.length === 0) return;
    setNewCategory('');
    setShowCategoryModal(true);
  };

  const handleBulkTaxTypeChange = () => {
    if (selectedTransactions.length === 0) return;
    setNewTaxType('');
    setShowTaxTypeModal(true);
  };

  const handleBulkDelete = async () => {
    if (selectedTransactions.length === 0) return;
    
    const confirmed = window.confirm(`선택한 ${selectedTransactions.length}개 항목을 삭제하시겠습니까?`);
    if (confirmed) {
      try {
        // 선택된 각 거래를 순차적으로 삭제
        for (const transactionId of selectedTransactions) {
          await deleteTransaction(transactionId);
        }
        alert(`${selectedTransactions.length}개 항목이 삭제되었습니다.`);
        setSelectedTransactions([]);
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCategorySubmit = async () => {
    if (newCategory.trim()) {
      try {
        // 선택된 각 거래의 카테고리를 순차적으로 수정
        for (const transactionId of selectedTransactions) {
          await updateTransaction({ 
            id: transactionId, 
            updates: { category: newCategory.trim() } 
          });
        }
        alert(`${selectedTransactions.length}개 항목의 카테고리를 "${newCategory}"로 변경했습니다.`);
        setSelectedTransactions([]);
        setShowCategoryModal(false);
      } catch (error) {
        console.error('카테고리 수정 중 오류 발생:', error);
        alert('카테고리 수정 중 오류가 발생했습니다.');
      }
    }
  };

  const handleTaxTypeSubmit = async () => {
    if (newTaxType.trim()) {
      try {
        // 선택된 각 거래의 세금유형을 순차적으로 수정
        for (const transactionId of selectedTransactions) {
          await updateTransaction({ 
            id: transactionId, 
            updates: { taxation_type: newTaxType } 
          });
        }
        alert(`${selectedTransactions.length}개 항목의 세금유형을 "${newTaxType}"로 변경했습니다.`);
        setSelectedTransactions([]);
        setShowTaxTypeModal(false);
      } catch (error) {
        console.error('세금유형 변경 중 오류 발생:', error);
        alert('세금유형 변경 중 오류가 발생했습니다.');
      }
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  const handleSort = (newSortBy: 'date' | 'amount' | 'category') => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">최근 거래</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && transactions.length === 0) {
    return (
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">최근 거래</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>등록된 거래가 없습니다.</p>
            <p className="text-sm mt-2">첫 번째 거래를 입력해보세요!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">검색 결과</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>검색 조건에 맞는 거래가 없습니다.</p>
            <p className="text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const getCategoryEmoji = (category: string | null) => {
    if (!category) return '💼';
    const emojiMap: Record<string, string> = {
      '식비': '🍔',
      '교통비': '🚗',
      '소프트웨어': '💻',
      '사무용품': '📎',
      '통신비': '📱',
      '임대료': '🏢',
      '광고비': '📢',
      '교육비': '📚',
      '의료비': '🏥',
      '여행비': '✈️',
      '연료비': '⛽',
      '수리비': '🔧',
      '보험료': '🛡️',
      '세금': '💰',
      '기타': '📋',
    };
    
    // Find the best match for category
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (category.includes(key)) return emoji;
    }
    return '💼';
  };

  const getVatStatusBadge = (taxationType: string | null, vatAmount: number) => {
    if (!taxationType) {
      if (vatAmount > 0) return { text: 'VAT 포함', variant: 'secondary' as const };
      return { text: '과세', variant: 'secondary' as const };
    }
    
    const statusMap: Record<string, { text: string; variant: 'secondary' | 'outline' }> = {
      'TAXABLE': { text: 'VAT 포함', variant: 'secondary' },
      'ZERO_RATED': { text: '영세', variant: 'outline' },
      'EXEMPT': { text: '면세', variant: 'outline' },
    };
    
    return statusMap[taxationType] || { text: '과세', variant: 'secondary' };
  };

  const getWithholdingTaxLabel = (incomeWithholding: number, localWithholding: number) => {
    const total = incomeWithholding + localWithholding;
    if (total > 0) {
      const rate = ((total / 100) * 3.3).toFixed(1); // Approximate rate
      return `${rate}% 원천징수`;
    }
    return null;
  };

  // 거래 상태 레이블링 개선
  const getTransactionStatusBadge = (transaction: any) => {
    if (transaction.status === 'confirmed') {
      return { text: '확정', variant: 'default' as const, icon: CheckCircle };
    }
    
    // 임시저장 상태를 사용자 친화적 레이블로 변경
    if (transaction.evidence_type === 'NONE') {
      return { text: '증빙 확인 필요', variant: 'destructive' as const, icon: AlertTriangle };
    }
    
    if (!transaction.category) {
      return { text: '분류 대기', variant: 'secondary' as const, icon: Clock };
    }
    
    // 기본적으로 미확정 상태
    return { text: '확인 필요', variant: 'secondary' as const, icon: Clock };
  };

  // 수정 화면으로 이동
  const handleEditTransaction = (transaction: any) => {
    onEditTransaction?.(transaction);
  };

  // 표시할 거래 목록 (페이지네이션 적용)
  const displayedTransactions = filteredTransactions.slice(0, displayCount);
  const hasMore = filteredTransactions.length > displayCount;

  return (
    <div className="space-y-4">
      {/* 다중 선택 액션 바 */}
      {selectedTransactions.length > 0 && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedTransactions.length}개 항목 선택됨
            </span>
            <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleBulkCategoryEdit}
                  >
                    카테고리 수정
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleBulkTaxTypeChange}
                  >
                    세금유형 변경
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={handleBulkDelete}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          )}

      {/* 거래 리스트 */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">거래 내역</h3>
        <div>
          {/* 전체 선택 체크박스와 요약 정보 */}
          {filteredTransactions.length > 0 && (
            <div className="flex items-center justify-between mb-1 pb-1">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedTransactions.length === displayedTransactions.length && displayedTransactions.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium text-muted-foreground">전체 선택</span>
                <span className="font-medium text-foreground">
                  총 {summary.totalCount}건
                </span>
              </div>
              
              {/* 정렬 옵션 */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value) => handleSort(value as 'date' | 'amount' | 'category')}>
                  <SelectTrigger className="w-32">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="date">날짜순</SelectItem>
                    <SelectItem value="amount">금액순</SelectItem>
                    <SelectItem value="category">카테고리순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-0">
            {displayedTransactions.map((transaction) => {
              const vatStatus = getVatStatusBadge(transaction.taxation_type, transaction.vat_amount);
              const withholdingLabel = getWithholdingTaxLabel(
                transaction.withholding_income_tax || 0, 
                transaction.withholding_local_tax || 0
              );
              const statusBadge = getTransactionStatusBadge(transaction);
              
              return (
                <div
                  key={transaction.id}
                  className="group relative bg-card rounded-lg hover:bg-muted/30 hover:shadow-soft transition-smooth border-b border-gray-100"
                >
                  {/* 선택 체크박스 추가 */}
                  <div className="px-0 py-4">
                    {/* 1행: 체크박스 + 날짜 (왼쪽) */}
                    <div className="flex items-center gap-3 mb-2">
                      <Checkbox
                        checked={selectedTransactions.includes(transaction.id)}
                        onCheckedChange={(checked) => handleSelectTransaction(transaction.id, !!checked)}
                        className="mt-0"
                      />
                      
                      {/* Transaction Date */}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(transaction.date), 'yyyy-MM-dd', { locale: ko })}
                      </div>
                    </div>
                    
                    {/* 2행: 거래처명 + 카테고리 (왼쪽) | 증빙 + 영수증 (오른쪽) */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 ml-6">
                        {/* Counterparty Name */}
                        <h3 className="font-semibold text-foreground">
                          {transaction.counterparty_name || transaction.description || '거래 내역'}
                        </h3>
                        
                        {/* Category */}
                        {transaction.category && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {transaction.category}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Evidence Type + Receipt Status */}
                      <div className="flex items-center space-x-2">
                        {/* Evidence Type */}
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                          <EvidenceTypeIcon type={transaction.evidence_type} className="h-3 w-3" />
                          <span>
                            {transaction.evidence_type === 'TAX_INVOICE' && '세금계산서'}
                            {transaction.evidence_type === 'CARD' && '카드매출'}
                            {transaction.evidence_type === 'CASH_RCPT' && '현금영수증'}
                            {transaction.evidence_type === 'SIMPLE_RCPT' && '간이영수증'}
                            {transaction.evidence_type === 'INVOICE' && '계산서'}
                            {transaction.evidence_type === 'NONE' && '증빙없음'}
                          </span>
                        </div>
                        
                        {/* Receipt Status */}
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                          <Receipt className="h-3 w-3" />
                          <span>
                            {(transaction as any).receipts && (transaction as any).receipts.length > 0 
                              ? `영수증 ${(transaction as any).receipts.length}개`
                              : '영수증 없음'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 3행: 금액 + VAT 상태 (왼쪽) */}
                    <div className="flex items-center space-x-2 mb-2 ml-6">
                      {/* 금액 */}
                      <div className={`font-bold text-lg ${
                        transaction.type === 'income' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount_gross)}
                      </div>
                      
                      {/* VAT Status */}
                      <Badge variant={vatStatus.variant} className="text-xs bg-gray-100 text-gray-700">
                        {vatStatus.text}
                      </Badge>
                    </div>
                    
                    {/* 4행: 상태 (왼쪽) | 액션 버튼 (오른쪽) */}
                    <div className="flex items-center justify-between">
                      {/* Left: 상태 정보 */}
                      <div className="flex items-center space-x-2 ml-6">
                        {/* Review Status */}
                        <Badge 
                          variant={statusBadge.variant}
                          className={`text-xs flex items-center gap-1 ${
                            statusBadge.variant === 'destructive' 
                              ? 'bg-orange-100 text-orange-700 border-orange-200' 
                              : statusBadge.variant === 'default'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <statusBadge.icon className="h-3 w-3" />
                          {statusBadge.text}
                        </Badge>
                      </div>

                      {/* Right: Action Buttons */}
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTransaction(transaction);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTransaction(transaction.id);
                          }}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 더보기 버튼 */}
          {hasMore && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                className="px-6 py-2"
              >
                더보기 ({filteredTransactions.length - displayCount}개 더)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 카테고리 수정 모달 */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">카테고리 수정</h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedTransactions.length}개 항목의 카테고리를 변경합니다.
            </p>
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="새로운 카테고리를 입력하세요"
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCategoryModal(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleCategorySubmit}
                disabled={!newCategory.trim()}
              >
                적용
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 세금유형 변경 모달 */}
      {showTaxTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">세금유형 변경</h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedTransactions.length}개 항목의 세금유형을 변경합니다.
            </p>
            <Select value={newTaxType} onValueChange={setNewTaxType}>
              <SelectTrigger className="mb-4">
                <SelectValue placeholder="세금유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VAT_INCLUDED">VAT 포함</SelectItem>
                <SelectItem value="VAT_EXCLUDED">VAT 제외</SelectItem>
                <SelectItem value="VAT_FREE">VAT 면세</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowTaxTypeModal(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleTaxTypeSubmit}
                disabled={!newTaxType}
              >
                적용
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};