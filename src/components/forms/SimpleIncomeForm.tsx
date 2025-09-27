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

// 국세청 서식 기준 필수 항목 + 디자이너 추가 항목
const simpleIncomeSchema = z.object({
  // 필수 항목 (국세청 서식 기준)
  date: z.date({ required_error: '거래 발생 날짜를 선택해주세요' }),
  account_subject: z.string().min(1, '계정과목을 선택해주세요'),
  transaction_content: z.string().min(1, '거래내용을 입력해주세요'),
  counterparty_name: z.string().min(1, '거래처명을 입력해주세요'),
  supply_amount: z.string().min(1, '수입금액(공급가액)을 입력해주세요'),
  vat_amount: z.string().min(1, '수입부가세를 입력해주세요'),
  evidence_type: z.string().min(1, '증빙유형을 선택해주세요'),
  evidence_number: z.string().optional(),
  
  // 디자이너 추가 항목
  tax_classification: z.string().default('TAXABLE'),
  payment_method: z.string().min(1, '결제수단을 선택해주세요'),
  payment_status: z.string().default('RECEIVED'),
  project_tag: z.string().optional(),
  client_tag: z.string().optional(),
  is_asset: z.boolean().default(false),
  is_depreciation: z.boolean().default(false),
  withholding_amount: z.string().default('0'),
  withholding_income_tax: z.string().default('0'),
  withholding_local_tax: z.string().default('0'),
  description: z.string().optional(),
});

type SimpleIncomeFormData = z.infer<typeof simpleIncomeSchema>;

interface SimpleIncomeFormProps {
  onSuccess: () => void;
  onContinueAdding?: () => void;
  initialData?: any;
}

// 돈의 성격 (수입)
const ACCOUNT_SUBJECTS = [
  { value: 'SALES', label: '수입(상품)', description: '상품 판매로 받은 돈' },
  { value: 'SERVICE_REVENUE', label: '수입(서비스)', description: '디자인/개발 서비스로 받은 돈' },
  { value: 'CONSULTING_REVENUE', label: '수입(자문)', description: '컨설팅/자문으로 받은 돈' },
  { value: 'ROYALTY', label: '수입(저작권)', description: '저작권/특허로 받은 돈' },
  { value: 'OTHER_REVENUE', label: '수입(기타)', description: '기타 수입' },
];

// 세금 종류
const TAX_CLASSIFICATIONS = [
  { value: 'TAXABLE', label: '과세(10%)', description: '일반 과세' },
  { value: 'ZERO_RATED', label: '영세율(해외수출)', description: '해외매출 등' },
  { value: 'EXEMPT', label: '면세(서적)', description: '면세 대상' },
];

// 결제 방법
const PAYMENT_METHODS = [
  { value: 'transfer', label: '계좌이체', icon: Building2 },
  { value: 'card', label: '카드', icon: CreditCard },
  { value: 'cash', label: '현금', icon: CreditCard },
  { value: 'pg', label: '네이버페이(자동정산)', icon: CreditCard },
  { value: 'etc', label: '기타', icon: CreditCard },
];

// 받았나? 아직인가?
const PAYMENT_STATUS = [
  { value: 'RECEIVED', label: '완료', description: '현금/외상 불문' },
  { value: 'PENDING', label: '미수금(아직 못 받음)', description: '외상거래' },
  { value: 'PARTIAL', label: '부분수금', description: '일부 수금' },
];

// 증거 종류
const EVIDENCE_TYPES = [
  { value: 'TAX_INVOICE', label: '세금계산서 #A123-45', description: '사업자간 거래' },
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
  const { createTransactionAsync, updateTransaction, isCreating } = useTransactions();
  const { categories } = useCategories();

  const form = useForm<SimpleIncomeFormData>({
    resolver: zodResolver(simpleIncomeSchema),
    defaultValues: initialData ? {
      date: new Date(initialData.date),
      account_subject: initialData.account_subject || 'SERVICE_REVENUE',
      transaction_content: initialData.transaction_content || '',
      counterparty_name: initialData.counterparty_name || '',
      supply_amount: initialData.supply_amount?.toString() || '',
      vat_amount: initialData.vat_amount?.toString() || '0',
      evidence_type: initialData.evidence_type || 'TAX_INVOICE',
      evidence_number: initialData.evidence_number || '',
      tax_classification: initialData.tax_classification || 'TAXABLE',
      payment_method: initialData.payment_method || 'transfer',
      payment_status: initialData.payment_status || 'RECEIVED',
      project_tag: initialData.project_tag || '',
      client_tag: initialData.client_tag || '',
      is_asset: initialData.is_asset || false,
      is_depreciation: initialData.is_depreciation || false,
      withholding_amount: initialData.withholding_amount?.toString() || '0',
      withholding_income_tax: initialData.withholding_income_tax?.toString() || '0',
      withholding_local_tax: initialData.withholding_local_tax?.toString() || '0',
      description: initialData.description || '',
    } : {
      date: new Date(),
      account_subject: 'SERVICE_REVENUE',
      transaction_content: '',
      counterparty_name: '',
      supply_amount: '',
      vat_amount: '0',
      evidence_type: 'TAX_INVOICE',
      evidence_number: '',
      tax_classification: 'TAXABLE',
      payment_method: 'transfer',
      payment_status: 'RECEIVED',
      project_tag: '',
      client_tag: '',
      is_asset: false,
      is_depreciation: false,
      withholding_amount: '0',
      withholding_income_tax: '0',
      withholding_local_tax: '0',
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
      console.log('Form submitted with data:', data);
      
      const transactionData = {
        type: 'income' as const,
        date: format(data.date, 'yyyy-MM-dd'),
        category: data.account_subject,
        description: data.transaction_content,
        counterparty_name: data.counterparty_name,
        amount_gross: parseFloat(data.supply_amount) + parseFloat(data.vat_amount),
        vat_amount: parseFloat(data.vat_amount),
        evidence_type: data.evidence_type as 'TAX_INVOICE' | 'INVOICE' | 'CARD' | 'CASH_RCPT' | 'SIMPLE_RCPT' | 'NONE',
        taxation_type: data.tax_classification as 'TAXABLE' | 'ZERO_RATED' | 'EXEMPT',
        payment_method: data.payment_method as 'transfer' | 'card' | 'cash' | 'etc',
        status: data.payment_status === 'RECEIVED' ? 'confirmed' : 'draft' as 'draft' | 'confirmed',
        project: data.project_tag || data.client_tag || null,
        withholding_income_tax: parseFloat(data.withholding_income_tax) || 0,
        withholding_local_tax: parseFloat(data.withholding_local_tax) || 0,
        currency: 'KRW',
      };
      
      console.log('Prepared transaction data:', transactionData);

      if (initialData?.id) {
        // 수정 모드
        await updateTransaction({ id: initialData.id, updates: transactionData });
        toast.success('수입이 성공적으로 수정되었습니다.');
        onSuccess();
      } else {
        // 새 거래 생성 모드
        console.log('Calling createTransactionAsync...');
        const result = await createTransactionAsync(transactionData);
        console.log('createTransactionAsync result:', result);
        
        if (saveType === 'continue') {
          form.reset({
            date: new Date(),
            account_subject: 'SERVICE_REVENUE',
            transaction_content: '',
            counterparty_name: '',
            supply_amount: '',
            vat_amount: '0',
            evidence_type: 'TAX_INVOICE',
            evidence_number: '',
            tax_classification: 'TAXABLE',
            payment_method: data.payment_method, // 결제수단은 유지
            payment_status: 'RECEIVED',
            project_tag: '',
            client_tag: '',
            is_asset: false,
            is_depreciation: false,
            withholding_amount: '0',
            withholding_income_tax: '0',
            withholding_local_tax: '0',
            description: '',
          });
          onContinueAdding?.();
        } else {
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
        {/* 필수 항목 (국세청 서식 기준) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
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

            {/* 받은 돈(세금 빼고) / 붙은 세금(받은 쪽) */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supply_amount"
                render={({ field }) => (
                  <FormItem>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FormLabel className="cursor-help">받은 돈(세금 빼고) *</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>수입금액(공급가액)</p>
                          <p>매출액(공급가액)과 매출 부가세를 분리 기재</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number"
                          placeholder="실제 서비스/상품값"
                          {...field}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          원
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      예: 1,000,000원
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
                          <FormLabel className="cursor-help">붙은 세금(받은 쪽) *</FormLabel>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>수입부가세</p>
                          <p>매출액(공급가액)과 매출 부가세를 분리 기재</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number"
                          placeholder="고객에게 추가로 받은 10% 세금"
                          {...field}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          원
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      예: 100,000원
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
                {/* 세금 종류 */}
                <FormField
                  control={form.control}
                  name="tax_classification"
                  render={({ field }) => (
                    <FormItem>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FormLabel className="cursor-help">세금 종류</FormLabel>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>과세구분</p>
                            <p>과세/면세/영세율(해외매출 등) 체크 → 부가세 신고 때 오류 방지</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="과세 / 면세 / 영세율(해외 등)" />
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
                        예: "과세(10%)", "면세(서적)", "영세율(해외수출)"
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 결제 방법 */}
                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FormLabel className="cursor-help">결제 방법</FormLabel>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>결제수단</p>
                            <p>현금/계좌이체/카드/PG(네이버페이 등) — 정산 내역 대조가 쉬워짐</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="현금, 카드, 계좌이체, 네이버페이 등" />
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
                        예: "네이버페이(자동정산)"
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 받았나? 아직인가? */}
                <FormField
                  control={form.control}
                  name="payment_status"
                  render={({ field }) => (
                    <FormItem>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FormLabel className="cursor-help">받았나? 아직인가?</FormLabel>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>수금/지급 상태</p>
                            <p>미수금/미지급금 여부(외상거래 관리) - 발생주의로 기록</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="완료 / 미수금(아직 못 받음) / 미지급(아직 못 냄)" />
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
                        예: "미수금 1,100,000원"
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* 프로젝트/고객 라벨 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="project_tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>프로젝트 라벨</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="어떤 프로젝트/고객 건인지 라벨"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          예: "웹사이트_프리미엄패키지/오로라상사"
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="client_tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>고객 라벨</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="클라이언트명 또는 업체명"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          클라이언트별 수입 관리
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                {/* 비싼 장비, 나눠서 비용 */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="is_asset"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">비싼 장비</FormLabel>
                          <FormDescription className="text-xs">
                            맥북·아이패드 같은 비싼 장비는 몇 년에 걸쳐 나눠서 비용 처리
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
                          <FormLabel className="text-base">나눠서 비용</FormLabel>
                          <FormDescription className="text-xs">
                            예: "맥북 240만원 → 3년 나눠쓰기"
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

                {/* 미리 떼간 세금 */}
                <FormField
                  control={form.control}
                  name="withholding_amount"
                  render={({ field }) => (
                    <FormItem>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FormLabel className="cursor-help">미리 떼간 세금 (있을 때)</FormLabel>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>원천징수액</p>
                            <p>플랫폼/고객이 원천징수한 금액 메모 → 5월 종소세 때 합산 검증 용이</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number"
                            placeholder="의뢰처가 먼저 떼고 준 세금"
                            {...field}
                            className="pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            원
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs">
                        예: "원천징수 33,000원" (5월 종소세에서 정산)
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
                <div>받은 돈(세금 빼고): {formatCurrency(form.watch('supply_amount'))}원</div>
                <div>붙은 세금(받은 쪽): {formatCurrency(form.watch('vat_amount'))}원</div>
                <div className="font-medium text-primary">
                  총액: {formatCurrency((parseFloat(form.watch('supply_amount') || '0') + parseFloat(form.watch('vat_amount') || '0')).toString())}원
                </div>
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