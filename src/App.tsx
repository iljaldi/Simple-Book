import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import OAuthCallback from "@/components/OAuthCallback";
import ErrorBoundary from "@/components/ui/error-boundary";
import { LoadingPage } from "@/components/ui/loading";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import EditTransaction from "./pages/EditTransaction";
import Components from "./pages/Components";
import TestPage from "./pages/TestPage";
import Receipts from "./pages/Receipts";
import Reports from "./pages/Reports";
import Exports from "./pages/Exports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle authenticated user redirects
const AuthenticatedRedirect = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // URL 파라미터에서 리디렉션 정보 확인
  const urlParams = new URLSearchParams(location.search);
  const redirectTo = urlParams.get('redirect_to') || '/dashboard';
  
  // 로딩 중이거나 초기화가 완료되지 않았으면 로딩 화면 표시
  if (loading) {
    return <LoadingPage message="인증 확인 중..." description="잠시만 기다려주세요" />;
  }
  
  // 인증된 사용자이고 유효한 사용자 정보가 있으면 대시보드로 리디렉션
  if (user && user.id) {
    console.log('인증된 사용자 감지, 대시보드로 리디렉션:', user);
    console.log('리디렉션 대상:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  // 인증되지 않은 사용자면 메인 페이지 표시
  console.log('인증되지 않은 사용자 - 메인 페이지 표시');
  return <Index />;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
            {/* Public routes */}
            <Route path="/" element={<AuthenticatedRedirect />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/components" element={<Components />} />
            <Route path="/test" element={<TestPage />} />
            
            {/* Protected routes with layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Transactions />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/transactions/add" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AddTransaction />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/transactions/edit/:id" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <EditTransaction />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/receipts" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Receipts />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Reports />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/exports" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Exports />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Settings />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
