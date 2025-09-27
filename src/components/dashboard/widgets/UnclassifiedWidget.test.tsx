/**
 * 미분류/미증빙 위젯 단위 테스트
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnclassifiedWidget } from './TaskWidgets';
import { scenarios } from '@/fixtures/dashboard';
import { analytics } from '@/lib/analytics';

// Analytics 모킹
jest.mock('@/lib/analytics', () => ({
  analytics: {
    trackWidgetClicked: jest.fn(),
    trackTodoQuickAction: jest.fn()
  }
}));

describe('UnclassifiedWidget', () => {
  const mockOnClick = jest.fn();
  const mockOnRuleCreate = jest.fn();
  const defaultProps = {
    data: scenarios.normal().tasks.unclassified,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    },
    onClick: mockOnClick,
    onRuleCreate: mockOnRuleCreate
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('렌더링', () => {
    it('정상 데이터가 있을 때 올바르게 렌더링된다', () => {
      render(<UnclassifiedWidget {...defaultProps} />);
      
      expect(screen.getByText('미분류 / 미증빙')).toBeInTheDocument();
      expect(screen.getByText(/미분류 \d+건 \/ 미증빙 \d+건/)).toBeInTheDocument();
      expect(screen.getByText('지금 정리')).toBeInTheDocument();
    });

    it('빈 상태일 때 올바르게 렌더링된다', () => {
      const emptyData = scenarios.newUser().tasks.unclassified;
      render(<UnclassifiedWidget {...defaultProps} data={emptyData} />);
      
      expect(screen.getByText('미분류 / 미증빙')).toBeInTheDocument();
      expect(screen.getByText('미분류 0건 / 미증빙 0건')).toBeInTheDocument();
      expect(screen.getByText('정리할 거래가 없습니다')).toBeInTheDocument();
    });

    it('반복 패턴이 있을 때 규칙 만들기 배지가 표시된다', () => {
      const patternData = {
        ...defaultProps.data,
        hasRepeatingPattern: true,
        ruleSuggestionMessage: '반복되는 패턴을 발견했습니다. 규칙을 만들어보세요!'
      };
      render(<UnclassifiedWidget {...defaultProps} data={patternData} />);
      
      expect(screen.getByText('규칙 만들기')).toBeInTheDocument();
    });

    it('반복 패턴이 없을 때 규칙 만들기 배지가 표시되지 않는다', () => {
      render(<UnclassifiedWidget {...defaultProps} />);
      
      expect(screen.queryByText('규칙 만들기')).not.toBeInTheDocument();
    });
  });

  describe('우선순위 표시', () => {
    it('낮은 우선순위일 때 올바른 색상이 적용된다', () => {
      const lowPriorityData = {
        ...defaultProps.data,
        unclassifiedCount: 2,
        unreceiptedCount: 1,
        totalPendingCount: 3
      };
      render(<UnclassifiedWidget {...defaultProps} data={lowPriorityData} />);
      
      const card = screen.getByText('미분류 / 미증빙').closest('.border');
      expect(card).toHaveClass('border-green-200', 'bg-green-50');
    });

    it('중간 우선순위일 때 올바른 색상이 적용된다', () => {
      const mediumPriorityData = {
        ...defaultProps.data,
        unclassifiedCount: 5,
        unreceiptedCount: 3,
        totalPendingCount: 8
      };
      render(<UnclassifiedWidget {...defaultProps} data={mediumPriorityData} />);
      
      const card = screen.getByText('미분류 / 미증빙').closest('.border');
      expect(card).toHaveClass('border-yellow-200', 'bg-yellow-50');
    });

    it('높은 우선순위일 때 올바른 색상과 경고 메시지가 표시된다', () => {
      const highPriorityData = {
        ...defaultProps.data,
        unclassifiedCount: 15,
        unreceiptedCount: 8,
        totalPendingCount: 23
      };
      render(<UnclassifiedWidget {...defaultProps} data={highPriorityData} />);
      
      const card = screen.getByText('미분류 / 미증빙').closest('.border');
      expect(card).toHaveClass('border-red-200', 'bg-red-50');
      
      expect(screen.getByText('처리 필요 건수가 많습니다. 우선순위를 정해 처리하세요.')).toBeInTheDocument();
    });
  });

  describe('클릭 이벤트', () => {
    it('메인 버튼 클릭 시 onClick 핸들러가 호출된다', () => {
      render(<UnclassifiedWidget {...defaultProps} />);
      
      const button = screen.getByText('지금 정리');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('메인 버튼 클릭 시 Analytics 이벤트가 추적된다', () => {
      render(<UnclassifiedWidget {...defaultProps} />);
      
      const button = screen.getByText('지금 정리');
      fireEvent.click(button);
      
      expect(analytics.trackTodoQuickAction).toHaveBeenCalledWith('unclassified', 'click');
      expect(analytics.trackWidgetClicked).toHaveBeenCalledWith(
        'unclassified',
        '이번 달',
        'project-1'
      );
    });

    it('규칙 만들기 배지 클릭 시 onRuleCreate 핸들러가 호출된다', () => {
      const patternData = {
        ...defaultProps.data,
        hasRepeatingPattern: true
      };
      render(<UnclassifiedWidget {...defaultProps} data={patternData} />);
      
      const ruleButton = screen.getByText('규칙 만들기');
      fireEvent.click(ruleButton);
      
      expect(mockOnRuleCreate).toHaveBeenCalledTimes(1);
    });

    it('규칙 만들기 배지 클릭 시 Analytics 이벤트가 추적된다', () => {
      const patternData = {
        ...defaultProps.data,
        hasRepeatingPattern: true
      };
      render(<UnclassifiedWidget {...defaultProps} data={patternData} />);
      
      const ruleButton = screen.getByText('규칙 만들기');
      fireEvent.click(ruleButton);
      
      expect(analytics.trackTodoQuickAction).toHaveBeenCalledWith('unproven', 'click');
    });
  });

  describe('접근성', () => {
    it('메인 버튼에 올바른 aria-label이 설정된다', () => {
      render(<UnclassifiedWidget {...defaultProps} />);
      
      const button = screen.getByLabelText(/지금 정리/);
      expect(button).toBeInTheDocument();
    });

    it('규칙 만들기 배지에 올바른 aria-label이 설정된다', () => {
      const patternData = {
        ...defaultProps.data,
        hasRepeatingPattern: true
      };
      render(<UnclassifiedWidget {...defaultProps} data={patternData} />);
      
      const ruleButton = screen.getByLabelText('반복 패턴 발견. 규칙 만들기 클릭');
      expect(ruleButton).toBeInTheDocument();
    });

    it('키보드 네비게이션이 올바르게 작동한다', () => {
      const patternData = {
        ...defaultProps.data,
        hasRepeatingPattern: true
      };
      render(<UnclassifiedWidget {...defaultProps} data={patternData} />);
      
      const ruleButton = screen.getByText('규칙 만들기');
      ruleButton.focus();
      
      fireEvent.keyDown(ruleButton, { key: 'Enter' });
      expect(mockOnRuleCreate).toHaveBeenCalledTimes(1);
      
      fireEvent.keyDown(ruleButton, { key: ' ' });
      expect(mockOnRuleCreate).toHaveBeenCalledTimes(2);
    });
  });

  describe('건수 표시', () => {
    it('미분류와 미증빙 건수가 올바르게 표시된다', () => {
      const testData = {
        ...defaultProps.data,
        unclassifiedCount: 7,
        unreceiptedCount: 3
      };
      render(<UnclassifiedWidget {...defaultProps} data={testData} />);
      
      expect(screen.getByText('미분류 7건 / 미증빙 3건')).toBeInTheDocument();
    });

    it('총 건수가 0일 때 적절한 메시지가 표시된다', () => {
      const emptyData = {
        ...defaultProps.data,
        unclassifiedCount: 0,
        unreceiptedCount: 0,
        totalPendingCount: 0
      };
      render(<UnclassifiedWidget {...defaultProps} data={emptyData} />);
      
      expect(screen.getByText('정리할 거래가 없습니다')).toBeInTheDocument();
    });
  });
});
