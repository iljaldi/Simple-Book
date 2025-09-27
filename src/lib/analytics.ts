/**
 * Analytics 이벤트 스텁
 * 실제 구현에서는 Google Analytics, Mixpanel 등으로 교체
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export interface WidgetClickEvent extends AnalyticsEvent {
  name: 'Widget Clicked';
  properties: {
    widget_id: string;
    filter_state: {
      period: string;
      project_id?: string;
    };
  };
}

export interface TodoQuickActionEvent extends AnalyticsEvent {
  name: 'Todo Quick Action';
  properties: {
    type: 'unclassified' | 'unproven';
    action: 'click' | 'complete';
  };
}

export interface DashboardViewedEvent extends AnalyticsEvent {
  name: 'Dashboard Viewed';
  properties: {
    period: string;
    project_id?: string;
    user_type?: string;
  };
}

/**
 * Analytics 클래스
 */
export class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  /**
   * 이벤트 추적
   */
  track(event: AnalyticsEvent): void {
    const eventWithTimestamp = {
      ...event,
      timestamp: Date.now()
    };
    
    this.events.push(eventWithTimestamp);
    
    // 개발 환경에서 콘솔에 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventWithTimestamp);
    }
    
    // TODO: 실제 Analytics 서비스로 전송
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - PostHog
  }

  /**
   * 대시보드 조회 이벤트
   */
  trackDashboardViewed(period: string, projectId?: string, userType?: string): void {
    this.track({
      name: 'Dashboard Viewed',
      properties: {
        period,
        project_id: projectId,
        user_type: userType
      }
    });
  }

  /**
   * 위젯 클릭 이벤트
   */
  trackWidgetClicked(widgetId: string, period: string, projectId?: string): void {
    this.track({
      name: 'Widget Clicked',
      properties: {
        widget_id: widgetId,
        filter_state: {
          period,
          project_id: projectId
        }
      }
    });
  }

  /**
   * 할 일 빠른 액션 이벤트
   */
  trackTodoQuickAction(type: 'unclassified' | 'unproven', action: 'click' | 'complete'): void {
    this.track({
      name: 'Todo Quick Action',
      properties: {
        type,
        action
      }
    });
  }

  /**
   * 저장된 이벤트 조회 (테스트용)
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * 이벤트 초기화 (테스트용)
   */
  clearEvents(): void {
    this.events = [];
  }
}

// 싱글톤 인스턴스 내보내기
export const analytics = Analytics.getInstance();
