# 디자인 시스템 가이드라인

## 개요
이 디자인 시스템은 일관성 있고 확장 가능한 UI 컴포넌트를 제공합니다. 모든 컴포넌트는 중앙화된 테마 토큰을 기반으로 구축됩니다.

## 디자인 토큰

### 색상 시스템
- **Primary**: `var(--color-brand-bg)` (#5e6ad2)
- **Accent**: `var(--color-accent)` (#7170ff)
- **Text Primary**: `var(--color-text-primary)` (#f7f8f8)
- **Text Secondary**: `var(--color-text-secondary)` (#d0d6e0)
- **Background Primary**: `var(--color-bg-primary)` (#08090a)
- **Background Secondary**: `var(--color-bg-secondary)` (#1c1c1f)

### 타이포그래피
- **Font Family**: `var(--font-regular)` (Inter Variable)
- **Font Weight**: 
  - Light: `var(--font-weight-light)` (300)
  - Normal: `var(--font-weight-normal)` (400)
  - Medium: `var(--font-weight-medium)` (510)
  - Semibold: `var(--font-weight-semibold)` (590)
  - Bold: `var(--font-weight-bold)` (680)

### 타이틀 스타일
- **Title 1**: `var(--title-1)` (1.0625rem, semibold)
- **Title 2**: `var(--title-2)` (1.3125rem, semibold)
- **Title 3**: `var(--title-3)` (1.5rem, semibold)
- **Title 4**: `var(--title-4)` (2rem, semibold)
- **Title 5**: `var(--title-5)` (2.5rem, semibold)

### 텍스트 스타일
- **Text Large**: `var(--text-large)` (1.0625rem)
- **Text Regular**: `var(--text-regular)` (0.9375rem)
- **Text Small**: `var(--text-small)` (0.875rem)
- **Text Mini**: `var(--text-mini)` (0.8125rem)
- **Text Micro**: `var(--text-micro)` (0.75rem)

### 간격 시스템
- **Page Padding**: `var(--page-padding-inline)` (24px)
- **Header Height**: `var(--header-height)` (64px)
- **Max Width**: `var(--page-max-width)` (1024px)

### 보더 반경
- **Small**: `var(--radius-4)` (4px)
- **Medium**: `var(--radius-8)` (8px)
- **Large**: `var(--radius-12)` (12px)
- **XLarge**: `var(--radius-16)` (16px)
- **Rounded**: `var(--radius-rounded)` (9999px)

### 그림자
- **Low**: `var(--shadow-low)`
- **Medium**: `var(--shadow-medium)`
- **High**: `var(--shadow-high)`

### 애니메이션
- **Quick Transition**: `var(--speed-quickTransition)` (0.1s)
- **Regular Transition**: `var(--speed-regularTransition)` (0.25s)
- **Easing**: `var(--ease-out-cubic)` (cubic-bezier(0.215,0.61,0.355,1))

## 컴포넌트 원칙

### 1. 일관성 (Consistency)
- 모든 컴포넌트는 동일한 디자인 토큰을 사용
- 일관된 간격, 색상, 타이포그래피 적용

### 2. 재사용성 (Reusability)
- Props를 통한 유연한 커스터마이징
- 다양한 크기와 변형 지원

### 3. 접근성 (Accessibility)
- 키보드 네비게이션 지원
- 스크린 리더 호환성
- 적절한 색상 대비

### 4. 성능 (Performance)
- 불필요한 리렌더링 방지
- CSS 변수 활용으로 테마 변경 최적화

## 컴포넌트 구조

### 기본 컴포넌트
- **Button**: 다양한 스타일과 크기의 버튼
- **Input**: 폼 입력 필드
- **Card**: 콘텐츠 컨테이너
- **Modal**: 오버레이 다이얼로그
- **Badge**: 상태 표시 요소

### 레이아웃 컴포넌트
- **Container**: 페이지 컨테이너
- **Grid**: 그리드 레이아웃
- **Stack**: 수직/수평 스택
- **Spacer**: 간격 조정

### 디스플레이 컴포넌트
- **Typography**: 텍스트 스타일링
- **Icon**: 아이콘 표시
- **Avatar**: 사용자 아바타
- **Progress**: 진행률 표시

## 사용 가이드

### CSS 변수 사용
```css
.my-component {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border-radius: var(--radius-8);
  padding: var(--page-padding-inline);
}
```

### 컴포넌트 Props
```tsx
<Button 
  variant="primary" 
  size="large" 
  disabled={false}
  onClick={handleClick}
>
  Click me
</Button>
```

### 테마 적용
```tsx
// 다크 테마
<div className="theme-dark">
  <MyComponent />
</div>

// 글래스 테마
<div className="theme-glass">
  <MyComponent />
</div>
```

## 네이밍 컨벤션

### 컴포넌트 이름
- PascalCase 사용: `Button`, `InputField`, `UserCard`
- 명확하고 설명적인 이름 사용

### Props 이름
- camelCase 사용: `isLoading`, `onClick`, `variant`
- boolean props는 `is`, `has`, `can` 접두사 사용

### CSS 클래스
- kebab-case 사용: `button-primary`, `input-field`, `card-container`
- BEM 방법론 적용: `button__text`, `button--large`

## 확장 가이드

### 새로운 컴포넌트 추가
1. 디자인 토큰 기반으로 스타일 정의
2. TypeScript 인터페이스 작성
3. 접근성 속성 추가
4. Storybook 스토리 작성
5. 테스트 케이스 작성

### 테마 확장
1. `design-tokens.json`에 새로운 토큰 추가
2. CSS 변수로 정의
3. 기존 컴포넌트에 적용
4. 문서 업데이트

## 품질 보증

### 코드 리뷰 체크리스트
- [ ] 디자인 토큰 사용
- [ ] 접근성 속성 포함
- [ ] TypeScript 타입 정의
- [ ] 반응형 디자인 적용
- [ ] 다크/라이트 테마 지원

### 테스트 요구사항
- [ ] 단위 테스트 작성
- [ ] 접근성 테스트 통과
- [ ] 크로스 브라우저 테스트
- [ ] 성능 테스트 통과
