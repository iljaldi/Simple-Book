import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CreditCard, 
  Calculator, 
  Receipt, 
  Building2, 
  Calendar as CalendarIcon,
  Minus,
  ChevronDown,
  Info,
  Tag,
  FileText,
  Banknote
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const incomeSchema = z.object({
  date: z.date({
    required_error: "날짜를 선택해주세요",
  }),
  counterparty: z.string().min(1, '거래처명을 입력해주세요'),
  business_registration_number: z.string().optional(),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  taxation_type: z.enum(['TAXABLE', 'ZERO_RATED', 'EXEMPT']),
  project_memo: z.string().optional(),
  supply_amount: z.string().min(1, '공급가액을 입력해주세요'),
  vat_amount: z.string().default('0'),
  total_amount_received: z.string().min(1, '총 수령액을 입력해주세요'),
  has_withholding: z.boolean().default(false),
  withholding_income_tax: z.string().default('0'),
  withholding_local_tax: z.string().default('0'),
  payment_method: z.string().min(1, '결제수단을 선택해주세요'),
  evidence_type: z.string().min(1, '증빙 종류를 선택해주세요'),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

interface IncomeWizardProps {
  onSuccess: () => void;
  onContinueAdding?: () => void;
}

const PAYMENT_METHODS = [
  { value: 'transfer', label: '계좌이체' },
  { value: 'card', label: '카드' },
  { value: 'cash', label: '현금' },
  { value: 'etc', label: '기타' },
];

const EVIDENCE_TYPES = [
  { value: 'TAX_INVOICE', label: '세금계산서' },
  { value: 'INVOICE', label: '계산서' },
  { value: 'CARD', label: '카드전표' },
  { value: 'CASH_RCPT', label: '현금영수증' },
  { value: 'SIMPLE_RCPT', label: '간이영수증' },
  { value: 'NONE', label: '증빙없음' },
];

export const IncomeWizard: React.FC<IncomeWizardProps> = ({ onSuccess, onContinueAdding }) => {
  const [continueAdding, setContinueAdding] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const { createTransactionAsync, isCreating } = useTransactions();
  const { categories } = useCategories();

  const form = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: new Date(),
      taxation_type: 'TAXABLE',
      supply_amount: '',
      vat_amount: '0',
      total_amount_received: '',
      has_withholding: false,
      withholding_income_tax: '0',
      withholding_local_tax: '0',
      payment_method: 'transfer',
      evidence_type: 'TAX_INVOICE',
    },
  });

  const incomeCategories = categories.filter(cat => cat.transaction_type === 'income');

  // Watch form values for automation
  const watchPaymentMethod = form.watch('payment_method');
  const watchCategory = form.watch('category');
  const watchTaxationType = form.watch('taxation_type');
  const watchTotalAmount = form.watch('total_amount_received');
  const watchHasWithholding = form.watch('has_withholding');
  const watchWithholdingIncome = form.watch('withholding_income_tax');
  const watchWithholdingLocal = form.watch('withholding_local_tax');

  // Helper functions
  const toNumber = (value: any): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatCurrency = (amount: string | number) => {
    const num = toNumber(amount);
    return num.toLocaleString('ko-KR');
  };

  // Auto-set evidence type based on payment method
  React.useEffect(() => {
    const evidenceMapping: Record<string, string> = {
      'transfer': 'TAX_INVOICE',
      'card': 'CARD',
      'cash': 'CASH_RCPT',
      'etc': 'NONE',
    };

    if (watchPaymentMethod && evidenceMapping[watchPaymentMethod]) {
      form.setValue('evidence_type', evidenceMapping[watchPaymentMethod], { shouldValidate: true });
    }
  }, [watchPaymentMethod, form]);

  // Auto-set taxation type based on category
  React.useEffect(() => {
    if (watchCategory) {
      const selectedCategory = incomeCategories.find(cat => cat.name === watchCategory);
      if (selectedCategory?.default_taxation_type) {
        const currentTaxationType = form.getValues('taxation_type');
        const newTaxationType = selectedCategory.default_taxation_type;
        
        if (currentTaxationType !== newTaxationType) {
          form.setValue('taxation_type', newTaxationType as 'TAXABLE' | 'ZERO_RATED' | 'EXEMPT', { shouldValidate: true });
          toast.info(`과세유형이 '${getTaxationTypeDescription(newTaxationType)}'으로 자동 설정되었습니다.`);
        }
      }
    }
  }, [watchCategory, incomeCategories, form]);

  // Auto-calculate supply amount and VAT from total amount
  React.useEffect(() => {
    if (watchTotalAmount && watchTaxationType) {
      const totalAmount = toNumber(watchTotalAmount);
      
      if (totalAmount > 0) {
        let supplyAmount: number;
        let vatAmount: number;
        
        if (watchTaxationType === 'TAXABLE') {
          supplyAmount = Math.round(totalAmount / 1.1);
          vatAmount = totalAmount - supplyAmount;
        } else {
          supplyAmount = totalAmount;
          vatAmount = 0;
        }
        
        form.setValue('supply_amount', supplyAmount.toString(), { shouldValidate: true });
        form.setValue('vat_amount', vatAmount.toString(), { shouldValidate: true });
      }
    }
  }, [watchTotalAmount, watchTaxationType, form]);

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

  const getTaxationTypeDescription = (type: string) => {
    switch (type) {
      case 'TAXABLE':
        return '부가세 10% 적용';
      case 'ZERO_RATED':
        return '부가세 0% (영세율)';
      case 'EXEMPT':
        return '부가세 면세';
      default:
        return '';
    }
  };

  const onSubmit = async (data: IncomeFormData) => {
    try {
      await createTransactionAsync({
        type: 'income',
        amount_gross: parseFloat(data.total_amount_received),
        counterparty_name: data.counterparty,
        category: data.category,
        date: format(data.date, 'yyyy-MM-dd'),
        counterparty_biz_no: data.business_registration_number || null,
        taxation_type: data.taxation_type,
        vat_amount: parseFloat(data.vat_amount),
        withholding_income_tax: data.has_withholding ? parseFloat(data.withholding_income_tax) : null,
        withholding_local_tax: data.has_withholding ? parseFloat(data.withholding_local_tax) : null,
        payment_method: data.payment_method as 'transfer' | 'card' | 'cash' | 'etc',
        evidence_type: data.evidence_type as 'TAX_INVOICE' | 'INVOICE' | 'CARD' | 'CASH_RCPT' | 'SIMPLE_RCPT' | 'NONE',
        project: data.project_memo || null,
      });
      
      const totalAmount = formatCurrency(data.total_amount_received);
      const categoryName = incomeCategories.find(cat => cat.name === data.category)?.name || data.category;
      const evidenceLabel = EVIDENCE_TYPES.find(type => type.value === data.evidence_type)?.label || data.evidence_type;
      
      toast.success(`✅ ${totalAmount}원 (${categoryName}, ${evidenceLabel}) 수입이 등록되었습니다!`);
      
      if (!continueAdding) {
        onSuccess();
      } else {
        // Reset form for continuous adding
        form.reset({
          date: data.date, // Keep the same date
          taxation_type: 'TAXABLE',
          supply_amount: '',
          vat_amount: '0',
          total_amount_received: '',
          has_withholding: false,
          withholding_income_tax: '0',
          withholding_local_tax: '0',
          payment_method: 'transfer',
          evidence_type: 'TAX_INVOICE',
        });
        setShowAdvanced(false);
      }
    } catch (error) {
      console.error('Transaction creation failed:', error);
      toast.error('거래 등록 중 오류가 발생했습니다.');
    }
  };

  // Calculate amounts for display
  const totalAmount = toNumber(watchTotalAmount);
  const supplyAmount = toNumber(form.watch('supply_amount'));
  const vatAmount = toNumber(form.watch('vat_amount'));
  const incomeTax = toNumber(watchWithholdingIncome);
  const localTax = toNumber(watchWithholdingLocal);
  const netAmount = totalAmount - incomeTax - localTax;

  // Show withholding tax only for EXEMPT taxation type
  const showWithholdingTax = watchTaxationType === 'EXEMPT';
  const selectedCategory = incomeCategories.find(cat => cat.name === watchCategory);

  return (
    <Card className="shadow-card gradient-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground">
          수입 등록
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          5초 안에 빠르게 수입을 기록하세요
        </p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 1. Payment Method - Priority 1 */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium text-foreground flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      결제수단 <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <div className="grid grid-cols-4 gap-2">
                      {PAYMENT_METHODS.map((method) => (
                        <Button
                          key={method.value}
                          type="button"
                          variant={field.value === method.value ? "default" : "outline"}
                          className="transition-smooth h-12"
                          onClick={() => field.onChange(method.value)}
                        >
                          {method.label}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchPaymentMethod === 'transfer' && (
                <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <Info className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    계좌이체의 경우 사업자번호 입력을 권장합니다. (세금계산서 발급)
                  </span>
                </div>
              )}
            </div>

            {/* 2. Total Amount - Priority 2 */}
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="total_amount_received"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold text-foreground flex items-center">
                        <Banknote className="h-6 w-6 mr-2 text-primary" />
                        총 수령액 <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="text-2xl font-bold h-14 text-center transition-smooth"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      
                      {totalAmount > 0 && (
                        <div className="mt-4 p-3 bg-background rounded-md border">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">공급가액:</span>
                            <span className="font-medium">₩ {formatCurrency(supplyAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">부가세:</span>
                            <span className="font-medium">₩ {formatCurrency(vatAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-base font-semibold border-t pt-2 mt-2">
                            <span>총액:</span>
                            <span className="text-primary">₩ {formatCurrency(totalAmount)}</span>
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* 3. Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      날짜 <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal transition-smooth",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "yyyy년 MM월 dd일", { locale: ko })
                            ) : (
                              <span>날짜를 선택하세요</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="counterparty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground flex items-center">
                      <Building2 className="h-4 w-4 mr-2" />
                      거래처명 <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="거래처명을 입력하세요"
                        className="transition-smooth"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 4. Category Selection */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    카테고리 <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="transition-smooth">
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {incomeCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedCategory && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {getTaxationTypeDescription(selectedCategory.default_taxation_type)}
                      </Badge>
                      {watchTaxationType && (
                        <Badge variant="outline" className="text-xs">
                          현재: {getTaxationTypeDescription(watchTaxationType)}
                        </Badge>
                      )}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 5. Evidence Type (Auto-set based on payment method) */}
            <FormField
              control={form.control}
              name="evidence_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground flex items-center">
                    <Receipt className="h-4 w-4 mr-2" />
                    증빙 유형 <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="transition-smooth">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVIDENCE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Withholding Tax Section (Only for EXEMPT) */}
            {showWithholdingTax && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
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
                          <FormLabel className="text-sm font-medium text-foreground flex items-center">
                            <Minus className="h-4 w-4 mr-2" />
                            원천징수세 적용 (3.3%)
                          </FormLabel>
                          <p className="text-xs text-muted-foreground">
                            면세 매출의 경우 원천징수가 적용됩니다
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {watchHasWithholding && totalAmount > 0 && (
                    <div className="mt-4 p-3 bg-background rounded-md border">
                      <div className="flex items-center mb-2">
                        <Calculator className="h-4 w-4 mr-2 text-muted-foreground" />
                        <h4 className="text-sm font-medium">원천징수 계산</h4>
                      </div>
                      <div className="space-y-1 text-sm">
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
                        <div className="flex justify-between border-t pt-2 font-semibold text-success">
                          <span>실제 수령액:</span>
                          <span>₩ {formatCurrency(netAmount)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Advanced Options - Collapsible */}
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="flex items-center justify-between w-full p-4 border border-border rounded-md transition-smooth"
                >
                  <span className="font-medium">고급 옵션</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-4">
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="business_registration_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          사업자등록번호
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123-45-67890"
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
                    name="project_memo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          프로젝트명 / 메모
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="예: 웹사이트 개발 프로젝트"
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
                    name="taxation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">
                          과세유형 (수동 설정)
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                          disabled={selectedCategory?.allow_override === false}
                        >
                          <FormControl>
                            <SelectTrigger className="transition-smooth">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TAXABLE">과세 (10%)</SelectItem>
                            <SelectItem value="ZERO_RATED">영세율 (0%)</SelectItem>
                            <SelectItem value="EXEMPT">면세</SelectItem>
                          </SelectContent>
                        </Select>
                        {selectedCategory?.allow_override === false && (
                          <p className="text-xs text-muted-foreground">
                            이 카테고리는 과세유형이 고정됩니다
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </form>
        </Form>
      </CardContent>

      {/* Fixed Bottom Save Bar */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground">
              총 {formatCurrency(totalAmount)}원
            </span>
            <span className="text-sm text-muted-foreground">
              {watchCategory && `${watchCategory} • `}
              {EVIDENCE_TYPES.find(type => type.value === form.watch('evidence_type'))?.label}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="continue-adding"
                checked={continueAdding}
                onCheckedChange={setContinueAdding}
              />
              <label
                htmlFor="continue-adding"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                계속 추가
              </label>
            </div>
            
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isCreating || !totalAmount}
              className="min-w-[120px] transition-smooth"
            >
              {isCreating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
              ) : (
                '저장'
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};