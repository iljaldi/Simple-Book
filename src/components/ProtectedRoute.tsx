import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingPage } from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 로딩 중이면 로딩 화면 표시
  if (loading) {
    return <LoadingPage message="인증 확인 중..." description="잠시만 기다려주세요" />;
  }

  // 인증되지 않은 사용자면 메인 페이지로 리디렉션
  if (!user) {
    console.log('보호된 경로 접근 시도 - 메인 페이지로 리디렉션');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 인증된 사용자면 보호된 콘텐츠 표시
  return <>{children}</>;
};

export default ProtectedRoute;