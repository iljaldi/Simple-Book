import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tag, FileText, Info } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

interface ClassificationStepProps {
  form: UseFormReturn<any>;
}

export const ClassificationStep: React.FC<ClassificationStepProps> = ({ form }) => {
  const { categories } = useCategories();
  const incomeCategories = categories.filter(cat => cat.transaction_type === 'income');
  
  const watchCategory = form.watch('category');
  const watchTaxationType = form.watch('taxation_type');
  
  // Find selected category object
  const selectedCategory = incomeCategories.find(cat => cat.name === watchCategory);

  // Auto-set taxation type based on category's default with enhanced logic
  React.useEffect(() => {
    if (selectedCategory?.default_taxation_type) {
      const currentTaxationType = form.getValues('taxation_type');
      const newTaxationType = selectedCategory.default_taxation_type;
      
      // Always update taxation type when category changes
      if (currentTaxationType !== newTaxationType) {
        form.setValue('taxation_type', newTaxationType as 'TAXABLE' | 'ZERO_RATED' | 'EXEMPT', { shouldValidate: true });
        
        // Show notification to user about auto-setting (but not on initial load)
        if (currentTaxationType) {
          toast.info(`과세유형이 '${getTaxationTypeDescription(newTaxationType)}'으로 자동 설정되었습니다.`);
        }
      }
    }
  }, [selectedCategory, form]);

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

  return (
    <div className="space-y-6">
      <Card className="gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <Tag className="h-5 w-5 mr-2 text-primary" />
            수입 분류
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  카테고리 <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="transition-smooth">
                      <SelectValue placeholder="수입 카테고리를 선택하세요" />
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
                  과세유형 <span className="text-destructive">*</span>
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={selectedCategory?.allow_override === false}
                >
                  <FormControl>
                    <SelectTrigger className="transition-smooth">
                      <SelectValue placeholder="과세유형을 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TAXABLE">과세 (10%)</SelectItem>
                    <SelectItem value="ZERO_RATED">영세율 (0%)</SelectItem>
                    <SelectItem value="EXEMPT">면세</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Category-based taxation type guidance */}
                {selectedCategory && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      카테고리 기본값: {getTaxationTypeDescription(selectedCategory.default_taxation_type)}
                    </Badge>
                    {selectedCategory.allow_override === false && (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        이 카테고리는 과세유형이 고정됩니다
                      </Badge>
                    )}
                  </div>
                )}
                {watchTaxationType && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center p-2 bg-muted rounded-md">
                      <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {getTaxationTypeDescription(watchTaxationType)}
                      </span>
                    </div>
                    {(watchTaxationType === 'TAXABLE' || watchTaxationType === 'ZERO_RATED') && (
                      <div className="flex items-center p-2 bg-blue-50 border border-blue-200 rounded-md">
                        <Info className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm text-blue-700">
                          이 과세유형에서는 원천징수가 적용되지 않습니다.
                        </span>
                      </div>
                    )}
                    {watchTaxationType === 'EXEMPT' && (
                      <div className="flex items-center p-2 bg-orange-50 border border-orange-200 rounded-md">
                        <Info className="h-4 w-4 mr-2 text-orange-600" />
                        <span className="text-sm text-orange-700">
                          면세 매출의 경우 원천징수(3.3%)가 적용될 수 있습니다.
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            추가 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="project_memo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  프로젝트명 / 메모 (선택)
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
        </CardContent>
      </Card>
    </div>
  );
};