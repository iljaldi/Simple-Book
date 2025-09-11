import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface DayTransaction {
  date: string;
  income: number;
  expense: number;
  transactionCount: number;
}

interface CalendarViewProps {
  data: DayTransaction[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDayData = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return data.find(d => d.date === dateStr);
  };

  const getModifiers = () => {
    const modifiers: { [key: string]: Date[] } = {
      hasIncome: [],
      hasExpense: [],
      hasBoth: [],
    };

    data.forEach(dayData => {
      const date = new Date(dayData.date);
      if (dayData.income > 0 && dayData.expense > 0) {
        modifiers.hasBoth.push(date);
      } else if (dayData.income > 0) {
        modifiers.hasIncome.push(date);
      } else if (dayData.expense > 0) {
        modifiers.hasExpense.push(date);
      }
    });

    return modifiers;
  };

  const getModifiersStyles = () => {
    return {
      hasIncome: {
        backgroundColor: 'hsl(var(--income) / 0.2)',
        color: 'hsl(var(--income))',
        fontWeight: 'bold',
      },
      hasExpense: {
        backgroundColor: 'hsl(var(--expense) / 0.2)',
        color: 'hsl(var(--expense))',
        fontWeight: 'bold',
      },
      hasBoth: {
        backgroundColor: 'hsl(var(--primary) / 0.2)',
        color: 'hsl(var(--primary))',
        fontWeight: 'bold',
      },
    };
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const selectedDayData = selectedDate ? getDayData(selectedDate) : null;

  return (
    <>
      <Card className="shadow-card gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <CalendarDays className="h-5 w-5 text-primary" />
            달력 뷰
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onDayClick={handleDayClick}
            modifiers={getModifiers()}
            modifiersStyles={getModifiersStyles()}
            className="pointer-events-auto [&_.rdp-day]:cursor-pointer [&_.rdp-day]:hover:bg-accent/50 [&_.rdp-day]:transition-colors"
            locale={ko}
          />
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-income/20 border border-income/40"></div>
              <span className="text-muted-foreground">수입만</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-expense/20 border border-expense/40"></div>
              <span className="text-muted-foreground">지출만</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary/40"></div>
              <span className="text-muted-foreground">수입+지출</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {selectedDate && format(selectedDate, 'yyyy년 M월 d일', { locale: ko })} 거래 내역
            </DialogTitle>
          </DialogHeader>
          {selectedDayData && (selectedDayData.income > 0 || selectedDayData.expense > 0) ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {selectedDayData.income > 0 && (
                  <div className="p-3 rounded-lg bg-income/10 border border-income/20">
                    <p className="text-sm text-muted-foreground mb-1">수입</p>
                    <p className="font-semibold text-income">
                      {formatCurrency(selectedDayData.income)}
                    </p>
                  </div>
                )}
                {selectedDayData.expense > 0 && (
                  <div className="p-3 rounded-lg bg-expense/10 border border-expense/20">
                    <p className="text-sm text-muted-foreground mb-1">지출</p>
                    <p className="font-semibold text-expense">
                      {formatCurrency(selectedDayData.expense)}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">총 거래 수</p>
                <p className="font-medium text-foreground">
                  {selectedDayData.transactionCount}건
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">거래 내역이 없습니다</p>
              <p className="text-sm">이 날짜에는 등록된 거래가 없습니다.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};