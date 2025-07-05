# University Card Image Display Fix

## Problem
Images uploaded via the ImageUpload component weren't showing on university cards.

## Root Cause
University card components were only using `logo_url` for display, but the image upload component allows uploading both logo and banner images. The cards needed to be updated to properly use both fields.

## Changes Made

### 1. Updated University Card Components
- **UniversityCard.jsx**: Now uses `banner_url` as primary image, `logo_url` as fallback
- **UniversityListCard.jsx**: Same priority: banner → logo → placeholder
- **HomeUniversityCard.jsx**: Same priority: banner → logo → placeholder

### 2. Enhanced Image Display Logic
- Primary image: Uses `banner_url` (usually larger, better for card backgrounds)
- Fallback: Uses `logo_url` if no banner available
- Placeholder: High-quality Unsplash image if neither available
- Logo overlay: Shows small logo in corner when both banner and logo exist

### 3. Added Error Handling
- `onError` handlers for failed image loads
- Automatic fallback to placeholder images
- Console logging for debugging

### 4. Added Debug Component
- Created `ImageDebugger.jsx` for troubleshooting
- Shows actual database values for logo_url and banner_url
- Visual preview of both images
- Only visible in development mode

## How It Works Now

1. **Upload Process**: 
   - User uploads via ImageUpload component
   - Images saved to ImgBB and URLs stored in database
   - URLs automatically populated in logo_url or banner_url fields

2. **Display Process**:
   - Cards check for banner_url first (best for card backgrounds)
   - Fall back to logo_url if no banner
   - Show placeholder if neither exists
   - Display small logo overlay when both exist

3. **Error Recovery**:
   - If uploaded image fails to load, shows placeholder
   - Console logs help identify broken URLs
   - Graceful degradation maintains card layout

## Testing

1. Navigate to `/admin/universities/new`
2. Upload images using the new upload buttons
3. Save university
4. Check cards on home page, universities page
5. Images should now display properly

The debug component (top-right corner in dev mode) shows exactly what URLs are stored in the database for troubleshooting.
