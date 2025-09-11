// Removed lucide-react imports - using remixicon instead

const StorySection = () => {
  return (
    <section id="about" className="px-4 pt-24 pb-24 sm:pt-48 sm:pb-48 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-6 sm:mb-8 leading-tight">
            세금 때문에 이런 고민 있으신가요?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* 문제 카드 1 */}
          <div className="text-center">
            <div className="rounded-2xl h-64 sm:h-80 flex flex-col justify-center items-center">
              <img 
                src="/images/storysection-1.png" 
                alt="복잡한 세금 분류" 
                className="w-4/5 h-4/5 object-contain rounded-2xl"
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black mb-4">세금 규칙이 복잡해요</h3>
              <p className="text-gray-600 leading-relaxed">
                "사업소득? 기타소득? 부가세? 종합소득세?<br />
                뭐가 뭔지 모르겠어요..."
              </p>
            </div>
          </div>

          {/* 문제 카드 2 */}
          <div className="text-center">
            <div className="rounded-2xl h-64 sm:h-80 flex flex-col justify-center items-center">
              <img 
                src="/images/storysection-2.png" 
                alt="번거로운 입력" 
                className="w-4/5 h-4/5 object-contain rounded-2xl"
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black mb-4">입력이 번거로워요</h3>
              <p className="text-gray-600 leading-relaxed">
                "매번 공급가액, 부가세를 따로 계산해서<br />
                입력하는 게 너무 귀찮아요..."
              </p>
            </div>
          </div>

          {/* 문제 카드 3 */}
          <div className="text-center">
            <div className="rounded-2xl h-64 sm:h-80 flex flex-col justify-center items-center">
              <img 
                src="/images/storysection-3.png" 
                alt="불안한 증빙 관리" 
                className="w-4/5 h-4/5 object-contain rounded-2xl"
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-xl font-bold text-black mb-4">증빙이 불안해요</h3>
              <p className="text-gray-600 leading-relaxed">
                "세무 신고할 때 어떤 자료를 내야 하는지<br />
                미리 확인하고 싶어요..."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;