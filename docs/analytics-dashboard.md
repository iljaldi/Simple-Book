# 대시보드 Analytics 명세서

## 1. 개요

### 목적
- 대시보드 사용자 행동 패턴 분석
- PRD 핵심 지표(KPI) 추적 및 측정
- 제품 개선을 위한 데이터 기반 의사결정 지원

### 핵심 지표(KPI) 매핑
- **대시보드 진입 후 행동 클릭률 ≥ 35%**
- **미분류/미증빙 잔여 건수 주간 감소**
- **월마감 완료율 및 제때 완료 비율 상승**
- **D30 잔존율 개선(습관화 지표)**

---

## 2. 이벤트 명세

### 2.1 페이지 뷰 이벤트

#### `dashboard_viewed`
**설명**: 대시보드 페이지 진입 시 발생

**발생 시점**:
- 대시보드 URL 접근
- 다른 페이지에서 대시보드로 이동
- 브라우저 새로고침

**파라미터**:
```typescript
{
  page: 'dashboard',
  period: string,           // '이번 달' | '지난 달' | '올해' | '사용자 지정'
  project_id?: string,      // 선택된 프로젝트 ID
  user_type?: string,       // 'freelancer' | 'studio_owner' | 'individual'
  referrer?: string,        // 이전 페이지 경로
  session_id: string,       // 세션 식별자
  timestamp: number         // Unix timestamp
}
```

**예시 페이로드**:
```json
{
  "event": "dashboard_viewed",
  "properties": {
    "page": "dashboard",
    "period": "이번 달",
    "project_id": "proj_123",
    "user_type": "freelancer",
    "referrer": "/transactions",
    "session_id": "sess_abc123",
    "timestamp": 1703123456789
  }
}
```

### 2.2 위젯 상호작용 이벤트

#### `widget_clicked`
**설명**: 대시보드 위젯 클릭 시 발생

**발생 시점**:
- 순이익 위젯 클릭
- 미분류/미증빙 위젯 클릭
- 기타 위젯 클릭

**파라미터**:
```typescript
{
  widget_id: string,        // 'net_profit' | 'unclassified' | 'estimated_tax' | 'cash_flow' | 'top_expenses' | 'tax_calendar'
  widget_name: string,      // 위젯 표시명
  filter_state: {
    period: string,
    project_id?: string
  },
  position: {
    section: string,        // 'summary' | 'tasks' | 'insights'
    order: number          // 섹션 내 순서
  },
  session_id: string,
  timestamp: number
}
```

**예시 페이로드**:
```json
{
  "event": "widget_clicked",
  "properties": {
    "widget_id": "net_profit",
    "widget_name": "이번 달 순이익",
    "filter_state": {
      "period": "이번 달",
      "project_id": "proj_123"
    },
    "position": {
      "section": "summary",
      "order": 1
    },
    "session_id": "sess_abc123",
    "timestamp": 1703123456789
  }
}
```

#### `widget_action_completed`
**설명**: 위젯에서 시작된 액션 완료 시 발생

**발생 시점**:
- 거래내역 페이지 이동 완료
- 영수증함 페이지 이동 완료
- 규칙 만들기 모달 열기 완료

**파라미터**:
```typescript
{
  widget_id: string,
  action_type: string,      // 'navigate_to_transactions' | 'navigate_to_receipts' | 'open_rule_modal'
  destination_page?: string, // 이동한 페이지
  completion_time_ms: number, // 액션 완료까지 걸린 시간
  session_id: string,
  timestamp: number
}
```

### 2.3 할 일 빠른 액션 이벤트

#### `todo_quick_action`
**설명**: 할 일 관련 빠른 액션 수행 시 발생

**발생 시점**:
- 미분류/미증빙 "지금 정리" 클릭
- 규칙 만들기 제안 클릭
- 할 일 체크 완료

**파라미터**:
```typescript
{
  action_type: string,      // 'unclassified_click' | 'unproven_click' | 'task_complete'
  task_category: string,    // 'unclassified' | 'unproven' | 'weekly_task'
  task_count: number,       // 관련된 작업 건수
  urgency_level: string,    // 'low' | 'medium' | 'high'
  session_id: string,
  timestamp: number
}
```

**예시 페이로드**:
```json
{
  "event": "todo_quick_action",
  "properties": {
    "action_type": "unclassified_click",
    "task_category": "unclassified",
    "task_count": 5,
    "urgency_level": "medium",
    "session_id": "sess_abc123",
    "timestamp": 1703123456789
  }
}
```

### 2.4 필터 변경 이벤트

#### `filter_changed`
**설명**: 대시보드 필터 변경 시 발생

**발생 시점**:
- 기간 필터 변경
- 프로젝트 필터 변경
- 필터 초기화

**파라미터**:
```typescript
{
  filter_type: string,      // 'period' | 'project' | 'reset'
  old_value: string,        // 이전 값
  new_value: string,        // 새로운 값
  change_method: string,    // 'chip_click' | 'dropdown_select' | 'reset_button'
  session_id: string,
  timestamp: number
}
```

### 2.5 전역 CTA 이벤트

#### `global_cta_clicked`
**설명**: 전역 스티키 CTA 클릭 시 발생

**발생 시점**:
- FAB 버튼 클릭
- 새 거래 입력 옵션 클릭
- 영수증 촬영 옵션 클릭

**파라미터**:
```typescript
{
  cta_type: string,         // 'fab_open' | 'new_transaction' | 'receipt_capture'
  current_page: string,      // CTA 클릭한 페이지
  session_id: string,
  timestamp: number
}
```

---

## 3. 사용자 여정별 이벤트 시퀀스

### 3.1 신규 사용자 첫 방문
```
dashboard_viewed (period: '이번 달', user_type: 'freelancer')
  → widget_clicked (widget_id: 'net_profit', action: 'empty_state_cta')
  → widget_action_completed (action_type: 'navigate_to_transactions')
```

### 3.2 기존 사용자 일상 사용
```
dashboard_viewed (period: '이번 달')
  → widget_clicked (widget_id: 'unclassified')
  → todo_quick_action (action_type: 'unclassified_click')
  → widget_action_completed (action_type: 'navigate_to_receipts')
  → filter_changed (filter_type: 'period', new_value: '지난 달')
  → dashboard_viewed (period: '지난 달')
```

### 3.3 월말 마감 준비
```
dashboard_viewed (period: '이번 달')
  → widget_clicked (widget_id: 'tax_calendar')
  → widget_action_completed (action_type: 'navigate_to_tax_wizard')
  → todo_quick_action (action_type: 'task_complete', task_category: 'weekly_task')
```

---

## 4. KPI 측정 방법

### 4.1 대시보드 진입 후 행동 클릭률 ≥ 35%

**측정 공식**:
```
행동 클릭률 = (위젯 클릭 수 + 전역 CTA 클릭 수) / 대시보드 조회 수 × 100
```

**관련 이벤트**:
- `dashboard_viewed` (분모)
- `widget_clicked` (분자)
- `global_cta_clicked` (분자)

**분석 쿼리 예시**:
```sql
SELECT 
  COUNT(CASE WHEN event = 'widget_clicked' OR event = 'global_cta_clicked' THEN 1 END) as action_clicks,
  COUNT(CASE WHEN event = 'dashboard_viewed' THEN 1 END) as total_views,
  (action_clicks / total_views) * 100 as click_rate
FROM analytics_events 
WHERE date >= '2024-01-01' 
  AND date <= '2024-01-31'
```

### 4.2 미분류/미증빙 잔여 건수 주간 감소

**측정 방법**:
- 주간별 `unclassified_widget_data` 스냅샷 저장
- `todo_quick_action` 이벤트로 처리 활동 추적
- 잔여 건수 변화율 계산

**관련 이벤트**:
- `todo_quick_action` (action_type: 'unclassified_click')
- `widget_action_completed` (action_type: 'navigate_to_receipts')

### 4.3 월마감 완료율 및 제때 완료 비율

**측정 방법**:
- 월별 마감 관련 작업 완료 추적
- `todo_quick_action` (task_category: 'weekly_task') 이벤트 활용
- 마감일 기준 완료 여부 측정

**관련 이벤트**:
- `todo_quick_action` (task_category: 'weekly_task')
- `widget_clicked` (widget_id: 'tax_calendar')

### 4.4 D30 잔존율 개선

**측정 방법**:
- 사용자별 첫 대시보드 조회일 기록
- 30일 후 재방문 여부 확인
- 잔존율 = 30일 후 재방문 사용자 수 / 전체 신규 사용자 수

**관련 이벤트**:
- `dashboard_viewed` (첫 방문 및 재방문 추적)

---

## 5. 대시보드 및 알림

### 5.1 실시간 모니터링 지표
- 대시보드 조회 수 (일/주/월)
- 위젯별 클릭률
- 전역 CTA 클릭률
- 필터 변경 빈도

### 5.2 주간 리포트 지표
- 행동 클릭률 추이
- 미분류/미증빙 처리 활동
- 월마감 완료율
- 사용자 세그먼트별 성과

### 5.3 알림 임계값
- 행동 클릭률 < 30%: 개선 필요 알림
- 미분류 건수 증가: 관리자 알림
- 월마감 완료율 < 80%: 제품팀 알림

---

## 6. 데이터 품질 관리

### 6.1 필수 이벤트 검증
- `dashboard_viewed`: session_id, timestamp 필수
- `widget_clicked`: widget_id, filter_state 필수
- `todo_quick_action`: action_type, task_category 필수

### 6.2 중복 이벤트 방지
- 동일 세션 내 5초 이내 중복 이벤트 제거
- 클라이언트 사이드 디바운싱 적용

### 6.3 데이터 보존 정책
- 원시 이벤트: 90일 보존
- 집계 데이터: 2년 보존
- 개인정보: 30일 후 익명화

---

## 7. 구현 가이드

### 7.1 클라이언트 사이드 구현
```typescript
// 이벤트 추적 예시
analytics.track('dashboard_viewed', {
  period: '이번 달',
  project_id: 'proj_123',
  user_type: 'freelancer',
  session_id: getSessionId(),
  timestamp: Date.now()
});
```

### 7.2 서버 사이드 검증
- 이벤트 스키마 검증
- 비정상적인 이벤트 패턴 탐지
- 실시간 알림 시스템 연동

### 7.3 A/B 테스트 지원
- 실험 그룹 식별자 추가
- 실험별 이벤트 분리 추적
- 통계적 유의성 검증

---

## 8. 개인정보 보호

### 8.1 수집 데이터
- 사용자 행동 패턴 (익명화)
- 기능 사용 통계
- 성능 지표

### 8.2 제외 데이터
- 개인 식별 정보 (PII)
- 거래 상세 내용
- 민감한 비즈니스 정보

### 8.3 동의 관리
- 쿠키 동의 상태 확인
- 분석 데이터 수집 동의 관리
- 데이터 삭제 요청 처리
