# Google AdSense Integration Guide

## Overview
This guide explains how to replace the placeholder Google Ads with real Google AdSense advertisements in your blog application.

## Current Implementation

### GoogleAds Component
- **Location**: `src/components/GoogleAds.jsx`
- **Purpose**: Reusable component for displaying Google AdSense ads
- **Current State**: Shows placeholder content with proper dimensions

### Ad Placements

#### 1. Blog Detail Page (`/blog/:slug`)
- **Location**: Sidebar, above related posts
- **Ad Size**: Medium Rectangle (300x250)
- **Component Usage**: `<GoogleAds adSize="medium-rectangle" className="mb-8" label="Advertisement" />`

#### 2. Blog List Page (`/blog`)
- **Location**: Sidebar, bottom section
- **Ad Size**: Wide Skyscraper (160x600)
- **Component Usage**: `<GoogleAds adSize="wide-skyscraper" label="Sponsored" className="sticky top-8" />`

## Implementation Steps

### Step 1: Get Google AdSense Account
1. Visit [Google AdSense](https://www.google.com/adsense/)
2. Sign up for an account
3. Add your website for review
4. Wait for approval (can take 24-48 hours)

### Step 2: Add AdSense Script to HTML Head
Add this script to your `index.html` file in the `<head>` section:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" 
        crossOrigin="anonymous"></script>
```

Replace `XXXXXXXXXXXXXXXX` with your actual AdSense publisher ID.

### Step 3: Replace Placeholder Content

#### Option A: Auto Ads (Recommended for beginners)
Replace the placeholder div in `GoogleAds.jsx` with:

```jsx
<ins className="adsbygoogle"
     style={{display:'block'}}
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="AUTO"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

#### Option B: Manual Ad Units (More control)
1. Create ad units in your AdSense dashboard
2. Copy the ad code for each unit
3. Replace placeholder content with specific ad codes:

```jsx
{/* Medium Rectangle (300x250) */}
<ins className="adsbygoogle"
     style={{display:'inline-block', width:'300px', height:'250px'}}
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="YYYYYYYYYY"></ins>

{/* Wide Skyscraper (160x600) */}
<ins className="adsbygoogle"
     style={{display:'inline-block', width:'160px', height:'600px'}}
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="ZZZZZZZZZZ"></ins>
```

### Step 4: Initialize Ads
Add this script after the ad elements or use useEffect in React:

```jsx
useEffect(() => {
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error('AdSense error:', e);
  }
}, []);
```

### Step 5: Update GoogleAds Component

Replace the placeholder content in `src/components/GoogleAds.jsx`:

```jsx
// Before (current placeholder)
<div className="bg-white rounded-lg border-2 border-dashed border-gray-300 ...">
  {/* Placeholder content */}
</div>

// After (real AdSense)
<div className="bg-white rounded-lg overflow-hidden">
  <ins className="adsbygoogle"
       style={{display:'block'}}
       data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
       data-ad-slot={getAdSlot(adSize)}
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>
```

## Testing and Optimization

### Testing
1. Use AdSense's test mode during development
2. Check that ads load properly on different devices
3. Verify ad placement doesn't interfere with user experience
4. Test page load speeds with ads enabled

### Optimization Tips
1. **Strategic Placement**: Above the fold, within content, sidebar
2. **Mobile Optimization**: Use responsive ad units
3. **Page Speed**: Monitor impact on loading times
4. **User Experience**: Ensure ads don't block content
5. **Revenue Tracking**: Monitor performance in AdSense dashboard

## Ad Sizes Reference

| Size Name | Dimensions | Best For |
|-----------|------------|----------|
| Banner | 728x90 | Header/Footer |
| Large Banner | 970x90 | Top of page |
| Medium Rectangle | 300x250 | Sidebar, within content |
| Large Rectangle | 336x280 | Within content |
| Leaderboard | 728x90 | Header |
| Skyscraper | 160x600 | Sidebar |
| Wide Skyscraper | 160x600 | Sidebar |
| Mobile Banner | 320x50 | Mobile header/footer |
| Square | 250x250 | Sidebar |

## Compliance and Best Practices

### AdSense Policies
- Don't click your own ads
- Don't encourage clicks
- Don't place ads on prohibited content
- Maintain good user experience
- Follow content policies

### GDPR Compliance
- Add cookie consent banner
- Update privacy policy
- Handle user consent for targeted ads

### Performance
- Lazy load ads when possible
- Monitor Core Web Vitals
- Optimize ad loading sequences

## Troubleshooting

### Common Issues
1. **Ads not showing**: Check ad codes, ensure domain is approved
2. **Poor performance**: Review ad placement and sizes
3. **Policy violations**: Review AdSense policy center
4. **Loading issues**: Check for JavaScript errors

### Debug Mode
Enable AdSense debug mode for testing:
```javascript
window.googletag = window.googletag || {cmd: []};
googletag.cmd.push(function() {
  googletag.pubads().enableConsoleLogging();
});
```

## Revenue Optimization

### A/B Testing
- Test different ad sizes
- Try various placements
- Experiment with ad colors
- Monitor click-through rates

### Analytics Integration
- Link with Google Analytics
- Track revenue per page
- Monitor user engagement impact
- Analyze traffic sources

## Conclusion

The GoogleAds component is designed to be flexible and easily replaceable with real AdSense code. The placeholder system allows you to:

1. **Plan Layout**: See exactly where ads will appear
2. **Test Design**: Ensure ads fit your design aesthetic
3. **Easy Implementation**: Simple replacement when ready for real ads
4. **Consistent Branding**: Professional appearance during development

When ready to monetize, simply replace the placeholder content with your actual AdSense code following the steps above.

**Important**: Always test thoroughly and ensure compliance with Google AdSense policies and local regulations.
