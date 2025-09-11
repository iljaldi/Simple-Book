import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSignUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      console.log('구글 로그인 시도 중...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      console.log('구글 로그인 응답:', { data, error });

      if (error) {
        console.error('구글 로그인 오류:', error);
        console.error('오류 상세 정보:', {
          message: error.message,
          status: error.status
        });
        
        let errorMessage = error.message;
        if (error.message.includes('Invalid token')) {
          errorMessage = "Google OAuth 설정이 올바르지 않습니다. 관리자에게 문의하세요.";
        }
        
        toast({
          title: "구글 로그인 실패",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        console.log('구글 로그인 성공:', data);
        toast({
          title: "구글 로그인 시작",
          description: "구글 인증 페이지로 이동합니다. 팝업이 차단되었다면 팝업 차단을 해제해주세요.",
        });
      }
    } catch (error) {
      console.error('구글 로그인 예외:', error);
      toast({
        title: "구글 로그인 중 오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 회원가입 시 비밀번호 확인
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "비밀번호가 일치하지 않습니다",
        description: "비밀번호를 다시 확인해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 비밀번호 강도 검사
    if (!isLogin && password.length < 6) {
      toast({
        title: "비밀번호는 6자 이상이어야 합니다",
        description: "더 안전한 비밀번호를 설정해주세요.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = isLogin 
        ? await handleSignIn(email, password)
        : await handleSignUp(email, password);

      if (error) {
        if (error.message === 'User already registered') {
          toast({
            title: "이미 가입된 사용자입니다",
            description: "로그인을 시도해보세요.",
            variant: "destructive",
          });
        } else if (error.message === 'Invalid login credentials') {
          toast({
            title: "로그인 정보가 올바르지 않습니다",
            description: "이메일과 비밀번호를 확인해주세요.",
            variant: "destructive",
          });
        } else {
          toast({
            title: isLogin ? "로그인 실패" : "회원가입 실패",
            description: error.message,
            variant: "destructive",
          });
        }
      } else if (!isLogin) {
        toast({
          title: "회원가입 완료",
          description: "이메일을 확인하여 계정을 활성화해주세요.",
        });
      }
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-8 hover:opacity-80 transition-opacity">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <i className="ri-book-open-line text-white text-sm" />
            </div>
            <span className="text-2xl font-bold text-black">Simple Book</span>
          </div>
        </Link>

        <Card className="border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-black text-center">
              {isLogin ? '로그인' : '회원가입'}
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              {isLogin 
                ? '계정에 로그인하여 장부를 관리하세요' 
                : '새 계정을 만들어 시작하세요'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={isLogin ? "비밀번호를 입력하세요" : "6자 이상 비밀번호를 입력하세요"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 transition-colors font-medium rounded-full"
                disabled={loading}
              >
                {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
              </Button>
            </form>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            {/* Google Login Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-full"
              onClick={(e) => {
                e.preventDefault();
                handleGoogleLogin();
              }}
              disabled={googleLoading || loading}
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
                ></path>
              </svg>
              {googleLoading ? '구글 로그인 중...' : '구글로 계속하기'}
            </Button>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setConfirmPassword('');
                }}
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                {isLogin 
                  ? '계정이 없으신가요? 회원가입하기' 
                  : '이미 계정이 있으신가요? 로그인하기'
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;