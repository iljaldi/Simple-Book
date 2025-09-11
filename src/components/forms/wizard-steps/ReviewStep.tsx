import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, Calendar, Building, Tag, DollarSign, CreditCard, Receipt } from 'lucide-react';

interface ReviewStepProps {
  form: UseFormReturn<any>;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ form }) => {
  const formData = form.getValues();

  // Helper function to safely convert to number
  const toNumber = (value: any): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatCurrency = (amount: string | number) => {
    const num = toNumber(amount);
    return num.toLocaleString('ko-KR');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTaxationTypeLabel = (type: string) => {
    switch (type) {
      case 'TAXABLE':
        return '과세 (10%)';
      case 'ZERO_RATED':
        return '영세율 (0%)';
      case 'EXEMPT':
        return '면세';
      default:
        return type;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'transfer':
        return '계좌이체';
      case 'cash':
        return '현금';
      case 'card':
        return '카드';
      case 'etc':
        return '기타';
      default:
        return method;
    }
  };

  const getEvidenceTypeLabel = (type: string) => {
    switch (type) {
      case 'TAX_INVOICE':
        return '세금계산서';
      case 'INVOICE':
        return '계산서';
      case 'CASH_RCPT':
        return '현금영수증';
      case 'SIMPLE_RCPT':
        return '간이영수증';
      case 'CARD':
        return '카드전표';
      case 'NONE':
        return '증빙없음';
      default:
        return type;
    }
  };

  const supplyAmount = toNumber(formData.supply_amount);
  const vatAmount = toNumber(formData.vat_amount);
  const totalAmount = toNumber(formData.total_amount_received);
  const incomeTax = toNumber(formData.withholding_income_tax);
  const localTax = toNumber(formData.withholding_local_tax);
  const netAmount = totalAmount - incomeTax - localTax;

  return (
    <div className="space-y-6">
      <Card className="gradient-subtle border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-success" />
            입력 내용 확인
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="flex items-center text-sm font-semibold text-foreground">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              기본 정보
            </h4>
            <div className="grid grid-cols-1 gap-2 pl-6">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">거래 날짜:</span>
                <span className="text-sm font-medium">{formatDate(formData.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">거래처명:</span>
                <span className="text-sm font-medium">{formData.counterparty}</span>
              </div>
              {formData.business_registration_number && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">사업자번호:</span>
                  <span className="text-sm font-medium">{formData.business_registration_number}</span>
                </div>
              )}
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-3">
            <h4 className="flex items-center text-sm font-semibold text-foreground">
              <Tag className="h-4 w-4 mr-2 text-primary" />
              수입 분류
            </h4>
            <div className="grid grid-cols-1 gap-2 pl-6">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">카테고리:</span>
                <span className="text-sm font-medium">{formData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">과세유형:</span>
                <span className="text-sm font-medium">{getTaxationTypeLabel(formData.taxation_type)}</span>
              </div>
              {formData.project_memo && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">프로젝트/메모:</span>
                  <span className="text-sm font-medium">{formData.project_memo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-3">
            <h4 className="flex items-center text-sm font-semibold text-foreground">
              <CreditCard className="h-4 w-4 mr-2 text-primary" />
              결제 및 증빙
            </h4>
            <div className="grid grid-cols-1 gap-2 pl-6">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">결제수단:</span>
                <span className="text-sm font-medium">{getPaymentMethodLabel(formData.payment_method)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">증빙 종류:</span>
                <span className="text-sm font-medium">{getEvidenceTypeLabel(formData.evidence_type)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amount Summary */}
      <Card className="border-success-light bg-success-light/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-success flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            금액 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">공급가액:</span>
              <span className="text-lg font-semibold">₩ {formatCurrency(supplyAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">부가세:</span>
              <span className="text-lg font-semibold">₩ {formatCurrency(vatAmount)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-success-light pt-3">
              <span className="text-sm font-semibold text-success">총 수령액:</span>
              <span className="text-xl font-bold text-success">₩ {formatCurrency(totalAmount)}</span>
            </div>

            {formData.has_withholding && (
              <>
                <div className="flex justify-between items-center text-destructive">
                  <span className="text-sm">소득세:</span>
                  <span className="font-medium">-₩ {formatCurrency(incomeTax)}</span>
                </div>
                <div className="flex justify-between items-center text-destructive">
                  <span className="text-sm">지방소득세:</span>
                  <span className="font-medium">-₩ {formatCurrency(localTax)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-success-light pt-3">
                  <span className="text-sm font-semibold text-success">실제 수령액:</span>
                  <span className="text-xl font-bold text-success">₩ {formatCurrency(netAmount)}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground text-center">
          위 내용을 확인하신 후 저장 버튼을 클릭하여 거래를 등록하세요.
        </p>
      </div>
    </div>
  );
};