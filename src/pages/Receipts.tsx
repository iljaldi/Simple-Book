import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Receipt as ReceiptIcon } from 'lucide-react';
import { ReceiptUpload } from '@/components/receipts/ReceiptUpload';
import { ReceiptList } from '@/components/receipts/ReceiptList';
import { ReceiptDetail } from '@/components/receipts/ReceiptDetail';
import { useReceipts, type ReceiptWithTransaction } from '@/hooks/useReceipts';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const Receipts: React.FC = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptWithTransaction | null>(null);
  const { receipts } = useReceipts();

  const stats = {
    total: receipts.length,
    matched: receipts.filter(r => r.transaction_id).length,
    needsMatching: receipts.filter(r => !r.transaction_id && r.ocr_status === 'done').length,
    failed: receipts.filter(r => r.ocr_status === 'failed').length,
  };

  const handleCreateTransaction = (receipt: ReceiptWithTransaction) => {
    // TODO: Navigate to transaction form with pre-filled data from OCR
    console.log('Create transaction from receipt:', receipt);
    setSelectedReceipt(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">영수증 관리</h1>
          <p className="text-gray-600">
            영수증을 업로드하면 자동으로 OCR 처리되어 거래와 연결됩니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* 액션 버튼 영역 */}
        </div>
      </div>
      
      <div className="space-y-8">

        {/* Stats */}
        {receipts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">전체 영수증</div>
            </div>
            <div className="bg-success/5 rounded-lg p-4 border border-success/20">
              <div className="text-2xl font-bold text-success">{stats.matched}</div>
              <div className="text-sm text-success/80">연결 완료</div>
            </div>
            <div className="bg-warning/5 rounded-lg p-4 border border-warning/20">
              <div className="text-2xl font-bold text-warning">{stats.needsMatching}</div>
              <div className="text-sm text-warning/80">매칭 필요</div>
            </div>
            <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/20">
              <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
              <div className="text-sm text-destructive/80">처리 실패</div>
            </div>
          </div>
        )}

        {/* Usage Guide */}
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm text-muted-foreground">
            <strong>사용 가이드:</strong> 영수증을 업로드하면 OCR로 텍스트를 추출하고, 
            기존 거래와 자동으로 매칭을 시도합니다. 매칭이 필요한 영수증은 수동으로 연결하거나 
            새로운 거래를 생성할 수 있습니다.
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="xl:col-span-1">
          <ReceiptUpload />
        </div>

        {/* Receipt List */}
        <div className="xl:col-span-2">
          <ReceiptList onReceiptSelect={setSelectedReceipt} />
        </div>
      </div>

      {/* Receipt Detail Sheet */}
      <Sheet open={!!selectedReceipt} onOpenChange={() => setSelectedReceipt(null)}>
        <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ReceiptIcon className="h-5 w-5" />
              영수증 상세
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedReceipt && (
              <ReceiptDetail
                receipt={selectedReceipt}
                onClose={() => setSelectedReceipt(null)}
                onCreateTransaction={handleCreateTransaction}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
      </div>
    </div>
  );
};

export default Receipts;