import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Calendar, Download, PieChart, LineChart, DollarSign } from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');

  const periods = [
    { value: 'this-month', label: '이번 달' },
    { value: 'last-month', label: '지난 달' },
    { value: 'this-year', label: '올해' },
    { value: 'last-year', label: '작년' },
    { value: 'custom', label: '기간 선택' },
  ];

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
      default:
        return dummyData.thisMonth;
    }
  }, [selectedPeriod]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">재무 리포트</h1>
            <p className="text-gray-600">수입과 지출을 분석하고 인사이트를 확인하세요</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="backdrop-glass border-primary/20 hover:border-primary/40 text-foreground hover:text-primary transition-smooth">
              <Download className="h-4 w-4 mr-2" />
              리포트 다운로드
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
                className={`cursor-pointer transition-smooth ${
                  selectedPeriod === period.value 
                    ? 'bg-primary text-primary-foreground shadow-green' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                onClick={() => setSelectedPeriod(period.value)}
              >
                {period.label}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
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
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
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
      </div>
    </div>
  );
};

export default Reports;