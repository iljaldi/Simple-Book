import React, { useState, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Calendar, Download, PieChart, LineChart, DollarSign, Shield, CheckCircle, Star, Users, Clock } from 'lucide-react';
// PDF 생성 기능은 필요시 활성화
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [customYear, setCustomYear] = useState('2025');
  const [customMonth, setCustomMonth] = useState('1');
  const [showCustomSelector, setShowCustomSelector] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const periods = [
    { value: 'this-month', label: '이번 달' },
    { value: 'last-month', label: '지난 달' },
    { value: 'this-year', label: '올해' },
    { value: 'last-year', label: '작년' },
    { value: 'custom', label: '사용자 지정' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2025 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handlePeriodChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomSelector(true);
      setSelectedPeriod('custom');
    } else {
      setShowCustomSelector(false);
      setSelectedPeriod(value);
    }
  };

  const handleCustomApply = () => {
    setSelectedPeriod('custom');
  };

  const handleDownloadReport = async () => {
    // PDF 다운로드 기능은 필요시 활성화
    alert('PDF 다운로드 기능은 준비 중입니다.');
  };

  // 더미 데이터
  const dummyData = {
    thisMonth: {
      totalIncome: 2500000,
      totalExpense: 1800000,
      netProfit: 700000,
      transactionCount: 45,
      incomeChange: 12,
      expenseChange: -8,
      netProfitChange: 24
    },
    lastMonth: {
      totalIncome: 2200000,
      totalExpense: 1950000,
      netProfit: 250000,
      transactionCount: 38,
      incomeChange: 5,
      expenseChange: 3,
      netProfitChange: 8
    },
    thisYear: {
      totalIncome: 28000000,
      totalExpense: 21000000,
      netProfit: 7000000,
      transactionCount: 520,
      incomeChange: 15,
      expenseChange: -5,
      netProfitChange: 35
    },
    lastYear: {
      totalIncome: 24000000,
      totalExpense: 22000000,
      netProfit: 2000000,
      transactionCount: 480,
      incomeChange: 8,
      expenseChange: 2,
      netProfitChange: 12
    }
  };

  const monthlyTrendData = [
    { month: '1월', income: 2100000, expense: 1800000 },
    { month: '2월', income: 2300000, expense: 1900000 },
    { month: '3월', income: 2500000, expense: 2000000 },
    { month: '4월', income: 2400000, expense: 1850000 },
    { month: '5월', income: 2600000, expense: 2100000 },
    { month: '6월', income: 2800000, expense: 1950000 },
    { month: '7월', income: 2700000, expense: 2200000 },
    { month: '8월', income: 2900000, expense: 2050000 },
    { month: '9월', income: 3000000, expense: 2150000 },
    { month: '10월', income: 2800000, expense: 1900000 },
    { month: '11월', income: 2600000, expense: 1800000 },
    { month: '12월', income: 2500000, expense: 1800000 }
  ];

  const categoryData = [
    { category: '식비', amount: 650000, percentage: 36, color: 'bg-red-500' },
    { category: '교통비', amount: 320000, percentage: 18, color: 'bg-blue-500' },
    { category: '쇼핑', amount: 280000, percentage: 16, color: 'bg-green-500' },
    { category: '의료비', amount: 180000, percentage: 10, color: 'bg-yellow-500' },
    { category: '통신비', amount: 150000, percentage: 8, color: 'bg-purple-500' },
    { category: '기타', amount: 220000, percentage: 12, color: 'bg-gray-500' }
  ];

  const incomeTrendData = [
    { month: '1월', amount: 2100000 },
    { month: '2월', amount: 2300000 },
    { month: '3월', amount: 2500000 },
    { month: '4월', amount: 2400000 },
    { month: '5월', amount: 2600000 },
    { month: '6월', amount: 2800000 },
    { month: '7월', amount: 2700000 },
    { month: '8월', amount: 2900000 },
    { month: '9월', amount: 3000000 },
    { month: '10월', amount: 2800000 },
    { month: '11월', amount: 2600000 },
    { month: '12월', amount: 2500000 }
  ];

  const expenseTrendData = [
    { month: '1월', amount: 1800000 },
    { month: '2월', amount: 1900000 },
    { month: '3월', amount: 2000000 },
    { month: '4월', amount: 1850000 },
    { month: '5월', amount: 2100000 },
    { month: '6월', amount: 1950000 },
    { month: '7월', amount: 2200000 },
    { month: '8월', amount: 2050000 },
    { month: '9월', amount: 2150000 },
    { month: '10월', amount: 1900000 },
    { month: '11월', amount: 1800000 },
    { month: '12월', amount: 1800000 }
  ];

  const currentData = useMemo(() => {
    switch (selectedPeriod) {
      case 'this-month':
        return dummyData.thisMonth;
      case 'last-month':
        return dummyData.lastMonth;
      case 'this-year':
        return dummyData.thisYear;
      case 'last-year':
        return dummyData.lastYear;
      case 'custom':
        // 사용자 지정 기간에 따른 더미 데이터 생성
        const selectedYear = parseInt(customYear);
        const selectedMonth = parseInt(customMonth);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        
        // 현재 연월과 비교하여 데이터 조정
        const yearDiff = selectedYear - currentYear;
        const monthDiff = selectedMonth - currentMonth;
        
        // 기본 데이터에 변동 적용
        const baseData = dummyData.thisMonth;
        const incomeMultiplier = 1 + (yearDiff * 0.1) + (monthDiff * 0.05);
        const expenseMultiplier = 1 + (yearDiff * 0.08) + (monthDiff * 0.03);
        
        return {
          totalIncome: Math.round(baseData.totalIncome * incomeMultiplier),
          totalExpense: Math.round(baseData.totalExpense * expenseMultiplier),
          netProfit: Math.round(baseData.totalIncome * incomeMultiplier - baseData.totalExpense * expenseMultiplier),
          transactionCount: Math.round(baseData.transactionCount * (1 + yearDiff * 0.05)),
          incomeChange: baseData.incomeChange + (yearDiff * 2),
          expenseChange: baseData.expenseChange + (yearDiff * 1),
          netProfitChange: baseData.netProfitChange + (yearDiff * 3)
        };
      default:
        return dummyData.thisMonth;
    }
  }, [selectedPeriod, customYear, customMonth]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>재무리포트 - 간편장부 | 프리랜서 1인사업자 수입지출 분석</title>
        <meta name="description" content="프리랜서와 1인사업자를 위한 재무리포트 분석. 수입·지출 동향을 분석하고 PDF로 다운로드하세요. 월별·연도별 상세 분석 제공!" />
        <meta name="keywords" content="재무리포트, 수입지출분석, 장부리포트, 프리랜서, 1인사업자, 간편장부, 월별분석, PDF다운로드, 재무관리" />
        <meta property="og:title" content="재무리포트 - 간편장부 | 프리랜서 1인사업자 수입지출 분석" />
        <meta property="og:description" content="프리랜서와 1인사업자를 위한 재무리포트 분석. 수입·지출 동향을 분석하고 PDF로 다운로드하세요." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://simplebook.site/reports" />
      </Helmet>
      <div ref={reportRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">재무 리포트</h1>
            <p className="text-gray-600">수입과 지출을 분석하고 인사이트를 확인하세요</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="backdrop-glass border-primary/20 hover:border-primary/40 text-foreground hover:text-primary transition-smooth"
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? '다운로드 중...' : '리포트 다운로드'}
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {periods.slice(0, 4).map((period) => (
              <Badge 
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "secondary"}
                className={`cursor-pointer transition-smooth h-10 px-3 py-2 ${
                  selectedPeriod === period.value 
                    ? 'bg-primary text-primary-foreground shadow-green' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                onClick={() => handlePeriodChange(period.value)}
              >
                {period.label}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="기간 선택" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Period Selector - Fixed Height Container */}
          <div className="h-10 flex items-center">
            {(showCustomSelector || selectedPeriod === 'custom') && (
              <div className="flex items-center gap-2 h-10">
                <Select value={customYear} onValueChange={setCustomYear}>
                  <SelectTrigger className="w-20 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">년</span>
                
                <Select value={customMonth} onValueChange={setCustomMonth}>
                  <SelectTrigger className="w-16 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month}월
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleCustomApply}
                  className="h-10 px-4"
                >
                  적용
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <span className={`text-xs ${currentData.incomeChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentData.incomeChange > 0 ? '+' : ''}{currentData.incomeChange}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">총 수입</p>
                <p className="text-2xl font-bold text-green-600 mb-1">₩{currentData.totalIncome.toLocaleString()}</p>
                <p className="text-xs text-gray-500">수입 현황</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />
                </div>
                <span className={`text-xs ${currentData.expenseChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {currentData.expenseChange > 0 ? '+' : ''}{currentData.expenseChange}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">총 지출</p>
                <p className="text-2xl font-bold text-red-600 mb-1">₩{currentData.totalExpense.toLocaleString()}</p>
                <p className="text-xs text-gray-500">지출 현황</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <span className={`text-xs ${currentData.netProfitChange > 0 ? 'text-purple-600' : 'text-red-600'}`}>
                  {currentData.netProfitChange > 0 ? '+' : ''}{currentData.netProfitChange}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">순이익</p>
                <p className="text-2xl font-bold text-purple-600 mb-1">₩{currentData.netProfit.toLocaleString()}</p>
                <p className="text-xs text-gray-500">순이익 현황</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                </div>
                <span className="text-xs text-gray-500">평균</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">거래 건수</p>
                <p className="text-2xl font-bold text-gray-600 mb-1">{currentData.transactionCount}</p>
                <p className="text-xs text-gray-500">거래 현황</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* 월별 통계 */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-blue-100">
                  <LineChart className="h-5 w-5 text-blue-600" />
                </div>
                월별 추세
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">₩{monthlyTrendData[monthlyTrendData.length - 1].income.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">이번 달 수입</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">₩{monthlyTrendData[monthlyTrendData.length - 1].expense.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">이번 달 지출</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {monthlyTrendData.slice(-6).map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-green-600">+₩{data.income.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">수입</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-red-600">-₩{data.expense.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">지출</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${data.income - data.expense > 0 ? 'text-purple-600' : 'text-red-600'}`}>
                            ₩{(data.income - data.expense).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">순이익</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 카테고리별 분석 */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-orange-100">
                  <PieChart className="h-5 w-5 text-orange-600" />
                </div>
                카테고리별 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                        <span className="text-sm font-medium">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">₩{category.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{category.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">총 지출</span>
                    <span className="text-lg font-bold text-gray-700">
                      ₩{categoryData.reduce((sum, cat) => sum + cat.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* 수입 동향 */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-green-100">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                수입 동향 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-green-600">₩{incomeTrendData[incomeTrendData.length - 1].amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">이번 달 수입</p>
                </div>
                <div className="space-y-2">
                  {incomeTrendData.slice(-6).map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.amount / Math.max(...incomeTrendData.map(d => d.amount))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-green-600 w-20 text-right">₩{data.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">평균 수입</span>
                    <span className="text-lg font-bold text-green-700">
                      ₩{Math.round(incomeTrendData.reduce((sum, data) => sum + data.amount, 0) / incomeTrendData.length).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 지출 동향 */}
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-red-100">
                  <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />
                </div>
                지출 동향 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-red-600">₩{expenseTrendData[expenseTrendData.length - 1].amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">이번 달 지출</p>
                </div>
                <div className="space-y-2">
                  {expenseTrendData.slice(-6).map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(data.amount / Math.max(...expenseTrendData.map(d => d.amount))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-red-600 w-20 text-right">₩{data.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-700">평균 지출</span>
                    <span className="text-lg font-bold text-red-700">
                      ₩{Math.round(expenseTrendData.reduce((sum, data) => sum + data.amount, 0) / expenseTrendData.length).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 전문 세무 검토 연계 섹션 */}
        <div className="mt-16">
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-900">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                전문 세무 검토 연계
                <Badge className="bg-purple-600 text-white">신규</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 왼쪽: 서비스 소개 */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">전문 세무사가 검토해드립니다</h3>
                    <p className="text-gray-600 leading-relaxed">
                      간편장부로 정리한 데이터를 전문 세무사가 검토하여 
                      홈택스 신고 시 발생할 수 있는 오류를 미리 방지하고 
                      최적의 세무 전략을 제안해드립니다.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">세무 신고 오류 방지</p>
                        <p className="text-sm text-gray-600">분류 오류, 누락 항목 등을 사전에 점검</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">최적 세무 전략 제안</p>
                        <p className="text-sm text-gray-600">개인 상황에 맞는 절세 방안 제안</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">홈택스 신고 지원</p>
                        <p className="text-sm text-gray-600">신고서 작성부터 제출까지 전 과정 지원</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 검토 옵션 */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">검토 서비스 선택</h3>
                    
                    {/* 기본 검토 */}
                    <Card className="border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Shield className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">기본 검토</h4>
                              <p className="text-sm text-gray-600">데이터 정확성 검토</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">₩50,000</p>
                            <p className="text-xs text-gray-500">1회</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>3-5일 소요</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 프리미엄 검토 */}
                    <Card className="border-2 border-purple-200 bg-purple-50 hover:border-purple-400 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Star className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">프리미엄 검토</h4>
                              <p className="text-sm text-gray-600">전체 세무 전략 검토</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-purple-600">₩150,000</p>
                            <p className="text-xs text-gray-500">1회</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>5-7일 소요</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 연간 구독 */}
                    <Card className="border border-gray-200 hover:border-green-300 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">연간 구독</h4>
                              <p className="text-sm text-gray-600">월 1회 정기 검토</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">₩300,000</p>
                            <p className="text-xs text-gray-500">연간</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>월 1회 검토</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                      검토 신청하기
                    </Button>
                    <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                      상담 문의
                    </Button>
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

export default Reports;