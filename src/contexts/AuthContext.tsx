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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', { event, session });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // SIGNED_IN 이벤트 시 로그만 출력 (리디렉션 제거)
        if (event === 'SIGNED_IN' && session) {
          console.log('사용자 로그인 완료:', session.user);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      console.log('로그아웃 시작');
      
      // Supabase 로그아웃
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase 로그아웃 오류:', error);
      }
      
      // localStorage 완전 클리어
      try {
        localStorage.clear();
        console.log('localStorage 클리어 완료');
      } catch (storageError) {
        console.error('localStorage 클리어 오류:', storageError);
      }
      
      // sessionStorage도 클리어
      try {
        sessionStorage.clear();
        console.log('sessionStorage 클리어 완료');
      } catch (storageError) {
        console.error('sessionStorage 클리어 오류:', storageError);
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
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};