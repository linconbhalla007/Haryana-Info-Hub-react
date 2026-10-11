import React, { useEffect, useState } from 'react';
import { downloadOrderPdf } from '../utils/downloadHelper.js';
import Toast from './Toast.jsx';
import './PDFViewer.css';

/**
 * Renders a PDF inline (desktop) using <iframe>, since browser PDF
 * rendering is inconsistent on mobile — there we show View/Download
 * buttons instead. Always shows both actions regardless of screen size.
 */
function PDFViewer({ src, title, orderId }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (downloading || (!src && !orderId)) return;
    setDownloading(true);
    setToast(null);

    try {
      await downloadOrderPdf(orderId, title, src);
      setToast({ type: 'success', message: 'PDF सफलतापूर्वक डाउनलोड हो गई।' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'PDF डाउनलोड करने में समस्या आई।' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="pdf-viewer">
      {!isMobile && src && (
        <div className="pdf-viewer__frame-wrap">
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(src)}&embedded=true`}
            title={title}
            className="pdf-viewer__frame"
          />
        </div>
      )}

      {isMobile && (
        <div className="pdf-viewer__mobile-note">
          <p>मोबाइल डिवाइस पर PDF सीधा ब्राउज़र में सही तरह से नहीं खुल सकता।</p>
        </div>
      )}

      <div className="pdf-viewer__actions">
        {src && (
          <a href={src} target="_blank" rel="noreferrer" className="btn btn-outline">
            PDF खोलें
          </a>
        )}
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="btn btn-green"
          style={{
            cursor: downloading ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {downloading && (
            <span
              style={{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#ffffff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}
            />
          )}
          <span>{downloading ? 'डाउनलोड हो रहा है...' : 'PDF डाउनलोड करें'}</span>
        </button>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default PDFViewer;
