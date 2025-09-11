-- Clean up duplicate categories while preserving transactions
-- Step 1: Create a temporary table with the latest category for each user + name + type combination
CREATE TEMP TABLE latest_categories AS
SELECT DISTINCT ON (user_id, name, transaction_type) 
       id, user_id, name, transaction_type, created_at
FROM categories 
ORDER BY user_id, name, transaction_type, created_at DESC;

-- Step 2: Update transactions to reference the latest category IDs
UPDATE transactions 
SET category_id = lc.id
FROM latest_categories lc, categories old_cat
WHERE transactions.category_id = old_cat.id
  AND old_cat.user_id = lc.user_id 
  AND old_cat.name = lc.name
  AND old_cat.transaction_type = lc.transaction_type
  AND old_cat.id != lc.id;

-- Step 3: Delete duplicate categories (keep only the latest ones)
DELETE FROM categories 
WHERE id NOT IN (SELECT id FROM latest_categories);

-- Step 4: Add unique constraint to prevent future duplicates
ALTER TABLE categories 
ADD CONSTRAINT unique_user_category_type 
UNIQUE (user_id, name, transaction_type);