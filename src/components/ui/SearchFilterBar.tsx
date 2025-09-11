import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// Removed lucide-react imports - using remixicon instead
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

interface SearchFilterBarProps {
  onSearchChange: (search: string) => void;
  onFilterChange: (filters: {
    dateRange?: DateRange;
    category?: string;
    evidenceType?: string;
    transactionType?: string;
    period?: string;
  }) => void;
  onClear: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  onSearchChange,
  onFilterChange,
  onClear
}) => {
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [category, setCategory] = useState<string>('');
  const [evidenceType, setEvidenceType] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this-month');
  const [showFilters, setShowFilters] = useState(false);

  // 기간 옵션 정의
  const periodOptions = [
    { value: 'this-month', label: '이번 달' },
    { value: 'last-month', label: '지난 달' },
    { value: 'this-quarter', label: '이번 분기' },
    { value: 'last-quarter', label: '지난 분기' },
    { value: 'this-year', label: '올해' },
    { value: 'custom', label: '사용자 지정' },
  ];

  // 기간 선택에 따른 날짜 범위 계산
  const getPeriodDateRange = (period: string): DateRange | undefined => {
    const now = new Date();
    
    switch (period) {
      case 'this-month':
        return { from: startOfMonth(now), to: endOfMonth(now) };
      case 'last-month':
        const lastMonth = subMonths(now, 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      case 'this-quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        const quarterEnd = new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0);
        return { from: quarterStart, to: quarterEnd };
      case 'last-quarter':
        const lastQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1);
        const lastQuarterEnd = new Date(lastQuarterStart.getFullYear(), lastQuarterStart.getMonth() + 3, 0);
        return { from: lastQuarterStart, to: lastQuarterEnd };
      case 'this-year':
        return { from: startOfYear(now), to: endOfYear(now) };
      case 'custom':
        return dateRange;
      default:
        return undefined;
    }
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleFilterChange = () => {
    const effectiveDateRange = selectedPeriod === 'custom' ? dateRange : getPeriodDateRange(selectedPeriod);
    onFilterChange({
      dateRange: effectiveDateRange,
      category: category || undefined,
      evidenceType: evidenceType || undefined,
      transactionType: transactionType || undefined,
      period: selectedPeriod,
    });
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      const newDateRange = getPeriodDateRange(period);
      setDateRange(newDateRange);
    }
    // 즉시 필터 적용
    setTimeout(() => {
      const effectiveDateRange = period === 'custom' ? dateRange : getPeriodDateRange(period);
      onFilterChange({
        dateRange: effectiveDateRange,
        category: category || undefined,
        evidenceType: evidenceType || undefined,
        transactionType: transactionType || undefined,
        period: period,
      });
    }, 0);
  };

  const handleClear = () => {
    setSearch('');
    setDateRange(undefined);
    setCategory('');
    setEvidenceType('');
    setTransactionType('');
    setSelectedPeriod('this-month');
    onClear();
  };

  const hasActiveFilters = dateRange || category || evidenceType || transactionType || selectedPeriod !== 'this-month';

  return (
    <div className="space-y-4">
      {/* Search Bar and Filter */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Input
            placeholder="거래처명으로 검색..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => handleSearchChange('')}
            >
              <i className="ri-close-line h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filter Button */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-10 ${hasActiveFilters ? 'border-primary text-primary' : ''}`}
        >
          <i className="ri-filter-line h-5 w-5 mr-2" />
          필터 {hasActiveFilters && `(${[dateRange, category, evidenceType, transactionType].filter(Boolean).length})`}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" className="h-10" onClick={handleClear}>
            <i className="ri-close-line h-4 w-4 mr-1" />
            초기화
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-muted/50 rounded-lg">
          
          {/* 기간 필터 (드롭다운) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">기간</label>
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="기간 선택" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {periodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 사용자 정의 날짜 범위 (기간이 '사용자 지정'일 때만 표시) */}
          {selectedPeriod === 'custom' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">사용자 지정 기간</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <i className="ri-calendar-line mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MM/dd", { locale: ko })} -{" "}
                          {format(dateRange.to, "MM/dd", { locale: ko })}
                        </>
                      ) : (
                        format(dateRange.from, "MM/dd", { locale: ko })
                      )
                    ) : (
                      <span>기간을 선택하세요</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range);
                      handleFilterChange();
                    }}
                    numberOfMonths={2}
                    className="pointer-events-auto"
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">유형</label>
            <Select value={transactionType} onValueChange={(value) => {
              setTransactionType(value);
              handleFilterChange();
            }}>
              <SelectTrigger>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">수입</SelectItem>
                <SelectItem value="expense">지출</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Evidence Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">증빙유형</label>
            <Select value={evidenceType} onValueChange={(value) => {
              setEvidenceType(value);
              handleFilterChange();
            }}>
              <SelectTrigger>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TAX_INVOICE">세금계산서</SelectItem>
                <SelectItem value="CARD">카드매출전표</SelectItem>
                <SelectItem value="CASH_RCPT">현금영수증</SelectItem>
                <SelectItem value="SIMPLE_RCPT">간이영수증</SelectItem>
                <SelectItem value="INVOICE">계산서</SelectItem>
                <SelectItem value="NONE">증빙없음</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">카테고리</label>
            <Input
              placeholder="카테고리명"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                handleFilterChange();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};