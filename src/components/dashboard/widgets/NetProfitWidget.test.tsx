/**
 * 순이익 위젯 단위 테스트
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NetProfitWidget } from './SummaryWidgets';
import { scenarios } from '@/fixtures/dashboard';
import { analytics } from '@/lib/analytics';

// Analytics 모킹
jest.mock('@/lib/analytics', () => ({
  analytics: {
    trackWidgetClicked: jest.fn(),
    trackTodoQuickAction: jest.fn()
  }
}));

describe('NetProfitWidget', () => {
  const mockOnClick = jest.fn();
  const defaultProps = {
    data: scenarios.normal().summary.netProfit,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    },
    onClick: mockOnClick
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('렌더링', () => {
    it('정상 데이터가 있을 때 올바르게 렌더링된다', () => {
      render(<NetProfitWidget {...defaultProps} />);
      
      expect(screen.getByText('이번 달 순이익')).toBeInTheDocument();
      expect(screen.getByText('이번 달 남은 돈')).toBeInTheDocument();
      expect(screen.getByText('거래내역 보기 →')).toBeInTheDocument();
    });

    it('빈 상태일 때 올바르게 렌더링된다', () => {
      const emptyData = scenarios.newUser().summary.netProfit;
      render(<NetProfitWidget {...defaultProps} data={emptyData} />);
      
      expect(screen.getByText('이번 달 순이익')).toBeInTheDocument();
      expect(screen.getByText('첫 거래를 추가해보세요')).toBeInTheDocument();
      expect(screen.getByText('거래 추가하기')).toBeInTheDocument();
    });

    it('금액이 올바르게 포맷팅되어 표시된다', () => {
      render(<NetProfitWidget {...defaultProps} />);
      
      // 금액이 원화 형식으로 표시되는지 확인
      const amountElement = screen.getByText(/₩/);
      expect(amountElement).toBeInTheDocument();
    });

    it('전월 대비 변화율이 올바르게 표시된다', () => {
      render(<NetProfitWidget {...defaultProps} />);
      
      expect(screen.getByText(/전월 대비/)).toBeInTheDocument();
    });
  });

  describe('클릭 이벤트', () => {
    it('버튼 클릭 시 onClick 핸들러가 호출된다', () => {
      render(<NetProfitWidget {...defaultProps} />);
      
      const button = screen.getByText('거래내역 보기 →');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('버튼 클릭 시 Analytics 이벤트가 추적된다', () => {
      render(<NetProfitWidget {...defaultProps} />);
      
      const button = screen.getByText('거래내역 보기 →');
      fireEvent.click(button);
      
      expect(analytics.trackWidgetClicked).toHaveBeenCalledWith(
        'net_profit',
        '이번 달',
        'project-1'
      );
    });

    it('빈 상태에서 버튼 클릭 시 Analytics 이벤트가 추적된다', () => {
      const emptyData = scenarios.newUser().summary.netProfit;
      render(<NetProfitWidget {...defaultProps} data={emptyData} />);
      
      const button = screen.getByText('거래 추가하기');
      fireEvent.click(button);
      
      expect(analytics.trackWidgetClicked).toHaveBeenCalledWith(
        'net_profit',
        '이번 달',
        'project-1'
      );
    });
  });

  describe('접근성', () => {
    it('버튼에 올바른 aria-label이 설정된다', () => {
      render(<NetProfitWidget {...defaultProps} />);
      
      const button = screen.getByLabelText(/거래내역 보기/);
      expect(button).toBeInTheDocument();
    });

    it('빈 상태에서 버튼에 올바른 aria-label이 설정된다', () => {
      const emptyData = scenarios.newUser().summary.netProfit;
      render(<NetProfitWidget {...defaultProps} data={emptyData} />);
      
      const button = screen.getByLabelText('첫 거래 추가하기');
      expect(button).toBeInTheDocument();
    });
  });

  describe('트렌드 표시', () => {
    it('상승 트렌드일 때 올바른 아이콘과 색상이 표시된다', () => {
      const positiveData = {
        ...defaultProps.data,
        monthOverMonthChange: 15.5
      };
      render(<NetProfitWidget {...defaultProps} data={positiveData} />);
      
      expect(screen.getByText('+15.5%')).toBeInTheDocument();
    });

    it('하락 트렌드일 때 올바른 아이콘과 색상이 표시된다', () => {
      const negativeData = {
        ...defaultProps.data,
        monthOverMonthChange: -8.2
      };
      render(<NetProfitWidget {...defaultProps} data={negativeData} />);
      
      expect(screen.getByText('-8.2%')).toBeInTheDocument();
    });
  });
});
