-- Create SEO analyses table for storing analysis data
CREATE TABLE IF NOT EXISTS seo_analyses (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    analysis_data JSONB NOT NULL,
    overall_score INTEGER DEFAULT 0,
    technical_score INTEGER DEFAULT 0,
    content_score INTEGER DEFAULT 0,
    keyword_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seo_analyses_url ON seo_analyses(url);
CREATE INDEX IF NOT EXISTS idx_seo_analyses_created_at ON seo_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_analyses_overall_score ON seo_analyses(overall_score DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_seo_analyses_updated_at 
    BEFORE UPDATE ON seo_analyses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE seo_analyses ENABLE ROW LEVEL SECURITY;

-- Allow public read access for SEO analyses
CREATE POLICY "Public can view SEO analyses" ON seo_analyses
    FOR SELECT USING (true);

-- Allow public insert for new analyses
CREATE POLICY "Public can insert SEO analyses" ON seo_analyses
    FOR INSERT WITH CHECK (true);

-- Create additional indexes for JSONB queries
CREATE INDEX IF NOT EXISTS idx_seo_analyses_analysis_data_gin ON seo_analyses USING GIN (analysis_data);

-- Add comments for documentation
COMMENT ON TABLE seo_analyses IS 'Stores SEO analysis results for websites and content';
COMMENT ON COLUMN seo_analyses.url IS 'The URL or identifier of the analyzed content';
COMMENT ON COLUMN seo_analyses.analysis_data IS 'Complete JSON analysis data including technical, content, and keyword metrics';
COMMENT ON COLUMN seo_analyses.overall_score IS 'Overall SEO score (0-100)';
COMMENT ON COLUMN seo_analyses.technical_score IS 'Technical SEO score (0-100)';
COMMENT ON COLUMN seo_analyses.content_score IS 'Content optimization score (0-100)';
COMMENT ON COLUMN seo_analyses.keyword_score IS 'Keyword optimization score (0-100)';

-- Insert sample data for testing
INSERT INTO seo_analyses (url, analysis_data, overall_score, technical_score, content_score, keyword_score) VALUES
(
    'https://example.com/sample-page',
    '{
        "technicalSEO": {
            "pageSpeed": {"mobile": 85, "desktop": 92},
            "lighthouse": {"performance": 88, "accessibility": 95, "bestPractices": 90, "seo": 96},
            "technicalIssues": []
        },
        "contentAnalysis": {
            "wordCount": 1250,
            "readabilityScore": 78,
            "keywordDensity": [
                {"keyword": "SEO optimization", "density": 2.1, "count": 8}
            ]
        },
        "keywordAnalysis": {
            "primaryKeyword": {
                "keyword": "SEO optimization",
                "searchVolume": 5400,
                "difficulty": 65
            }
        },
        "timestamp": "2024-01-15T10:30:00Z"
    }',
    87,
    90,
    85,
    86
),
(
    'https://example.com/blog-post',
    '{
        "technicalSEO": {
            "pageSpeed": {"mobile": 78, "desktop": 88},
            "lighthouse": {"performance": 82, "accessibility": 88, "bestPractices": 85, "seo": 91},
            "technicalIssues": [
                {"type": "warning", "description": "Large images not optimized", "priority": "Medium"}
            ]
        },
        "contentAnalysis": {
            "wordCount": 850,
            "readabilityScore": 82,
            "keywordDensity": [
                {"keyword": "content marketing", "density": 1.8, "count": 6}
            ]
        },
        "timestamp": "2024-01-14T15:20:00Z"
    }',
    83,
    85,
    82,
    81
);
