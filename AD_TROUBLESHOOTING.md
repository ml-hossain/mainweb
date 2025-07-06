# Ad Management System Troubleshooting

## Common Issues and Solutions

### 1. ERR_BLOCKED_BY_CLIENT Error
**Problem**: Network requests to Supabase are being blocked by browser ad blockers.

**Symptoms**:
- `ERR_BLOCKED_BY_CLIENT` errors in browser console
- Failed to update/create ads
- Database operations failing

**Solutions**:
1. **Disable Ad Blocker** (Recommended for development):
   - Temporarily disable ad blocker for localhost
   - Add `localhost` to ad blocker whitelist

2. **Use Incognito/Private Mode**:
   - Ad blockers are usually disabled in incognito mode

3. **Alternative Development Setup**:
   - Use a different browser without ad blockers
   - Configure ad blocker to allow localhost requests

### 2. WebSocket Connection Issues
**Problem**: Hot Module Replacement (HMR) WebSocket connection errors.

**Symptoms**:
- CSP violations for WebSocket connections
- HMR not working properly

**Solutions**:
1. **Updated CSP Headers**: Added `ws://localhost:*` to connect-src
2. **Vite Configuration**: Updated HMR port configuration

### 3. Form Validation Errors
**Problem**: Empty color inputs causing HTML5 validation errors.

**Symptoms**:
- "The specified value does not conform to the required format" errors
- Color inputs showing invalid values

**Solutions**:
1. **Default Values**: Set default colors (#ffffff, #e5e7eb)
2. **Null Handling**: Properly handle null/undefined values from database

### 4. Target Pages Array Issues
**Problem**: PostgreSQL array handling and empty arrays.

**Symptoms**:
- Target pages not saving correctly
- Array queries failing

**Solutions**:
1. **Array Filtering**: Filter out empty strings before saving
2. **Default Arrays**: Initialize with empty array instead of null

## Testing the Ad Manager

### 1. Basic Functionality Test
```bash
# 1. Navigate to admin
http://localhost:3003/admin/ads

# 2. Create a test ad
- Click "Create Ad"
- Fill in basic information
- Set placement to "blog-sidebar"
- Add target page "/blog"
- Save ad

# 3. Test ad display
http://localhost:3003/blog
```

### 2. Development Environment Setup
```bash
# Disable ad blocker for localhost
# Or use incognito mode
# Or use different browser

# Restart development server
npm run dev
```

### 3. Database Direct Testing
```sql
-- Check ads table
SELECT * FROM ads;

-- Update ad status manually
UPDATE ads SET status = 'active' WHERE id = 'your-ad-id';
```

## Production Deployment Notes

### 1. Remove Development CSP Rules
Remove `ws://localhost:*` from CSP in production.

### 2. Ad Blocker Considerations
- Use semantic naming for components (avoid "ad", "banner", "promo")
- Consider server-side rendering for ad content
- Implement fallback content for blocked ads

### 3. Performance Optimizations
- Cache ad data appropriately
- Minimize database queries
- Use CDN for ad assets

### 4. Analytics and Monitoring
- Set up proper error tracking
- Monitor ad performance metrics
- Implement A/B testing framework

## Security Considerations

### 1. Content Security Policy
- Maintain strict CSP in production
- Whitelist only necessary domains
- Validate all user-generated content

### 2. Input Validation
- Sanitize HTML content in custom_html field
- Validate URLs and color values
- Prevent XSS in ad content

### 3. Database Security
- Use RLS (Row Level Security) for ads table
- Implement proper user permissions
- Log all ad modifications

## Monitoring and Analytics

### 1. Error Tracking
```javascript
// Add to your error tracking
if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
  console.warn('Ad blocker detected - consider fallback strategy');
}
```

### 2. Performance Monitoring
- Track ad load times
- Monitor click-through rates
- Alert on high error rates

### 3. User Experience
- Implement graceful fallbacks
- Provide clear error messages
- Test across different browsers and ad blockers
