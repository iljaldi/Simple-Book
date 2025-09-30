import React, { useState, useEffect } from 'react';

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // 목표 날짜 설정: 2025년 9월 30일 23:59
    const targetDate = new Date('2025-09-30T23:59:59');

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
      <div className="bg-gray-100 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center w-full sm:w-auto sm:min-w-[60px] md:min-w-[80px] lg:min-w-[100px]">
        <div className="text-2xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black font-mono">
          {timeLeft.days.toString().padStart(2, '0')}
        </div>
        <div className="text-xs sm:text-sm text-black">일</div>
      </div>
      <div className="bg-gray-100 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center w-full sm:w-auto sm:min-w-[60px] md:min-w-[80px] lg:min-w-[100px]">
        <div className="text-2xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black font-mono">
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <div className="text-xs sm:text-sm text-black">시간</div>
      </div>
      <div className="bg-gray-100 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center w-full sm:w-auto sm:min-w-[60px] md:min-w-[80px] lg:min-w-[100px]">
        <div className="text-2xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black font-mono">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <div className="text-xs sm:text-sm text-black">분</div>
      </div>
      <div className="bg-gray-100 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center w-full sm:w-auto sm:min-w-[60px] md:min-w-[80px] lg:min-w-[100px]">
        <div className="text-2xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black font-mono">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
        <div className="text-xs sm:text-sm text-black">초</div>
      </div>
    </div>
  );
};

export default CountdownTimer;
