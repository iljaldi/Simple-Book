# Google OAuth 설정 가이드

## 문제 상황
현재 "구글로 계속하기" 버튼을 클릭하면 "Invalid token: signature is invalid" 오류가 발생합니다.
이는 Supabase OAuth 설정에서 Google OAuth 클라이언트 ID와 시크릿이 올바르게 설정되지 않았기 때문입니다.

## 해결 방법

### 1. Google Cloud Console 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "사용자 인증 정보" 이동
4. "사용자 인증 정보 만들기" > "OAuth 2.0 클라이언트 ID" 선택
5. 애플리케이션 유형: "웹 애플리케이션" 선택
6. 승인된 자바스크립트 원본에 추가:
   - `http://localhost:5173` (기본 Vite 포트)
   - `http://localhost:8083` (현재 개발 서버 포트)
   - `https://yourdomain.com` (프로덕션용)
7. 승인된 리디렉션 URI에 추가:
   - `https://yrknbfrwuolpfzbrqfco.supabase.co/auth/v1/callback`
   - `http://localhost:5173/` (기본 Vite 포트)
   - `http://localhost:8083/` (현재 개발 서버 포트)

### 2. Supabase Dashboard 설정
1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속
2. 프로젝트 선택 (yrknbfrwuolpfzbrqfco)
3. "Authentication" > "Providers" 이동
4. "Google" 프로바이더 활성화
5. Google Cloud Console에서 생성한 클라이언트 ID와 클라이언트 시크릿 입력
6. **중요**: 클라이언트 ID는 `xxxxx.apps.googleusercontent.com` 형태여야 함
7. **중요**: 클라이언트 시크릿은 24자리 문자열이어야 함
8. "Save" 클릭

### 3. 설정 확인 방법
- Google Cloud Console에서 OAuth 2.0 클라이언트 ID가 올바르게 생성되었는지 확인
- Supabase Dashboard에서 Google 프로바이더가 활성화되어 있는지 확인
- 클라이언트 ID와 시크릿이 정확히 입력되었는지 확인

### 4. 현재 코드 수정사항
- 구글 로그인 함수에 디버깅 로그 추가
- OAuth 옵션에 `access_type: 'offline'` 및 `prompt: 'consent'` 추가
- 더 자세한 오류 메시지 표시
- OAuth 콜백 후 자동 대시보드 리디렉션

### 5. 테스트 방법
1. 브라우저 개발자 도구 콘솔 열기
2. "구글로 계속하기" 버튼 클릭
3. 콘솔에서 로그 메시지 확인
4. 오류가 있다면 구체적인 오류 메시지 확인

### 6. 일반적인 문제들
- **"Invalid token: signature is invalid" 오류**: Google OAuth 클라이언트 ID/시크릿이 Supabase에 올바르게 설정되지 않음
- **Google OAuth 설정 미완료**: Google Cloud Console과 Supabase Dashboard 설정 필요
- **리디렉션 URI 불일치**: 정확한 Supabase 콜백 URL 설정 필요
- **도메인 미승인**: 개발/프로덕션 도메인이 Google OAuth에 등록되어야 함
- **브라우저 팝업 차단**: 브라우저에서 팝업 차단 해제 필요

### 7. 즉시 해결 방법
1. **Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성**
2. **Supabase Dashboard > Authentication > Providers > Google에서 설정**
   - 클라이언트 ID: `xxxxx.apps.googleusercontent.com` 형태
   - 클라이언트 시크릿: 24자리 문자열
3. **브라우저에서 테스트 및 콘솔 로그 확인**

## 다음 단계
1. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
2. Supabase Dashboard에서 Google 프로바이더 설정
3. 브라우저에서 테스트 및 콘솔 로그 확인
