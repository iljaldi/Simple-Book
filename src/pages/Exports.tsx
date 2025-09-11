import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, FileSpreadsheet, Calendar, CheckCircle } from 'lucide-react';

const Exports: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">신고 패키지 다운로드</h1>
          <p className="text-gray-600">홈택스 신고에 필요한 자료를 생성하고 다운로드하세요</p>
        </div>
        <div className="flex items-center gap-2">
          {/* 액션 버튼 영역 */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 신고 패키지 생성 */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">신고 패키지 생성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">신고 기간</label>
              <div className="flex gap-2">
                <Badge variant="secondary" className="cursor-pointer">
                  <Calendar className="h-3 w-3 mr-1" />
                  2024년
                </Badge>
                <Badge variant="outline" className="cursor-pointer">2023년</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">파일 형식</label>
              <div className="flex gap-2">
                <Badge variant="secondary" className="cursor-pointer">
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  Excel
                </Badge>
                <Badge variant="outline" className="cursor-pointer">
                  <FileText className="h-3 w-3 mr-1" />
                  PDF
                </Badge>
              </div>
            </div>

            <Button className="w-full transition-smooth" disabled>
              <Download className="h-4 w-4 mr-2" />
              신고 패키지 생성
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              거래 데이터가 없어서 패키지를 생성할 수 없습니다.
            </p>
          </CardContent>
        </Card>

        {/* 생성된 패키지 목록 */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">생성된 패키지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>생성된 신고 패키지가 없습니다.</p>
              <p className="text-sm mt-2">거래를 입력한 후 패키지를 생성해주세요.</p>
            </div>
          </CardContent>
        </Card>

        {/* 신고 체크리스트 */}
        <Card className="shadow-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">신고 준비 체크리스트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                  <span className="text-sm text-muted-foreground">모든 거래 입력 완료</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                  <span className="text-sm text-muted-foreground">영수증 첨부 완료</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                  <span className="text-sm text-muted-foreground">카테고리 분류 완료</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                  <span className="text-sm text-muted-foreground">사업자 정보 확인</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                  <span className="text-sm text-muted-foreground">계좌 정보 확인</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                  <span className="text-sm text-muted-foreground">신고 패키지 다운로드</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default Exports;