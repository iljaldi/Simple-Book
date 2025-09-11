import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Building } from 'lucide-react';

interface BasicInfoStepProps {
  form: UseFormReturn<any>;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <Card className="gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            거래 일자
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">거래 날짜</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    className="transition-smooth"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <Building className="h-5 w-5 mr-2 text-primary" />
            거래처 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="counterparty"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  거래처명 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="예: 주식회사 ABC"
                    className="transition-smooth"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="business_registration_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  사업자등록번호 (선택)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="예: 123-45-67890"
                    className="transition-smooth"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};