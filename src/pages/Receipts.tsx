import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Info, 
  Receipt as ReceiptIcon, 
  Upload,
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Link,
  FileImage,
  Lightbulb
} from 'lucide-react';
import { ReceiptUpload } from '@/components/receipts/ReceiptUpload';
import { ReceiptList } from '@/components/receipts/ReceiptList';
import { ReceiptDetail } from '@/components/receipts/ReceiptDetail';
import { useReceipts, type ReceiptWithTransaction } from '@/hooks/useReceipts';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const Receipts: React.FC = () => {
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptWithTransaction | null>(null);
  const { receipts, getReceiptsByStatus } = useReceipts();

  const stats = {
    total: receipts.length,
    matched: receipts.filter(r => r.transaction_id).length,
    needsMatching: receipts.filter(r => !r.transaction_id && r.ocr_status === 'done').length,
    failed: receipts.filter(r => r.ocr_status === 'failed').length,
    pending: receipts.filter(r => r.ocr_status === 'pending').length,
  };

  const handleCreateTransaction = (receipt: ReceiptWithTransaction) => {
    // TODO: Navigate to transaction form with pre-filled data from OCR
    console.log('Create transaction from receipt:', receipt);
    setSelectedReceipt(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>영수증관리 - 간편장부 | 프리랜서 1인사업자 영수증 업로드</title>
        <meta name="description" content="프리랜서와 1인사업자를 위한 영수증 관리. 영수증을 업로드하고 자동으로 정보를 추출하세요. 세금신고에 필요한 증빙자료를 체계적으로 관리!" />
        <meta name="keywords" content="영수증관리, 영수증업로드, 프리랜서, 1인사업자, 간편장부, 증빙자료, 세금신고, 영수증추출" />
        <meta property="og:title" content="영수증관리 - 간편장부 | 프리랜서 1인사업자 영수증 업로드" />
        <meta property="og:description" content="프리랜서와 1인사업자를 위한 영수증 관리. 영수증을 업로드하고 자동으로 정보를 추출하세요." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://lovable-project-8e6a730d-izb25a1j8-iljaldis-projects.vercel.app/receipts" />
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">영수증 관리</h1>
          <p className="text-gray-600">영수증을 업로드하면 자동으로 OCR 처리되어 거래와 연결됩니다</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* 전체 영수증 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <ReceiptIcon className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">전체 영수증</p>
                <p className="text-2xl font-bold text-blue-600 mb-1">{stats.total}</p>
                <p className="text-xs text-gray-500">총 업로드</p>
              </div>
            </CardContent>
          </Card>

          {/* 연결 완료 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">연결 완료</p>
                <p className="text-2xl font-bold text-green-600 mb-1">{stats.matched}</p>
                <p className="text-xs text-gray-500">거래 매칭됨</p>
              </div>
            </CardContent>
          </Card>

          {/* 매칭 필요 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Link className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">매칭 필요</p>
                <p className="text-2xl font-bold text-yellow-600 mb-1">{stats.needsMatching}</p>
                <p className="text-xs text-gray-500">수동 연결 필요</p>
              </div>
            </CardContent>
          </Card>

          {/* 처리 중 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">처리 중</p>
                <p className="text-2xl font-bold text-purple-600 mb-1">{stats.pending}</p>
                <p className="text-xs text-gray-500">OCR 처리 중</p>
              </div>
            </CardContent>
          </Card>

          {/* 처리 실패 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">처리 실패</p>
                <p className="text-2xl font-bold text-red-600 mb-1">{stats.failed}</p>
                <p className="text-xs text-gray-500">재처리 필요</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Guide */}
        <Alert className="border-primary/20 bg-primary/5 mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm text-muted-foreground">
            <strong>사용 가이드:</strong> 영수증을 업로드하면 OCR로 텍스트를 추출하고, 
            기존 거래와 자동으로 매칭을 시도합니다. 매칭이 필요한 영수증은 수동으로 연결하거나 
            새로운 거래를 생성할 수 있습니다.
          </AlertDescription>
        </Alert>

        {/* Main Content - Equal Width Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="flex flex-col">
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  영수증 업로드
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReceiptUpload />
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border border-gray-200 mt-6">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  업로드 팁
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">명확한 촬영</p>
                    <p>영수증이 화면에 전체가 보이도록 촬영하세요</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">조명 주의</p>
                    <p>그림자나 반사를 피해 촬영하세요</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900">자동 매칭</p>
                    <p>OCR 결과로 기존 거래와 자동 연결됩니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Receipt List */}
          <div className="flex flex-col">
            <Card className="border border-gray-200 flex-1">
              <CardHeader>
                <CardTitle className="text-gray-900">
                  영수증 목록
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <ReceiptList onReceiptSelect={setSelectedReceipt} />
              </CardContent>
            </Card>
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