import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertTriangle, Upload, CreditCard, Banknote, Smartphone, Building2, MoreHorizontal, ChevronDown, Calculator, Receipt, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const expenseSchema = z.object({
  // 기본 정보
  date: z.date({
    required_error: "날짜를 선택해주세요",
  }),
  counterparty_name: z.string().min(1, '거래처명을 입력해주세요'),
  counterparty_biz_no: z.string().optional(),
  category_id: z.string().min(1, '카테고리를 선택해주세요'),
  
  // 과세 정보
  taxation_type: z.enum(['TAXABLE', 'ZERO_RATED', 'EXEMPT']).default('TAXABLE'),
  
  // 금액 관련
  supply_amount: z.string().min(1, '공급가액을 입력해주세요'),
  vat_amount: z.string().optional(),
  total_amount: z.string().min(1, '합계금액을 입력해주세요'),
  business_use_ratio: z.number().min(0).max(100).default(100),
  
  // 증빙/결제
  evidence_type: z.string().min(1, '증빙유형을 선택해주세요'),
  payment_method: z.string().min(1, '결제수단을 선택해주세요'),
  
  // 관리/메모
  project: z.string().optional(),
  description: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

// 결제수단 옵션 (우선순위 높음)
const PAYMENT_METHODS = [
  { value: 'card', label: '카드결제', icon: CreditCard, description: '신용/체크카드' },
  { value: 'transfer', label: '계좌이체', icon: Building2, description: '세금계산서 권장' },
  { value: 'cash', label: '현금', icon: Banknote, description: '현금영수증' },
  { value: 'simple_pay', label: '간편결제', icon: Smartphone, description: '페이앱' },
  { value: 'etc', label: '기타', icon: MoreHorizontal, description: '기타수단' },
];

// 증빙유형 옵션
const EVIDENCE_TYPES = [
  { value: 'TAX_INVOICE', label: '세금계산서', description: '사업자번호 필요' },
  { value: 'INVOICE', label: '계산서', description: '간이과세자' },
  { value: 'CARD', label: '카드매출전표', description: '자동 연계' },
  { value: 'CASH_RCPT', label: '현금영수증', description: '국세청 연계' },
  { value: 'SIMPLE_RCPT', label: '간이영수증', description: '비용 제한' },
  { value: 'NONE', label: '증빙 없음', description: '비용 불인정' },
];

interface ExpenseFormProps {
  onSuccess: () => void;
  onContinueAdding?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSuccess, onContinueAdding }) => {
  const { createTransactionAsync, isCreating } = useTransactions();
  const { categories } = useCategories();
  const { toast } = useToast();
  const expenseCategories = categories.filter(cat => cat.transaction_type === 'expense');
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [continueAdding, setContinueAdding] = useState(false);
  const [isSimpleMode, setIsSimpleMode] = useState(true);

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date(),
      counterparty_name: '',
      counterparty_biz_no: '',
      category_id: '',
      taxation_type: 'TAXABLE',
      supply_amount: '',
      vat_amount: '0',
      total_amount: '',
      business_use_ratio: 100,
      evidence_type: 'CARD',
      payment_method: 'card',
      project: '',
      description: '',
    },
  });

  // 결제수단 → 증빙유형 자동 매핑
  const watchedPaymentMethod = form.watch('payment_method');
  useEffect(() => {
    if (watchedPaymentMethod) {
      let autoEvidenceType = '';
      switch (watchedPaymentMethod) {
        case 'card':
        case 'simple_pay':
          autoEvidenceType = 'CARD';
          break;
        case 'transfer':
          autoEvidenceType = 'TAX_INVOICE';
          break;
        case 'cash':
          autoEvidenceType = 'CASH_RCPT';
          break;
        default:
          return; // 'etc'는 기존값 유지
      }
      if (autoEvidenceType) {
        form.setValue('evidence_type', autoEvidenceType);
        toast({
          description: `증빙유형이 "${EVIDENCE_TYPES.find(e => e.value === autoEvidenceType)?.label}"로 자동 설정되었습니다.`,
        });
      }
    }
  }, [watchedPaymentMethod, form, toast]);

  // 카테고리 → 과세유형 자동 설정
  const watchedCategory = form.watch('category_id');
  useEffect(() => {
    if (watchedCategory) {
      const selectedCategory = expenseCategories.find(cat => cat.id === watchedCategory);
      if (selectedCategory?.default_taxation_type) {
        form.setValue('taxation_type', selectedCategory.default_taxation_type as any);
      }
    }
  }, [watchedCategory, expenseCategories, form]);

  // 합계금액 → 공급가/부가세 자동 분해
  const watchedFields = form.watch(['total_amount', 'taxation_type', 'evidence_type']);
  useEffect(() => {
    const totalAmount = parseFloat(watchedFields[0] || '0');
    const taxationType = watchedFields[1];
    const evidenceType = watchedFields[2];

    if (totalAmount > 0) {
      const isVatApplicable = taxationType === 'TAXABLE';
      const isVatZero = evidenceType === 'SIMPLE_RCPT' || evidenceType === 'NONE' || !isVatApplicable;
      
      if (isVatZero) {
        form.setValue('supply_amount', totalAmount.toString());
        form.setValue('vat_amount', '0');
      } else if (isVatApplicable) {
        const calculatedSupply = Math.round(totalAmount / 1.1);
        const calculatedVat = totalAmount - calculatedSupply;
        form.setValue('supply_amount', calculatedSupply.toString());
        form.setValue('vat_amount', calculatedVat.toString());
      }
    }
  }, [watchedFields, form]);

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const supplyAmount = parseFloat(data.supply_amount);
      const vatAmount = parseFloat(data.vat_amount || '0');
      const totalAmount = supplyAmount + vatAmount;
      
      await createTransactionAsync({
        type: 'expense',
        amount_gross: totalAmount,
        vat_amount: vatAmount,
        counterparty_name: data.counterparty_name,
        counterparty_biz_no: data.counterparty_biz_no || null,
        category_id: data.category_id,
        date: format(data.date, 'yyyy-MM-dd'),
        evidence_type: data.evidence_type as any,
        payment_method: data.payment_method as any,
        business_use_ratio: data.business_use_ratio / 100,
        project: data.project || null,
        description: data.description || null,
      });

      const selectedCategory = expenseCategories.find(cat => cat.id === data.category_id);
      const selectedPayment = PAYMENT_METHODS.find(p => p.value === data.payment_method);
      
      toast({
        description: `✅ ${totalAmount.toLocaleString()}원 (${selectedCategory?.name}, ${selectedPayment?.label}) 지출이 등록되었습니다.`,
      });

      if (!continueAdding) {
        onSuccess();
      }
      form.reset();
    } catch (error) {
      console.error('Expense creation failed:', error);
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount || '0');
    return num > 0 ? `${num.toLocaleString()}원` : '0원';
  };

  const watchedTotalAmount = form.watch('total_amount');
  const watchedSupplyAmount = form.watch('supply_amount');
  const watchedVatAmount = form.watch('vat_amount');
  const watchedEvidenceType = form.watch('evidence_type');
  const selectedEvidence = EVIDENCE_TYPES.find(e => e.value === watchedEvidenceType);

  return (
    <div className="pb-20"> {/* Bottom padding for fixed bar */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* 1. 결제수단 선택 (최우선) */}
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                어떻게 결제했나요?
              </h3>
              <FormField
                control={form.control}
                name="payment_method"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {PAYMENT_METHODS.map((method) => {
                          const IconComponent = method.icon;
                          return (
                            <Button
                              key={method.value}
                              type="button"
                              variant={field.value === method.value ? "default" : "outline"}
                              className="h-auto p-4 flex-col space-y-2"
                              onClick={() => field.onChange(method.value)}
                            >
                              <IconComponent className="h-6 w-6" />
                              <div className="text-sm font-medium">{method.label}</div>
                              <div className="text-xs text-muted-foreground">{method.description}</div>
                            </Button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* 계좌이체 선택 시 안내 */}
              {watchedPaymentMethod === 'transfer' && (
                <Alert className="mt-4">
                  <Building2 className="h-4 w-4" />
                  <AlertDescription>
                    계좌이체는 세금계산서 발행이 권장됩니다. 거래처 사업자번호를 입력해주세요.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* 2. 합계금액 입력 (강조) */}
          <Card className="shadow-card gradient-card">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                얼마를 지출했나요?
              </h3>
              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="예: 12000"
                          className="text-2xl font-semibold h-14 pr-12 text-center"
                          {...field}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                          원
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* 자동 계산 미리보기 */}
              {parseFloat(watchedTotalAmount || '0') > 0 && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>공급가액</span>
                    <span>{formatCurrency(watchedSupplyAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>부가세</span>
                    <span>{formatCurrency(watchedVatAmount)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>합계</span>
                    <span>{formatCurrency(watchedTotalAmount)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. 기본 정보 */}
          <Card className="shadow-card">
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>지출일자</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
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
                  name="counterparty_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>거래처명 *</FormLabel>
                      <FormControl>
                        <Input placeholder="예: 스타벅스 강남점" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리 *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="지출 카테고리를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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

          {/* 4. 증빙 확인 */}
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-primary" />
                증빙 확인
              </h3>
              
              <FormField
                control={form.control}
                name="evidence_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>증빙유형</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="증빙유형을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EVIDENCE_TYPES.map((evidence) => (
                          <SelectItem key={evidence.value} value={evidence.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{evidence.label}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {evidence.description}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 증빙별 안내 메시지 */}
              {selectedEvidence && (
                <Alert className={`mt-4 ${
                  selectedEvidence.value === 'SIMPLE_RCPT' || selectedEvidence.value === 'NONE'
                    ? 'border-destructive/50 text-destructive'
                    : 'border-primary/50'
                }`}>
                  {selectedEvidence.value === 'SIMPLE_RCPT' || selectedEvidence.value === 'NONE' ? (
                    <AlertTriangle className="h-4 w-4" />
                  ) : (
                    <Receipt className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {selectedEvidence.value === 'CARD' && "카드매출전표는 국세청에서 자동으로 확인됩니다."}
                    {selectedEvidence.value === 'CASH_RCPT' && "현금영수증은 국세청에서 자동으로 확인됩니다."}
                    {selectedEvidence.value === 'TAX_INVOICE' && "세금계산서는 정확한 세무처리에 도움이 됩니다."}
                    {selectedEvidence.value === 'SIMPLE_RCPT' && "간이영수증은 비용 인정에 제한이 있을 수 있습니다."}
                    {selectedEvidence.value === 'NONE' && "증빙이 없으면 비용으로 인정받지 못할 수 있습니다."}
                  </AlertDescription>
                </Alert>
              )}

              {/* 영수증 업로드 영역 */}
              <div className="mt-4 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">영수증을 촬영하거나 파일을 업로드하세요</p>
                <p className="text-xs text-muted-foreground mt-1">(향후 OCR로 자동 입력됩니다)</p>
              </div>
            </CardContent>
          </Card>

          {/* 5. 고급 옵션 (접기) */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                고급 옵션
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="shadow-card mt-4">
                <CardContent className="pt-6 space-y-4">
                  
                  <FormField
                    control={form.control}
                    name="counterparty_biz_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>거래처 사업자번호</FormLabel>
                        <FormControl>
                          <Input placeholder="000-00-00000" {...field} />
                        </FormControl>
                        <FormDescription>
                          세금계산서 발행 시 필요합니다
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>과세유형</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TAXABLE">과세 (10%)</SelectItem>
                            <SelectItem value="ZERO_RATED">영세율 (0%)</SelectItem>
                            <SelectItem value="EXEMPT">면세 (0%)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="business_use_ratio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사업 관련 비율: {field.value}%</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={10}
                            value={[field.value]}
                            onValueChange={(values) => field.onChange(values[0])}
                          />
                        </FormControl>
                        <FormDescription>
                          개인과 사업이 혼재된 지출의 사업 비율
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>프로젝트명</FormLabel>
                        <FormControl>
                          <Input placeholder="프로젝트나 메모를 입력하세요" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>상세 메모</FormLabel>
                        <FormControl>
                          <Textarea placeholder="추가 설명이나 메모" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

        </form>
      </Form>

      {/* 6. 하단 고정 저장 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground">합계금액</div>
            <div className="text-lg font-semibold">
              {formatCurrency(watchedTotalAmount)}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="continue-adding"
                checked={continueAdding}
                onCheckedChange={setContinueAdding}
              />
              <label htmlFor="continue-adding" className="text-sm text-muted-foreground">
                계속 추가
              </label>
            </div>
            
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isCreating || !form.formState.isValid}
              className="px-6"
            >
              {isCreating ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};