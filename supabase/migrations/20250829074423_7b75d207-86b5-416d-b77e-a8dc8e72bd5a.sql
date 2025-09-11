-- Clean up duplicate expense categories, keeping only the first one of each name per user
WITH duplicates_to_delete AS (
  SELECT id,
    ROW_NUMBER() OVER (PARTITION BY user_id, transaction_type, name ORDER BY created_at) as rn
  FROM categories
  WHERE transaction_type = 'expense'
)
DELETE FROM categories 
WHERE id IN (
  SELECT id FROM duplicates_to_delete WHERE rn > 1
);

-- Create income categories for existing users
INSERT INTO categories (user_id, transaction_type, name, sort_order, is_deductible)
SELECT DISTINCT 
  c.user_id,
  'income' as transaction_type,
  income_cat.name,
  income_cat.sort_order,
  income_cat.is_deductible
FROM categories c
CROSS JOIN (
  VALUES 
    ('프로젝트 매출', 1, true),
    ('컨설팅/강의료', 2, true),
    ('저작권·인세 수입', 3, true),
    ('플랫폼 매출(국내)', 4, true),
    ('플랫폼 매출(해외)', 5, true),
    ('광고/스폰서 수입', 6, true),
    ('기타 수입', 7, true),
    ('보조금/지원금', 8, true)
) AS income_cat(name, sort_order, is_deductible)
WHERE c.transaction_type = 'expense'
  AND NOT EXISTS (
    SELECT 1 FROM categories existing 
    WHERE existing.user_id = c.user_id 
      AND existing.transaction_type = 'income' 
      AND existing.name = income_cat.name
  );