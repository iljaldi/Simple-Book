import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { 
  Calendar as CalendarIcon,
  ChevronDown,
  Calculator,
  Settings,
  Save,
  Plus,
  Info,
  Building2,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';

// 필수 필드만 포함한 간소화된 스키마
const simpleIncomeSchema = z.object({
  // 필수 필드
  date: z.date({ required_error: '날짜를 선택해주세요' }),
  counterparty_name: z.string().min(1, '거래처명을 입력해주세요'),
  total_amount_received: z.string().min(1, '수령액을 입력해주세요'),
  payment_method: z.string().min(1, '결제수단을 선택해주세요'),
  
  // 선택 필드 (상세 모드)
  category: z.string().optional(),
  evidence_type: z.string().optional(),
  taxation_type: z.string().default('TAXABLE'),
  supply_amount: z.string().default(''),
  vat_amount: z.string().default('0'),
  has_withholding: z.boolean().default(false),
  withholding_income_tax: z.string().default('0'),
  withholding_local_tax: z.string().default('0'),
  project: z.string().optional(),
  description: z.string().optional(),
});

type SimpleIncomeFormData = z.infer<typeof simpleIncomeSchema>;

interface SimpleIncomeFormProps {
  onSuccess: () => void;
  onContinueAdding?: () => void;
  initialData?: any;
}

const PAYMENT_METHODS = [
  { value: 'transfer', label: '계좌이체', icon: Building2 },
  { value: 'card', label: '카드', icon: CreditCard },
  { value: 'cash', label: '현금', icon: CreditCard },
  { value: 'etc', label: '기타', icon: CreditCard },
];

const EVIDENCE_TYPES = [
  { value: 'TAX_INVOICE', label: '세금계산서', description: '사업자간 거래' },
  { value: 'INVOICE', label: '계산서', description: '간이과세자' },
  { value: 'CARD', label: '카드전표', description: '자동 연계' },
  { value: 'CASH_RCPT', label: '현금영수증', description: '현금거래 시' },
  { value: 'SIMPLE_RCPT', label: '간이영수증', description: '소액거래' },
  { value: 'NONE', label: '증빙없음', description: '증빙 미비' },
];

export const SimpleIncomeForm: React.FC<SimpleIncomeFormProps> = ({ 
  onSuccess, 
  onContinueAdding,
  initialData 
}) => {
  const [isDetailMode, setIsDetailMode] = useState(!!initialData?.project || !!initialData?.description);
  const [saveType, setSaveType] = useState<'save' | 'continue'>('save');
  const { createTransaction, updateTransaction, isCreating } = useTransactions();
  const { categories } = useCategories();

  const form = useForm<SimpleIncomeFormData>({
    resolver: zodResolver(simpleIncomeSchema),
    defaultValues: initialData ? {
      date: new Date(initialData.date),
      counterparty_name: initialData.counterparty_name || '',
      total_amount_received: initialData.amount_gross?.toString() || '',
      payment_method: initialData.payment_method || 'transfer',
      category: initialData.category || '',
      evidence_type: initialData.evidence_type || 'TAX_INVOICE',
      taxation_type: initialData.taxation_type || 'TAXABLE',
      supply_amount: initialData.supply_amount?.toString() || '',
      vat_amount: initialData.vat_amount?.toString() || '0',
      has_withholding: (initialData.withholding_income_tax || 0) > 0 || (initialData.withholding_local_tax || 0) > 0,
      withholding_income_tax: initialData.withholding_income_tax?.toString() || '0',
      withholding_local_tax: initialData.withholding_local_tax?.toString() || '0',
      project: initialData.project || '',
      description: initialData.description || '',
    } : {
      date: new Date(),
      counterparty_name: '',
      total_amount_received: '',
      payment_method: 'transfer',
      category: '',
      evidence_type: 'TAX_INVOICE',
      taxation_type: 'TAXABLE',
      supply_amount: '',
      vat_amount: '0',
      has_withholding: false,
      withholding_income_tax: '0',
      withholding_local_tax: '0',
      project: '',
      description: '',
    },
  });

  const incomeCategories = categories.filter(cat => cat.transaction_type === 'income');
  
  // 총 수령액 변경 시 공급가액/부가세 자동 계산
  const watchTotalAmount = form.watch('total_amount_received');
  const watchTaxationType = form.watch('taxation_type');

  useEffect(() => {
    if (watchTotalAmount && !isNaN(parseFloat(watchTotalAmount))) {
      const total = parseFloat(watchTotalAmount);
      
      if (watchTaxationType === 'TAXABLE') {
        const supply = Math.round(total / 1.1);
        const vat = total - supply;
        form.setValue('supply_amount', supply.toString());
        form.setValue('vat_amount', vat.toString());
      } else {
        form.setValue('supply_amount', total.toString());
        form.setValue('vat_amount', '0');
      }
    }
  }, [watchTotalAmount, watchTaxationType, form]);

  // 결제수단 변경 시 증빙유형 자동 설정
  const watchPaymentMethod = form.watch('payment_method');
  useEffect(() => {
    if (watchPaymentMethod) {
      let autoEvidenceType = '';
      switch (watchPaymentMethod) {
        case 'card':
          autoEvidenceType = 'CARD';
          break;
        case 'transfer':
          autoEvidenceType = 'TAX_INVOICE';
          break;
        case 'cash':
          autoEvidenceType = 'CASH_RCPT';
          break;
        default:
          return;
      }
      if (autoEvidenceType && isDetailMode) {
        form.setValue('evidence_type', autoEvidenceType);
      }
    }
  }, [watchPaymentMethod, form, isDetailMode]);

  const onSubmit = async (data: SimpleIncomeFormData) => {
    try {
      const transactionData = {
        type: 'income' as const,
        date: format(data.date, 'yyyy-MM-dd'),
        counterparty_name: data.counterparty_name,
        category: data.category || null,
        taxation_type: data.taxation_type as 'TAXABLE' | 'ZERO_RATED' | 'EXEMPT',
        vat_amount: parseFloat(data.vat_amount) || 0,
        amount_gross: parseFloat(data.total_amount_received),
        withholding_income_tax: data.has_withholding ? parseFloat(data.withholding_income_tax) : null,
        withholding_local_tax: data.has_withholding ? parseFloat(data.withholding_local_tax) : null,
        payment_method: data.payment_method as 'transfer' | 'card' | 'cash' | 'etc',
        evidence_type: (data.evidence_type || 'NONE') as 'TAX_INVOICE' | 'INVOICE' | 'CARD' | 'CASH_RCPT' | 'SIMPLE_RCPT' | 'NONE',
        project: data.project || null,
        description: data.description || null,
        status: 'confirmed' as 'draft' | 'confirmed',
        currency: 'KRW',
      };

      if (initialData?.id) {
        // 수정 모드
        await updateTransaction({ id: initialData.id, updates: transactionData });
        toast.success('수입이 성공적으로 수정되었습니다.');
        onSuccess();
      } else {
        // 새 거래 생성 모드
        await createTransaction(transactionData);
        
        if (saveType === 'continue') {
          toast.success('수입이 저장되었습니다. 새 거래를 입력하세요.');
          form.reset({
            date: new Date(),
            counterparty_name: '',
            total_amount_received: '',
            payment_method: data.payment_method, // 결제수단은 유지
            category: '',
            evidence_type: data.evidence_type || 'TAX_INVOICE',
            taxation_type: 'TAXABLE',
            supply_amount: '',
            vat_amount: '0',
            has_withholding: false,
            withholding_income_tax: '0',
            withholding_local_tax: '0',
            project: '',
            description: '',
          });
          onContinueAdding?.();
        } else {
          toast.success('수입이 성공적으로 저장되었습니다.');
          onSuccess();
        }
      }
    } catch (error) {
      console.error('수입 저장 오류:', error);
      console.error('오류 상세:', error);
      toast.error(`수입 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? '' : num.toLocaleString('ko-KR');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 기본 정보 (필수 섹션) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              기본 정보
              <Badge variant="secondary" className="text-xs">필수</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 날짜 */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>거래일자 *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy년 MM월 dd일", { locale: ko })
                          ) : (
                            <span>날짜를 선택하세요</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 거래처명 */}
            <FormField
              control={form.control}
              name="counterparty_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>거래처명 *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="거래 상대방 이름 또는 회사명을 입력하세요"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    수입을 지급한 회사나 개인의 이름을 입력하세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 총 수령액 */}
            <FormField
              control={form.control}
              name="total_amount_received"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>총 수령액 *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number"
                        placeholder="실제로 받은 총 금액을 입력하세요"
                        {...field}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        원
                      </span>
                    </div>
                  </FormControl>
                  {field.value && (
                    <FormDescription className="text-xs text-green-600">
                      {formatCurrency(field.value)}원 
                      {watchTaxationType === 'TAXABLE' && ' (VAT 포함)'}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 결제수단 */}
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>결제수단 *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="결제수단을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover">
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex items-center gap-2">
                            <method.icon className="h-4 w-4" />
                            {method.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 사용 가이드 */}
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm text-muted-foreground">
            필수 정보만 입력해도 거래를 저장할 수 있습니다. 
            추가 옵션은 "상세 정보" 섹션에서 설정하세요.
          </AlertDescription>
        </Alert>

        {/* 상세 정보 (선택 섹션) */}
        <Collapsible open={isDetailMode} onOpenChange={setIsDetailMode}>
          <CollapsibleTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                상세 정보 설정
                <Badge variant="outline" className="text-xs">선택</Badge>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                isDetailMode && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {/* 카테고리 */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리</FormLabel>
                      <Select value={field.value || ''} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="수입 카테고리를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover">
                          {incomeCategories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        미선택 시 기본 카테고리로 분류됩니다
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 증빙유형 */}
                <FormField
                  control={form.control}
                  name="evidence_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>증빙유형</FormLabel>
                      <Select value={field.value || ''} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="증빙유형을 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover">
                          {EVIDENCE_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex flex-col items-start">
                                <span>{type.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {type.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        결제수단에 따라 자동으로 설정됩니다
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 프로젝트 */}
                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>프로젝트명</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="관련 프로젝트명 (선택사항)"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* 설명 */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>설명</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="추가 설명 (선택사항)"
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* 실시간 미리보기 */}
        {watchTotalAmount && (
          <Alert>
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              <div className="text-sm space-y-1">
                <div className="font-medium">계산 결과:</div>
                <div>공급가액: {formatCurrency(form.watch('supply_amount'))}원</div>
                <div>부가세: {formatCurrency(form.watch('vat_amount'))}원</div>
                <div className="font-medium text-primary">
                  총액: {formatCurrency(watchTotalAmount)}원
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* 저장 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            type="submit"
            disabled={isCreating}
            onClick={() => setSaveType('save')}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {isCreating && saveType === 'save' ? (initialData?.id ? '수정 중...' : '저장 중...') : (initialData?.id ? '수정' : '저장')}
          </Button>
          
          {!initialData?.id && (
            <Button 
              type="submit"
              variant="outline"
              disabled={isCreating}
              onClick={() => setSaveType('continue')}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating && saveType === 'continue' ? '저장 중...' : '저장 후 계속 입력'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};