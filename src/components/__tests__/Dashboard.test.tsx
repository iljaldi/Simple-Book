import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '@/pages/Dashboard';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            lte: jest.fn(() => ({
              order: jest.fn(() => ({
                limit: jest.fn(() => ({
                  data: [],
                  error: null
                }))
              }))
            }))
          }))
        }))
      }))
    }))
  }
}));

// Mock useDashboardData hook
jest.mock('@/hooks/useDashboardData', () => ({
  useDashboardData: jest.fn(() => ({
    stats: {
      profit: 1000000,
      tax: 100000,
      income: 1500000,
      expense: 500000,
      profitChange: 10.5,
      incomeChange: 15.2,
      expenseChange: -5.3
    },
    transactions: [
      {
        id: '1',
        company: '테스트 회사',
        date: '2025. 1. 15.',
        amount: 100000,
        type: 'income'
      }
    ],
    fixedExpenses: [
      {
        id: '1',
        name: '테스트 고정지출',
        amount: 50000,
        day: 1,
        category: '기타'
      }
    ],
    loading: false,
    error: null,
    lastUpdated: new Date('2025-01-15T10:00:00Z'),
    refetch: jest.fn()
  }))
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard 컴포넌트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('대시보드가 정상적으로 렌더링된다', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('대시보드')).toBeInTheDocument();
    expect(screen.getByText('오늘의 장부 현황을 확인하세요')).toBeInTheDocument();
  });

  it('통계 카드들이 정상적으로 표시된다', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('순이익')).toBeInTheDocument();
    expect(screen.getByText('예상 세금')).toBeInTheDocument();
    expect(screen.getByText('이번 달 수입')).toBeInTheDocument();
    expect(screen.getByText('이번 달 지출')).toBeInTheDocument();
  });

  it('거래 내역이 정상적으로 표시된다', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('최근 거래')).toBeInTheDocument();
    expect(screen.getByText('테스트 회사')).toBeInTheDocument();
    expect(screen.getByText('+₩100,000')).toBeInTheDocument();
  });

  it('고정 지출이 정상적으로 표시된다', () => {
    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('고정 지출')).toBeInTheDocument();
    expect(screen.getByText('테스트 고정지출')).toBeInTheDocument();
    expect(screen.getByText('-₩50,000')).toBeInTheDocument();
  });

  it('기간 선택 드롭다운이 작동한다', async () => {
    renderWithProviders(<Dashboard />);
    
    const periodSelect = screen.getByRole('combobox');
    fireEvent.click(periodSelect);
    
    await waitFor(() => {
      expect(screen.getByText('이전 달')).toBeInTheDocument();
      expect(screen.getByText('사용자 지정')).toBeInTheDocument();
    });
  });

  it('새로고침 버튼이 작동한다', () => {
    const mockRefetch = jest.fn();
    const { useDashboardData } = require('@/hooks/useDashboardData');
    useDashboardData.mockReturnValue({
      stats: { profit: 0, tax: 0, income: 0, expense: 0, profitChange: 0, incomeChange: 0, expenseChange: 0 },
      transactions: [],
      fixedExpenses: [],
      loading: false,
      error: null,
      lastUpdated: null,
      refetch: mockRefetch
    });

    renderWithProviders(<Dashboard />);
    
    const refreshButton = screen.getByText('새로고침');
    fireEvent.click(refreshButton);
    
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('로딩 상태가 정상적으로 표시된다', () => {
    const { useDashboardData } = require('@/hooks/useDashboardData');
    useDashboardData.mockReturnValue({
      stats: null,
      transactions: [],
      fixedExpenses: [],
      loading: true,
      error: null,
      lastUpdated: null,
      refetch: jest.fn()
    });

    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('순이익 데이터 로딩 중...')).toBeInTheDocument();
    expect(screen.getByText('차트 데이터 로딩 중...')).toBeInTheDocument();
  });

  it('에러 상태가 정상적으로 표시된다', () => {
    const { useDashboardData } = require('@/hooks/useDashboardData');
    useDashboardData.mockReturnValue({
      stats: null,
      transactions: [],
      fixedExpenses: [],
      loading: false,
      error: '데이터를 불러오는 중 오류가 발생했습니다.',
      lastUpdated: null,
      refetch: jest.fn()
    });

    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('대시보드 데이터를 불러올 수 없습니다')).toBeInTheDocument();
    expect(screen.getByText('데이터를 불러오는 중 오류가 발생했습니다.')).toBeInTheDocument();
  });

  it('빈 데이터 상태가 정상적으로 표시된다', () => {
    const { useDashboardData } = require('@/hooks/useDashboardData');
    useDashboardData.mockReturnValue({
      stats: { profit: 0, tax: 0, income: 0, expense: 0, profitChange: 0, incomeChange: 0, expenseChange: 0 },
      transactions: [],
      fixedExpenses: [],
      loading: false,
      error: null,
      lastUpdated: new Date(),
      refetch: jest.fn()
    });

    renderWithProviders(<Dashboard />);
    
    expect(screen.getByText('거래 내역이 없습니다')).toBeInTheDocument();
    expect(screen.getByText('고정 지출이 없습니다')).toBeInTheDocument();
  });
});
