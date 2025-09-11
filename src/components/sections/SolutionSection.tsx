// Removed lucide-react imports - using remixicon instead

const SolutionSection = () => {
  return (
    <section id="features" className="px-4 pt-48 pb-48 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-8 leading-tight">
            Simple Book이 해결합니다
          </h2>
        </div>

        {/* 3가지 기능 카드 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* 자동 분류 */}
          <div className="text-center">
            <div className="bg-gray-100 rounded-2xl p-8 h-80 flex flex-col justify-center">
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">자동 분류</h3>
            </div>
          </div>

          {/* 간편 입력 */}
          <div className="text-center">
            <div className="bg-gray-100 rounded-2xl p-8 h-80 flex flex-col justify-center">
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">간편 입력</h3>
            </div>
          </div>

          {/* 보고서 생성 */}
          <div className="text-center">
            <div className="bg-gray-100 rounded-2xl p-8 h-80 flex flex-col justify-center">
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">보고서 생성</h3>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-16">
          <div id="feature-input" className="text-center">
            <div className="bg-gray-100 rounded-2xl p-8 h-80 flex flex-col justify-center">
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">거래 입력 5초, 합계만 넣으면 끝</h3>
            </div>
          </div>

          <div id="feature-receipts" className="text-center">
            <div className="bg-gray-100 rounded-2xl p-8 h-80 flex flex-col justify-center">
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">영수증은 자동으로 정리</h3>
            </div>
          </div>

          <div id="feature-reports" className="text-center">
            <div className="bg-gray-100 rounded-2xl p-8 h-80 flex flex-col justify-center">
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black">세무 보고서, 클릭 한 번</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;