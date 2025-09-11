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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
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

        <div className="space-y-6 sm:space-y-8">
          {/* 프로필 설정 */}
          <Card className="shadow-card gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                프로필 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">이름</Label>
                  <Input 
                    id="name" 
                    placeholder="이름을 입력하세요" 
                    className="transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">이메일</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="이메일을 입력하세요"
                    className="transition-smooth"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business" className="text-sm font-medium text-foreground">사업자명 (선택)</Label>
                <Input 
                  id="business" 
                  placeholder="사업자명을 입력하세요"
                  className="transition-smooth"
                />
              </div>
              <Button className="gradient-primary text-primary-foreground shadow-green hover:shadow-glow transition-bounce hover:scale-105">
                <Save className="h-4 w-4 mr-2" />
                프로필 저장
              </Button>
            </CardContent>
          </Card>

          {/* 알림 설정 */}
          <Card className="shadow-card gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-mint/10">
                  <Bell className="h-5 w-5 text-mint" />
                </div>
                알림 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground mb-1">거래 알림</h4>
                    <p className="text-sm text-muted-foreground">새로운 거래가 추가될 때 알림을 받습니다</p>
                  </div>
                  <Switch className="self-start sm:self-center" />
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground mb-1">월 마감 알림</h4>
                    <p className="text-sm text-muted-foreground">매월 말 장부 정리 알림을 받습니다</p>
                  </div>
                  <Switch className="self-start sm:self-center" />
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground mb-1">신고 기간 알림</h4>
                    <p className="text-sm text-muted-foreground">세금 신고 기간에 알림을 받습니다</p>
                  </div>
                  <Switch defaultChecked className="self-start sm:self-center" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 보안 설정 */}
          <Card className="shadow-card gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-frog/10">
                  <Shield className="h-5 w-5 text-frog" />
                </div>
                보안 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm font-medium text-foreground">현재 비밀번호</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="현재 비밀번호를 입력하세요"
                    className="transition-smooth"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-sm font-medium text-foreground">새 비밀번호</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      placeholder="새 비밀번호를 입력하세요"
                      className="transition-smooth"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">새 비밀번호 확인</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      placeholder="새 비밀번호를 다시 입력하세요"
                      className="transition-smooth"
                    />
                  </div>
                </div>
              </div>
              <Button variant="outline" className="backdrop-glass border-primary/20 hover:border-primary/40 text-foreground hover:text-primary transition-smooth">
                <Shield className="h-4 w-4 mr-2" />
                비밀번호 변경
              </Button>
            </CardContent>
          </Card>

          {/* 데이터 관리 */}
          <Card className="shadow-card gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-success/10">
                  <Download className="h-5 w-5 text-success" />
                </div>
                데이터 관리
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground mb-1">데이터 백업</h4>
                    <p className="text-sm text-muted-foreground">모든 거래 데이터를 안전하게 다운로드합니다</p>
                  </div>
                  <Button variant="outline" size="sm" className="backdrop-glass border-success/20 hover:border-success/40 text-success hover:text-success transition-smooth self-start sm:self-center">
                    <Download className="h-4 w-4 mr-2" />
                    다운로드
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-destructive mb-1">계정 삭제</h4>
                    <p className="text-sm text-muted-foreground">계정과 모든 데이터가 영구적으로 삭제됩니다</p>
                  </div>
                  <Button variant="destructive" size="sm" className="transition-smooth self-start sm:self-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    계정 삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;