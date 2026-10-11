import React, { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestNotifications } from '../services/notificationService.js';
import './LatestUpdatesBar.css';

export function LatestUpdatesBar({ initialItems = null }) {
  const [rawItems, setRawItems] = useState(initialItems || []);
  const [loading, setLoading] = useState(initialItems === null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tickerKey, setTickerKey] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(600);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const navigate = useNavigate();
  const viewportRef = useRef(null);
  const itemRef = useRef(null);

  // Fetch notifications on mount if not provided as prop
  useEffect(() => {
    if (initialItems !== null) return;
    let isMounted = true;
    getLatestNotifications()
      .then((data) => {
        if (isMounted) {
          setRawItems(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRawItems([]);
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [initialItems]);

  // Check prefers-reduced-motion media query for accessibility
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Filter active/enabled notifications and sort by newest first
  const activeItems = useMemo(() => {
    if (!Array.isArray(rawItems)) return [];
    return rawItems
      .filter((item) => item && item.enabled !== false && item.title)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [rawItems]);

  // Keep currentIndex bounded if items list changes
  useEffect(() => {
    if (activeItems.length > 0 && currentIndex >= activeItems.length) {
      setCurrentIndex(0);
      setTickerKey((k) => k + 1);
    }
  }, [activeItems.length, currentIndex]);

  // Measure viewport container width dynamically on mount and resize
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => {
      if (el) {
        setViewportWidth(el.offsetWidth || 600);
      }
    };
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  const currentItem = activeItems[currentIndex] || activeItems[0];

  // Calculate approximate duration based on content length & viewport width
  // Speed is kept constant at ~65px/sec for comfortable, clear reading
  const dynamicDuration = useMemo(() => {
    if (!currentItem) return 14;
    const titleLen = currentItem.title?.length || 0;
    const descLen = currentItem.description?.length || 0;
    const estimatedTextWidth = Math.max(250, titleLen * 9.5 + descLen * 8.5 + 40);
    const totalDistance = (viewportWidth || 600) + estimatedTextWidth + 48;
    return Math.max(9, Math.round((totalDistance / 65) * 10) / 10);
  }, [currentItem, viewportWidth]);

  // Refine exact duration and variables on DOM layout before paint
  useLayoutEffect(() => {
    if (!itemRef.current || !viewportRef.current) return;
    const vWidth = viewportRef.current.offsetWidth || viewportWidth || 600;
    const tWidth = itemRef.current.scrollWidth || 300;
    const exactDistance = vWidth + tWidth + 48;
    const exactDuration = Math.max(9, Math.round((exactDistance / 65) * 10) / 10);

    itemRef.current.style.setProperty('--viewport-width', `${vWidth}px`);
    itemRef.current.style.setProperty('--ticker-duration', `${exactDuration}s`);
  }, [tickerKey, currentIndex, viewportWidth]);

  // Handle animation end: smoothly advance to the next notification
  const handleAnimationEnd = () => {
    if (activeItems.length <= 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    setTickerKey((k) => k + 1);
  };

  // For prefers-reduced-motion users, fall back to stationary timer rotation
  useEffect(() => {
    if (!prefersReducedMotion || activeItems.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
      setTickerKey((k) => k + 1);
    }, 6000);

    return () => clearInterval(timer);
  }, [prefersReducedMotion, activeItems.length, isPaused]);

  // If loading or no active notifications exist, hide completely
  if (loading || activeItems.length === 0) {
    return null;
  }

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    setTickerKey((k) => k + 1);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
    setTickerKey((k) => k + 1);
  };

  const handleItemClick = () => {
    if (!currentItem || !currentItem.link) return;

    if (currentItem.link.startsWith('/')) {
      navigate(currentItem.link);
    } else if (currentItem.link.startsWith('http')) {
      window.open(currentItem.link, '_blank', 'noopener,noreferrer');
    }
  };

  // Helper to check if record is recent (within last 7 days)
  const isRecent = (() => {
    if (!currentItem.createdAt) return currentIndex === 0;
    const itemDate = new Date(currentItem.createdAt);
    const now = new Date();
    const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  })();

  // Helper to format date string
  const formattedDate = currentItem.createdAt
    ? new Date(currentItem.createdAt).toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div className="latest-updates-wrapper">
      <div
        className="latest-updates-bar"
        role="region"
        aria-label="Latest Updates Notification"
      >
        {/* Left Badge & Bell Icon (Stationary) */}
        <div className="latest-updates-head">
          <div className="latest-updates-bell" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>

          <span className="latest-updates-badge">
            ताज़ा अपडेट
          </span>

          {isRecent && <span className="latest-updates-new-tag">नया</span>}
        </div>

        {/* Center Area: Continuous Horizontal Marquee Ticker Viewport */}
        <div
          className="latest-updates-body"
          ref={viewportRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button
            key={tickerKey}
            ref={itemRef}
            type="button"
            className="latest-updates-item"
            onClick={handleItemClick}
            onAnimationEnd={handleAnimationEnd}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            disabled={!currentItem.link}
            title={currentItem.link ? `खोलें: ${currentItem.title}` : currentItem.title}
            style={{
              '--viewport-width': `${viewportWidth}px`,
              '--ticker-duration': `${dynamicDuration}s`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            <span className="latest-updates-title">{currentItem.title}</span>
            {currentItem.description && (
              <span className="latest-updates-desc">— {currentItem.description}</span>
            )}
          </button>
        </div>

        {/* Date & Navigation Controls (Stationary) */}
        <div className="latest-updates-actions">
          {formattedDate && (
            <span className="latest-updates-date">{formattedDate}</span>
          )}

          {activeItems.length > 1 && (
            <>
              <span className="latest-updates-counter">
                {currentIndex + 1}/{activeItems.length}
              </span>
              <button
                type="button"
                className="latest-updates-nav-btn"
                onClick={handlePrev}
                aria-label="पिछला अपडेट"
                title="पिछला"
              >
                ‹
              </button>
              <button
                type="button"
                className="latest-updates-nav-btn"
                onClick={handleNext}
                aria-label="अगला अपडेट"
                title="अगला"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LatestUpdatesBar;
