import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
  const { transactions, isLoading, deleteTransaction, isDeleting } = useTransactions();
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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

  if (transactions.length === 0) {
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

  return (
    <div className="space-y-4">
      {/* 요약 정보 및 컨트롤 바 */}
      <Card className="shadow-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium text-foreground">
                총 {summary.totalCount}건
              </span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">
                  +{formatCurrency(summary.totalIncome)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-red-600 font-medium">
                  -{formatCurrency(summary.totalExpense)}
                </span>
              </div>
              <span className={`font-bold ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                순액: {summary.netAmount >= 0 ? '+' : ''}{formatCurrency(summary.netAmount)}
              </span>
            </div>
            
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

          {/* 다중 선택 액션 바 */}
          {selectedTransactions.length > 0 && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {selectedTransactions.length}개 항목 선택됨
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">카테고리 수정</Button>
                  <Button size="sm" variant="outline">세금유형 변경</Button>
                  <Button size="sm" variant="destructive">삭제</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 거래 리스트 */}
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">거래 내역</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 전체 선택 체크박스 */}
          {filteredTransactions.length > 0 && (
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/20">
              <Checkbox
                checked={selectedTransactions.length === filteredTransactions.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium text-muted-foreground">전체 선택</span>
            </div>
          )}

          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const vatStatus = getVatStatusBadge(transaction.taxation_type, transaction.vat_amount);
              const withholdingLabel = getWithholdingTaxLabel(
                transaction.withholding_income_tax || 0, 
                transaction.withholding_local_tax || 0
              );
              const statusBadge = getTransactionStatusBadge(transaction);
              
              return (
                <div
                  key={transaction.id}
                  className="group relative bg-card border border-border rounded-lg hover:bg-muted/30 hover:shadow-soft transition-smooth"
                >
                  {/* 선택 체크박스 추가 */}
                  <div className="flex items-start gap-3 p-4">
                    <Checkbox
                      checked={selectedTransactions.includes(transaction.id)}
                      onCheckedChange={(checked) => handleSelectTransaction(transaction.id, !!checked)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        {/* Left Section: 날짜, 거래처명, 카테고리 + 프로젝트 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            {/* Category Emoji */}
                            <span className="text-lg flex-shrink-0">
                              {getCategoryEmoji(transaction.category)}
                            </span>
                            
                            <div className="flex-1 min-w-0">
                              {/* Transaction Date */}
                              <div className="text-xs text-muted-foreground mb-1">
                                {format(new Date(transaction.date), 'yyyy-MM-dd', { locale: ko })}
                              </div>
                              
                              {/* Counterparty Name */}
                              <h3 className="font-semibold text-foreground truncate mb-1">
                                {transaction.counterparty_name || transaction.description || '거래 내역'}
                              </h3>
                              
                              {/* Category + Project */}
                              <div className="flex items-center space-x-2">
                                {transaction.category && (
                                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                    {transaction.category}
                                  </Badge>
                                )}
                                {transaction.project && (
                                  <Badge variant="outline" className="text-xs border-accent text-accent-foreground">
                                    [{transaction.project}]
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Section: 금액 + 부가세 상태, 사업용 비율 */}
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className={`font-bold text-lg mb-1 ${
                            transaction.type === 'income' 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount_gross)}
                          </div>
                          
                          {/* VAT Status */}
                          <div className="mb-1">
                            <Badge variant={vatStatus.variant} className="text-xs">
                              {vatStatus.text}
                            </Badge>
                          </div>
                          
                          {/* Business Use Ratio (for expenses only) */}
                          {transaction.type === 'expense' && transaction.business_use_ratio && transaction.business_use_ratio < 1 && (
                            <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                              사업용 {Math.round(transaction.business_use_ratio * 100)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: 증빙 아이콘 + 상태 */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center justify-between">
                      {/* Left: Evidence + Receipt Status */}
                      <div className="flex items-center space-x-4">
                        {/* Evidence Type */}
                        <div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded">
                          <EvidenceTypeIcon type={transaction.evidence_type} className="h-4 w-4" />
                          <span className="text-xs text-muted-foreground">
                            {transaction.evidence_type === 'TAX_INVOICE' && '세금계산서'}
                            {transaction.evidence_type === 'CARD' && '카드매출'}
                            {transaction.evidence_type === 'CASH_RCPT' && '현금영수증'}
                            {transaction.evidence_type === 'SIMPLE_RCPT' && '간이영수증'}
                            {transaction.evidence_type === 'INVOICE' && '계산서'}
                            {transaction.evidence_type === 'NONE' && '증빙없음'}
                          </span>
                        </div>
                        
                        {/* Receipt Attachment Status */}
                        {(transaction as any).receipts && (transaction as any).receipts.length > 0 ? (
                          <div className="flex items-center gap-1 text-success bg-success/10 px-2 py-1 rounded">
                            <Receipt className="h-3 w-3" />
                            <span className="text-xs">영수증 {(transaction as any).receipts.length}개</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                            <Receipt className="h-3 w-3" />
                            <span className="text-xs">영수증 없음</span>
                          </div>
                        )}
                        
                        {/* Evidence Warning */}
                        {transaction.evidence_type === 'NONE' && (
                          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="text-xs">증빙 확인 필요</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Review Status + Withholding Tax + Actions */}
                      <div className="flex items-center space-x-3">
                        {/* Withholding Tax (income only) */}
                        {transaction.type === 'income' && withholdingLabel && (
                          <span className="text-xs text-muted-foreground bg-blue-50 px-2 py-1 rounded">
                            {withholdingLabel}
                          </span>
                        )}
                        
                        {/* Review Status */}
                        <Badge 
                          variant={statusBadge.variant}
                          className={`text-xs flex items-center gap-1 ${
                            statusBadge.variant === 'destructive' 
                              ? 'bg-red-50 text-red-700 border-red-200' 
                              : statusBadge.variant === 'default'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          <statusBadge.icon className="h-3 w-3" />
                          {statusBadge.text}
                        </Badge>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-smooth">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
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
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};