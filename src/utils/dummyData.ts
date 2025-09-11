import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];

export const generateDummyTransactions = async (userId: string) => {
  console.log('더미 데이터 생성 시작 - 사용자 ID:', userId);
  
  if (!userId) {
    console.error('사용자 ID가 없습니다.');
    throw new Error('사용자 ID가 필요합니다.');
  }
  
  try {
    // 기존 데이터 삭제
    console.log('기존 데이터 삭제 중...');
    await clearAllTransactions(userId);
    console.log('기존 데이터 삭제 완료');
    
    const dummyTransactions: TransactionInsert[] = [
      // 수입 거래들 (7개)
      {
        user_id: userId,
        type: 'income',
        amount_gross: 5000000,
        vat_amount: 500000,
        taxation_type: 'TAXABLE',
        evidence_type: 'TAX_INVOICE',
        counterparty_name: '컴팩트 소프트',
        category: '프로젝트 매출',
        description: '웹 개발 프로젝트 완료',
        date: '2025-01-15',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'transfer',
        project: '웹사이트 리뉴얼',
        withholding_income_tax: 250000,
        withholding_local_tax: 25000,
      },
      {
        user_id: userId,
        type: 'income',
        amount_gross: 3000000,
        vat_amount: 300000,
        taxation_type: 'TAXABLE',
        evidence_type: 'INVOICE',
        counterparty_name: '디자인 스튜디오',
        category: '디자인 수입',
        description: 'UI/UX 디자인 작업',
        date: '2025-01-12',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'transfer',
        project: '모바일 앱 디자인',
      },
      {
        user_id: userId,
        type: 'income',
        amount_gross: 1500000,
        vat_amount: 0,
        taxation_type: 'EXEMPT',
        evidence_type: 'CARD',
        counterparty_name: '개인 고객',
        category: '컨설팅 수입',
        description: 'IT 컨설팅 서비스',
        date: '2025-01-10',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'card',
      },
      {
        user_id: userId,
        type: 'income',
        amount_gross: 8000000,
        vat_amount: 800000,
        taxation_type: 'TAXABLE',
        evidence_type: 'TAX_INVOICE',
        counterparty_name: '대기업 A',
        category: '시스템 개발',
        description: 'ERP 시스템 구축',
        date: '2025-01-08',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'transfer',
        project: 'ERP 구축 프로젝트',
        withholding_income_tax: 400000,
        withholding_local_tax: 40000,
      },
      {
        user_id: userId,
        type: 'income',
        amount_gross: 2000000,
        vat_amount: 200000,
        taxation_type: 'TAXABLE',
        evidence_type: 'INVOICE',
        counterparty_name: '스타트업 B',
        category: '앱 개발',
        description: '모바일 앱 개발',
        date: '2025-01-05',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'transfer',
        project: '모바일 앱',
      },
      {
        user_id: userId,
        type: 'income',
        amount_gross: 1200000,
        vat_amount: 0,
        taxation_type: 'ZERO_RATED',
        evidence_type: 'INVOICE',
        counterparty_name: '해외 고객',
        category: '수출 수입',
        description: '해외 수출 서비스',
        date: '2025-01-18',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'transfer',
        project: '글로벌 프로젝트',
      },
      {
        user_id: userId,
        type: 'income',
        amount_gross: 800000,
        vat_amount: 0,
        taxation_type: 'EXEMPT',
        evidence_type: 'CARD',
        counterparty_name: '정부기관',
        category: '정부 지원금',
        description: '스타트업 지원금',
        date: '2025-01-20',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'transfer',
      },

      // 지출 거래들 (13개)
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 500000,
        vat_amount: 50000,
        taxation_type: 'TAXABLE',
        evidence_type: 'CARD',
        counterparty_name: '클라우드 서비스',
        category: '서버 비용',
        description: 'AWS 클라우드 서비스',
        date: '2025-01-14',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'card',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 300000,
        vat_amount: 30000,
        taxation_type: 'TAXABLE',
        evidence_type: 'CASH_RCPT',
        counterparty_name: '오피스 임대',
        category: '사무실 임대료',
        description: '사무실 월 임대료',
        date: '2025-01-01',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'transfer',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 150000,
        vat_amount: 15000,
        taxation_type: 'TAXABLE',
        evidence_type: 'CARD',
        counterparty_name: '인터넷 서비스',
        category: '통신비',
        description: '인터넷 및 전화비',
        date: '2025-01-03',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'card',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 200000,
        vat_amount: 20000,
        taxation_type: 'TAXABLE',
        evidence_type: 'CARD',
        counterparty_name: '장비 구매',
        category: '장비 구매',
        description: '개발 장비 구매',
        date: '2025-01-07',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'card',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 100000,
        vat_amount: 0,
        taxation_type: 'EXEMPT',
        evidence_type: 'SIMPLE_RCPT',
        counterparty_name: '식당',
        category: '식비',
        description: '고객과의 미팅 식사',
        date: '2025-01-11',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'card',
        business_use_ratio: 0.5,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 80000,
        vat_amount: 8000,
        taxation_type: 'TAXABLE',
        evidence_type: 'CARD',
        counterparty_name: '교통비',
        category: '교통비',
        description: '출장 교통비',
        date: '2025-01-09',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'card',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 120000,
        vat_amount: 12000,
        taxation_type: 'TAXABLE',
        evidence_type: 'CARD',
        counterparty_name: '마케팅 비용',
        category: '마케팅',
        description: '온라인 광고비',
        date: '2025-01-06',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'card',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 60000,
        vat_amount: 0,
        taxation_type: 'EXEMPT',
        evidence_type: 'NONE',
        counterparty_name: '기타 비용',
        category: '기타',
        description: '기타 사업비',
        date: '2025-01-04',
        currency: 'KRW',
        status: 'draft',
        payment_method: 'cash',
        business_use_ratio: 0.8,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 400000,
        vat_amount: 40000,
        taxation_type: 'TAXABLE',
        evidence_type: 'TAX_INVOICE',
        counterparty_name: '회계 서비스',
        category: '전문가 자문비',
        description: '회계 및 세무 자문',
        date: '2025-01-02',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'transfer',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 250000,
        vat_amount: 25000,
        taxation_type: 'TAXABLE',
        evidence_type: 'CARD',
        counterparty_name: '소프트웨어 라이선스',
        category: '소프트웨어',
        description: '개발 도구 라이선스',
        date: '2025-01-13',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'card',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 180000,
        vat_amount: 18000,
        taxation_type: 'TAXABLE',
        evidence_type: 'CARD',
        counterparty_name: '보험료',
        category: '보험료',
        description: '사업자 보험료',
        date: '2025-01-16',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'transfer',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 90000,
        vat_amount: 0,
        taxation_type: 'EXEMPT',
        evidence_type: 'SIMPLE_RCPT',
        counterparty_name: '도서 구매',
        category: '교육비',
        description: '전문 서적 구매',
        date: '2025-01-17',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'card',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
      {
        user_id: userId,
        type: 'expense',
        amount_gross: 350000,
        vat_amount: 35000,
        taxation_type: 'TAXABLE',
        evidence_type: 'CARD',
        counterparty_name: '법무 서비스',
        category: '법무비',
        description: '법무 자문비',
        date: '2025-01-19',
        currency: 'KRW',
        status: 'confirmed',
        payment_method: 'transfer',
        business_use_ratio: 1.0,
        is_deductible: true,
      },
    ];

    console.log('더미 데이터 삽입 시작 - 총', dummyTransactions.length, '개');
    const { data, error } = await supabase
      .from('transactions')
      .insert(dummyTransactions)
      .select();

    if (error) {
      console.error('더미 데이터 삽입 오류:', error);
      throw error;
    }

    console.log(`${dummyTransactions.length}개의 더미 거래 데이터가 성공적으로 생성되었습니다.`, data);
    return data;
  } catch (error) {
    console.error('더미 데이터 생성 실패:', error);
    throw error;
  }
};

export const clearAllTransactions = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('거래 데이터 삭제 오류:', error);
      throw error;
    }

    console.log('모든 거래 데이터가 삭제되었습니다.');
  } catch (error) {
    console.error('거래 데이터 삭제 실패:', error);
    throw error;
  }
};