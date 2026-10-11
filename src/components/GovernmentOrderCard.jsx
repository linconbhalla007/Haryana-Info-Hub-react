import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { downloadOrderPdf } from '../utils/downloadHelper.js';
import Toast from './Toast.jsx';

function GovernmentOrderCard({ order }) {
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (downloading) return;
    setDownloading(true);
    setToast(null);

    try {
      await downloadOrderPdf(order.id, order.title, order.pdf);
      setToast({ type: 'success', message: 'PDF सफलतापूर्वक डाउनलोड हो गई।' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'डाउनलोड विफल रहा।' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="list-card">
      <div className="list-card__head">
        <span className="tag tag-green">{order.departmentHindi || order.department}</span>
        <span className="list-card__date">{order.date}</span>
      </div>
      <h3 className="list-card__title">
        <Link to={`/government-orders/${order.id}`}>{order.title}</Link>
      </h3>
      <p className="list-card__desc">{order.description}</p>
      <div className="list-card__footer">
        <Link to={`/government-orders/${order.id}`} className="btn btn-outline btn-sm">
          विवरण देखें
        </Link>
        {order.pdf && (
          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="btn btn-green btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: downloading ? 'wait' : 'pointer'
            }}
          >
            {downloading && (
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}
              />
            )}
            <span>{downloading ? 'डाउनलोड हो रहा है...' : 'PDF डाउनलोड करें'}</span>
          </button>
        )}
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default GovernmentOrderCard;
