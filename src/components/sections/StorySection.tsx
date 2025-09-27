// Removed lucide-react imports - using remixicon instead

const StorySection = () => {
  return (
    <section id="about" className="px-4 pt-24 pb-12 sm:pt-48 sm:pb-24 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-[1056px] mx-auto">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-20 sm:mb-24 leading-tight text-center">
            세무 때문에 이런 고민 있으신가요?
          </h2>
          
          <div className="max-w-[640px] mx-auto">
            <div className="space-y-8 sm:space-y-12">
              {/* 첫번째 - 오른쪽 */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div 
                  className="text-lg sm:text-[24px] text-gray-700 font-medium leading-[150%] text-left flex-1 bg-white"
                  style={{
                    display: 'flex',
                    width: '400px',
                    height: '150px',
                    padding: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '54px 0 54px 54px',
                    border: '1px solid #D7D7D7',
                    backgroundColor: '#ffffff'
                  }}
                >
                  영수증이 카톡·드라이브·이메일에<br />
                  흩어져 찾기 힘들어요.
                </div>
                <img 
                  src="/images/face1.svg" 
                  alt="고민 표정 1" 
                  className="w-16 h-16 sm:w-[180px] sm:h-[180px] object-contain flex-shrink-0"
                />
              </div>
              
              {/* 두번째 - 왼쪽 */}
              <div className="flex items-center gap-4 sm:gap-6">
                <img 
                  src="/images/face2.svg" 
                  alt="고민 표정 2" 
                  className="w-16 h-16 sm:w-[180px] sm:h-[180px] object-contain flex-shrink-0"
                />
                <div 
                  className="text-lg sm:text-[24px] text-gray-700 font-medium leading-[150%] text-left flex-1 bg-white"
                  style={{
                    display: 'flex',
                    width: '400px',
                    height: '150px',
                    padding: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '0 54px 54px 54px',
                    border: '1px solid #D7D7D7',
                    backgroundColor: '#ffffff'
                  }}
                >
                  신고 기준이 어렵고,<br />
                  세무사마다 설명이 달라 더 헷갈려요.
                </div>
              </div>
              
              {/* 세번째 - 오른쪽 */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div 
                  className="text-lg sm:text-[24px] text-gray-700 font-medium leading-[150%] text-left flex-1 bg-white"
                  style={{
                    display: 'flex',
                    width: '400px',
                    height: '150px',
                    padding: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '54px 0 54px 54px',
                    border: '1px solid #D7D7D7',
                    backgroundColor: '#ffffff'
                  }}
                >
                  디자이너 업에 맞는<br />
                  업종코드/경비 분류가 버거워요.
                </div>
                <img 
                  src="/images/face3.svg" 
                  alt="고민 표정 3" 
                  className="w-16 h-16 sm:w-[180px] sm:h-[180px] object-contain flex-shrink-0"
                />
              </div>
              
              {/* 네번째 - 왼쪽 */}
              <div className="flex items-center gap-4 sm:gap-6">
                <img 
                  src="/images/face4.svg" 
                  alt="고민 표정 4" 
                  className="w-16 h-16 sm:w-[180px] sm:h-[180px] object-contain flex-shrink-0"
                />
                <div 
                  className="text-lg sm:text-[24px] text-gray-700 font-medium leading-[150%] text-left flex-1 bg-white"
                  style={{
                    display: 'flex',
                    width: '400px',
                    height: '150px',
                    padding: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '0 54px 54px 54px',
                    border: '1px solid #D7D7D7',
                    backgroundColor: '#ffffff'
                  }}
                >
                  기존 서비스는 수수료/환급 구조가<br />
                  제각각이라 망설여져요.
                </div>
              </div>
              
              {/* 다섯번째 - 오른쪽 */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div 
                  className="text-lg sm:text-[24px] text-gray-700 font-medium leading-[150%] text-left flex-1 bg-white"
                  style={{
                    display: 'flex',
                    width: '400px',
                    height: '150px',
                    padding: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '54px 0 54px 54px',
                    border: '1px solid #D7D7D7',
                    backgroundColor: '#ffffff'
                  }}
                >
                  홈택스 용어가 낯설어<br />
                  시작이 어려워요.
                </div>
                <img 
                  src="/images/face5.svg" 
                  alt="고민 표정 5" 
                  className="w-16 h-16 sm:w-[180px] sm:h-[180px] object-contain flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default StorySection;