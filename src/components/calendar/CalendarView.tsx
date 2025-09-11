import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'react-day-picker/dist/style.css';

interface CalendarViewProps {
  selectedYear?: number;
  selectedMonth?: number;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  selectedYear: propSelectedYear = 2025, 
  selectedMonth: propSelectedMonth = 8 
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date(propSelectedYear, propSelectedMonth));

  useEffect(() => {
    setSelectedMonth(new Date(propSelectedYear, propSelectedMonth));
  }, [propSelectedYear, propSelectedMonth]);

  // 거래가 있는 날짜들 (예시 데이터)
  const transactionDates = {
    // 8월 31일 - 수입+지출 (보라색)
    [new Date(2025, 7, 31).getTime()]: 'income-expense',
    // 9월 5일 - 수입만 (초록색)
    [new Date(2025, 8, 5).getTime()]: 'income-only',
    // 9월 10일 - 수입+지출 (보라색)
    [new Date(2025, 8, 10).getTime()]: 'income-expense',
    // 9월 12일 - 지출만 (빨간색)
    [new Date(2025, 8, 12).getTime()]: 'expense-only',
    // 9월 15일 - 수입만 (초록색)
    [new Date(2025, 8, 15).getTime()]: 'income-only',
    // 9월 18일 - 수입+지출 (보라색)
    [new Date(2025, 8, 18).getTime()]: 'income-expense',
    // 9월 20일 - 지출만 (빨간색)
    [new Date(2025, 8, 20).getTime()]: 'expense-only',
    // 9월 25일 - 수입만 (초록색)
    [new Date(2025, 8, 25).getTime()]: 'income-only',
    // 9월 28일 - 지출만 (빨간색)
    [new Date(2025, 8, 28).getTime()]: 'expense-only',
  };

  // 거래 금액 데이터 (예시)
  const transactionAmounts = {
    [new Date(2025, 7, 31).getTime()]: { income: 5000000, expense: 2000000, profit: 3000000 },
    [new Date(2025, 8, 5).getTime()]: { income: 800000, expense: 0, profit: 800000 },
    [new Date(2025, 8, 10).getTime()]: { income: 3000000, expense: 1500000, profit: 1500000 },
    [new Date(2025, 8, 12).getTime()]: { income: 0, expense: 120000, profit: -120000 },
    [new Date(2025, 8, 15).getTime()]: { income: 2000000, expense: 0, profit: 2000000 },
    [new Date(2025, 8, 18).getTime()]: { income: 1500000, expense: 800000, profit: 700000 },
    [new Date(2025, 8, 20).getTime()]: { income: 0, expense: 500000, profit: -500000 },
    [new Date(2025, 8, 25).getTime()]: { income: 1200000, expense: 0, profit: 1200000 },
    [new Date(2025, 8, 28).getTime()]: { income: 0, expense: 300000, profit: -300000 },
  };

  const getDayClassName = (day: Date) => {
    const dayTime = day.getTime();
    const transactionType = transactionDates[dayTime];
    
    if (transactionType === 'income-expense') {
      return 'bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center';
    } else if (transactionType === 'income-only') {
      return 'bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center';
    } else if (transactionType === 'expense-only') {
      return 'bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center';
    }
    
    return '';
  };

  const handleMonthChange = (month: Date) => {
    setSelectedMonth(month);
  };

  const goToPreviousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  return (
    <div className="flex flex-col">
      {/* 달력 헤더 - 제목+범례, 월/년도 네비게이션 */}
      <div className="flex items-center justify-between mb-[30px]">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold text-gray-900">달력 뷰</h3>
          {/* 범례 */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">수입</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-600">지출</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-gray-600">순이익</span>
            </div>
          </div>
        </div>
        
        {/* 월/년도 네비게이션 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold text-gray-900 min-w-[120px] text-center">
            {selectedMonth.getMonth() + 1}월 {selectedMonth.getFullYear()}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 달력 */}
      <div className="calendar-container w-full h-[380px] overflow-hidden">
        <DayPicker
          mode="single"
          month={selectedMonth}
          onMonthChange={handleMonthChange}
          className="rdp w-full m-0 h-full"
          classNames={{
            months: 'flex flex-col w-full h-full',
            month: 'w-full h-full',
            caption: 'hidden', // 캡션 숨김
            caption_label: 'text-sm font-medium',
            nav: 'space-x-1 flex items-center',
            nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full h-full border-collapse',
            head_row: 'flex w-full',
            head_cell: 'text-gray-500 flex-1 font-normal text-sm text-center py-3 border-b border-gray-100',
            row: 'flex w-full border-b border-gray-50 last:border-b-0 h-[63px]',
            cell: 'text-sm p-0 relative flex-1 hover:bg-gray-50 transition-colors flex items-center justify-center h-[63px]',
            day: 'h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-full hover:bg-gray-100 transition-colors',
            day_selected: 'bg-blue-500 text-white hover:bg-blue-600',
            day_today: 'bg-gray-100 text-gray-900 font-semibold',
            day_outside: 'text-gray-300',
            day_disabled: 'text-gray-300 cursor-not-allowed',
            day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible',
          }}
          components={{
            Day: ({ date, displayMonth }) => {
              const dayTime = date.getTime();
              const transactionType = transactionDates[dayTime];
              const transactionAmount = transactionAmounts[dayTime];
              const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
              const now = new Date();
              const isToday =
                date.getFullYear() === now.getFullYear() &&
                date.getMonth() === now.getMonth() &&
                date.getDate() === now.getDate();
              
              if (!isCurrentMonth) {
                return <div className="w-full h-[63px]" />;
              }

              let dotColor = '';
              if (transactionType === 'income-expense') {
                dotColor = 'bg-purple-500';
              } else if (transactionType === 'income-only') {
                dotColor = 'bg-green-500';
              } else if (transactionType === 'expense-only') {
                dotColor = 'bg-red-500';
              }

              return (
                <div className="relative w-full h-[63px] group">
                  <span className={`absolute top-1 left-1 text-sm ${isToday ? 'text-white font-semibold' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {isToday ? (
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        {date.getDate()}
                      </div>
                    ) : (
                      date.getDate()
                    )}
                  </span>
                  {dotColor && (
                    <div className="absolute top-1 left-6 flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${dotColor} cursor-pointer`} />
                      {transactionAmount && (
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {transactionType === 'income-only' && (
                            <div>수입: ₩{transactionAmount.income.toLocaleString()}</div>
                          )}
                          {transactionType === 'expense-only' && (
                            <div>지출: ₩{transactionAmount.expense.toLocaleString()}</div>
                          )}
                          {transactionType === 'income-expense' && (
                            <div>순이익: ₩{transactionAmount.profit.toLocaleString()}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            },
          }}
        />
      </div>

    </div>
  );
};

export default CalendarView;