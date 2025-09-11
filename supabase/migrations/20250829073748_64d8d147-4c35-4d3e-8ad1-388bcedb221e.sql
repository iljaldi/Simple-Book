-- Add transaction_type to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS transaction_type TEXT NOT NULL DEFAULT 'expense';

-- Update existing categories to be expense type (they already are due to default)
-- No need to update since default handles this