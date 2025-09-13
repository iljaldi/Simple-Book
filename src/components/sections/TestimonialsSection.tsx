import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, Users, Shield, Award } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "김민수",
      job: "UI/UX 디자이너",
      content: "세무 준비에 걸리던 시간이 1/3로 줄었어요. 이제 디자인에만 집중할 수 있습니다.",
      rating: 5,
      avatar: "김",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "박지영",
      job: "그래픽 디자이너",
      content: "부가세 납부 예상액이 보여서 세금 걱정이 사라졌습니다. 미리미리 준비할 수 있어 좋아요.",
      rating: 5,
      avatar: "박",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "이준호",
      job: "브랜드 디자이너",
      content: "맥북에서도 편하게 쓸 수 있어서 정말 만족합니다. 디자인도 깔끔해서 사용하기 편해요.",
      rating: 5,
      avatar: "이",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "정수진",
      job: "웹 디자이너",
      content: "영수증 업로드 기능이 정말 편해요. 수동으로 입력할 필요가 없어서 시간이 많이 절약됩니다.",
      rating: 5,
      avatar: "정",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "최현우",
      job: "모션 디자이너",
      content: "세무 신고서 자동 생성 기능이 대단해요. 복잡한 계산을 자동으로 해주니까 실수할 걱정이 없어요.",
      rating: 5,
      avatar: "최",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "한소영",
      job: "패키지 디자이너",
      content: "모바일에서도 PC와 동일하게 사용할 수 있어서 언제 어디서나 장부 관리를 할 수 있어요.",
      rating: 5,
      avatar: "한",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "강태현",
      job: "UI/UX 디자이너",
      content: "사용자 인터페이스가 직관적이어서 처음 사용해도 쉽게 익힐 수 있었어요. 정말 잘 만들어진 서비스입니다.",
      rating: 5,
      avatar: "강",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "윤서연",
      job: "일러스트레이터",
      content: "세금 관련 걱정이 많이 줄었어요. Simple Book 덕분에 본업에 더 집중할 수 있게 되었습니다.",
      rating: 5,
      avatar: "윤",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "조민석",
      job: "제품 디자이너",
      content: "수입과 지출을 한눈에 볼 수 있어서 가계 관리가 훨씬 쉬워졌어요. 강력 추천합니다!",
      rating: 5,
      avatar: "조",
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "임지현",
      job: "패션 디자이너",
      content: "고객 지원이 정말 친절하고 빠르네요. 궁금한 점이 있을 때마다 바로 해결해주셔서 감사해요.",
      rating: 5,
      avatar: "임",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "송재현",
      job: "인테리어 디자이너",
      content: "API 연동 기능이 있어서 다른 도구들과 함께 사용하기 편해요. 개발자 친화적인 서비스입니다.",
      rating: 5,
      avatar: "송",
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "배수정",
      job: "그래픽 디자이너",
      content: "데이터 백업과 복원이 자동으로 되어서 안전하게 사용할 수 있어요. 정말 믿을 수 있는 서비스입니다.",
      rating: 5,
      avatar: "배",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <section className="px-4 pt-24 pb-24 sm:pt-48 sm:pb-48 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-[1056px] mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            독립한 디자이너들의 실제 후기
          </h2>
        </div>

        {/* 신뢰 요소 - 후기 카드 위로 이동 */}
        <div className="mb-12 sm:mb-16">
          <Card className="p-6 sm:p-8 border border-gray-200 rounded-xl shadow-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">2,847명</div>
                  <div className="text-sm text-purple-600">이용 중인 1인 기업·프리랜서 디자이너</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">99.9%</div>
                  <div className="text-sm text-purple-600">데이터 보안 안정성</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">4.8/5</div>
                  <div className="text-sm text-purple-600">사용자 만족도</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 사용자 후기 카드 */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`p-4 sm:p-6 border border-gray-200 rounded-xl shadow-none h-auto ${index >= testimonials.length - 3 ? 'border-b-0' : ''}`}>
                <div className="flex items-start space-x-4 h-full">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold text-lg">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="font-semibold text-gray-900 text-base mb-1">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 mb-3">{testimonial.job}</div>
                    <p className="text-gray-700 leading-relaxed text-sm flex-1">
                      {testimonial.content}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* 그라데이션 페이드 효과 */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none"></div>
          
          {/* 추가 그라데이션 레이어 */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;