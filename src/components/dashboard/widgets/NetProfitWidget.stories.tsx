/**
 * 순이익 위젯 Storybook 스토리
 */

import type { Meta, StoryObj } from '@storybook/react';
import { NetProfitWidget } from './SummaryWidgets';
import { scenarios } from '@/fixtures/dashboard';

const meta: Meta<typeof NetProfitWidget> = {
  title: 'Dashboard/Widgets/NetProfitWidget',
  component: NetProfitWidget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '순이익 위젯 - 이번 달 순이익 수치, 전월 대비 변화율, 스파크라인 차트를 표시합니다.'
      }
    }
  },
  argTypes: {
    onClick: { action: 'clicked' },
    data: {
      description: '순이익 위젯 데이터',
      control: 'object'
    },
    filterState: {
      description: '현재 필터 상태',
      control: 'object'
    }
  }
};

export default meta;
type Story = StoryObj<typeof NetProfitWidget>;

// 기본 스토리 (정상 데이터)
export const Default: Story = {
  args: {
    data: scenarios.normal().summary.netProfit,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 빈 상태 스토리 (신규 사용자)
export const Empty: Story = {
  args: {
    data: scenarios.newUser().summary.netProfit,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 고수익 스토리
export const HighEarning: Story = {
  args: {
    data: scenarios.highEarning().summary.netProfit,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 저수익 스토리
export const LowEarning: Story = {
  args: {
    data: scenarios.lowEarning().summary.netProfit,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 지난 달 데이터
export const LastMonth: Story = {
  args: {
    data: scenarios.lastMonth().summary.netProfit,
    filterState: {
      period: '지난 달',
      projectId: 'project-1'
    }
  }
};

// 간이과세 사업자
export const SimpleTax: Story = {
  args: {
    data: scenarios.simpleTax().summary.netProfit,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 일반과세 사업자
export const GeneralTax: Story = {
  args: {
    data: scenarios.generalTax().summary.netProfit,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 면세 사업자
export const TaxFree: Story = {
  args: {
    data: scenarios.taxFree().summary.netProfit,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};
