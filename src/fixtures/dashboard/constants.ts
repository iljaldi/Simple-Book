/**
 * 대시보드 픽스처 데이터 상수
 */

// 카테고리 목록
export const CATEGORIES = {
  INCOME: ['프로젝트 수입', '상품 판매', '강의료', '기타 수입'],
  EXPENSE: ['사무용품', '통신비', '교통비', '식비', '마케팅', '소프트웨어', '호스팅', '교육비', '기타 지출']
} as const;

// 결제 수단 목록
export const PAYMENT_METHODS = ['현금', '카드', '계좌이체', '간편결제'] as const;

// 거래처 목록
export const COMPANIES = [
  '클라이언트 A', '클라이언트 B', '클라이언트 C', '네이버', '카카오', '구글',
  '아마존', '마이크로소프트', '어도비', '피그마', '노션', '슬랙',
  '스타벅스', '맥도날드', '롯데마트', '이마트', '쿠팡', '배달의민족'
] as const;

// 구독 서비스 목록
export const SUBSCRIPTION_SERVICES = [
  'Figma Pro', 'Notion Pro', 'Adobe Creative Cloud', 'Slack Pro',
  'GitHub Pro', 'Vercel Pro', 'Netlify Pro', 'AWS', 'Google Cloud',
  'Dropbox Pro', '1Password', 'Spotify Premium', 'Netflix'
] as const;

// 사업 유형별 세율 (참고용)
export const BUSINESS_TAX_RATES = {
  simple: { vat: 0, incomeTax: 0.1 }, // 간이과세
  general: { vat: 0.1, incomeTax: 0.2 }, // 일반과세
  tax_free: { vat: 0, incomeTax: 0 } // 면세
} as const;

// 세무 일정
export const TAX_SCHEDULE = [
  { name: '부가세 신고', months: [1, 7], day: 25 },
  { name: '종합소득세 신고', months: [5], day: 31 },
  { name: '지방소득세 신고', months: [5], day: 31 }
] as const;
