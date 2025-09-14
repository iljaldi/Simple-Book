import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/design-system/Modal';
import { Download, FileText, FileSpreadsheet, Calendar, CheckCircle, Trash2, Eye, X } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// jsPDF 타입 확장
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const Exports: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewingPackage, setViewingPackage] = useState<any>(null);
  const [generatedPackages, setGeneratedPackages] = useState([
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
  ]);

  const handleGeneratePackage = async () => {
    setIsGenerating(true);
    
    try {
      // 실제 구현에서는 API 호출을 통해 패키지 생성
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기 (시뮬레이션)
      
      // 새 패키지 생성
      const newPackage = {
        id: Date.now(),
        name: `${selectedYear}년 ${selectedFormat === 'excel' ? '부가가치세' : '소득세'} 신고서`,
        year: selectedYear,
        format: selectedFormat,
        size: selectedFormat === 'excel' ? '2.3 MB' : '1.8 MB',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'completed',
        description: `${selectedYear}년 ${selectedFormat === 'excel' ? '부가가치세' : '소득세'} 신고서 (${selectedFormat.toUpperCase()})`
      };
      
      setGeneratedPackages(prev => [newPackage, ...prev]);
      
      // 성공 알림
      alert(`${selectedYear}년 ${selectedFormat.toUpperCase()} 형식의 신고 패키지가 생성되었습니다!`);
      
    } catch (error) {
      console.error('패키지 생성 중 오류가 발생했습니다:', error);
      alert('패키지 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPackage = (pkg: any) => {
    const fileName = `${pkg.name}.${pkg.format}`;
    
    if (pkg.format === 'excel') {
      // Excel 파일 생성 (실제 .xlsx 파일)
      generateExcelContent(pkg, fileName);
    } else if (pkg.format === 'pdf') {
      // PDF 파일 생성
      generatePDFContent(pkg, fileName);
    }
  };

  const generateExcelContent = (pkg: any, fileName: string) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // 워크북 생성
    const wb = XLSX.utils.book_new();
    
    // 기본 정보 시트
    const basicInfo = [
      ['Report Name', pkg.name],
      ['Report Year', pkg.year],
      ['Created Date', currentDate],
      ['File Format', pkg.format.toUpperCase()],
      [''],
      ['Financial Summary'],
      ['Item', 'Amount', 'Description'],
      ['Income', 2500000, `Total income for ${pkg.year}`],
      ['Expenses', 1800000, `Total expenses for ${pkg.year}`],
      ['Net Profit', 700000, 'Income minus expenses'],
      ['VAT', 70000, '10% of net profit'],
      ['Income Tax', 140000, '20% of net profit']
    ];
    
    const basicInfoSheet = XLSX.utils.aoa_to_sheet(basicInfo);
    XLSX.utils.book_append_sheet(wb, basicInfoSheet, 'Basic Info');
    
    // 거래 내역 시트
    const transactions = [
      ['Transaction Type', 'Amount', 'Date', 'Category'],
      ['Sales', 500000, currentDate, 'Income'],
      ['Salary', 300000, currentDate, 'Income'],
      ['Office Supplies', 50000, currentDate, 'Expense'],
      ['Communication', 30000, currentDate, 'Expense'],
      ['Transportation', 20000, currentDate, 'Expense']
    ];
    
    const transactionSheet = XLSX.utils.aoa_to_sheet(transactions);
    XLSX.utils.book_append_sheet(wb, transactionSheet, 'Transactions');
    
    // Excel 파일 다운로드
    XLSX.writeFile(wb, fileName.replace('.excel', '.xlsx'));
  };

  const generateCSVContent = (pkg: any) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    // BOM (Byte Order Mark) 추가하여 UTF-8 인코딩 명시
    const BOM = '\uFEFF';
    
    const csvContent = `${BOM}Report Name,${pkg.name}
Report Year,${pkg.year}
Created Date,${currentDate}
File Format,${pkg.format.toUpperCase()}

Item,Amount,Description
Income,2500000,Total income for ${pkg.year}
Expenses,1800000,Total expenses for ${pkg.year}
Net Profit,700000,Income minus expenses
VAT,70000,10% of net profit
Income Tax,140000,20% of net profit

Transaction Type,Amount,Date,Category
Sales,500000,${currentDate},Income
Salary,300000,${currentDate},Income
Office Supplies,50000,${currentDate},Expense
Communication,30000,${currentDate},Expense
Transportation,20000,${currentDate},Expense`;
    
    return csvContent;
  };

  const generatePDFContent = (pkg: any, fileName: string) => {
    try {
      // jsPDF를 사용한 PDF 생성
      const pdf = new jsPDF();
      const currentDate = new Date().toISOString().split('T')[0];
      
      // 제목
      pdf.setFontSize(20);
      pdf.text(pkg.name, 20, 30);
      
      // 기본 정보
      pdf.setFontSize(12);
      pdf.text(`Report Year: ${pkg.year}`, 20, 50);
      pdf.text(`Created Date: ${currentDate}`, 20, 60);
      pdf.text(`File Format: ${pkg.format.toUpperCase()}`, 20, 70);
      
      // 구분선
      pdf.line(20, 80, 190, 80);
      
      // 재무 정보
      pdf.setFontSize(14);
      pdf.text('Financial Summary', 20, 95);
      
      pdf.setFontSize(10);
      pdf.text('Income: 2,500,000 KRW', 20, 110);
      pdf.text('Expenses: 1,800,000 KRW', 20, 120);
      pdf.text('Net Profit: 700,000 KRW', 20, 130);
      
      // 세금 정보
      pdf.setFontSize(14);
      pdf.text('Tax Calculation', 20, 150);
      
      pdf.setFontSize(10);
      pdf.text('VAT: 70,000 KRW (10% of Net Profit)', 20, 165);
      pdf.text('Income Tax: 140,000 KRW (20% of Net Profit)', 20, 175);
      
      // 거래 내역
      pdf.setFontSize(14);
      pdf.text('Transaction Details', 20, 195);
      
      pdf.setFontSize(10);
      pdf.text('Sales: 500,000 KRW', 20, 210);
      pdf.text('Salary: 300,000 KRW', 20, 220);
      pdf.text('Office Supplies: 50,000 KRW', 20, 230);
      pdf.text('Communication: 30,000 KRW', 20, 240);
      pdf.text('Transportation: 20,000 KRW', 20, 250);
      
      // PDF 다운로드
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF 생성 중 오류:', error);
      // 대안: 간단한 텍스트 파일로 다운로드
      const textContent = `
${pkg.name}
Report Year: ${pkg.year}
Created Date: ${new Date().toISOString().split('T')[0]}
File Format: ${pkg.format.toUpperCase()}

Financial Summary:
- Income: 2,500,000 KRW
- Expenses: 1,800,000 KRW
- Net Profit: 700,000 KRW

Tax Calculation:
- VAT: 70,000 KRW (10% of Net Profit)
- Income Tax: 140,000 KRW (20% of Net Profit)

Transaction Details:
- Sales: 500,000 KRW
- Salary: 300,000 KRW
- Office Supplies: 50,000 KRW
- Communication: 30,000 KRW
- Transportation: 20,000 KRW
      `;
      
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.replace('.pdf', '.txt');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDeletePackage = (packageId: number) => {
    if (confirm('이 패키지를 삭제하시겠습니까?')) {
      setGeneratedPackages(prev => prev.filter(pkg => pkg.id !== packageId));
    }
  };

  const handleViewPackage = (pkg: any) => {
    setViewingPackage(pkg);
  };

  const closeViewModal = () => {
    setViewingPackage(null);
  };

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
      <Helmet>
        <title>신고패키지 다운로드 - 간편장부 | 프리랜서 1인사업자 세금신고</title>
        <meta name="description" content="프리랜서와 1인사업자를 위한 신고패키지 다운로드. 홈택스 세금신고용 Excel, PDF 파일을 자동 생성하고 다운로드하세요. 간편한 세금신고!" />
        <meta name="keywords" content="신고패키지, 세금신고, 홈택스신고, 프리랜서, 1인사업자, 간편장부, Excel다운로드, PDF다운로드, 세무신고" />
        <meta property="og:title" content="신고패키지 다운로드 - 간편장부 | 프리랜서 1인사업자 세금신고" />
        <meta property="og:description" content="프리랜서와 1인사업자를 위한 신고패키지 다운로드. 홈택스 세금신고용 Excel, PDF 파일을 자동 생성하고 다운로드하세요." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://simplebook.site/exports" />
      </Helmet>
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
                  className="cursor-pointer h-12 px-4 py-3 text-sm"
                  onClick={() => setSelectedYear('2024')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  2024년
                </Badge>
                <Badge 
                  variant={selectedYear === '2023' ? "default" : "outline"} 
                  className="cursor-pointer h-12 px-4 py-3 text-sm"
                  onClick={() => setSelectedYear('2023')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  2023년
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">파일 형식</label>
              <div className="flex gap-2">
                <Badge 
                  variant={selectedFormat === 'excel' ? "default" : "outline"} 
                  className="cursor-pointer h-12 px-4 py-3 text-sm"
                  onClick={() => setSelectedFormat('excel')}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel
                </Badge>
                <Badge 
                  variant={selectedFormat === 'pdf' ? "default" : "outline"} 
                  className="cursor-pointer h-12 px-4 py-3 text-sm"
                  onClick={() => setSelectedFormat('pdf')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Badge>
              </div>
            </div>

            <Button 
              className="w-full h-14 transition-smooth bg-black hover:bg-gray-800 text-white text-base font-medium"
              onClick={handleGeneratePackage}
              disabled={isGenerating}
            >
              <Download className="h-5 w-5 mr-2" />
              {isGenerating ? '생성 중...' : '신고 패키지 생성'}
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
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewPackage(pkg)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        보기
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-black hover:bg-gray-800 text-white"
                        onClick={() => handleDownloadPackage(pkg)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        다운로드
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeletePackage(pkg.id)}
                      >
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

      {/* 패키지 미리보기 모달 */}
      {viewingPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={closeViewModal}
          />
          
          {/* Modal */}
          <div
            className="relative bg-white rounded-lg border border-gray-200 shadow-xl w-full mx-4 max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {viewingPackage.format === 'excel' ? (
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                ) : (
                  <FileText className="h-8 w-8 text-red-600" />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewingPackage.name}</h2>
                  <p className="text-gray-600">{viewingPackage.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={closeViewModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">패키지 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">파일 형식:</span>
                      <Badge variant="secondary">{viewingPackage.format.toUpperCase()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">신고 연도:</span>
                      <span className="font-medium">{viewingPackage.year}년</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">파일 크기:</span>
                      <span className="font-medium">{viewingPackage.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">생성일:</span>
                      <span className="font-medium">{viewingPackage.createdAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">상태:</span>
                      <Badge variant="default" className="bg-green-600">완료</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">포함 내용</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">신고서 양식</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">거래 내역 데이터</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">세금 계산서</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">영수증 첨부파일</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">신고 가이드</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">미리보기</h3>
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-center py-8">
                    {viewingPackage.format === 'excel' ? (
                      <div className="space-y-2">
                        <FileSpreadsheet className="h-16 w-16 text-green-600 mx-auto" />
                        <p className="text-gray-600">Excel 파일 미리보기</p>
                        <p className="text-sm text-gray-500">스프레드시트 형태의 신고서 데이터</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FileText className="h-16 w-16 text-red-600 mx-auto" />
                        <p className="text-gray-600">PDF 파일 미리보기</p>
                        <p className="text-sm text-gray-500">인쇄 가능한 신고서 문서</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeViewModal}>
                  닫기
                </Button>
                <Button 
                  className="bg-black hover:bg-gray-800 text-white"
                  onClick={() => {
                    handleDownloadPackage(viewingPackage);
                    closeViewModal();
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exports;