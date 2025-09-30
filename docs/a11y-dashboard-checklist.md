# 대시보드 접근성 체크리스트

## 1. 개요

### 목적
- WCAG 2.1 AA 수준 준수
- 스크린리더 사용자 경험 최적화
- 키보드 전용 사용자 지원
- 시각적 차트의 대체 텍스트 제공

### 적용 범위
- 대시보드 전체 레이아웃
- 8개 핵심 위젯
- 전역 필터 및 네비게이션
- 전역 스티키 CTA

---

## 2. 랜드마크 역할 및 ARIA 라벨

### 2.1 페이지 구조

```html
<!-- 메인 래퍼 -->
<div role="main" aria-label="대시보드 메인 콘텐츠">
  
  <!-- 상단 필터 영역 -->
  <nav role="navigation" aria-label="대시보드 필터 및 네비게이션">
    <h1>대시보드</h1>
    <div role="group" aria-label="기간 필터">
      <!-- 기간 필터 칩들 -->
    </div>
  </nav>

  <!-- 본문 3영역 -->
  <div class="dashboard-grid">
    
    <!-- 요약 영역 -->
    <section aria-label="요약 정보" role="region">
      <h2 class="sr-only">요약 정보</h2>
      <!-- 순이익, 예상세액 위젯 -->
    </section>

    <!-- 작업 영역 -->
    <section aria-label="할 일 및 작업 목록" role="region">
      <h2 class="sr-only">할 일 및 작업 목록</h2>
      <!-- 미분류/미증빙, 이번 주 할 일, 정기구독 경고 위젯 -->
    </section>

    <!-- 인사이트/일정 영역 -->
    <section aria-label="인사이트 및 일정" role="region">
      <h2 class="sr-only">인사이트 및 일정</h2>
      <!-- 현금흐름, 지출 Top5, 세무 캘린더 위젯 -->
    </section>
    
  </div>
</div>
```

### 2.2 위젯별 랜드마크

#### 순이익 위젯
```html
<article role="region" aria-labelledby="net-profit-title" aria-describedby="net-profit-desc">
  <h3 id="net-profit-title">이번 달 순이익</h3>
  <div id="net-profit-desc" class="sr-only">
    현재 기간의 순이익 수치와 전월 대비 변화율을 표시합니다.
  </div>
  <!-- 위젯 내용 -->
</article>
```

#### 미분류/미증빙 위젯
```html
<article role="region" aria-labelledby="unclassified-title" aria-describedby="unclassified-desc">
  <h3 id="unclassified-title">미분류 / 미증빙</h3>
  <div id="unclassified-desc" class="sr-only">
    처리해야 할 미분류 거래와 미증빙 거래 건수를 표시합니다.
  </div>
  <!-- 위젯 내용 -->
</article>
```

#### 현금흐름 위젯
```html
<article role="region" aria-labelledby="cashflow-title" aria-describedby="cashflow-desc">
  <h3 id="cashflow-title">현금흐름 (최근 6개월)</h3>
  <div id="cashflow-desc" class="sr-only">
    최근 6개월간의 월별 수입, 지출, 순이익 추이를 그래프로 표시합니다.
  </div>
  <!-- 차트 영역 -->
  <div role="img" aria-label="현금흐름 차트 설명" id="cashflow-chart-desc">
    <!-- 차트 대체 텍스트 -->
  </div>
</article>
```

---

## 3. 키보드 포커스 순서

### 3.1 전체 포커스 순서

```
1. 상단 네비게이션 (기간 필터)
   ├── 기간 필터 칩 1 (이번 달)
   ├── 기간 필터 칩 2 (지난 달)
   ├── 기간 필터 칩 3 (올해)
   └── 필터 초기화 버튼 (X)

2. 요약 영역
   ├── 순이익 위젯
   │   ├── 위젯 헤더
   │   ├── 순이익 수치
   │   ├── 전월 대비 변화율
   │   └── "거래내역 보기" 버튼
   └── 예상세액 위젯
       ├── 위젯 헤더
       ├── 세액 수치
       └── "자세히 보기" 버튼

3. 작업 영역
   ├── 미분류/미증빙 위젯
   │   ├── 위젯 헤더
   │   ├── 건수 표시
   │   ├── "규칙 만들기" 배지 (있는 경우)
   │   └── "지금 정리" 버튼
   ├── 이번 주 할 일 위젯
   └── 정기구독 경고 위젯

4. 인사이트/일정 영역
   ├── 현금흐름 위젯
   ├── 지출 Top5 위젯
   └── 세무 캘린더 위젯

5. 전역 스티키 CTA
   ├── FAB 버튼
   ├── 새 거래 옵션 (열린 경우)
   └── 영수증 촬영 옵션 (열린 경우)
```

### 3.2 위젯 내부 포커스 순서

#### 순이익 위젯
```
1. 위젯 헤더 (h3)
2. 순이익 수치 (금액)
3. 전월 대비 변화율 (텍스트)
4. 스파크라인 차트 (있는 경우)
5. "거래내역 보기" 버튼
```

#### 미분류/미증빙 위젯
```
1. 위젯 헤더 (h3)
2. "규칙 만들기" 배지 (있는 경우)
3. 미분류 건수 (텍스트)
4. 미증빙 건수 (텍스트)
5. 설명 텍스트
6. "지금 정리" 버튼
```

---

## 4. 차트 대체 텍스트

### 4.1 현금흐름 차트

```html
<div role="img" aria-label="현금흐름 차트" aria-describedby="cashflow-chart-desc">
  <!-- 차트 SVG 또는 Canvas -->
</div>

<div id="cashflow-chart-desc" class="sr-only">
  최근 6개월 현금흐름 차트입니다.
  
  월별 데이터:
  - 2024년 7월: 수입 3,500,000원, 지출 2,100,000원, 순이익 1,400,000원
  - 2024년 8월: 수입 4,200,000원, 지출 2,800,000원, 순이익 1,400,000원
  - 2024년 9월: 수입 3,800,000원, 지출 2,200,000원, 순이익 1,600,000원
  - 2024년 10월: 수입 4,500,000원, 지출 3,100,000원, 순이익 1,400,000원
  - 2024년 11월: 수입 3,900,000원, 지출 2,500,000원, 순이익 1,400,000원
  - 2024년 12월: 수입 4,800,000원, 지출 3,200,000원, 순이익 1,600,000원
  
  총 수입: 25,600,000원
  총 지출: 16,900,000원
  총 순이익: 8,700,000원
  
  클릭하여 월별 상세 리포트를 확인할 수 있습니다.
</div>
```

### 4.2 지출 Top5 카테고리 차트

```html
<div role="img" aria-label="지출 Top5 카테고리 차트" aria-describedby="top-expenses-chart-desc">
  <!-- 차트 SVG 또는 Canvas -->
</div>

<div id="top-expenses-chart-desc" class="sr-only">
  이번 달 지출 Top5 카테고리 차트입니다.
  
  카테고리별 지출:
  1. 사무용품: 1,200,000원 (전월 대비 +15%, 전체 지출의 25%)
  2. 통신비: 800,000원 (전월 대비 -5%, 전체 지출의 17%)
  3. 교통비: 600,000원 (전월 대비 +8%, 전체 지출의 12%)
  4. 식비: 500,000원 (전월 대비 -2%, 전체 지출의 10%)
  5. 마케팅: 400,000원 (전월 대비 +20%, 전체 지출의 8%)
  
  총 지출: 4,800,000원
  
  클릭하여 해당 카테고리 상세 리포트를 확인할 수 있습니다.
</div>
```

### 4.3 스파크라인 차트 (순이익 위젯)

```html
<div role="img" aria-label="순이익 스파크라인 차트" aria-describedby="sparkline-desc">
  <!-- 스파크라인 SVG -->
</div>

<div id="sparkline-desc" class="sr-only">
  최근 12개월 순이익 추이 스파크라인입니다.
  
  월별 순이익:
  - 2024년 1월: 1,200,000원
  - 2024년 2월: 1,100,000원
  - 2024년 3월: 1,400,000원
  - 2024년 4월: 1,300,000원
  - 2024년 5월: 1,500,000원
  - 2024년 6월: 1,400,000원
  - 2024년 7월: 1,400,000원
  - 2024년 8월: 1,400,000원
  - 2024년 9월: 1,600,000원
  - 2024년 10월: 1,400,000원
  - 2024년 11월: 1,400,000원
  - 2024년 12월: 1,600,000원
  
  전체적으로 안정적인 수준을 유지하고 있으며, 최근 3개월간 소폭 상승 추세입니다.
</div>
```

---

## 5. 버튼 라벨 (스크린리더용)

### 5.1 위젯 액션 버튼

#### 순이익 위젯
```html
<!-- 정상 상태 -->
<button aria-label="거래내역 보기. 현재 기간: 이번 달. 순이익 1,400,000원">
  거래내역 보기 →
</button>

<!-- 빈 상태 -->
<button aria-label="첫 거래 추가하기. 아직 거래 내역이 없습니다">
  거래 추가하기
</button>
```

#### 미분류/미증빙 위젯
```html
<!-- 정상 상태 -->
<button aria-label="지금 정리. 미분류 5건, 미증빙 3건 처리 필요">
  지금 정리
</button>

<!-- 빈 상태 -->
<button aria-label="정리할 거래가 없습니다. 미분류 0건, 미증빙 0건">
  정리할 거래가 없습니다
</button>

<!-- 긴급 상태 -->
<button aria-label="지금 정리. 긴급! 미분류 15건, 미증빙 8건 처리 필요">
  지금 정리
</button>
```

#### 예상세액 위젯
```html
<button aria-label="자세히 보기. 예상 부가세 140,000원, 소득세 280,000원">
  자세히 보기 →
</button>
```

#### 현금흐름 위젯
```html
<button aria-label="월별 상세 보기. 최근 6개월 현금흐름 데이터">
  월별 상세 보기 →
</button>
```

#### 지출 Top5 위젯
```html
<button aria-label="카테고리 분석. 사무용품, 통신비, 교통비 등 상위 5개 카테고리">
  카테고리 분석 →
</button>
```

#### 세무 캘린더 위젯
```html
<button aria-label="마감 점검 시작. 부가세 신고 D-15, 종소세 신고 D-120">
  마감 점검 시작
</button>
```

### 5.2 전역 CTA 버튼

```html
<!-- FAB 메인 버튼 -->
<button aria-label="빠른 추가. 새 거래 입력 또는 영수증 촬영">
  <Plus className="h-6 w-6" />
</button>

<!-- 스피드 다이얼 옵션들 -->
<button aria-label="새 거래 입력. 수입 또는 지출 거래를 추가합니다">
  <FileText className="h-5 w-5" />
</button>

<button aria-label="영수증 촬영. 카메라로 영수증을 촬영하거나 파일을 업로드합니다">
  <Camera className="h-5 w-5" />
</button>
```

### 5.3 필터 및 네비게이션

```html
<!-- 기간 필터 칩 -->
<button aria-label="현재 선택된 기간: 이번 달. 클릭하여 변경">
  이번 달
</button>

<!-- 필터 초기화 -->
<button aria-label="필터 초기화. 기본값인 이번 달로 되돌립니다">
  <X className="h-3 w-3" />
</button>

<!-- 규칙 만들기 배지 -->
<button aria-label="반복 패턴 발견. 규칙 만들기 클릭">
  <Settings className="h-3 w-3 mr-1" />
  규칙 만들기
</button>
```

---

## 6. 빈 상태/에러 상태 음성화

### 6.1 신규 사용자 (데이터 없음)

#### 순이익 위젯 빈 상태
```html
<div role="status" aria-live="polite" aria-label="순이익 위젯 빈 상태">
  <h3>이번 달 순이익</h3>
  <p>아직 거래 내역이 없습니다.</p>
  <p>첫 거래를 추가하여 장부 관리를 시작해보세요.</p>
  <button>거래 추가하기</button>
</div>
```

#### 미분류/미증빙 위젯 빈 상태
```html
<div role="status" aria-live="polite" aria-label="미분류 위젯 빈 상태">
  <h3>미분류 / 미증빙</h3>
  <p>정리할 거래가 없습니다.</p>
  <p>모든 거래가 정상적으로 분류되어 있습니다.</p>
  <button>정리할 거래가 없습니다</button>
</div>
```

### 6.2 데이터 부족 상태

#### 현금흐름 위젯
```html
<div role="status" aria-live="polite" aria-label="현금흐름 위젯 데이터 부족">
  <h3>현금흐름 (최근 6개월)</h3>
  <p>데이터를 축적해보세요.</p>
  <p>최소 3개월 이상의 거래 데이터가 필요합니다.</p>
  <button>월별 상세 보기</button>
</div>
```

#### 지출 Top5 위젯
```html
<div role="status" aria-live="polite" aria-label="지출 분석 위젯 데이터 부족">
  <h3>지출 Top5 카테고리</h3>
  <p>지출 데이터가 없습니다.</p>
  <p>거래를 추가하면 카테고리별 분석을 확인할 수 있습니다.</p>
  <button>카테고리 분석</button>
</div>
```

### 6.3 과부하 상태 (미분류/미증빙 과다)

```html
<div role="alert" aria-live="assertive" aria-label="미분류 위젯 과부하 경고">
  <h3>미분류 / 미증빙</h3>
  <p>미분류 15건 / 미증빙 8건</p>
  <div class="alert">
    <p>처리 필요 건수가 많습니다. 우선순위를 정해 처리하세요.</p>
  </div>
  <button>지금 정리</button>
</div>
```

### 6.4 에러 상태

#### 데이터 로드 실패
```html
<div role="alert" aria-live="assertive" aria-label="데이터 로드 오류">
  <h3>데이터를 불러올 수 없습니다</h3>
  <p>일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
  <button>다시 시도</button>
</div>
```

#### 네트워크 오류
```html
<div role="alert" aria-live="assertive" aria-label="네트워크 연결 오류">
  <h3>연결 오류</h3>
  <p>인터넷 연결을 확인하고 다시 시도해주세요.</p>
  <button>다시 시도</button>
</div>
```

---

## 7. 키보드 단축키

### 7.1 전역 단축키

```
Alt + D: 대시보드로 이동
Alt + T: 거래내역으로 이동
Alt + R: 영수증함으로 이동
Alt + N: 새 거래 추가
Alt + C: 영수증 촬영
```

### 7.2 위젯 내부 단축키

```
Enter 또는 Space: 위젯 액션 실행
Tab: 다음 요소로 이동
Shift + Tab: 이전 요소로 이동
Escape: 모달 닫기 (있는 경우)
```

---

## 8. 스크린리더 테스트 체크리스트

### 8.1 기본 네비게이션
- [ ] 페이지 제목이 올바르게 읽힌다
- [ ] 랜드마크가 올바른 순서로 읽힌다
- [ ] 헤딩 구조가 논리적이다 (h1 → h2 → h3)
- [ ] 모든 버튼에 명확한 라벨이 있다

### 8.2 위젯 테스트
- [ ] 각 위젯의 목적이 명확히 설명된다
- [ ] 수치 데이터가 올바르게 읽힌다
- [ ] 차트 대체 텍스트가 의미있게 제공된다
- [ ] 액션 버튼의 결과가 예측 가능하다

### 8.3 상태 변화
- [ ] 빈 상태가 적절히 안내된다
- [ ] 에러 상태가 즉시 알려진다
- [ ] 로딩 상태가 진행 상황을 보여준다
- [ ] 성공 상태가 확인된다

### 8.4 키보드 전용 사용
- [ ] 모든 기능이 키보드로 접근 가능하다
- [ ] 포커스 순서가 논리적이다
- [ ] 포커스 표시가 명확하다
- [ ] 트랩이 적절히 설정되어 있다

---

## 9. 구현 가이드

### 9.1 CSS 클래스

```css
/* 스크린리더 전용 텍스트 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 포커스 표시 */
.focus-visible {
  outline: 2px solid #4F46E5;
  outline-offset: 2px;
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
  .widget-card {
    border: 2px solid;
  }
}
```

### 9.2 JavaScript 이벤트

```typescript
// 키보드 이벤트 처리
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};

// 포커스 관리
const focusFirstElement = (container: HTMLElement) => {
  const focusable = container.querySelector('[tabindex="0"], button, [href]');
  if (focusable) {
    (focusable as HTMLElement).focus();
  }
};
```

이 체크리스트를 따라 구현하면 WCAG 2.1 AA 수준의 접근성을 달성할 수 있습니다.
