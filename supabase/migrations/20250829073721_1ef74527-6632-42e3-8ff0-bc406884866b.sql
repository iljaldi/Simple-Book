-- Add transaction_type to categories table
ALTER TABLE public.categories 
ADD COLUMN transaction_type TEXT NOT NULL DEFAULT 'expense';

-- Update existing categories to be expense type
UPDATE public.categories 
SET transaction_type = 'expense' 
WHERE transaction_type = 'expense';

-- Insert new income categories
INSERT INTO public.categories (name, is_deductible, sort_order, transaction_type) VALUES
('프로젝트 매출', false, 1, 'income'),
('컨설팅/강의료', false, 2, 'income'),
('저작권·인세 수입', false, 3, 'income'),
('플랫폼 매출(국내)', false, 4, 'income'),
('플랫폼 매출(해외)', false, 5, 'income'),
('광고/스폰서 수입', false, 6, 'income'),
('기타 수입', false, 7, 'income'),
('보조금/지원금', false, 8, 'income')
ON CONFLICT DO NOTHING;