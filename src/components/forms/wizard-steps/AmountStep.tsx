import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';

interface AmountStepProps {
  form: UseFormReturn<any>;
}

export const AmountStep: React.FC<AmountStepProps> = ({ form }) => {
  const watchSupplyAmount = form.watch('supply_amount');
  const watchTaxationType = form.watch('taxation_type');

  // Helper function to safely convert to number
  const toNumber = (value: any): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Auto-calculate VAT and total based on supply amount and taxation type
  React.useEffect(() => {
    const supplyAmount = toNumber(watchSupplyAmount);
    if (supplyAmount > 0 && watchTaxationType) {
      let vatAmount = 0;
      
      if (watchTaxationType === 'TAXABLE') {
        vatAmount = Math.round(supplyAmount * 0.1);
      }
      
      const totalAmount = supplyAmount + vatAmount;
      
      form.setValue('vat_amount', vatAmount.toString(), { shouldValidate: true });
      form.setValue('total_amount_received', totalAmount.toString(), { shouldValidate: true });
    }
  }, [watchSupplyAmount, watchTaxationType, form]);

  const formatCurrency = (amount: string | number) => {
    const num = toNumber(amount);
    return num.toLocaleString('ko-KR');
  };

  const supplyAmount = toNumber(watchSupplyAmount);
  const vatAmount = toNumber(form.watch('vat_amount'));
  const totalAmount = toNumber(form.watch('total_amount_received'));

  return (
    <div className="space-y-6">
      <Card className="gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-primary" />
            공급가액 입력
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="supply_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  공급가액 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1000000"
                    className="transition-smooth text-lg font-medium"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {supplyAmount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    ₩ {formatCurrency(supplyAmount)}
                  </p>
                )}
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <Calculator className="h-5 w-5 mr-2 text-primary" />
            자동 계산 결과
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium text-foreground">부가세</span>
              <span className="text-lg font-semibold text-foreground">
                ₩ {formatCurrency(vatAmount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-primary-light rounded-lg">
              <span className="text-sm font-semibold text-primary">총 수령액</span>
              <span className="text-xl font-bold text-primary">
                ₩ {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="total_amount_received"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  총 수령액 확인 <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="transition-smooth font-medium"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground">
                  자동 계산된 금액이 실제 수령액과 다르면 직접 수정할 수 있습니다.
                </p>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {supplyAmount > 0 && (
        <Card className="border-success-light bg-success-light/10">
          <CardContent className="pt-6">
            <div className="flex items-center mb-3">
              <TrendingUp className="h-5 w-5 mr-2 text-success" />
              <h4 className="font-medium text-success">계산 요약</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">공급가액:</span>
                <span className="font-medium">₩ {formatCurrency(supplyAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">부가세 ({watchTaxationType === 'TAXABLE' ? '10%' : '0%'}):</span>
                <span className="font-medium">₩ {formatCurrency(vatAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-success-light pt-2">
                <span className="font-semibold text-success">총 수령액:</span>
                <span className="font-bold text-success">₩ {formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};