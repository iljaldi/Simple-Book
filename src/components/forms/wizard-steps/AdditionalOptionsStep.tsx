import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CreditCard, Receipt, Minus, Calculator, Info } from 'lucide-react';

interface AdditionalOptionsStepProps {
  form: UseFormReturn<any>;
}

export const AdditionalOptionsStep: React.FC<AdditionalOptionsStepProps> = ({ form }) => {
  const watchHasWithholding = form.watch('has_withholding');
  const watchTotalAmount = form.watch('total_amount_received');
  const watchWithholdingIncome = form.watch('withholding_income_tax');
  const watchWithholdingLocal = form.watch('withholding_local_tax');
  const watchTaxationType = form.watch('taxation_type');

  // Helper function to safely convert to number
  const toNumber = (value: any): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Reset withholding values when taxation type excludes withholding
  React.useEffect(() => {
    if (watchTaxationType === 'TAXABLE' || watchTaxationType === 'ZERO_RATED') {
      form.setValue('has_withholding', false, { shouldValidate: true });
      form.setValue('withholding_income_tax', '0', { shouldValidate: true });
      form.setValue('withholding_local_tax', '0', { shouldValidate: true });
    }
  }, [watchTaxationType, form]);

  // Auto-calculate withholding taxes
  React.useEffect(() => {
    if (watchHasWithholding && watchTotalAmount && watchTaxationType === 'EXEMPT') {
      const totalAmount = toNumber(watchTotalAmount);
      if (totalAmount > 0) {
        const incomeTax = Math.round(totalAmount * 0.033); // 3.3%
        const localTax = Math.round(incomeTax * 0.1); // 소득세의 10%
        
        form.setValue('withholding_income_tax', incomeTax.toString(), { shouldValidate: true });
        form.setValue('withholding_local_tax', localTax.toString(), { shouldValidate: true });
      }
    } else if (!watchHasWithholding || watchTaxationType !== 'EXEMPT') {
      form.setValue('withholding_income_tax', '0', { shouldValidate: true });
      form.setValue('withholding_local_tax', '0', { shouldValidate: true });
    }
  }, [watchHasWithholding, watchTotalAmount, watchTaxationType, form]);

  const formatCurrency = (amount: string | number) => {
    const num = toNumber(amount);
    return num.toLocaleString('ko-KR');
  };

  const totalAmount = toNumber(watchTotalAmount);
  const incomeTax = toNumber(watchWithholdingIncome);
  const localTax = toNumber(watchWithholdingLocal);
  const netAmount = totalAmount - incomeTax - localTax;

  // Show withholding tax only for EXEMPT taxation type
  const showWithholdingTax = watchTaxationType === 'EXEMPT';

  return (
    <div className="space-y-6">
      {showWithholdingTax && (
        <Card className="gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <Minus className="h-5 w-5 mr-2 text-primary" />
            원천징수
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="has_withholding"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="transition-smooth"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium text-foreground">
                    원천징수세 적용
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    소득세 3.3% + 지방소득세 자동 계산
                  </p>
                </div>
              </FormItem>
            )}
          />

          {watchHasWithholding && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="withholding_income_tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">소득세</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
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
                name="withholding_local_tax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">지방소득세</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="transition-smooth"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {watchHasWithholding && totalAmount > 0 && (
            <Card className="border-muted bg-muted/30">
              <CardContent className="pt-4">
                <div className="flex items-center mb-3">
                  <Calculator className="h-4 w-4 mr-2 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-foreground">원천징수 계산</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">총 수령액:</span>
                    <span className="font-medium">₩ {formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>소득세 (3.3%):</span>
                    <span>-₩ {formatCurrency(incomeTax)}</span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>지방소득세:</span>
                    <span>-₩ {formatCurrency(localTax)}</span>
                  </div>
                  <div className="flex justify-between border-t border-muted pt-2 font-semibold text-success">
                    <span>실제 수령액:</span>
                    <span>₩ {formatCurrency(netAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      )}

      {!showWithholdingTax && (
        <Card className="border-muted bg-muted/30">
          <CardContent className="pt-4">
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
              <h4 className="text-sm font-medium text-muted-foreground">원천징수 안내</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {watchTaxationType === 'TAXABLE' && '과세매출(부가세 10%)의 경우 원천징수가 적용되지 않습니다.'}
              {watchTaxationType === 'ZERO_RATED' && '영세율 매출의 경우 원천징수가 적용되지 않습니다.'}
              {!watchTaxationType && '과세유형을 먼저 선택해주세요.'}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary" />
            결제 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  결제수단 <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="transition-smooth">
                      <SelectValue placeholder="결제수단을 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="transfer">계좌이체</SelectItem>
                    <SelectItem value="cash">현금</SelectItem>
                    <SelectItem value="card">카드</SelectItem>
                    <SelectItem value="etc">기타</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-primary" />
            증빙 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="evidence_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  증빙 종류 <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="transition-smooth">
                      <SelectValue placeholder="증빙 종류를 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TAX_INVOICE">세금계산서</SelectItem>
                    <SelectItem value="INVOICE">계산서</SelectItem>
                    <SelectItem value="CASH_RCPT">현금영수증</SelectItem>
                    <SelectItem value="SIMPLE_RCPT">간이영수증</SelectItem>
                    <SelectItem value="CARD">카드전표</SelectItem>
                    <SelectItem value="NONE">증빙없음</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};