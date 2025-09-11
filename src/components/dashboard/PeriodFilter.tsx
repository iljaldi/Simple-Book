import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

export type PeriodType = 'current_month' | 'last_month' | 'current_year' | 'custom';

interface PeriodFilterProps {
  value: PeriodType;
  onChange: (value: PeriodType) => void;
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="기간 선택" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border shadow-card">
          <SelectItem value="current_month">이번 달</SelectItem>
          <SelectItem value="last_month">지난 달</SelectItem>
          <SelectItem value="current_year">올해</SelectItem>
          <SelectItem value="custom">사용자 지정</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};