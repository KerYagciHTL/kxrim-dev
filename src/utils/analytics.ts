interface AnalyticsData {
  pageViews: Record<string, number>;
  uniqueVisitors: number;
  lastVisit: string;
  firstVisit: string;
}

const ANALYTICS_KEY = 'kxrim_analytics';
const VISITOR_KEY = 'kxrim_visitor_id';

function generateVisitorId(): string {
  return 'visitor_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Get or create visitor ID
function getVisitorId(): string {
  let visitorId = localStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = generateVisitorId();
    localStorage.setItem(VISITOR_KEY, visitorId);
  }
  return visitorId;
}

function getAnalyticsData(): AnalyticsData {
  const stored = localStorage.getItem(ANALYTICS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse analytics data:', e);
    }
  }
  
  return {
    pageViews: {},
    uniqueVisitors: 0,
    lastVisit: new Date().toISOString(),
    firstVisit: new Date().toISOString()
  };
}

function saveAnalyticsData(data: AnalyticsData): void {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save analytics data:', e);
  }
}

// Track a page view
export function trackPageView(pageName: string = window.location.pathname): void {
  try {
    getVisitorId();
    
    const data = getAnalyticsData();
    
    data.pageViews[pageName] = (data.pageViews[pageName] || 0) + 1;
    data.lastVisit = new Date().toISOString();
    
    saveAnalyticsData(data);
    
    trackWithGoatCounter(pageName);
    
    console.log(`Page view tracked: ${pageName}`);
  } catch (error) {
    console.warn('Failed to track page view:', error);
  }
}

function trackWithGoatCounter(path: string): void {
  try {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({
        path: path,
        title: document.title || 'kxrim.dev',
        event: true
      });
    }
  } catch (error) {
    console.warn('GoatCounter tracking failed:', error);
  }
}

export function getAnalyticsSummary(): {
  totalPageViews: number;
  uniquePages: number;
  topPages: Array<{ page: string; views: number }>;
  lastVisit: string;
  firstVisit: string;
} {
  const data = getAnalyticsData();
  
  const totalPageViews = Object.values(data.pageViews).reduce((sum, views) => sum + views, 0);
  const uniquePages = Object.keys(data.pageViews).length;
  
  const topPages = Object.entries(data.pageViews)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  return {
    totalPageViews,
    uniquePages,
    topPages,
    lastVisit: data.lastVisit,
    firstVisit: data.firstVisit
  };
}

export function initializeAnalytics(): void {
  trackPageView();
  
  if (!window.goatcounter && !document.querySelector('script[data-goatcounter]')) {
    const script = document.createElement('script');
    script.setAttribute('data-goatcounter', 'https://kxrim.goatcounter.com/count');
    script.src = '//gc.zgo.at/count.js';
    script.async = true;
    document.head.appendChild(script);
  }
}

declare global {
  interface Window {
    goatcounter?: {
      count: (vars?: { path?: string; title?: string; event?: boolean }) => void;
    };
  }
}

export { getVisitorId, getAnalyticsData };