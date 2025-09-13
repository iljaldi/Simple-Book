import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, FileSpreadsheet, Calendar, CheckCircle, Trash2, Eye } from 'lucide-react';

const Exports: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedFormat, setSelectedFormat] = useState('excel');

  // 더미 데이터
  const generatedPackages = [
    {
      id: 1,
      name: '2024년 부가가치세 신고서',
      year: '2024',
      format: 'excel',
      size: '2.3 MB',
      createdAt: '2024-12-01',
      status: 'completed',
      description: '2024년 1분기 부가가치세 신고서 (Excel)'
    },
    {
      id: 2,
      name: '2024년 소득세 신고서',
      year: '2024',
      format: 'pdf',
      size: '1.8 MB',
      createdAt: '2024-11-15',
      status: 'completed',
      description: '2024년 종합소득세 신고서 (PDF)'
    },
    {
      id: 3,
      name: '2023년 부가가치세 신고서',
      year: '2023',
      format: 'excel',
      size: '3.1 MB',
      createdAt: '2024-03-31',
      status: 'completed',
      description: '2023년 연간 부가가치세 신고서 (Excel)'
    },
    {
      id: 4,
      name: '2024년 2분기 부가가치세',
      year: '2024',
      format: 'pdf',
      size: '1.5 MB',
      createdAt: '2024-07-25',
      status: 'completed',
      description: '2024년 2분기 부가가치세 신고서 (PDF)'
    }
  ];

  const checklistItems = [
    { id: 1, text: '모든 거래 입력 완료', completed: true },
    { id: 2, text: '영수증 첨부 완료', completed: true },
    { id: 3, text: '카테고리 분류 완료', completed: true },
    { id: 4, text: '사업자 정보 확인', completed: true },
    { id: 5, text: '계좌 정보 확인', completed: false },
    { id: 6, text: '신고 패키지 다운로드', completed: true }
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const totalCount = checklistItems.length;

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 신고 패키지 생성 */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-foreground">신고 패키지 생성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">신고 기간</label>
              <div className="flex gap-2">
                <Badge 
                  variant={selectedYear === '2024' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedYear('2024')}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  2024년
                </Badge>
                <Badge 
                  variant={selectedYear === '2023' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedYear('2023')}
                >
                  2023년
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">파일 형식</label>
              <div className="flex gap-2">
                <Badge 
                  variant={selectedFormat === 'excel' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedFormat('excel')}
                >
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  Excel
                </Badge>
                <Badge 
                  variant={selectedFormat === 'pdf' ? "default" : "outline"} 
                  className="cursor-pointer"
                  onClick={() => setSelectedFormat('pdf')}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  PDF
                </Badge>
              </div>
            </div>

            <Button className="w-full transition-smooth bg-black hover:bg-gray-800 text-white">
              <Download className="h-4 w-4 mr-2" />
              신고 패키지 생성
            </Button>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">생성 가능</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                {selectedYear}년 {selectedFormat.toUpperCase()} 형식으로 패키지를 생성할 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 생성된 패키지 목록 */}
        <Card className="border border-gray-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">생성된 패키지 ({generatedPackages.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedPackages.map((pkg) => (
                <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {pkg.format.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {pkg.year}년
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>크기: {pkg.size}</span>
                        <span>생성일: {pkg.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        보기
                      </Button>
                      <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
                        <Download className="h-4 w-4 mr-1" />
                        다운로드
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 신고 체크리스트 */}
        <Card className="border border-gray-200 lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center justify-between">
              <span>신고 준비 체크리스트</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {completedCount}/{totalCount} 완료
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {checklistItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      item.completed 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <span className={`text-sm ${
                      item.completed ? 'text-green-700 font-medium' : 'text-gray-500'
                    }`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {checklistItems.slice(3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      item.completed 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    <span className={`text-sm ${
                      item.completed ? 'text-green-700 font-medium' : 'text-gray-500'
                    }`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">신고 준비 진행률</p>
                  <p className="text-xs text-gray-500">모든 항목을 완료하면 신고가 가능합니다</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{Math.round((completedCount / totalCount) * 100)}%</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    ></div>
                  </div>
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