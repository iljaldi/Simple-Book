import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Trash2, Download, Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
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
                  placeholder="이름을 입력하세요" 
                  className="h-10 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">이메일</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="이메일을 입력하세요"
                  className="h-10 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business" className="text-sm font-medium text-gray-700">사업자명 (선택)</Label>
                <Input 
                  id="business" 
                  placeholder="사업자명을 입력하세요"
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
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">월 마감 알림</h4>
                  <p className="text-sm text-gray-500">매월 말 장부 정리 알림을 받습니다</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">신고 기간 알림</h4>
                  <p className="text-sm text-gray-500">세금 신고 기간에 알림을 받습니다</p>
                </div>
                <Switch defaultChecked />
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
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">데이터 백업</h4>
                  <p className="text-sm text-gray-500">모든 거래 데이터를 안전하게 다운로드합니다</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-200 hover:border-blue-500 hover:text-blue-600">
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
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