import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestNotifications } from '../services/notificationService.js';
import './LatestUpdatesBar.css';

export function LatestUpdatesBar({ initialItems = null }) {
  const [rawItems, setRawItems] = useState(initialItems || []);
  const [loading, setLoading] = useState(initialItems === null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

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

  // Filter active/enabled notifications and sort by newest first
  const activeItems = useMemo(() => {
    if (!Array.isArray(rawItems)) return [];
    return rawItems
      .filter((item) => item && item.enabled !== false && item.title)
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [rawItems]);

  // Auto-rotation timer for multiple notification items
  useEffect(() => {
    if (activeItems.length <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeItems.length, isPaused]);

  // If loading or no active notifications exist, hide completely
  if (loading || activeItems.length === 0) {
    return null;
  }

  const currentItem = activeItems[currentIndex] || activeItems[0];

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
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
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        role="region"
        aria-label="Latest Updates Notification"
      >
        {/* Left Badge & Bell Icon */}
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

        {/* Main Content Item */}
        <div className="latest-updates-body">
          <button
            type="button"
            className="latest-updates-item"
            onClick={handleItemClick}
            disabled={!currentItem.link}
            title={currentItem.link ? `खोलें: ${currentItem.title}` : currentItem.title}
          >
            <span className="latest-updates-title">{currentItem.title}</span>
            {currentItem.description && (
              <span className="latest-updates-desc">— {currentItem.description}</span>
            )}
          </button>
        </div>

        {/* Date & Navigation Controls */}
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
