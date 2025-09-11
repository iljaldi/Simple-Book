-- Add default_taxation_type column to categories table
ALTER TABLE public.categories 
ADD COLUMN default_taxation_type text;

-- Update existing income categories with logical tax type mappings
UPDATE public.categories 
SET default_taxation_type = CASE 
  WHEN name = '프로젝트 매출' THEN 'TAXABLE'
  WHEN name = '컨설팅/강의료' THEN 'TAXABLE'
  WHEN name = '저작권·인세 수입' THEN 'EXEMPT'
  WHEN name = '플랫폼 매출(국내)' THEN 'TAXABLE'
  WHEN name = '플랫폼 매출(해외)' THEN 'ZERO_RATED'
  WHEN name = '광고/스폰서 수입' THEN 'TAXABLE'
  WHEN name = '기타 수입' THEN 'TAXABLE'
  WHEN name = '보조금/지원금' THEN 'EXEMPT'
  ELSE 'TAXABLE'
END
WHERE transaction_type = 'income';