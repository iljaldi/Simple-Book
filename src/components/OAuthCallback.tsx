import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const OAuthCallback: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('OAuth 콜백 처리 시작');
      console.log('현재 URL:', window.location.href);
      console.log('사용자 상태:', { user, loading });

      // URL 파라미터에서 리디렉션 정보 확인
      const urlParams = new URLSearchParams(location.search);
      const redirectTo = urlParams.get('redirect_to') || '/dashboard';
      
      console.log('리디렉션 대상:', redirectTo);

      // 로딩이 완료되고 사용자가 있으면 리디렉션
      if (!loading && user) {
        console.log('OAuth 콜백 성공, 대시보드로 리디렉션');
        navigate(redirectTo, { replace: true });
      } else if (!loading && !user) {
        console.log('OAuth 콜백 실패, 로그인 페이지로 리디렉션');
        navigate('/auth', { replace: true });
      }
    };

    // 약간의 지연을 두고 처리 (Supabase 인증 상태 업데이트 대기)
    const timer = setTimeout(handleOAuthCallback, 1000);
    
    return () => clearTimeout(timer);
  }, [user, loading, navigate, location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
        <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
