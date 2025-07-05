-- Create blog_posts table for the admin panel blog management
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image VARCHAR(500),
    author VARCHAR(100),
    category VARCHAR(100),
    tags TEXT[], -- Array of tags
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    reading_time INTEGER DEFAULT 0, -- in minutes
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample blog posts for testing
INSERT INTO blog_posts (title, slug, excerpt, content, author, category, tags, featured, published, published_at) VALUES 
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
);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read published posts
-- CREATE POLICY "Public can read published blog posts" ON blog_posts
-- FOR SELECT USING (published = true);

-- Create policy for admin users to manage all posts (you'll need to adjust based on your auth setup)
-- CREATE POLICY "Admin can manage all blog posts" ON blog_posts
-- FOR ALL USING (auth.jwt() ->> 'email' IN ('hossain890m@gmail.com', 'play.rjfahad@gmail.com'));
