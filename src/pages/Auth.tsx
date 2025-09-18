import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading';
import { FileText, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string }>({ score: 0, label: '', color: '' });
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // 로그인/회원가입 모드 전환 시 입력값 초기화
  useEffect(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setEmailError('');
    setIsCheckingEmail(false);
    setPasswordStrength({ score: 0, label: '', color: '' });
    setPasswordCriteria({ length: false, lowercase: false, uppercase: false, number: false, special: false });
    setPasswordConfirmError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setIsSubmitting(false);
  }, [isLogin]);

  // 비밀번호 강도 측정 (회원가입 모드에서만)
  useEffect(() => {
    if (isLogin) {
      setPasswordStrength({ score: 0, label: '', color: '' });
      setPasswordCriteria({ length: false, lowercase: false, uppercase: false, number: false, special: false });
      setPasswordConfirmError('');
      return;
    }
    const value = password || '';
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[a-z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    if (value.length >= 12) score += 1;

    // 비밀번호 기준 체크 (10자 이상, 소문자, 대문자, 숫자, 특수문자)
    setPasswordCriteria({
      length: value.length >= 10,
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value)
    });

    let label = '약함';
    let color = '#ef4444';
    if (score >= 4) { label = '보통'; color = '#f59e0b'; }
    if (score >= 6) { label = '강함'; color = '#22c55e'; }
    setPasswordStrength({ score, label, color });
  }, [password, isLogin]);

  // 비밀번호 확인 검사 (회원가입 모드에서만)
  useEffect(() => {
    if (isLogin || !confirmPassword) {
      setPasswordConfirmError('');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다');
    } else {
      setPasswordConfirmError('');
    }
  }, [password, confirmPassword, isLogin]);

  // 공용 이메일 검사 함수 (즉시 실행용)
  const checkEmailNow = async (targetEmail: string) => {
    if (!targetEmail) {
      setEmailError('');
      return;
    }
    
    setIsCheckingEmail(true);
    try {
      const { data, error } = await supabase.rpc('email_exists', { p_email: targetEmail });
      if (error) {
        if (import.meta.env.DEV) console.warn('Email availability RPC error (onBlur):', error.message);
        setEmailError('');
      } else if (data === true) {
        // 가입 모드에서는 중복 경고, 로그인 모드에서는 정상
        setEmailError(isLogin ? '' : '이미 사용되고 있는 이메일입니다');
      } else {
        // 로그인 모드에서는 없는 계정 경고, 가입 모드에서는 정상
        setEmailError(isLogin ? '없는 계정입니다.' : '');
      }
    } catch (e) {
      if (import.meta.env.DEV) console.warn('Email availability RPC exception (onBlur):', e);
      setEmailError('');
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 이메일 존재 여부 검사 (디바운스, RPC: public.email_exists)
  useEffect(() => {
    if (!email) {
      setEmailError('');
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsCheckingEmail(true);
      try {
        const { data, error } = await supabase.rpc('email_exists', { p_email: email });

        if (error) {
          // RPC 오류 시, 제출 단계에서 중복을 재검사하므로 필드는 통과시킴
          console.warn('Email availability RPC error:', error.message);
          setEmailError('');
        } else if (data === true) {
          // 가입 모드에서는 중복 경고, 로그인 모드에서는 정상
          setEmailError(isLogin ? '' : '이미 사용되고 있는 이메일입니다');
        } else {
          // 로그인 모드에서는 없는 계정 경고, 가입 모드에서는 정상
          setEmailError(isLogin ? '없는 계정입니다.' : '');
        }
      } catch (e) {
        console.warn('Email availability RPC exception:', e);
        setEmailError('');
      } finally {
        setIsCheckingEmail(false);
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [email, isLogin]);

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
      if (import.meta.env.DEV) console.log('구글 로그인 시도 중...');
      
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

      if (import.meta.env.DEV) console.log('구글 로그인 응답:', { data, error });

      if (error) {
        if (import.meta.env.DEV) console.error('구글 로그인 오류:', error);
        if (import.meta.env.DEV) console.error('오류 상세 정보:', {
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
        if (import.meta.env.DEV) console.log('구글 로그인 성공:', data);
        toast({
          title: "구글 로그인 시작",
          description: "구글 인증 페이지로 이동합니다. 팝업이 차단되었다면 팝업 차단을 해제해주세요.",
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('구글 로그인 예외:', error);
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
    
    // 중복 제출 방지
    if (isSubmitting) return;
    
    // 회원가입 시 비밀번호 확인
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: "비밀번호가 일치하지 않습니다",
        description: "비밀번호를 다시 확인해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 비밀번호 필수 조건 검사
    if (!isLogin) {
      const allCriteriaMet = passwordCriteria.length && 
                            passwordCriteria.lowercase && 
                            passwordCriteria.uppercase && 
                            passwordCriteria.number && 
                            passwordCriteria.special;
      
      if (!allCriteriaMet) {
        toast({
          title: "비밀번호 필수 조건을 확인해 주세요",
          description: "10자 이상, 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.",
          variant: "destructive",
        });
        return;
      }
    }

    // 진행 중 체크 또는 이메일 오류 시 차단
    if (isCheckingEmail || emailError) {
      toast({
        title: isCheckingEmail ? "이메일 확인 중" : (isLogin ? "로그인 불가" : "이메일 중복"),
        description: isCheckingEmail ? '이메일 사용 가능 여부 확인이 끝난 후 다시 시도하세요.' : emailError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const { error } = isLogin 
        ? await handleSignIn(email, password)
        : await handleSignUp(email, password);

      if (error) {
        // 상세 진단용 콘솔 로그 (서버 응답 구조에 따라 status/code/constraint 노출될 수 있음)
        if (import.meta.env.DEV) console.error('Auth error detail:', {
          phase: isLogin ? 'signIn' : 'signUp',
          message: error.message,
          status: (error as any)?.status,
          name: (error as any)?.name,
          code: (error as any)?.code,
          // Supabase가 내보내는 Postgres 오류의 경우 아래와 같은 필드가 포함될 수 있음
          details: (error as any)?.details,
          hint: (error as any)?.hint,
        });
        if (error.message === 'User already registered') {
          // 인라인 에러도 함께 표시하여 사용자에게 즉시 피드백 제공
          if (!isLogin) setEmailError('이미 사용되고 있는 이메일입니다');
          toast({
            title: "이미 가입된 사용자입니다",
            description: "이미 사용되고 있는 이메일입니다",
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
      setIsSubmitting(false);
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
                  onBlur={() => checkEmailNow(email)}
                  required
                  className="border-gray-300 focus:border-black focus:ring-black"
                />
                <div className="text-xs h-4" aria-live="polite">
                  {isCheckingEmail && (
                    <span className="text-gray-500">
                      {isLogin ? '계정 확인 중…' : '이메일 사용 가능 여부 확인 중…'}
                    </span>
                  )}
                  {!isCheckingEmail && emailError && (
                    <span className="text-red-600">{emailError}</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isLogin ? "비밀번호를 입력하세요" : "10자 이상, 대소문자, 숫자, 특수문자 포함"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:border-black focus:ring-black pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {!isLogin && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-600 font-medium">비밀번호 필수 조건:</div>
                    <div className="space-y-1">
                      <div className={`text-xs flex items-center gap-2 ${passwordCriteria.length ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordCriteria.length ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        10자 이상
                      </div>
                      <div className={`text-xs flex items-center gap-2 ${passwordCriteria.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordCriteria.lowercase ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        소문자 포함
                      </div>
                      <div className={`text-xs flex items-center gap-2 ${passwordCriteria.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordCriteria.uppercase ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        대문자 포함
                      </div>
                      <div className={`text-xs flex items-center gap-2 ${passwordCriteria.number ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordCriteria.number ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        숫자 포함
                      </div>
                      <div className={`text-xs flex items-center gap-2 ${passwordCriteria.special ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordCriteria.special ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                        특수문자 포함
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">비밀번호 확인</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-black focus:ring-black pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordConfirmError && (
                    <div className="text-xs text-red-600 mt-1 flex items-center gap-1" aria-live="polite">
                      <XCircle className="h-3 w-3" />
                      {passwordConfirmError}
                    </div>
                  )}
                  {!passwordConfirmError && confirmPassword && password === confirmPassword && (
                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      비밀번호가 일치합니다
                    </div>
                  )}
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 transition-colors font-medium rounded-full"
                disabled={loading || isSubmitting || (!isLogin && (isCheckingEmail || !!emailError))}
              >
                {loading || isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" className="text-white" />
                    {isLogin ? '로그인 중...' : '회원가입 중...'}
                  </div>
                ) : (
                  isLogin ? '로그인' : '회원가입'
                )}
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
              disabled={googleLoading || loading || isSubmitting || (!isLogin && (isCheckingEmail || !!emailError))}
            >
              {googleLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  구글 로그인 중...
                </div>
              ) : (
                <>
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
                  구글로 계속하기
                </>
              )}
            </Button>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  // 모든 상태 초기화
                  setEmailError('');
                  setIsCheckingEmail(false);
                  setPasswordConfirmError('');
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                  setIsSubmitting(false);
                  setPasswordStrength({ score: 0, label: '', color: '' });
                  setPasswordCriteria({ length: false, lowercase: false, uppercase: false, number: false, special: false });
                  // 모드 전환
                  setIsLogin(!isLogin);
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