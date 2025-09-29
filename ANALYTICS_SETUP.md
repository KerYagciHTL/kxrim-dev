# Analytics Setup for kxrim.dev

## Overview
Your site now has visitor statistics tracking using a dual approach:
1. **Local Analytics** - Tracks data in the browser's localStorage (visible only to you)
2. **GoatCounter** - Free, privacy-friendly analytics service (comprehensive tracking)

## What's Already Implemented

### ✅ Local Tracking
- Tracks page views in localStorage
- Works offline and doesn't require external services
- Includes 404 page tracking
- You can view stats using the analytics dashboard component

### ✅ Code Integration
- Analytics utility functions in `src/utils/analytics.ts`
- Integrated into main App component
- Added to 404.html page
- Created optional AnalyticsDashboard component

## Setting Up GoatCounter (Recommended)

### 1. Create GoatCounter Account
1. Go to [goatcounter.com](https://www.goatcounter.com)
2. Sign up for a free account
3. Choose subdomain: `kxrim` (so your dashboard will be at `kxrim.goatcounter.com`)

### 2. Verify Configuration
The tracking code is already added to your site:
```html
<script data-goatcounter="https://kxrim.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
```

### 3. Deploy and Test
1. Build and deploy your site to GitHub Pages:
   ```bash
   npm run build
   npm run deploy
   ```
2. Visit your deployed site
3. Check your GoatCounter dashboard at `https://kxrim.goatcounter.com`

## Adding the Analytics Dashboard (Optional)

If you want to show analytics on your site, you can add the dashboard component:

1. Import in your App.tsx:
   ```tsx
   import AnalyticsDashboard from './components/AnalyticsDashboard';
   ```

2. Add state for showing/hiding:
   ```tsx
   const [showAnalytics, setShowAnalytics] = useState(false);
   ```

3. Add a button to toggle it:
   ```tsx
   <button onClick={() => setShowAnalytics(true)}>
     Show Analytics
   </button>
   ```

4. Add the component:
   ```tsx
   <AnalyticsDashboard 
     isOpen={showAnalytics} 
     onClose={() => setShowAnalytics(false)} 
   />
   ```

## What Gets Tracked

### Pages Tracked:
- Homepage (`/`)
- 404 page (`/404`)
- Any other pages you add to your site

### Data Collected:
- Page views per page
- Unique visitors (localStorage only)
- Visit timestamps
- Referrer information (GoatCounter only)
- Browser/device info (GoatCounter only, anonymized)

## Privacy-First Approach
- GoatCounter doesn't use cookies
- No personal data is collected
- GDPR compliant
- Visitor IP addresses are not stored
- No tracking across websites

## Benefits for GitHub Pages
- Works perfectly with static hosting
- No server-side requirements
- Free tier includes up to 100k pageviews/month
- Real-time statistics
- Export data anytime

## Monitoring Your Stats

### GoatCounter Dashboard
- Real-time visitor count
- Page popularity
- Referrer sources
- Browser/OS statistics
- Geographic data (country-level)

### Local Analytics (in browser console)
```javascript
// View your local analytics data
console.log(JSON.parse(localStorage.getItem('kxrim_analytics')));
```

## Next Steps
1. Create your GoatCounter account with subdomain `kxrim`
2. Deploy your site
3. Start monitoring your visitor statistics!

Your site will automatically start collecting analytics data once deployed.