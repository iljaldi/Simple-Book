import React from 'react';
import { Link } from 'react-router-dom';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <Link 
              to="/terms" 
              className="hover:text-gray-800 transition-colors"
            >
              이용약관
            </Link>
            <Link 
              to="/privacy" 
              className="hover:text-gray-800 transition-colors font-bold text-black"
            >
              개인정보처리방침
            </Link>
            <Link 
              to="/support" 
              className="hover:text-gray-800 transition-colors"
            >
              고객센터
            </Link>
          </div>
          <div className="text-sm text-gray-500">
            ⓒ 2025 Simple Book. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;