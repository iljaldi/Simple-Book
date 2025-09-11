import React from 'react';
import { Receipt, CreditCard, FileText, AlertTriangle, Calculator, Banknote } from 'lucide-react';

interface EvidenceTypeIconProps {
  type: string;
  className?: string;
}

export const EvidenceTypeIcon: React.FC<EvidenceTypeIconProps> = ({ type, className = "h-4 w-4" }) => {
  const getIcon = () => {
    switch (type) {
      case 'TAX_INVOICE':
        return <Calculator className={className} />;
      case 'CARD':
        return <CreditCard className={className} />;
      case 'CASH_RCPT':
        return <Banknote className={className} />;
      case 'SIMPLE_RCPT':
        return <Receipt className={className} />;
      case 'INVOICE':
        return <FileText className={className} />;
      case 'NONE':
        return <AlertTriangle className={`${className} text-destructive`} />;
      default:
        return <FileText className={className} />;
    }
  };

  const getLabel = () => {
    const labels: Record<string, string> = {
      'TAX_INVOICE': '세금계산서',
      'CARD': '카드매출전표',
      'CASH_RCPT': '현금영수증',
      'SIMPLE_RCPT': '간이영수증',
      'INVOICE': '계산서',
      'NONE': '증빙없음',
    };
    return labels[type] || '기타';
  };

  return (
    <div className="flex items-center" title={getLabel()}>
      {getIcon()}
    </div>
  );
};