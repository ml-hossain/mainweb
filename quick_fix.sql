-- Quick fix: Add the missing 'featured' column to blog_posts table
-- Copy and paste this into your Supabase SQL Editor

-- Add featured column if it doesn't exist
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Add other commonly needed columns if they don't exist
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Create index for featured column
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);

-- Mark some posts as featured for testing (optional)
UPDATE blog_posts SET featured = true WHERE id IN (
  SELECT id FROM blog_posts WHERE published = true ORDER BY created_at DESC LIMIT 2
);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
ORDER BY column_name;
