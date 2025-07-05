-- Update existing blog_posts table to add missing columns
-- Run this if you already have a blog_posts table but it's missing some columns

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add featured column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'featured') THEN
        ALTER TABLE blog_posts ADD COLUMN featured BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add tags column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'tags') THEN
        ALTER TABLE blog_posts ADD COLUMN tags TEXT[];
    END IF;
    
    -- Add meta_title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'meta_title') THEN
        ALTER TABLE blog_posts ADD COLUMN meta_title VARCHAR(255);
    END IF;
    
    -- Add meta_description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'meta_description') THEN
        ALTER TABLE blog_posts ADD COLUMN meta_description TEXT;
    END IF;
    
    -- Add meta_keywords column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'meta_keywords') THEN
        ALTER TABLE blog_posts ADD COLUMN meta_keywords TEXT;
    END IF;
    
    -- Add reading_time column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'reading_time') THEN
        ALTER TABLE blog_posts ADD COLUMN reading_time INTEGER DEFAULT 0;
    END IF;
    
    -- Add view_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'view_count') THEN
        ALTER TABLE blog_posts ADD COLUMN view_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add published_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blog_posts' AND column_name = 'published_at') THEN
        ALTER TABLE blog_posts ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Update published_at for existing published posts
UPDATE blog_posts 
SET published_at = created_at 
WHERE published = true AND published_at IS NULL;

-- Insert some sample data if the table is empty
INSERT INTO blog_posts (title, slug, excerpt, content, author, category, tags, featured, published, published_at)
SELECT * FROM (VALUES 
    (
        'Complete Guide to Study Abroad in 2024',
        'complete-guide-study-abroad-2024',
        'Everything you need to know about studying abroad in 2024, from choosing universities to visa applications.',
        '<h1>Complete Guide to Study Abroad in 2024</h1><p>Studying abroad is one of the most rewarding experiences you can have as a student. This comprehensive guide will walk you through everything you need to know.</p><h2>Why Study Abroad?</h2><p>International education offers numerous benefits including global perspective, career opportunities, and personal growth.</p>',
        'MA Education Team',
        'Study Tips',
        ARRAY['study abroad', 'international education', 'university guide', 'student tips'],
        true,
        true,
        NOW()
    ),
    (
        'Top 10 Universities in Canada for International Students',
        'top-10-universities-canada-international-students',
        'Discover the best Canadian universities that welcome international students with excellent programs and support services.',
        '<h1>Top 10 Universities in Canada for International Students</h1><p>Canada is known for its world-class education system and welcoming environment for international students.</p><h2>University of Toronto</h2><p>One of Canada''s most prestigious institutions...</p>',
        'Sarah Johnson',
        'University Reviews',
        ARRAY['canada', 'universities', 'international students', 'education'],
        true,
        true,
        NOW() - INTERVAL '1 day'
    ),
    (
        'IELTS vs TOEFL: Which English Test Should You Take?',
        'ielts-vs-toefl-which-english-test',
        'Compare IELTS and TOEFL tests to determine which English proficiency exam is best for your study abroad goals.',
        '<h1>IELTS vs TOEFL: Which English Test Should You Take?</h1><p>Choosing between IELTS and TOEFL can be confusing. This guide helps you make the right decision.</p>',
        'Dr. Ahmed Rahman',
        'Test Preparation',
        ARRAY['ielts', 'toefl', 'english test', 'test preparation'],
        false,
        true,
        NOW() - INTERVAL '2 days'
    )
) AS v(title, slug, excerpt, content, author, category, tags, featured, published, published_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_posts LIMIT 1);

-- Create or update the updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at 
BEFORE UPDATE ON blog_posts 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
