import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthenticatedLayout from "@/components/layouts/AuthenticatedLayout";
import OAuthCallback from "@/components/OAuthCallback";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    console.log('인증된 사용자 감지, 대시보드로 리디렉션:', user);
    console.log('리디렉션 대상:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Index />;
};

const App = () => (
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
);

export default App;
