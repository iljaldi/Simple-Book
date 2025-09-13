import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Eye, 
  Link, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X,
  FileImage,
  Receipt
} from 'lucide-react';
import { useReceipts, type ReceiptWithTransaction } from '@/hooks/useReceipts';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ReceiptListProps {
  onReceiptSelect?: (receipt: ReceiptWithTransaction) => void;
}

export const ReceiptList: React.FC<ReceiptListProps> = ({ onReceiptSelect }) => {
  const { receipts, getReceiptsByStatus, deleteReceipt } = useReceipts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredReceipts = useMemo(() => {
    let receiptList = getReceiptsByStatus(activeTab === 'all' ? undefined : activeTab);
    
    if (searchQuery) {
      receiptList = receiptList.filter(receipt => 
        receipt.original_filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.ocr_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        receipt.transaction?.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return receiptList;
  }, [getReceiptsByStatus, activeTab, searchQuery]);

  const getStatusBadge = (receipt: ReceiptWithTransaction) => {
    if (receipt.transaction_id) {
      return (
        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          매칭 완료
        </Badge>
      );
    }

    switch (receipt.ocr_status) {
      case 'done':
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
            <Link className="h-3 w-3 mr-1" />
            매칭 필요
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            인식 실패
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            처리 중
          </Badge>
        );
    }
  };

  const getTabCounts = () => {
    return {
      all: receipts.length,
      matched: getReceiptsByStatus('matched').length,
      'needs-matching': getReceiptsByStatus('needs-matching').length,
      failed: getReceiptsByStatus('failed').length,
      pending: getReceiptsByStatus('pending').length,
    };
  };

  const tabCounts = getTabCounts();

  if (receipts.length === 0) {
    return (
      <Card className="shadow-card border-border">
        <CardContent className="text-center py-12">
          <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            업로드된 영수증이 없습니다
          </h3>
          <p className="text-muted-foreground mb-4">
            첫 번째 영수증을 업로드하면 자동으로 거래와 연결됩니다.
          </p>
          <p className="text-sm text-muted-foreground">
            드래그 앤 드롭으로 쉽게 업로드할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="파일명, 내용, 거래처로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="transition-smooth">
          <Filter className="h-4 w-4 mr-2" />
          필터
        </Button>
      </div>

      {/* Status Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="text-xs">
            전체 ({tabCounts.all})
          </TabsTrigger>
          <TabsTrigger value="matched" className="text-xs">
            완료 ({tabCounts.matched})
          </TabsTrigger>
          <TabsTrigger value="needs-matching" className="text-xs">
            매칭필요 ({tabCounts['needs-matching']})
          </TabsTrigger>
          <TabsTrigger value="failed" className="text-xs">
            실패 ({tabCounts.failed})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs">
            처리중 ({tabCounts.pending})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredReceipts.map((receipt) => (
              <Card
                key={receipt.id}
                className="shadow-card border-border cursor-pointer transition-smooth hover:shadow-lg"
                onClick={() => onReceiptSelect?.(receipt)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      {receipt.file_url ? (
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={receipt.file_url}
                            alt={receipt.original_filename || '영수증'}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                          <FileImage className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate text-sm">
                            {receipt.original_filename || '영수증'}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(receipt.uploaded_at), 'PPp', { locale: ko })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {getStatusBadge(receipt)}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteReceipt(receipt.id);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Transaction Info */}
                      {receipt.transaction && (
                        <div className="bg-success/5 rounded-md p-2 mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-3 w-3 text-success" />
                            <span className="text-xs font-medium text-success">
                              연결된 거래
                            </span>
                          </div>
                          <p className="text-xs text-foreground line-clamp-1">
                            {receipt.transaction.description || '거래 설명 없음'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>
                              {format(new Date(receipt.transaction.date), 'PP', { locale: ko })}
                            </span>
                            <span>
                              {receipt.transaction.amount_gross?.toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      )}

                      {/* OCR Info */}
                      {receipt.ocr_text && (
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {receipt.ocr_text}
                        </div>
                      )}

                      {/* Match Confidence */}
                      {receipt.match_confidence && receipt.match_confidence < 1 && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>매칭 신뢰도:</span>
                            <span className="font-medium">
                              {Math.round(receipt.match_confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onReceiptSelect?.(receipt);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        보기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredReceipts.length === 0 && (
              <Card className="shadow-card border-border">
                <CardContent className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery ? '검색 결과가 없습니다.' : '해당 상태의 영수증이 없습니다.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};