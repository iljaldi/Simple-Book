import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Trash2, Download, Save, CheckCircle, AlertCircle, Calendar, CreditCard } from 'lucide-react';

const Settings: React.FC = () => {
  // 더미 데이터
  const [profileData, setProfileData] = useState({
    name: '김민수',
    email: 'minsu.kim@example.com',
    business: '김민수 개인사업자',
    phone: '010-1234-5678',
    businessNumber: '123-45-67890',
    address: '서울특별시 강남구 테헤란로 123, 456호'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    transactionAlerts: true,
    monthlyReminder: false,
    taxDeadline: true,
    securityAlerts: true,
    marketingEmails: false
  });

  const [securityData, setSecurityData] = useState({
    lastPasswordChange: '2024-11-15',
    twoFactorEnabled: true,
    loginHistory: [
      { date: '2024-12-01 14:30', location: '서울, 대한민국', device: 'Chrome on Windows' },
      { date: '2024-11-28 09:15', location: '서울, 대한민국', device: 'Safari on iPhone' },
      { date: '2024-11-25 16:45', location: '서울, 대한민국', device: 'Chrome on Mac' }
    ]
  });

  const [dataStats, setDataStats] = useState({
    totalTransactions: 245,
    totalReceipts: 89,
    storageUsed: '2.3 GB',
    lastBackup: '2024-12-01 15:30',
    accountCreated: '2024-01-15'
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>설정 - 간편장부 | 프리랜서 1인사업자 계정관리</title>
        <meta name="description" content="프리랜서와 1인사업자를 위한 간편장부 설정. 프로필 관리, 알림 설정, 데이터 백업 등 개인화된 설정을 관리하세요!" />
        <meta name="keywords" content="설정, 계정관리, 프로필관리, 프리랜서, 1인사업자, 간편장부, 알림설정, 데이터백업" />
        <meta property="og:title" content="설정 - 간편장부 | 프리랜서 1인사업자 계정관리" />
        <meta property="og:description" content="프리랜서와 1인사업자를 위한 간편장부 설정. 프로필 관리, 알림 설정, 데이터 백업 등 개인화된 설정을 관리하세요!" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://simplebook.site/settings" />
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">계정 설정</h1>
            <p className="text-gray-600">프로필과 앱 설정을 관리하세요</p>
          </div>
          <div className="flex items-center gap-2">
            {/* 액션 버튼 영역 */}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 프로필 설정 */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                프로필 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">이름</Label>
                <Input 
                  id="name" 
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-10 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">이메일</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-10 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">전화번호</Label>
                <Input 
                  id="phone" 
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-10 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business" className="text-sm font-medium text-gray-700">사업자명</Label>
                <Input 
                  id="business" 
                  value={profileData.business}
                  onChange={(e) => setProfileData(prev => ({ ...prev, business: e.target.value }))}
                  className="h-10 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessNumber" className="text-sm font-medium text-gray-700">사업자등록번호</Label>
                <Input 
                  id="businessNumber" 
                  value={profileData.businessNumber}
                  onChange={(e) => setProfileData(prev => ({ ...prev, businessNumber: e.target.value }))}
                  className="h-10 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">주소</Label>
                <Input 
                  id="address" 
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  className="h-10 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <Button className="w-full h-10 bg-black hover:bg-gray-800 text-white">
                <Save className="h-4 w-4 mr-2" />
                프로필 저장
              </Button>
            </CardContent>
          </Card>

          {/* 알림 설정 */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">거래 알림</h4>
                  <p className="text-sm text-gray-500">새로운 거래가 추가될 때 알림을 받습니다</p>
                </div>
                <Switch 
                  checked={notificationSettings.transactionAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('transactionAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">월 마감 알림</h4>
                  <p className="text-sm text-gray-500">매월 말 장부 정리 알림을 받습니다</p>
                </div>
                <Switch 
                  checked={notificationSettings.monthlyReminder}
                  onCheckedChange={(checked) => handleNotificationChange('monthlyReminder', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">신고 기간 알림</h4>
                  <p className="text-sm text-gray-500">세금 신고 기간에 알림을 받습니다</p>
                </div>
                <Switch 
                  checked={notificationSettings.taxDeadline}
                  onCheckedChange={(checked) => handleNotificationChange('taxDeadline', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">보안 알림</h4>
                  <p className="text-sm text-gray-500">로그인 및 보안 관련 알림을 받습니다</p>
                </div>
                <Switch 
                  checked={notificationSettings.securityAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('securityAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">마케팅 이메일</h4>
                  <p className="text-sm text-gray-500">새로운 기능 및 서비스 소식을 받습니다</p>
                </div>
                <Switch 
                  checked={notificationSettings.marketingEmails}
                  onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 보안 설정 */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                보안 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 보안 상태 */}
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">보안 상태 양호</span>
                </div>
                <p className="text-sm text-green-700">마지막 비밀번호 변경: {securityData.lastPasswordChange}</p>
                <p className="text-sm text-green-700">2단계 인증: {securityData.twoFactorEnabled ? '활성화됨' : '비활성화됨'}</p>
              </div>

              {/* 비밀번호 변경 */}
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">현재 비밀번호</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  placeholder="현재 비밀번호를 입력하세요"
                  className="h-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">새 비밀번호</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  placeholder="새 비밀번호를 입력하세요"
                  className="h-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">새 비밀번호 확인</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  placeholder="새 비밀번호를 다시 입력하세요"
                  className="h-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <Button variant="outline" className="w-full h-10 border-gray-200 hover:border-green-500 hover:text-green-600">
                <Shield className="h-4 w-4 mr-2" />
                비밀번호 변경
              </Button>

              <Separator className="my-4" />

              {/* 로그인 기록 */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">최근 로그인 기록</h4>
                <div className="space-y-2">
                  {securityData.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{login.device}</p>
                          <p className="text-xs text-gray-500">{login.location}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{login.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 데이터 관리 */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                데이터 관리
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 데이터 통계 */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{dataStats.totalTransactions}</div>
                  <div className="text-sm text-blue-700">총 거래 건수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{dataStats.totalReceipts}</div>
                  <div className="text-sm text-blue-700">영수증 개수</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{dataStats.storageUsed}</div>
                  <div className="text-sm text-blue-700">사용 용량</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">11개월</div>
                  <div className="text-sm text-blue-700">사용 기간</div>
                </div>
              </div>

              {/* 데이터 백업 */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">데이터 백업</h4>
                  <p className="text-sm text-gray-500">마지막 백업: {dataStats.lastBackup}</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-200 hover:border-blue-500 hover:text-blue-600">
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </div>

              {/* 계정 정보 */}
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">계정 정보</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>계정 생성일: {dataStats.accountCreated}</p>
                  <p>사용자 ID: user_123456789</p>
                  <p>계정 상태: 활성</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-red-900 mb-1">계정 삭제</h4>
                  <p className="text-sm text-red-600">계정과 모든 데이터가 영구적으로 삭제됩니다</p>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  계정 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;