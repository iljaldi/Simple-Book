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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { 
  Calendar as CalendarIcon,
  ChevronDown,
  Calculator,
  Settings,
  Save,
  Plus,
  Receipt,
  CreditCard,
  Building2,
  Smartphone,
  Info
} from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { toast } from 'sonner';

// 국세청 서식 기준 필수 항목 + 디자이너 추가 항목
const simpleExpenseSchema = z.object({
  // 필수 항목 (국세청 서식 기준)
  date: z.date({ required_error: '거래 발생 날짜를 선택해주세요' }),
  account_subject: z.string().min(1, '계정과목을 선택해주세요'),
  transaction_content: z.string().min(1, '거래내용을 입력해주세요'),
  counterparty_name: z.string().min(1, '거래처명을 입력해주세요'),
  supply_amount: z.string().min(1, '비용금액(공급가액)을 입력해주세요'),
  vat_amount: z.string().min(1, '비용부가세를 입력해주세요'),
  evidence_type: z.string().min(1, '증빙유형을 선택해주세요'),
  evidence_number: z.string().optional(),
  
  // 디자이너 추가 항목
  tax_classification: z.string().default('TAXABLE'),
  payment_method: z.string().min(1, '결제수단을 선택해주세요'),
  payment_status: z.string().default('PAID'),
  business_use_ratio: z.number().default(100),
  counterparty_biz_no: z.string().optional(),
  project_tag: z.string().optional(),
  client_tag: z.string().optional(),
  is_asset: z.boolean().default(false),
  is_depreciation: z.boolean().default(false),
  withholding_amount: z.string().default('0'),
  description: z.string().optional(),
});

type SimpleExpenseFormData = z.infer<typeof simpleExpenseSchema>;

interface SimpleExpenseFormProps {
  onSuccess: () => void;
  onContinueAdding?: () => void;
  initialData?: any;
}

// 돈의 성격 (지출)
const ACCOUNT_SUBJECTS = [
  { value: 'COST_OF_GOODS', label: '비용(원가)', description: '상품/서비스 원가' },
  { value: 'GENERAL_ADMIN', label: '비용(관리)', description: '사무용품, 통신비 등' },
  { value: 'MARKETING', label: '비용(마케팅)', description: '광고, 홍보비' },
  { value: 'RENT', label: '비용(임대)', description: '사무실 임대료' },
  { value: 'UTILITIES', label: '비용(공과금)', description: '전기, 가스, 수도' },
  { value: 'EQUIPMENT', label: '장비(컴퓨터)', description: '컴퓨터, 소프트웨어' },
  { value: 'TRAVEL', label: '비용(여비)', description: '출장, 교통비' },
  { value: 'OTHER_EXPENSE', label: '비용(기타)', description: '기타 지출' },
];

// 세금 종류
const TAX_CLASSIFICATIONS = [
  { value: 'TAXABLE', label: '과세(10%)', description: '일반 과세' },
  { value: 'ZERO_RATED', label: '영세율(해외수출)', description: '해외매출 등' },
  { value: 'EXEMPT', label: '면세(서적)', description: '면세 대상' },
];

// 결제 방법
const PAYMENT_METHODS = [
  { value: 'card', label: '카드', icon: CreditCard },
  { value: 'transfer', label: '계좌이체', icon: Building2 },
  { value: 'cash', label: '현금', icon: CreditCard },
  { value: 'pg', label: '네이버페이(자동정산)', icon: CreditCard },
  { value: 'simple_pay', label: '간편결제', icon: Smartphone },
  { value: 'etc', label: '기타', icon: CreditCard },
];

// 받았나? 아직인가?
const PAYMENT_STATUS = [
  { value: 'PAID', label: '완료', description: '현금/외상 불문' },
  { value: 'PENDING', label: '미지급(아직 못 냄)', description: '외상거래' },
  { value: 'PARTIAL', label: '부분지급', description: '일부 지급' },
];

// 증거 종류
const EVIDENCE_TYPES = [
  { value: 'CARD', label: '카드매출전표', description: '자동 연계' },
  { value: 'TAX_INVOICE', label: '세금계산서 #A123-45', description: '사업자번호 필요' },
  { value: 'INVOICE', label: '계산서', description: '간이과세자' },
  { value: 'CASH_RCPT', label: '현금영수증', description: '국세청 연계' },
  { value: 'SIMPLE_RCPT', label: '간이영수증', description: '비용 제한' },
  { value: 'NONE', label: '증빙 없음', description: '비용 불인정' },
];

export const SimpleExpenseForm: React.FC<SimpleExpenseFormProps> = ({ 
  onSuccess, 
  onContinueAdding,
  initialData 
}) => {
  const [isDetailMode, setIsDetailMode] = useState(!!initialData?.project || !!initialData?.description);
  const [saveType, setSaveType] = useState<'save' | 'continue'>('save');
  const { createTransactionAsync, updateTransaction, isCreating } = useTransactions();
  const { categories } = useCategories();

  const form = useForm<SimpleExpenseFormData>({
    resolver: zodResolver(simpleExpenseSchema),
    defaultValues: initialData ? {
      date: new Date(initialData.date),
      account_subject: initialData.account_subject || 'GENERAL_ADMIN',
      transaction_content: initialData.transaction_content || '',
      counterparty_name: initialData.counterparty_name || '',
      supply_amount: initialData.supply_amount?.toString() || '',
      vat_amount: initialData.vat_amount?.toString() || '0',
      evidence_type: initialData.evidence_type || 'CARD',
      evidence_number: initialData.evidence_number || '',
      tax_classification: initialData.tax_classification || 'TAXABLE',
      payment_method: initialData.payment_method || 'card',
      payment_status: initialData.payment_status || 'PAID',
      business_use_ratio: Math.round((initialData.business_use_ratio || 1) * 100),
      counterparty_biz_no: initialData.counterparty_biz_no || '',
      project_tag: initialData.project_tag || '',
      client_tag: initialData.client_tag || '',
      is_asset: initialData.is_asset || false,
      is_depreciation: initialData.is_depreciation || false,
      withholding_amount: initialData.withholding_amount?.toString() || '0',
      description: initialData.description || '',
    } : {
      date: new Date(),
      account_subject: 'GENERAL_ADMIN',
      transaction_content: '',
      counterparty_name: '',
      supply_amount: '',
      vat_amount: '0',
      evidence_type: 'CARD',
      evidence_number: '',
      tax_classification: 'TAXABLE',
      payment_method: 'card',
      payment_status: 'PAID',
      business_use_ratio: 100,
      counterparty_biz_no: '',
      project_tag: '',
      client_tag: '',
      is_asset: false,
      is_depreciation: false,
      withholding_amount: '0',
      description: '',
    },
  });

  const expenseCategories = categories.filter(cat => cat.transaction_type === 'expense');
  
  // 총 결제금액 변경 시 공급가액/부가세 자동 계산
  const watchTotalAmount = form.watch('total_amount');
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
          return;
      }
      if (autoEvidenceType && isDetailMode) {
        form.setValue('evidence_type', autoEvidenceType);
      }
    }
  }, [watchPaymentMethod, form, isDetailMode]);

  // 카테고리 변경 시 과세유형 자동 설정
  const watchCategoryId = form.watch('category_id');
  useEffect(() => {
    if (watchCategoryId) {
      const selectedCategory = expenseCategories.find(cat => cat.id === watchCategoryId);
      if (selectedCategory?.default_taxation_type) {
        form.setValue('taxation_type', selectedCategory.default_taxation_type as any);
      }
    }
  }, [watchCategoryId, expenseCategories, form]);

  const onSubmit = async (data: SimpleExpenseFormData) => {
    try {
      const transactionData = {
        type: 'expense' as const,
        date: format(data.date, 'yyyy-MM-dd'),
        category: data.account_subject,
        description: data.transaction_content,
        counterparty_name: data.counterparty_name,
        counterparty_biz_no: data.counterparty_biz_no || null,
        amount_gross: parseFloat(data.supply_amount) + parseFloat(data.vat_amount),
        vat_amount: parseFloat(data.vat_amount),
        evidence_type: data.evidence_type as 'TAX_INVOICE' | 'INVOICE' | 'CARD' | 'CASH_RCPT' | 'SIMPLE_RCPT' | 'NONE',
        taxation_type: data.tax_classification as 'TAXABLE' | 'ZERO_RATED' | 'EXEMPT',
        payment_method: (data.payment_method === 'simple_pay' ? 'etc' : data.payment_method) as 'transfer' | 'card' | 'cash' | 'etc',
        status: data.payment_status === 'PAID' ? 'confirmed' : 'draft' as 'draft' | 'confirmed',
        business_use_ratio: data.business_use_ratio / 100,
        project: data.project_tag || data.client_tag || null,
        withholding_income_tax: parseFloat(data.withholding_amount) || 0,
        currency: 'KRW',
        is_deductible: true,
      };

      if (initialData?.id) {
        // 수정 모드
        await updateTransaction({ id: initialData.id, updates: transactionData });
        toast.success('지출이 성공적으로 수정되었습니다.');
        onSuccess();
      } else {
        // 새 거래 생성 모드
        console.log('Calling createTransactionAsync...');
        const result = await createTransactionAsync(transactionData);
        console.log('createTransactionAsync result:', result);
        
        if (saveType === 'continue') {
          form.reset({
            date: new Date(),
            account_subject: 'GENERAL_ADMIN',
            transaction_content: '',
            counterparty_name: '',
            supply_amount: '',
            vat_amount: '0',
            evidence_type: 'CARD',
            evidence_number: '',
            tax_classification: 'TAXABLE',
            payment_method: data.payment_method, // 결제수단은 유지
            payment_status: 'PAID',
            business_use_ratio: 100,
            counterparty_biz_no: '',
            project_tag: '',
            client_tag: '',
            is_asset: false,
            is_depreciation: false,
            withholding_amount: '0',
            description: '',
          });
          onContinueAdding?.();
        } else {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('지출 저장 오류:', error);
      console.error('오류 상세:', error);
      toast.error(`지출 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? '' : num.toLocaleString('ko-KR');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 필수 항목 (국세청 서식 기준) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              필수 항목 (국세청 서식 기준)
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel className="cursor-help">날짜 *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>일자</p>
                        <p>거래가 발생한 날짜 (현금/외상 가리지 않음)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                            <span>그 일이 언제 있었는지</span>
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
                  <FormDescription className="text-xs text-muted-foreground">
                    예: 2025-09-27
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 돈의 성격 */}
            <FormField
              control={form.control}
              name="account_subject"
              render={({ field }) => (
                <FormItem>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel className="cursor-help">돈의 성격 *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>계정과목</p>
                        <p>거래 성격에 맞는 항목 선택 (수입·매출원가·일반관리비·고정자산 등)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="이 돈이 왜 오갔는지 카테고리" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover">
                      {ACCOUNT_SUBJECTS.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>
                          <div className="flex flex-col items-start">
                            <span>{subject.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {subject.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-muted-foreground">
                    예: 수입(로고 디자인), 비용(전기요금), 장비(맥북)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 한 줄 설명 */}
            <FormField
              control={form.control}
              name="transaction_content"
              render={({ field }) => (
                <FormItem>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel className="cursor-help">한 줄 설명 *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>거래내용</p>
                        <p>한 줄 설명으로 거래 내용을 명확히 기록</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <FormControl>
                    <Input 
                      placeholder="뭐 하다가 생긴 돈/지출인지 한 줄 메모"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    예: "네이버스토어 로고 패키지 판매"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 누구랑 */}
            <FormField
              control={form.control}
              name="counterparty_name"
              render={({ field }) => (
                <FormItem>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel className="cursor-help">누구랑 *</FormLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>거래처</p>
                        <p>실제로 돈 주고받은 상대 이름/업체명</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <FormControl>
                    <Input 
                      placeholder="돈 주고받은 상대"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    예: "주식회사 알파(고객)", "KB전기(납품처)"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 쓴 돈(세금 빼고) / 붙은 세금(쓴 쪽) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supply_amount"
                render={({ field }) => (
                  <FormItem>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="cursor-help">쓴 돈(세금 빼고) *</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>비용금액(공급가액)</p>
                          <p>매입액(공급가액)과 매입 부가세를 분리 기재</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number"
                          placeholder="내가 결제한 실제 값"
                          {...field}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          원
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      예: 200,000원
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vat_amount"
                render={({ field }) => (
                  <FormItem>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="cursor-help">붙은 세금(쓴 쪽) *</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>비용부가세(매입세액)</p>
                          <p>매입액(공급가액)과 매입 부가세를 분리 기재</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number"
                          placeholder="계산서·카드전표에 찍힌 10%"
                          {...field}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          원
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      예: 20,000원
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 증거 종류/번호 */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="evidence_type"
                render={({ field }) => (
                  <FormItem>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="cursor-help">증거 종류 *</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>증빙유형</p>
                          <p>세금계산서/계산서/영수증/카드전표 등 증빙 종류와 번호</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="세금계산서, 카드전표, 현금영수증 등" />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evidence_number"
                render={({ field }) => (
                  <FormItem>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="cursor-help">증거 번호</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>증빙번호</p>
                          <p>세금계산서/계산서/영수증/카드전표 등 증빙 번호</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormControl>
                      <Input 
                        placeholder="고유번호 (선택사항)"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      예: "세금계산서 #A123-45"
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* 사용 가이드 */}
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm text-muted-foreground">
            필수 항목만 입력해도 거래를 저장할 수 있습니다. 
            디자이너에게 유용한 추가 옵션은 "상세 정보" 섹션에서 설정하세요.
          </AlertDescription>
        </Alert>

        {/* 상세 정보 (디자이너 추가 항목) */}
        <Collapsible open={isDetailMode} onOpenChange={setIsDetailMode}>
          <CollapsibleTrigger asChild>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                디자이너 추가 항목
                <Badge variant="outline" className="text-xs">권장</Badge>
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
                {/* 과세구분 */}
                <FormField
                  control={form.control}
                  name="tax_classification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>과세구분</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="과세구분을 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover">
                          {TAX_CLASSIFICATIONS.map((classification) => (
                            <SelectItem key={classification.value} value={classification.value}>
                              <div className="flex flex-col items-start">
                                <span>{classification.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {classification.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        과세/면세/영세율(해외매출 등) 체크 → 부가세 신고 때 오류 방지
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 결제수단 */}
                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>결제수단</FormLabel>
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
                      <FormDescription className="text-xs">
                        현금/계좌이체/카드/PG(네이버페이 등) — 정산 내역 대조가 쉬워짐
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 수금/지급 상태 */}
                <FormField
                  control={form.control}
                  name="payment_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>수금/지급 상태</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="지급 상태를 선택하세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover">
                          {PAYMENT_STATUS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex flex-col items-start">
                                <span>{status.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {status.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        미수금/미지급금 여부(외상거래 관리) - 발생주의로 기록
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 사업용 비율 */}
                <FormField
                  control={form.control}
                  name="business_use_ratio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사업용 비율: {field.value}%</FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={10}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        해당 지출이 사업과 관련된 비율을 설정하세요
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 프로젝트/클라이언트 태그 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="project_tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>프로젝트 태그</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="로고 패키지, 웹사이트 빌드 등"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          프로젝트별로 묶기 → 리포트, 견적 회고에 바로 씀
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="client_tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>클라이언트 태그</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="클라이언트명 또는 업체명"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          클라이언트별 지출 관리
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                {/* 사업자번호 */}
                <FormField
                  control={form.control}
                  name="counterparty_biz_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>사업자번호</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="거래처 사업자번호 (선택사항)"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        세금계산서 발행 시 필요합니다
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 자산/감가상각 플래그 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="is_asset"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">고정자산</FormLabel>
                          <FormDescription className="text-xs">
                            맥북, 아이패드, 카메라 등 고정자산 체크
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_depreciation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">감가상각</FormLabel>
                          <FormDescription className="text-xs">
                            연간 감가상각비 반영 루틴 만들기
                          </FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* 원천징수액 */}
                <FormField
                  control={form.control}
                  name="withholding_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>원천징수액 (있을 때)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number"
                            placeholder="원천징수된 금액"
                            {...field}
                            className="pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            원
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        플랫폼/고객이 원천징수한 금액 메모 → 5월 종소세 때 합산 검증 용이
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 설명 */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>추가 설명</FormLabel>
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
        {(form.watch('supply_amount') || form.watch('vat_amount')) && (
          <Alert>
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              <div className="text-sm space-y-1">
                <div className="font-medium">계산 결과:</div>
                <div>쓴 돈(세금 빼고): {formatCurrency(form.watch('supply_amount'))}원</div>
                <div>붙은 세금(쓴 쪽): {formatCurrency(form.watch('vat_amount'))}원</div>
                <div className="font-medium text-primary">
                  총액: {formatCurrency((parseFloat(form.watch('supply_amount') || '0') + parseFloat(form.watch('vat_amount') || '0')).toString())}원
                </div>
                <div>사업용: {form.watch('business_use_ratio')}%</div>
                {form.watch('withholding_amount') && parseFloat(form.watch('withholding_amount')) > 0 && (
                  <div className="text-orange-600">
                    미리 떼간 세금: {formatCurrency(form.watch('withholding_amount'))}원
                  </div>
                )}
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