'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

interface WebVitalsProps {
  reportTarget?: 'console' | 'analytics' | 'both';
}

export function WebVitals({ reportTarget = 'console' }: WebVitalsProps): null {
  useEffect(() => {
    // Only run in production or when explicitly enabled in development
    const shouldReport =
      process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS === 'true';

    if (!shouldReport) return;

    const reportMetric = (metric: Metric): void => {
      const data = {
        name: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        rating: metric.rating,
        timestamp: Date.now(),
        url: window.location.href,
      };

      // Log to console in development or when console reporting is enabled
      if (reportTarget === 'console' || reportTarget === 'both') {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(`[Web Vitals] ${metric.name}:`, data);
        }
      }

      // Send to analytics service (can be customized)
      if (reportTarget === 'analytics' || reportTarget === 'both') {
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', metric.name, {
            custom_parameter_1: metric.value,
            custom_parameter_2: metric.id,
          });
        }

        // Example: Send to a custom analytics endpoint
        if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
          fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }).catch((error) => {
            console.warn('Failed to send Web Vitals to analytics:', error);
          });
        }
      }
    };

    // Measure all Web Vitals
    onCLS(reportMetric);
    onINP(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
  }, [reportTarget]);

  return null;
}

// Hook for programmatic access to Web Vitals
export function useWebVitals(callback?: (metric: Metric) => void): void {
  useEffect(() => {
    if (!callback) return;

    onCLS(callback);
    onINP(callback);
    onFCP(callback);
    onLCP(callback);
    onTTFB(callback);
  }, [callback]);
}
