import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Receipt, Camera, BarChart3, Calculator, TrendingUp, TrendingDown, DollarSign, Calendar, ChevronDown, Plus, Minus, Circle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import CalendarView from '@/components/calendar/CalendarView';

const Dashboard: React.FC = () => {
  console.log('Dashboard 컴포넌트 렌더링됨');
  const [selectedPeriod, setSelectedPeriod] = useState('이번 달');
  const [customMonth, setCustomMonth] = useState('1');
  const [customYear, setCustomYear] = useState('2025');
  const [showCustomSelector, setShowCustomSelector] = useState(false);
  const [isCustomPeriod, setIsCustomPeriod] = useState(false);

  const handlePeriodChange = (value: string) => {
    if (value === '사용자 지정') {
      setShowCustomSelector(true);
      setSelectedPeriod('사용자 지정');
      setIsCustomPeriod(false);
    } else {
      setShowCustomSelector(false);
      setSelectedPeriod(value);
      setIsCustomPeriod(false);
    }
  };

  const handleCustomApply = () => {
    const customPeriod = `${customYear}년 ${customMonth}월`;
    setSelectedPeriod(customPeriod);
    setShowCustomSelector(false);
    setIsCustomPeriod(true);
  };

  // 선택된 기간에 따른 데이터 계산
  const getPeriodData = () => {
    switch (selectedPeriod) {
      case '이번 달':
        return {
          profit: 5118000,
          tax: 511800,
          income: 5130000,
          expense: 12000,
          profitChange: 675.5,
          incomeChange: 632.9,
          expenseChange: -70.0
        };
      case '이전 달':
        return {
          profit: 3000000,
          tax: 300000,
          income: 3500000,
          expense: 500000,
          profitChange: 25.0,
          incomeChange: 15.0,
          expenseChange: -10.0
        };
      default:
        // 사용자 지정 기간 (예시 데이터)
        return {
          profit: 4000000,
          tax: 400000,
          income: 4500000,
          expense: 500000,
          profitChange: 50.0,
          incomeChange: 30.0,
          expenseChange: -20.0
        };
    }
  };

  const periodData = getPeriodData();

  // 선택된 기간에 따른 거래 내역 데이터
  const getTransactionData = () => {
    switch (selectedPeriod) {
      case '이번 달':
        return [
          { company: '컴팩트 소프트', date: '2025. 8. 31.', amount: 5000000, type: 'income' },
          { company: '네이버', date: '2025. 8. 31.', amount: 70000, type: 'income' },
          { company: '카카오페이', date: '2025. 8. 30.', amount: 150000, type: 'income' },
          { company: '토스', date: '2025. 8. 29.', amount: 80000, type: 'income' },
          { company: '스타벅스', date: '2025. 8. 28.', amount: 15000, type: 'expense' },
          { company: '쿠팡', date: '2025. 8. 27.', amount: 45000, type: 'expense' },
          { company: '배달의민족', date: '2025. 8. 26.', amount: 35000, type: 'expense' },
          { company: '아임웹', date: '2025. 8. 25.', amount: 60000, type: 'expense' }
        ];
      case '이전 달':
        return [
          { company: '카카오', date: '2025. 7. 15.', amount: 3000000, type: 'income' },
          { company: '구글', date: '2025. 7. 20.', amount: 150000, type: 'income' },
          { company: '애플', date: '2025. 7. 10.', amount: 120000, type: 'income' },
          { company: '삼성', date: '2025. 7. 5.', amount: 80000, type: 'income' },
          { company: '마이크로소프트', date: '2025. 7. 25.', amount: 200000, type: 'expense' },
          { company: 'LG', date: '2025. 7. 1.', amount: 60000, type: 'expense' },
          { company: 'SK텔레콤', date: '2025. 7. 12.', amount: 45000, type: 'expense' }
        ];
      default:
        return [
          { company: '선택된 기간', date: `${customYear}. ${customMonth}. 15.`, amount: 2500000, type: 'income' },
          { company: '사용자 지정', date: `${customYear}. ${customMonth}. 20.`, amount: 100000, type: 'income' },
          { company: '데모 거래', date: `${customYear}. ${customMonth}. 10.`, amount: 300000, type: 'income' },
          { company: '커스텀', date: `${customYear}. ${customMonth}. 25.`, amount: 150000, type: 'expense' },
          { company: '테스트 거래', date: `${customYear}. ${customMonth}. 5.`, amount: 50000, type: 'expense' }
        ];
    }
  };

  const transactionData = getTransactionData();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
            <p className="text-gray-600">오늘의 장부 현황을 확인하세요</p>
          </div>
          <div className="flex items-center gap-2">
            <Select 
              value={isCustomPeriod ? 'custom' : selectedPeriod} 
              onValueChange={handlePeriodChange}
            >
              <SelectTrigger className="w-32 h-10 bg-white border-gray-200">
                <SelectValue placeholder="기간 선택">
                  {isCustomPeriod ? selectedPeriod : selectedPeriod}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="이번 달">이번 달</SelectItem>
                <SelectItem value="이전 달">이전 달</SelectItem>
                <SelectItem value="사용자 지정">사용자 지정</SelectItem>
              </SelectContent>
            </Select>
            
            {showCustomSelector && (
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                <Select value={customYear} onValueChange={setCustomYear}>
                  <SelectTrigger className="w-20 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">년</span>
                
                <Select value={customMonth} onValueChange={setCustomMonth}>
                  <SelectTrigger className="w-16 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1}월
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  size="sm" 
                  onClick={handleCustomApply}
                  className="h-8 px-3 bg-black hover:bg-gray-800 text-white"
                >
                  적용
                </Button>
              </div>
            )}
          </div>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 순이익 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-600">₩</span>
            </div>
            </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">순이익</p>
                <p className="text-2xl font-bold text-purple-600 mb-1">₩{periodData.profit.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mb-1">{selectedPeriod} 순이익</p>
                <p className="text-xs text-purple-600 font-medium">↑{periodData.profitChange}%</p>
            </div>
          </CardContent>
        </Card>

          {/* 예상 세금 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
            </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">예상 세금</p>
                <p className="text-2xl font-bold text-yellow-600 mb-1">₩{periodData.tax.toLocaleString()}</p>
                <p className="text-xs text-gray-500">예상 부가세+소득세</p>
            </div>
          </CardContent>
        </Card>

          {/* 이번 달 수입 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{selectedPeriod} 수입</p>
                <p className="text-2xl font-bold text-green-600 mb-1">₩{periodData.income.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mb-1">총 수입</p>
                <p className="text-xs text-green-600 font-medium">↑{periodData.incomeChange}%</p>
            </div>
          </CardContent>
        </Card>

          {/* 이번 달 지출 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{selectedPeriod} 지출</p>
                <p className="text-2xl font-bold text-red-600 mb-1">₩{periodData.expense.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mb-1">총 지출</p>
                <p className="text-xs text-red-600 font-medium">↓{Math.abs(periodData.expenseChange)}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Charts and Calendar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 월별 추세 차트 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <MonthlyTrendChart selectedYear={isCustomPeriod ? customYear : '2025'} />
            </CardContent>
          </Card>

          {/* 달력 뷰 */}
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <CalendarView 
                selectedYear={isCustomPeriod ? parseInt(customYear) : 2025}
                selectedMonth={isCustomPeriod ? parseInt(customMonth) - 1 : 8}
              />
            </CardContent>
          </Card>
      </div>

        {/* Recent Transactions and Quick Start Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 거래 */}
          <Card className="border border-gray-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900">최근 거래</CardTitle>
                <span className="text-sm text-gray-500">{transactionData.length}건</span>
              </div>
          </CardHeader>
          <CardContent>
              <div className="space-y-3">
                {transactionData.map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <Plus className="h-4 w-4 text-green-600" />
                        ) : (
                          <Minus className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.company}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
                    </div>
                    <span className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₩{transaction.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
          </CardContent>
        </Card>

          {/* 고정 지출 */}
          <Card className="border border-gray-200">
          <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-gray-900">고정 지출</CardTitle>
                <span className="text-sm text-gray-500">7건</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                      <Minus className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">식비/다과비</p>
                      <p className="text-sm text-gray-500">매월 1일</p>
                    </div>
                  </div>
                  <span className="font-medium text-red-600">-₩200,000</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                      <Minus className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">교통비</p>
                      <p className="text-sm text-gray-500">매월 5일</p>
                    </div>
                  </div>
                  <span className="font-medium text-red-600">-₩80,000</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                      <Minus className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">소프트웨어/구독료</p>
                      <p className="text-sm text-gray-500">매월 10일</p>
                    </div>
                  </div>
                  <span className="font-medium text-red-600">-₩150,000</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                      <Minus className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">통신비</p>
                      <p className="text-sm text-gray-500">매월 15일</p>
                    </div>
                  </div>
                  <span className="font-medium text-red-600">-₩120,000</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                      <Minus className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">사무실 임차료/공유오피스</p>
                      <p className="text-sm text-gray-500">매월 20일</p>
                    </div>
                  </div>
                  <span className="font-medium text-red-600">-₩500,000</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                      <Minus className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">외주비/프리랜서 비용</p>
                      <p className="text-sm text-gray-500">매월 25일</p>
                    </div>
                  </div>
                  <span className="font-medium text-red-600">-₩300,000</span>
              </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                      <Minus className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">수수료</p>
                      <p className="text-sm text-gray-500">매월 30일</p>
                    </div>
                  </div>
                  <span className="font-medium text-red-600">-₩50,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;