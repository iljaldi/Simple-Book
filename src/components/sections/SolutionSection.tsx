// Removed lucide-react imports - using remixicon instead

const SolutionSection = () => {
  return (
    <section id="features" className="px-4 pt-32 pb-48 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-24 pt-8 sm:pt-12">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-8 leading-tight">
            <div>그래서!</div>
            <div className="mt-2 sm:mt-3">
              <span className="text-purple-600">디자이너 전용 간편 장부</span>
              <span>를 만들었어요</span>
            </div>
          </h2>
        </div>

        {/* 3가지 기능 카드 */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {/* 자동 분류 */}
          <div className="text-center">
            <div 
              className="flex justify-center items-center mx-auto"
              style={{
                display: 'flex',
                width: '393px',
                height: '296px',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                borderRadius: '24px',
                background: '#F5F5F7'
              }}
            >
              <img 
                src="/images/box01.png" 
                alt="수입·지출 초간단 입력" 
                className="w-[70%] h-[70%] object-contain rounded-2xl"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">수입·지출 초간단 입력</h3>
            </div>
          </div>

          {/* 간편 입력 */}
          <div className="text-center">
            <div 
              className="flex justify-center items-center mx-auto"
              style={{
                display: 'flex',
                width: '393px',
                height: '296px',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                borderRadius: '24px',
                background: '#F5F5F7'
              }}
            >
              <img 
                src="/images/box02.png" 
                alt="영수증·카드/은행 CSV 업로드" 
                className="w-[70%] h-[70%] object-contain rounded-2xl"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">영수증·카드/은행 CSV 업로드</h3>
            </div>
          </div>

          {/* 보고서 생성 */}
          <div className="text-center">
            <div 
              className="flex justify-center items-center mx-auto"
              style={{
                display: 'flex',
                width: '393px',
                height: '296px',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                borderRadius: '24px',
                background: '#F5F5F7'
              }}
            >
              <img 
                src="/images/box03.png" 
                alt="디자이너 전용 업종코드·경비 분류" 
                className="w-[70%] h-[70%] object-contain rounded-2xl"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">디자이너 전용 업종코드·경비 분류</h3>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mt-16 sm:mt-20">
          <div id="feature-input" className="text-center">
            <div 
              className="flex justify-center items-center mx-auto"
              style={{
                display: 'flex',
                width: '393px',
                height: '296px',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                borderRadius: '24px',
                background: '#F5F5F7'
              }}
            >
              <img 
                src="/images/box04.png" 
                alt="홈택스 제출용 문서(CSV/PDF) 출력" 
                className="w-[70%] h-[70%] object-contain rounded-2xl"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">홈택스 제출용 문서(CSV/PDF) 출력</h3>
            </div>
          </div>

          <div id="feature-receipts" className="text-center">
            <div 
              className="flex justify-center items-center mx-auto"
              style={{
                display: 'flex',
                width: '393px',
                height: '296px',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                borderRadius: '24px',
                background: '#F5F5F7'
              }}
            >
              <img 
                src="/images/box05.png" 
                alt="세무 일정 알림" 
                className="w-[70%] h-[70%] object-contain rounded-2xl"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">세무 일정 알림</h3>
            </div>
          </div>

          <div id="feature-reports" className="text-center">
            <div 
              className="flex justify-center items-center mx-auto"
              style={{
                display: 'flex',
                width: '393px',
                height: '296px',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                borderRadius: '24px',
                background: '#F5F5F7'
              }}
            >
              <img 
                src="/images/box06.png" 
                alt="전문 세무 검토 연계" 
                className="w-[70%] h-[70%] object-contain rounded-2xl"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">전문 세무 검토 연계</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;