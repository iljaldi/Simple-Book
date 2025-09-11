import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MonthlyTrendChartProps {
  selectedYear?: string;
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ selectedYear: propSelectedYear = '2025' }) => {
  const [selectedYear, setSelectedYear] = useState(propSelectedYear);

  useEffect(() => {
    setSelectedYear(propSelectedYear);
  }, [propSelectedYear]);

  // 년도별 데이터 (2022-2025) - 천 단위로 조정
  const yearlyData = {
    '2022': {
      income: [1800, 2100, 2400, 2200, 2800, 3200, 3000, 3500, 3300, 2800, 2500, 2200],
      expense: [1200, 1400, 1600, 1800, 2000, 2200, 2100, 1800, 1700, 1900, 1800, 1500],
      profit: [600, 700, 800, 400, 800, 1000, 900, 1700, 1600, 900, 700, 700]
    },
    '2023': {
      income: [2500, 2800, 3200, 3000, 3600, 4000, 3800, 4200, 4000, 3500, 3200, 2900],
      expense: [1600, 1800, 2000, 2200, 2400, 2600, 2500, 2200, 2100, 2300, 2200, 1900],
      profit: [900, 1000, 1200, 800, 1200, 1400, 1300, 2000, 1900, 1200, 1000, 1000]
    },
    '2024': {
      income: [3200, 3600, 4000, 3800, 4400, 4800, 4600, 5000, 4800, 4200, 3800, 3500],
      expense: [2000, 2200, 2400, 2600, 2800, 3000, 2900, 2600, 2500, 2700, 2600, 2300],
      profit: [1200, 1400, 1600, 1200, 1600, 1800, 1700, 2400, 2300, 1500, 1200, 1200]
    },
    '2025': {
      income: [4000, 4800, 5500, 5200, 6200, 7000, 6600, 9000, 11500, 8000, 6400, 5000],
      expense: [2400, 2800, 3200, 3600, 4000, 4400, 4200, 300, 100, 1200, 1000, 800],
      profit: [1600, 2000, 2300, 1600, 2200, 2600, 2400, 8700, 11400, 6800, 5400, 4200]
    }
  };

  const currentData = yearlyData[selectedYear as keyof typeof yearlyData];
  
  // 디버깅을 위한 콘솔 출력
  console.log('Selected Year:', selectedYear);
  console.log('Current Data:', currentData);

  // 간단한 테스트 데이터
  const testData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [
      {
        label: '수입',
        data: [1000, 2000, 3000, 2500, 4000, 5000, 4500, 6000, 5500, 4000, 3500, 3000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: 'rgb(34, 197, 94)',
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: '지출',
        data: [800, 1200, 1500, 1800, 2000, 2200, 2100, 1800, 1700, 1900, 1800, 1500],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'rgb(239, 68, 68)',
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: '순이익',
        data: [200, 800, 1500, 700, 2000, 2800, 2400, 4200, 3800, 2100, 1700, 1500],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: 'rgb(168, 85, 247)',
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };
  
  const data = currentData ? {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [
      {
        label: '수입',
        data: currentData.income,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: 'rgb(34, 197, 94)',
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: '지출',
        data: currentData.expense,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: 'rgb(239, 68, 68)',
        pointHoverRadius: 6,
        borderWidth: 2,
      },
      {
        label: '순이익',
        data: currentData.profit,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: 'rgb(168, 85, 247)',
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  } : testData;
  
  // 차트 데이터 디버깅
  console.log('Chart Data:', data);
  console.log('Income Data:', data.datasets[0].data);
  console.log('Expense Data:', data.datasets[1].data);
  console.log('Profit Data:', data.datasets[2].data);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        beginAtZero: true,
        display: true,
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* 헤더 - 제목, 범례, 년도 선택 */}
      <div className="flex items-center justify-between mb-[30px]">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-semibold text-gray-900">월별 추세</h3>
          {/* 범례 */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">수입</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-600">지출</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-gray-600">순이익</span>
            </div>
          </div>
        </div>
        
        {/* 년도 선택 */}
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-24 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025년</SelectItem>
            <SelectItem value="2024">2024년</SelectItem>
            <SelectItem value="2023">2023년</SelectItem>
            <SelectItem value="2022">2022년</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 차트 */}
      <div className="relative h-[380px]">
        <Line key={selectedYear} data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyTrendChart;