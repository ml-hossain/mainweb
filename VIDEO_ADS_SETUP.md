# Video Ads Integration Guide

This document explains how to integrate and manage video advertisements using the `VideoAd` component.

## 🎬 VideoAd Component Features

The `VideoAd` component is a comprehensive video advertisement solution that supports:

- **Multiple video ad formats** (preroll, midroll, postroll, banner, overlay)
- **Custom video controls** with play/pause, mute/unmute, progress bar
- **Skip functionality** with customizable skip timer
- **Auto-play and muted options** for better user experience
- **VAST/VPAID support** for programmatic video ads
- **Google IMA SDK integration** ready
- **Responsive design** optimized for all devices
- **Professional ad labeling** and user controls

## 🚀 Current Implementation

### Pages with Video Ads:
1. **Universities Listing Page** (`/universities`) - Banner video ad before university grid
2. **Individual University Page** (`/universities/[slug]`) - Sidebar video ad after consultation card

### Video Ad Types:
- **Preroll**: Before main content
- **Midroll**: During content breaks  
- **Postroll**: After content ends
- **Banner**: Header/footer video banners
- **Overlay**: Full-screen overlay ads

## 📱 Ad Formats and Specifications

### Banner Video Ads
- **Desktop**: Max width 728px, height auto-adjusts
- **Mobile**: Max width 320px, height auto-adjusts
- **Aspect Ratio**: Maintains original video ratio
- **File Format**: MP4, WebM, OGG support

### Preroll/Midroll/Postroll Ads
- **Desktop**: Max width 1024px
- **Mobile**: Full width responsive
- **Recommended Resolution**: 1280x720 (720p) or 1920x1080 (1080p)
- **Duration**: 15-30 seconds optimal

### Overlay Ads
- **Full screen**: Covers entire viewport
- **Background**: Semi-transparent black overlay
- **Centered**: Video player centered on screen

## 🛠️ Component Usage Examples

### Basic Video Ad
```jsx
<VideoAd 
  videoUrl="https://example.com/your-ad-video.mp4"
  type="preroll"
  autoPlay={true}
  muted={true}
  skipAfter={5}
/>
```

### Advanced Video Ad with Callbacks
```jsx
<VideoAd 
  videoUrl="https://example.com/your-ad-video.mp4"
  type="banner"
  autoPlay={false}
  muted={true}
  closeable={true}
  showLabel={true}
  skipAfter={3}
  className="my-6"
  onSkip={() => console.log('User skipped ad')}
  onComplete={() => console.log('Ad completed')}
  onClose={() => console.log('Ad closed')}
/>
```

### VAST/Programmatic Video Ad
```jsx
<VideoAd 
  adTagUrl="https://pubads.g.doubleclick.net/gampad/ads?iu=/6062/iab_vast_samples/skippable&description_url=http%3A%2F%2Fiab.com&tfcd=0&npa=0&sz=640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator="
  enableIMA={true}
  type="preroll"
  skipAfter={5}
/>
```

## 🎯 Video Ad Properties

### Core Properties
```jsx
videoUrl: string              // Direct video file URL
type: 'preroll' | 'midroll' | 'postroll' | 'banner' | 'overlay'
autoPlay: boolean             // Auto-start video (default: true)
muted: boolean               // Start muted (default: true)
closeable: boolean           // Show close button (default: true)
showLabel: boolean           // Show "Advertisement" label (default: true)
skipAfter: number            // Seconds before skip button appears (default: 5)
className: string            // Additional CSS classes
```

### Event Callbacks
```jsx
onSkip: function             // Called when user skips ad
onComplete: function         // Called when ad finishes playing
onClose: function            // Called when user closes ad
```

### VAST/IMA Integration
```jsx
adTagUrl: string             // VAST/VPAID ad tag URL
enableIMA: boolean           // Enable Google IMA SDK (default: false)
```

## 📺 Video File Requirements

### Supported Formats
- **MP4** (H.264 codec) - Recommended
- **WebM** (VP8/VP9 codec)
- **OGG** (Theora codec)

### Recommended Specifications
- **Resolution**: 1280x720 (720p) minimum
- **Bitrate**: 1-5 Mbps
- **Duration**: 15-30 seconds for optimal engagement
- **Audio**: 128kbps AAC
- **Frame Rate**: 24-30 fps

### File Size Guidelines
- **Banner ads**: 1-3 MB maximum
- **Preroll ads**: 5-15 MB maximum
- **Keep files optimized** for fast loading

## 🔧 Google IMA SDK Integration

### Step 1: Add IMA SDK Script
Add to your `index.html`:

```html
<script src="//imasdk.googleapis.com/js/sdkloader/ima3.js"></script>
```

### Step 2: Configure VAST Ad Tags
Use Google Ad Manager or other ad servers to generate VAST tags:

```jsx
<VideoAd 
  adTagUrl="https://pubads.g.doubleclick.net/gampad/ads?..."
  enableIMA={true}
  type="preroll"
/>
```

### Step 3: Handle IMA Events
The component automatically handles IMA initialization and ad loading.

## 📊 Video Ad Analytics

### Built-in Tracking
The component tracks:
- **Ad starts**: When video begins playing
- **Ad completions**: When video finishes
- **Skip events**: When users skip the ad
- **Close events**: When users close the ad

### Custom Analytics Integration
```jsx
const handleAdEvents = {
  onStart: () => {
    // Google Analytics
    gtag('event', 'video_ad_start', {
      event_category: 'advertisement',
      event_label: 'banner-ad'
    });
  },
  onComplete: () => {
    gtag('event', 'video_ad_complete', {
      event_category: 'advertisement', 
      event_label: 'banner-ad'
    });
  },
  onSkip: () => {
    gtag('event', 'video_ad_skip', {
      event_category: 'advertisement',
      event_label: 'banner-ad'
    });
  }
};
```

## 🎨 Customization Options

### Styling
```jsx
<VideoAd 
  className="my-custom-ad-class"
  style={{ 
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
  }}
/>
```

### Custom Controls Theme
The video controls are styled with Tailwind CSS and can be customized by modifying the component or adding custom CSS.

## 📱 Mobile Optimization

### Touch-Friendly Controls
- Larger touch targets for mobile devices
- Optimized button sizes and spacing
- Responsive text and icons

### Performance Considerations
- Videos auto-play muted on mobile (browser requirement)
- Optimized for 3G/4G connections
- Lazy loading for below-fold ads

## 🚨 Best Practices

### User Experience
1. **Always start muted** to comply with browser autoplay policies
2. **Provide skip option** after reasonable time (3-5 seconds)
3. **Keep ads short** (15-30 seconds maximum)
4. **Don't overload pages** with too many video ads

### Performance
1. **Optimize video files** for web delivery
2. **Use CDN** for video hosting
3. **Implement lazy loading** for ads below the fold
4. **Monitor loading times** and user engagement

### Accessibility
1. **Provide captions** when possible
2. **Ensure keyboard navigation** works
3. **Add proper ARIA labels**
4. **Test with screen readers**

## 🔗 Video Hosting Recommendations

### CDN Services
- **Amazon CloudFront**
- **Cloudflare Video**
- **Vimeo Pro/Business**
- **YouTube (for public content)**

### Self-Hosting
- Ensure sufficient bandwidth
- Use video optimization tools
- Implement proper caching headers

## 🎉 Ready for Production!

The video advertising system is now ready for:
- ✅ **Direct video file ads**
- ✅ **VAST/VPAID programmatic ads**
- ✅ **Google IMA SDK integration**
- ✅ **Mobile-responsive playback**
- ✅ **Analytics and tracking**
- ✅ **Professional user experience**

Replace the sample video URLs with your actual ad content and start monetizing your education platform with engaging video advertisements!
