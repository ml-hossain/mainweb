-- Create SEO Settings table for Bangladesh market optimization
CREATE TABLE IF NOT EXISTS seo_settings (
  id SERIAL PRIMARY KEY,
  market VARCHAR(50) UNIQUE NOT NULL,
  keywords JSONB,
  meta_data JSONB,
  content_optimization JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_seo_settings_market ON seo_settings(market);
CREATE INDEX IF NOT EXISTS idx_seo_settings_updated_at ON seo_settings(updated_at);

-- Insert initial Bangladesh market data
INSERT INTO seo_settings (market, keywords, meta_data, content_optimization) 
VALUES (
  'bangladesh',
  '{
    "primary": [],
    "secondary": [],
    "localBD": [],
    "competitors": []
  }',
  '{
    "homePage": {
      "title": "Best Education Consultant in Bangladesh | MA Education",
      "description": "Study abroad from Bangladesh with MA Education. Expert guidance for Malaysia, Canada, Australia universities. Free consultation for Bangladeshi students.",
      "keywords": "study abroad bangladesh, education consultant dhaka, international education",
      "ogTitle": "Study Abroad from Bangladesh - MA Education Consultancy",
      "ogDescription": "Transform your future with MA Education. Leading study abroad consultant in Bangladesh helping students achieve their international education dreams.",
      "ogImage": ""
    },
    "aboutPage": {
      "title": "About MA Education - Leading Study Abroad Consultant Bangladesh",
      "description": "Learn about MA Education, Bangladeshs trusted education consultancy. 10+ years helping students study in Malaysia, Canada, Australia & more.",
      "keywords": "about ma education, education consultancy bangladesh, study abroad consultant dhaka"
    },
    "servicesPage": {
      "title": "Study Abroad Services Bangladesh | University Admission Help",
      "description": "Complete study abroad services for Bangladeshi students. University selection, visa processing, scholarship guidance & more. Free consultation.",
      "keywords": "study abroad services, university admission bangladesh, student visa help"
    },
    "universitiesPage": {
      "title": "Top Universities for Bangladesh Students | Study Abroad Options",
      "description": "Explore top universities in Malaysia, Canada, Australia for Bangladeshi students. Compare programs, fees, scholarships. Expert guidance available.",
      "keywords": "universities for bangladeshi students, study in malaysia, study in canada"
    }
  }',
  '{
    "bangladeshiFocus": {
      "enabled": true,
      "regions": ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal"],
      "languages": ["Bengali", "English"],
      "currency": "BDT"
    },
    "localSEO": {
      "businessName": "MA Education Consultancy",
      "address": "Dhaka, Bangladesh",
      "phone": "+880-XXX-XXXXXX",
      "coordinates": {
        "lat": 23.8103,
        "lng": 90.4125
      }
    }
  }'
) ON CONFLICT (market) DO NOTHING;
