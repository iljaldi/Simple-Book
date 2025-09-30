import React from 'react';
import { Helmet } from 'react-helmet-async';

const TestPage: React.FC = () => {
  console.log('TestPage 렌더링 중...');
  
  return (
    <>
      <Helmet>
        <title>테스트 페이지 - 간편장부</title>
        <meta name="description" content="개발 중 테스트 페이지입니다." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            테스트 페이지가 정상 작동합니다! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            React 앱이 정상적으로 렌더링되고 있습니다.
          </p>
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">상태 확인</h2>
            <ul className="text-left space-y-2">
              <li>✅ React 컴포넌트 렌더링</li>
              <li>✅ Tailwind CSS 스타일링</li>
              <li>✅ Helmet 메타 태그</li>
              <li>✅ 콘솔 로그 출력</li>
            </ul>
          </div>
          <div className="mt-8">
            <a 
              href="/dashboard" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              대시보드로 이동
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestPage;