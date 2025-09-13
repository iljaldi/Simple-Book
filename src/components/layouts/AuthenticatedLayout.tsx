import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, 
  Receipt, 
  Camera, 
  BarChart3, 
  Download, 
  Settings, 
  LogOut,
  FileText,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardFooter from './DashboardFooter';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('로그아웃 버튼 클릭됨');
      await signOut();
      console.log('로그아웃 완료, 홈페이지로 이동');
      
      // 강제 리디렉션 (replace 사용)
      navigate('/', { replace: true });
      
      // 추가 보장을 위한 window.location 사용
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      // 오류가 발생해도 홈페이지로 이동
      navigate('/', { replace: true });
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: '대시보드' },
    { to: '/transactions', icon: Receipt, label: '거래 입력' },
    { to: '/receipts', icon: Camera, label: '영수증' },
    { to: '/reports', icon: BarChart3, label: '리포트' },
    { to: '/exports', icon: Download, label: '신고' },
    { to: '/settings', icon: Settings, label: '설정' },
  ];

  const NavItems = ({ className = "", onItemClick = () => {} }) => (
    <ul className={cn("flex gap-6", className)}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-smooth font-medium text-sm",
                isActive
                  ? 'bg-primary text-primary-foreground shadow-green'
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline lg:inline">{item.label}</span>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/50 backdrop-blur-[12px]'
          : 'bg-white/50 backdrop-blur-[12px]'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 relative">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                  <i className="ri-book-open-line text-white text-sm" />
                </div>
                <span className="text-lg font-bold text-black">Simple Book</span>
              </NavLink>
            </div>

            {/* Desktop Navigation (Centered) */}
            <nav className="hidden md:block absolute left-1/2 -translate-x-1/2">
              <NavItems />
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-foreground hover:bg-accent/50 hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 gradient-card">
                  <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border/20">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-foreground">Simple Book</span>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 p-4">
                      <NavItems 
                        className="flex-col gap-2" 
                        onItemClick={() => setIsMobileMenuOpen(false)}
                      />
                    </nav>

                    {/* Mobile Sign out */}
                    <div className="p-4 border-t border-border/20">
                      <Button
                        variant="ghost"
                        onClick={handleSignOut}
                        className="w-full justify-start gap-2 text-foreground hover:bg-accent/50"
                      >
                        <LogOut className="h-4 w-4" />
                        로그아웃
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation (Alternative) */}
        <div className="md:hidden border-t border-border/20">
          <div className="px-2 py-2">
            <NavItems className="justify-between overflow-x-auto" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="min-h-[calc(100vh-8rem)]">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <DashboardFooter />
    </div>
  );
};

export default AuthenticatedLayout;