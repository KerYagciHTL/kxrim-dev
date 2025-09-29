import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, Calendar, TrendingUp } from 'lucide-react';
import { getAnalyticsSummary } from '../utils/analytics';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyticsDashboard({ isOpen, onClose }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<{
    totalPageViews: number;
    uniquePages: number;
    topPages: Array<{ page: string; views: number }>;
    lastVisit: string;
    firstVisit: string;
  }>({
    totalPageViews: 0,
    uniquePages: 0,
    topPages: [],
    lastVisit: '',
    firstVisit: ''
  });

  useEffect(() => {
    if (isOpen) {
      const data = getAnalyticsSummary();
      setAnalytics(data);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-2xl m-4 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Analytics Dashboard
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Total Page Views</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.totalPageViews}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Unique Pages</h3>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{analytics.uniquePages}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Visit History</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">First Visit:</span>
              <span className="text-gray-900 dark:text-white">{formatDate(analytics.firstVisit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Visit:</span>
              <span className="text-gray-900 dark:text-white">{formatDate(analytics.lastVisit)}</span>
            </div>
          </div>
        </div>

        {analytics.topPages.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Top Pages</h3>
            <div className="space-y-2">
              {analytics.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold">
                      {index + 1}
                    </div>
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {page.page === '/' ? 'Homepage' : page.page}
                    </span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    {page.views} view{page.views !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> This dashboard shows local analytics data stored in your browser. 
            For comprehensive analytics across all visitors, check your GoatCounter dashboard at{' '}
            <a 
              href="https://kxrim.goatcounter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              kxrim.goatcounter.com
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}