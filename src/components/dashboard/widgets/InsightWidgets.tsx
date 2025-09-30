import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * 인사이트/일정 영역 위젯들
 * - 현금흐름 위젯 (최근 6개월)
 * - 지출 Top5 카테고리 위젯
 * - 세무 캘린더 위젯
 */

// 현금흐름 위젯 (최근 6개월)
export const CashFlowWidget: React.FC = () => {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          현금흐름 (최근 6개월)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: 월별 수입/지출/순이익 요약 그래프 구현 */}
        <div className="text-center py-8">
          <div className="text-sm text-gray-500 mb-4">
            월별 수입/지출/순이익 요약
          </div>
          <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">차트 영역 (구현 예정)</span>
          </div>
        </div>
        {/* TODO: 특정 월 클릭 → 그 월의 리포트 뷰로 이동 */}
        <button className="w-full text-sm text-blue-600 hover:text-blue-700">
          월별 상세 보기 →
        </button>
      </CardContent>
    </Card>
  );
};

// 지출 Top5 카테고리 위젯
export const TopExpenseCategoriesWidget: React.FC = () => {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          지출 Top5 카테고리
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: 카테고리명, 금액, 전월 대비, 비중% 구현 */}
        <div className="space-y-3">
          <div className="text-center py-6">
            <div className="text-sm text-gray-500 mb-2">
              카테고리별 지출 분석
            </div>
            <div className="text-lg font-medium text-gray-600">
              데이터 없음
            </div>
          </div>
        </div>
        {/* TODO: 클릭 → 해당 카테고리 상세 리포트, 단일 카테고리 과대집중(>40%) 경고 배지 구현 */}
        <button className="w-full text-sm text-green-600 hover:text-green-700">
          카테고리 분석 →
        </button>
      </CardContent>
    </Card>
  );
};

// 세무 캘린더 위젯
export const TaxCalendarWidget: React.FC = () => {
  return (
    <Card className="border border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          세무 캘린더
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: 부가세(1·7월), 종소세(5월) 등 주요 일정 + 준비도 구현 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">부가세 신고</span>
            <span className="text-sm font-medium text-purple-600">1월, 7월</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">종소세 신고</span>
            <span className="text-sm font-medium text-purple-600">5월</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600">준비도</span>
            <span className="text-sm font-medium text-green-600">준비 완료</span>
          </div>
        </div>
        {/* TODO: "마감 점검 시작" → 신고 메뉴 위저드로 이동 */}
        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 mt-4">
          마감 점검 시작
        </button>
      </CardContent>
    </Card>
  );
};
