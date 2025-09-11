import React, { useState } from 'react';
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
          <Card className="shadow-card gradient-card hover:shadow-green transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-income/10">
                  <TrendingUp className="h-5 w-5 text-income" />
                </div>
                <span className="text-xs text-muted-foreground">+12%</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">총 수입</p>
                <p className="text-2xl font-bold text-income">₩0</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card gradient-card hover:shadow-green transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-expense/10">
                  <TrendingUp className="h-5 w-5 text-expense rotate-180" />
                </div>
                <span className="text-xs text-muted-foreground">-8%</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">총 지출</p>
                <p className="text-2xl font-bold text-expense">₩0</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card gradient-card hover:shadow-green transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-success">+24%</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">순이익</p>
                <p className="text-2xl font-bold text-primary">₩0</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card gradient-card hover:shadow-green transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-mint/10">
                  <BarChart3 className="h-5 w-5 text-mint" />
                </div>
                <span className="text-xs text-muted-foreground">평균</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">거래 건수</p>
                <p className="text-2xl font-bold text-foreground">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* 월별 통계 */}
          <Card className="shadow-card gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-primary/10">
                  <LineChart className="h-5 w-5 text-primary" />
                </div>
                월별 추세
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <LineChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">거래 데이터가 없습니다</p>
                <p className="text-sm">거래를 입력하면 월별 추세가 표시됩니다</p>
              </div>
            </CardContent>
          </Card>

          {/* 카테고리별 분석 */}
          <Card className="shadow-card gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-frog/10">
                  <PieChart className="h-5 w-5 text-frog" />
                </div>
                카테고리별 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">카테고리 분석 준비 중</p>
                <p className="text-sm">거래를 입력하고 카테고리를 설정해주세요</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* 수입 동향 */}
          <Card className="shadow-card gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-income/10">
                  <TrendingUp className="h-5 w-5 text-income" />
                </div>
                수입 동향 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">수입 분석 준비 중</p>
                <p className="text-sm">수입 거래를 입력하면 분석이 표시됩니다</p>
              </div>
            </CardContent>
          </Card>

          {/* 지출 동향 */}
          <Card className="shadow-card gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-expense/10">
                  <TrendingUp className="h-5 w-5 text-expense rotate-180" />
                </div>
                지출 동향 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50 rotate-180" />
                <p className="text-lg font-medium mb-2">지출 분석 준비 중</p>
                <p className="text-sm">지출 거래를 입력하면 분석이 표시됩니다</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;