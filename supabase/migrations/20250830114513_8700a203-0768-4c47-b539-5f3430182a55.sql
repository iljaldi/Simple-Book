-- Add allow_override field to categories table
ALTER TABLE public.categories 
ADD COLUMN allow_override BOOLEAN NOT NULL DEFAULT true;

-- Update existing categories with appropriate allow_override values
-- Set some categories to have fixed taxation types
UPDATE public.categories 
SET allow_override = false 
WHERE name IN ('저작권·인세 수입', '보조금/지원금') 
AND default_taxation_type = 'EXEMPT';

-- Create index for better performance on taxation type queries
CREATE INDEX IF NOT EXISTS idx_categories_taxation_type ON public.categories(default_taxation_type);

-- Add comment for documentation
COMMENT ON COLUMN public.categories.allow_override IS 'Whether users can override the default taxation type for this category';