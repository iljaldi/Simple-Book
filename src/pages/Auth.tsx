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
  const [isLogin, setIsLogin] = useState(true); // Start in login mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  // 폼 초기화 함수
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setIsCheckingEmail(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // 실시간 이메일 중복 체크
  useEffect(() => {
    if (!isLogin && email && email.includes('@') && email.includes('.')) {
      const checkEmailDuplicate = async () => {
        setIsCheckingEmail(true);
        setEmailError('');
        
        try {
          // 임시 비밀번호로 회원가입 시도하여 중복 여부 확인
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password: 'TempPassword123!@#',
            options: {
              emailRedirectTo: `${window.location.origin}/auth`
            }
          });

          console.log('Email check result:', { signupData, signupError });

          // 회원가입이 성공한 경우 - 새 계정이므로 중복 아님
          if (signupData && signupData.user && !signupError) {
            console.log('새 계정 생성 성공 - 중복 아님');
            setEmailError(''); // 중복 아님
            return;
          }

          // Supabase에서 반환하는 중복 이메일 오류 처리
          if (signupError && (
            signupError.message === 'User already registered' ||
            signupError.message.includes('already registered') ||
            signupError.message.includes('already exists') ||
            signupError.message.includes('duplicate') ||
            signupError.message.includes('email address is already in use') ||
            signupError.message.includes('Email already registered') ||
            signupError.message.includes('email already registered') ||
            signupError.message.includes('User already exists') ||
            signupError.message.includes('Email already exists') ||
            signupError.message.includes('이미 등록된') ||
            signupError.message.includes('이미 존재하는') ||
            signupError.status === 400 ||
            signupError.status === 409
          )) {
            setEmailError('이미 사용되고 있는 계정입니다');
            return;
          }

          // 비밀번호 강도 오류는 이메일 중복이 아님
          if (signupError && signupError.message.includes('Password should contain')) {
            setEmailError(''); // 비밀번호 강도 오류는 무시
            return;
          }

          // 계정이 존재하지 않음
          setEmailError('');
        } catch (error) {
          console.error('Email check error:', error);
          setEmailError('');
        } finally {
          setIsCheckingEmail(false);
        }
      };

      // 디바운싱 (500ms 후에 체크)
      const timeoutId = setTimeout(checkEmailDuplicate, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setEmailError('');
    }
  }, [email, isLogin, password]);


  const handleSignUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;

    console.log('Attempting signup for email:', email);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    console.log('Signup response:', { data, error });

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
    
    console.log('=== Form Submit Debug ===');
    console.log('isLogin:', isLogin);
    console.log('email:', email);
    console.log('password:', password);
    
    // 회원가입 시 비밀번호 확인
    if (!isLogin && password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다');
      return;
    }

    // 비밀번호 강도 검사
    if (!isLogin && password.length < 6) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다');
      return;
    }

    setLoading(true);

    try {
      const { error } = isLogin 
        ? await handleSignIn(email, password)
        : await handleSignUp(email, password);

      if (error) {
        console.log('Auth error:', error);
        console.log('Error message:', error.message);
        console.log('Error status:', error.status);
        
        if (isLogin) {
          if (error.message === 'Invalid login credentials') {
            setPasswordError('계정이 존재하지 않습니다. 회원가입 후 사용해주세요');
          } else {
            setPasswordError(error.message);
          }
        } else {
          setPasswordError(error.message);
        }
      } else if (!isLogin) {
        toast({
          title: "회원가입 완료",
          description: "이메일을 확인하여 계정을 활성화해주세요.",
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (isLogin) {
        setPasswordError('계정이 존재하지 않습니다. 회원가입 후 사용해주세요');
      } else {
        setPasswordError('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
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
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className={`border-gray-300 focus:border-black focus:ring-black ${
                            emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                          }`}
                        />
                        {isCheckingEmail && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          </div>
                        )}
                      </div>
                      {emailError && (
                        <p className="text-sm text-red-500">{emailError}</p>
                      )}
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
                {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
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
                  {confirmPasswordError && (
                    <p className="text-sm text-red-500">{confirmPasswordError}</p>
                  )}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 transition-colors font-medium rounded-full"
                disabled={loading || (!isLogin && (isCheckingEmail || emailError))}
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
                  resetForm();
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