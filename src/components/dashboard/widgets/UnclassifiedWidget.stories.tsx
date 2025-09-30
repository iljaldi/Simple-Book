/**
 * 미분류/미증빙 위젯 Storybook 스토리
 */

import type { Meta, StoryObj } from '@storybook/react';
import { UnclassifiedWidget } from './TaskWidgets';
import { scenarios } from '@/fixtures/dashboard';

const meta: Meta<typeof UnclassifiedWidget> = {
  title: 'Dashboard/Widgets/UnclassifiedWidget',
  component: UnclassifiedWidget,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '미분류/미증빙 위젯 - 처리해야 할 미분류 거래와 미증빙 거래 건수를 표시하고 빠른 처리를 위한 액션을 제공합니다.'
      }
    }
  },
  argTypes: {
    onClick: { action: 'clicked' },
    onRuleCreate: { action: 'rule-create-clicked' },
    data: {
      description: '미분류/미증빙 위젯 데이터',
      control: 'object'
    },
    filterState: {
      description: '현재 필터 상태',
      control: 'object'
    }
  }
};

export default meta;
type Story = StoryObj<typeof UnclassifiedWidget>;

// 기본 스토리 (정상 데이터)
export const Default: Story = {
  args: {
    data: scenarios.normal().tasks.unclassified,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 빈 상태 스토리 (신규 사용자)
export const Empty: Story = {
  args: {
    data: scenarios.newUser().tasks.unclassified,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 낮은 우선순위 (1-5건)
export const LowPriority: Story = {
  args: {
    data: {
      ...scenarios.normal().tasks.unclassified,
      unclassifiedCount: 3,
      unreceiptedCount: 2,
      totalPendingCount: 5,
      hasRepeatingPattern: false
    },
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 중간 우선순위 (6-10건)
export const MediumPriority: Story = {
  args: {
    data: {
      ...scenarios.normal().tasks.unclassified,
      unclassifiedCount: 7,
      unreceiptedCount: 3,
      totalPendingCount: 10,
      hasRepeatingPattern: false
    },
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 높은 우선순위 (10건 이상)
export const HighPriority: Story = {
  args: {
    data: {
      ...scenarios.normal().tasks.unclassified,
      unclassifiedCount: 15,
      unreceiptedCount: 8,
      totalPendingCount: 23,
      hasRepeatingPattern: false
    },
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 반복 패턴 발견 (규칙 만들기 제안)
export const WithRepeatingPattern: Story = {
  args: {
    data: {
      ...scenarios.normal().tasks.unclassified,
      unclassifiedCount: 8,
      unreceiptedCount: 4,
      totalPendingCount: 12,
      hasRepeatingPattern: true,
      ruleSuggestionMessage: '반복되는 패턴을 발견했습니다. 규칙을 만들어보세요!'
    },
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 월말 시나리오 (과부하 상태)
export const MonthEnd: Story = {
  args: {
    data: scenarios.monthEnd().tasks.unclassified,
    filterState: {
      period: '이번 달',
      projectId: 'project-1'
    }
  }
};

// 지난 달 데이터
export const LastMonth: Story = {
  args: {
    data: scenarios.lastMonth().tasks.unclassified,
    filterState: {
      period: '지난 달',
      projectId: 'project-1'
    }
  }
};
