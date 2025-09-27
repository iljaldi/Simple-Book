import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


// 세션 유효성 검증 함수 (Supabase 자동 갱신에 의존)
const isSessionValid = (session: Session | null): boolean => {
  if (!session) return false;
  
  // Supabase가 자동으로 세션을 갱신하므로 세션이 있으면 유효한 것으로 간주
  // 실제 만료는 Supabase가 자동으로 처리
  return true;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 초기화 상태를 false로 설정 (로딩 시작)
    setInitialized(false);
    setLoading(true);
    // 초기 상태에서 user와 session을 명시적으로 null로 설정
    setUser(null);
    setSession(null);
    
    // 고유 세션 ID 생성 및 확인
    const getOrCreateSessionId = () => {
      let sessionId = sessionStorage.getItem('browser_session_id');
      if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('browser_session_id', sessionId);
        console.log('새 브라우저 세션 ID 생성:', sessionId);
      }
      return sessionId;
    };

    // 페이지 로드 시 이전 세션 상태 확인 (완화된 버전)
    const checkPreviousSession = () => {
      const lastActivity = localStorage.getItem('last_activity');
      const browserSession = sessionStorage.getItem('auth_session');
      const currentSessionId = getOrCreateSessionId();
      const storedSessionId = localStorage.getItem('current_session_id');
      const currentTime = new Date().getTime();
      
      // 세션 ID가 다르면 새로운 브라우저 세션 (브라우저 닫기 후 재접속)
      if (storedSessionId && storedSessionId !== currentSessionId) {
        console.log('세션 ID 불일치 - 브라우저 닫기 후 재접속으로 판단');
        console.log('저장된 세션 ID:', storedSessionId);
        console.log('현재 세션 ID:', currentSessionId);
        localStorage.removeItem('last_activity');
        localStorage.removeItem('current_session_id');
        sessionStorage.removeItem('auth_session');
        return false;
      }
      
      // 브라우저 세션이 없어도 Supabase 세션이 있으면 허용 (초기 로그인 시)
      // 단, 30분 이상 비활성 상태면 세션 무효화
      if (lastActivity && (currentTime - parseInt(lastActivity)) > 30 * 60 * 1000) {
        console.log('장시간 비활성 상태 - 세션 무효화');
        localStorage.removeItem('last_activity');
        localStorage.removeItem('current_session_id');
        sessionStorage.removeItem('auth_session');
        return false;
      }
      
      // 현재 시간을 마지막 활동 시간으로 저장
      localStorage.setItem('last_activity', currentTime.toString());
      localStorage.setItem('current_session_id', currentSessionId);
      return true;
    };

    // 브라우저 닫기/새로고침 감지
    const handleBeforeUnload = () => {
      console.log('브라우저 닫기/새로고침 감지 - 세션 제거');
      sessionStorage.removeItem('auth_session');
      sessionStorage.removeItem('browser_session_id');
      localStorage.removeItem('last_activity');
      localStorage.removeItem('current_session_id');
    };

    // 페이지 가시성 변경 감지 (탭 전환 등)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('페이지 숨김 감지 - 활동 시간 업데이트');
        localStorage.setItem('last_activity', new Date().getTime().toString());
      } else {
        // 페이지가 다시 보이면 활동 시간 확인
        if (!checkPreviousSession()) {
          console.log('장시간 비활성 상태 감지 - 자동 로그아웃');
          supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setLoading(false);
          return;
        }
      }
    };

    // 주기적으로 활동 시간 업데이트 (5분마다)
    const updateActivity = () => {
      localStorage.setItem('last_activity', new Date().getTime().toString());
    };

    // 이벤트 리스너 등록
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 주기적 활동 시간 업데이트
    const activityInterval = setInterval(updateActivity, 5 * 60 * 1000);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', { event, session });
        
        // 세션 유효성 검증
        if (session && !isSessionValid(session)) {
          console.log('세션이 만료됨 - 자동 로그아웃');
          supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setLoading(false);
          setInitialized(true);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        setInitialized(true);
        
        // 로그인 시 브라우저 세션 저장
        if (event === 'SIGNED_IN' && session) {
          console.log('사용자 로그인 완료:', session.user);
          const sessionId = getOrCreateSessionId();
          sessionStorage.setItem('auth_session', 'true');
          localStorage.setItem('last_activity', new Date().getTime().toString());
          localStorage.setItem('current_session_id', sessionId);
        }
        
        // 로그아웃 시 브라우저 세션 제거
        if (event === 'SIGNED_OUT') {
          console.log('사용자 로그아웃 완료');
          sessionStorage.removeItem('auth_session');
          sessionStorage.removeItem('browser_session_id');
          localStorage.removeItem('last_activity');
          localStorage.removeItem('current_session_id');
        }
      }
    );

    // 초기 세션 확인
    const initializeAuth = async () => {
      console.log('인증 초기화 시작');
      
      // 이전 세션 상태 확인
      if (!checkPreviousSession()) {
        console.log('장시간 비활성 상태 또는 브라우저 닫기 후 재접속 - 로그아웃 처리');
        setUser(null);
        setSession(null);
        setLoading(false);
        setInitialized(true);
        return;
      }

      // Supabase 세션 확인
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Initial session check:', session);
      
      if (session && !isSessionValid(session)) {
        console.log('기존 세션이 만료됨 - 자동 로그아웃');
        supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setLoading(false);
        setInitialized(true);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      setInitialized(true);
      console.log('인증 초기화 완료:', { user: session?.user, loading: false, initialized: true });
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(activityInterval);
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('로그아웃 시작');
      
      // Supabase 로그아웃
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase 로그아웃 오류:', error);
      }
      
      // 브라우저 세션 제거
      try {
        sessionStorage.removeItem('auth_session');
        sessionStorage.removeItem('browser_session_id');
        console.log('브라우저 세션 제거 완료');
      } catch (storageError) {
        console.error('브라우저 세션 제거 오류:', storageError);
      }
      
      // localStorage 완전 클리어
      try {
        localStorage.removeItem('last_activity');
        localStorage.removeItem('current_session_id');
        console.log('localStorage 클리어 완료');
      } catch (storageError) {
        console.error('localStorage 클리어 오류:', storageError);
      }
      
      // 상태 강제 초기화
      setUser(null);
      setSession(null);
      setLoading(false);
      
      console.log('로그아웃 성공 - 모든 상태 초기화 완료');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 오류가 발생해도 상태는 초기화
      setUser(null);
      setSession(null);
      setLoading(false);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading: loading || !initialized,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};