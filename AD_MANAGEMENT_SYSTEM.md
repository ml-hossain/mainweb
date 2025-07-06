# Ad Management System Documentation

## Overview
The Ad Management System provides a complete solution for managing advertisements across your website. It includes:

- **Dynamic Ad Loading**: Ads are loaded from the database based on placement and targeting rules
- **Admin Interface**: Full CRUD operations for managing ads
- **Analytics Tracking**: Track views, clicks, and impressions
- **Flexible Targeting**: Target specific pages or all pages
- **Multiple Ad Types**: Support for Google AdSense, custom HTML, and simple image/text ads
- **Scheduling**: Set start/end dates and impression limits

## Database Schema

### `ads` Table
```sql
CREATE TABLE ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  position VARCHAR(50) DEFAULT 'center',
  placement VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  
  -- Ad Content
  title VARCHAR(255),
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  
  -- Google AdSense Integration
  ad_client VARCHAR(100),
  ad_slot VARCHAR(100),
  
  -- Custom HTML/JavaScript content
  custom_html TEXT,
  
  -- Display Settings
  show_label BOOLEAN DEFAULT true,
  label_text VARCHAR(50) DEFAULT 'Advertisement',
  dismissible BOOLEAN DEFAULT false,
  
  -- Styling
  custom_css TEXT,
  background_color VARCHAR(20),
  border_color VARCHAR(20),
  
  -- Targeting & Scheduling
  target_pages TEXT[],
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  max_impressions INTEGER,
  current_impressions INTEGER DEFAULT 0,
  
  -- Analytics
  click_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);
```

## Components

### 1. DynamicGoogleAds Component
**Location**: `src/components/DynamicGoogleAds.jsx`

This is the main component that displays ads on the frontend.

**Props**:
- `placement`: Where the ad appears (e.g., 'blog-sidebar', 'blog-detail')
- `adSize`: Size of the ad (same as GoogleAds component)
- `className`: Additional CSS classes
- `fallback`: Whether to show fallback ad if no ads found (default: true)

**Features**:
- Automatically fetches ads from database
- Filters ads based on targeting rules, date ranges, and impression limits
- Tracks views and clicks
- Supports Google AdSense integration
- Supports custom HTML/JavaScript content
- Supports simple image/text ads

**Usage**:
```jsx
<DynamicGoogleAds 
  placement="blog-sidebar"
  adSize="medium-rectangle"
  className="mb-8"
/>
```

### 2. AdManager Component
**Location**: `src/admin/pages/AdManager.jsx`

The admin interface for managing ads.

**Features**:
- Create, edit, and delete ads
- Toggle ad status (active/inactive)
- Duplicate ads
- Filter and search ads
- Real-time analytics display
- Comprehensive ad editor with tabs:
  - Basic Info: Name, type, placement, status
  - Content: Title, description, images, AdSense settings
  - Targeting: Page targeting, date ranges, impression limits
  - Advanced: Styling, custom CSS, labels

### 3. AdAnalytics Component
**Location**: `src/admin/components/AdAnalytics.jsx`

Displays analytics for a specific ad.

**Props**:
- `adId`: ID of the ad to show analytics for
- `className`: Additional CSS classes

**Metrics**:
- Views: Total number of times the ad was displayed
- Clicks: Total number of clicks on the ad
- Impressions: Total impressions served
- CTR: Click-through rate percentage

## Ad Types

### 1. Google AdSense Ads
Set the `ad_client` and `ad_slot` fields to enable Google AdSense integration.

**Example**:
```
ad_client: "ca-pub-xxxxxxxxxxxxxxxx"
ad_slot: "xxxxxxxxxx"
```

### 2. Custom HTML/JavaScript Ads
Use the `custom_html` field to insert custom HTML or JavaScript code.

**Example**:
```html
<div style="background: linear-gradient(45deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center;">
  <h3 style="color: white; margin: 0;">Study Abroad!</h3>
  <p style="color: white; margin: 10px 0;">Get expert guidance</p>
  <button onclick="window.open('https://example.com', '_blank')" style="background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Learn More</button>
</div>
```

### 3. Simple Image/Text Ads
Use the `title`, `description`, `image_url`, and `link_url` fields for simple ads.

## Placements

Current supported placements:
- `blog-sidebar`: Blog page sidebar
- `blog-detail`: Blog detail page sidebar
- `blog-detail-inline`: Inline within blog content
- `home-banner`: Home page banner
- `home-sidebar`: Home page sidebar
- `footer`: Footer area
- `header`: Header area
- `mobile-bottom`: Mobile bottom banner
- `popup`: Popup ads
- `custom`: Custom placement

## Targeting

### Page Targeting
Use the `target_pages` array to specify which pages should show the ad:
- `["/blog"]`: Only show on blog pages
- `["/blog", "/blog-detail"]`: Show on blog and blog detail pages
- `["*"]`: Show on all pages
- `["/"]`: Show only on home page

### Date Targeting
- `start_date`: Ad will only show after this date
- `end_date`: Ad will stop showing after this date

### Impression Limits
- `max_impressions`: Maximum number of impressions before ad stops showing
- `current_impressions`: Current impression count (auto-incremented)

## Analytics

The system tracks:
- **Views**: Each time an ad is displayed
- **Clicks**: Each time an ad is clicked
- **Impressions**: Total impressions served
- **CTR**: Click-through rate (clicks/views * 100)

Analytics are updated in real-time and can be viewed in the admin interface.

## Integration Guide

### Step 1: Add DynamicGoogleAds to Your Pages
Replace existing `GoogleAds` components with `DynamicGoogleAds`:

```jsx
// Old
<GoogleAds adSize="medium-rectangle" className="mb-8" />

// New
<DynamicGoogleAds 
  placement="blog-sidebar"
  adSize="medium-rectangle"
  className="mb-8"
/>
```

### Step 2: Access Admin Interface
Navigate to `/admin/ads` to manage your ads.

### Step 3: Create Your First Ad
1. Click "Create Ad" in the admin interface
2. Fill in the basic information
3. Add your content (AdSense, HTML, or simple ad)
4. Set targeting rules
5. Save and activate

### Step 4: Monitor Performance
Use the analytics dashboard to monitor ad performance and optimize accordingly.

## Best Practices

### 1. Ad Placement Strategy
- Place ads in high-visibility areas (sidebar, between content)
- Don't overwhelm users with too many ads
- Use different ad types for different placements

### 2. Content Guidelines
- Keep ad content relevant to your audience
- Use clear, compelling call-to-action text
- Ensure ads are mobile-friendly

### 3. Performance Optimization
- Monitor CTR and adjust ad content accordingly
- Test different ad positions and sizes
- Use A/B testing with multiple ads per placement

### 4. User Experience
- Don't make ads too intrusive
- Ensure ads load quickly
- Make sure ads don't negatively impact site performance

## Troubleshooting

### Common Issues

1. **Ads not showing**
   - Check if ad status is 'active'
   - Verify placement name matches component placement prop
   - Check targeting rules (pages, dates, impression limits)

2. **Analytics not updating**
   - Ensure database connection is working
   - Check browser console for JavaScript errors
   - Verify ad ID is correct

3. **AdSense ads not displaying**
   - Verify ad_client and ad_slot are correct
   - Ensure AdSense script is loaded on the page
   - Check AdSense account for policy violations

### Debug Mode
Add `?debug=true` to your URL to see debug information about ad loading.

## Future Enhancements

Potential future features:
- Advanced targeting (geographic, device, user behavior)
- A/B testing framework
- Revenue tracking
- Integration with ad networks beyond Google AdSense
- Automated ad rotation
- Performance recommendations
- Bulk ad operations
- Ad templates
- Campaign management
- Detailed analytics reports

## Support

For issues or questions about the ad management system, please:
1. Check this documentation
2. Review the browser console for error messages
3. Test in the admin interface
4. Check database connectivity and permissions
