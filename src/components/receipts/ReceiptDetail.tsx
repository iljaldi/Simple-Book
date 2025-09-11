import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  X, 
  Link, 
  Search, 
  Plus, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  FileImage,
  Calendar,
  DollarSign,
  Building,
  Receipt as ReceiptIcon
} from 'lucide-react';
import { useReceipts, type ReceiptWithTransaction } from '@/hooks/useReceipts';
import { useTransactions } from '@/hooks/useTransactions';
import type { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type Transaction = Database['public']['Tables']['transactions']['Row'];

interface ReceiptDetailProps {
  receipt: ReceiptWithTransaction;
  onClose: () => void;
  onCreateTransaction?: (receipt: ReceiptWithTransaction) => void;
}

export const ReceiptDetail: React.FC<ReceiptDetailProps> = ({ 
  receipt, 
  onClose,
  onCreateTransaction 
}) => {
  const { linkToTransaction, isLinking } = useReceipts();
  const { transactions } = useTransactions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Find potential matching transactions
  const potentialMatches = useMemo(() => {
    if (!receipt.ocr_text) return [];

    return transactions
      .filter(t => !t.deleted_at) // Filter out deleted transactions
      .map(transaction => {
        let score = 0;
        
        // Amount matching (if we can extract amount from OCR)
        const amountMatch = receipt.ocr_text?.match(/[\d,]+/g);
        if (amountMatch && transaction.amount_gross) {
          const extractedAmount = parseInt(amountMatch[0].replace(/,/g, ''));
          const amountDiff = Math.abs(extractedAmount - Number(transaction.amount_gross));
          if (amountDiff < 1000) score += 0.4; // Within 1000 won
          else if (amountDiff < 5000) score += 0.2; // Within 5000 won
        }

        // Description/content matching
        if (transaction.description && receipt.ocr_text) {
          const descWords = transaction.description.toLowerCase().split(' ');
          const ocrText = receipt.ocr_text.toLowerCase();
          const matchingWords = descWords.filter(word => 
            word.length > 1 && ocrText.includes(word)
          );
          score += (matchingWords.length / descWords.length) * 0.3;
        }

        // Date proximity (within 7 days)
        const receiptDate = new Date(receipt.uploaded_at);
        const transactionDate = new Date(transaction.date);
        const daysDiff = Math.abs((receiptDate.getTime() - transactionDate.getTime()) / (1000 * 3600 * 24));
        if (daysDiff <= 1) score += 0.2;
        else if (daysDiff <= 3) score += 0.1;
        else if (daysDiff <= 7) score += 0.05;

        return { transaction, score };
      })
      .filter(({ score }) => score > 0.1) // Only show matches with decent confidence
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 matches
  }, [receipt, transactions]);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return potentialMatches.map(m => m.transaction);
    
    return transactions.filter(transaction =>
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.counterparty_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery, potentialMatches]);

  const handleLinkTransaction = () => {
    if (!selectedTransaction) return;

    linkToTransaction({
      receiptId: receipt.id,
      transactionId: selectedTransaction.id
    });
    onClose();
  };

  const getStatusIcon = () => {
    if (receipt.transaction_id) {
      return <CheckCircle className="h-5 w-5 text-success" />;
    }

    switch (receipt.ocr_status) {
      case 'done':
        return <Link className="h-5 w-5 text-warning" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    if (receipt.transaction_id) return '거래에 연결됨';
    
    switch (receipt.ocr_status) {
      case 'done': return '매칭 필요';
      case 'failed': return 'OCR 인식 실패';
      case 'pending': return 'OCR 처리 중';
      default: return '알 수 없는 상태';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {receipt.original_filename || '영수증 상세'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {getStatusText()} • {format(new Date(receipt.uploaded_at), 'PPp', { locale: ko })}
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receipt Preview */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              영수증 미리보기
            </CardTitle>
          </CardHeader>
          <CardContent>
            {receipt.file_url ? (
              <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-muted">
                <img
                  src={receipt.file_url}
                  alt={receipt.original_filename || '영수증'}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full aspect-[3/4] rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <FileImage className="h-16 w-16 mx-auto mb-2" />
                  <p>미리보기를 사용할 수 없습니다</p>
                </div>
              </div>
            )}

            {/* File Info */}
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">파일 크기:</span>
                <span className="text-foreground">
                  {receipt.file_size ? (receipt.file_size / 1024 / 1024).toFixed(2) + ' MB' : '알 수 없음'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">파일 형식:</span>
                <span className="text-foreground">{receipt.mime_type || '알 수 없음'}</span>
              </div>
              {receipt.match_confidence && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">매칭 신뢰도:</span>
                  <span className="text-foreground">
                    {Math.round(receipt.match_confidence * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* OCR Text */}
            {receipt.ocr_text && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-foreground mb-2">추출된 텍스트:</h4>
                <div className="bg-muted rounded-lg p-3 text-sm text-foreground max-h-32 overflow-y-auto">
                  {receipt.ocr_text}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Matching */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              거래 연결
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {receipt.transaction ? (
              /* Already Linked */
              <Alert className="border-success/20 bg-success/5">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">이미 연결된 거래가 있습니다</p>
                    <div className="bg-background rounded-md p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <ReceiptIcon className="h-4 w-4" />
                        <span className="font-medium">{receipt.transaction.description}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(receipt.transaction.date), 'PP', { locale: ko })}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {receipt.transaction.amount_gross?.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              /* Not Linked - Show Matching Options */
              <div className="space-y-4">
                {/* Search Transactions */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="거래 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Potential Matches */}
                {!searchQuery && potentialMatches.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">추천 거래</h4>
                    <div className="space-y-2">
                      {potentialMatches.map(({ transaction, score }) => (
                        <div
                          key={transaction.id}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-smooth",
                            selectedTransaction?.id === transaction.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {transaction.description || '거래 설명 없음'}
                              </p>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <span>{format(new Date(transaction.date), 'PP', { locale: ko })}</span>
                                <span>{transaction.amount_gross?.toLocaleString()}원</span>
                                {transaction.counterparty_name && (
                                  <span className="flex items-center gap-1">
                                    <Building className="h-3 w-3" />
                                    {transaction.counterparty_name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(score * 100)}% 일치
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Transactions */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">
                    {searchQuery ? '검색 결과' : '최근 거래'}
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredTransactions.slice(0, 10).map((transaction) => (
                      <div
                        key={transaction.id}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-smooth",
                          selectedTransaction?.id === transaction.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <p className="font-medium text-foreground">
                          {transaction.description || '거래 설명 없음'}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{format(new Date(transaction.date), 'PP', { locale: ko })}</span>
                          <span>{transaction.amount_gross?.toLocaleString()}원</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={handleLinkTransaction}
                    disabled={!selectedTransaction || isLinking}
                    className="w-full"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    {isLinking ? '연결 중...' : '선택한 거래에 연결'}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => onCreateTransaction?.(receipt)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    이 영수증으로 새 거래 만들기
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};