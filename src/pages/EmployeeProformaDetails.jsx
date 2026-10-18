import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEmployeeProformaById } from '../services/proformaService.js';
import { downloadProformaPdf } from '../utils/downloadHelper.js';
import Breadcrumb from '../components/Breadcrumb.jsx';
import PDFViewer from '../components/PDFViewer.jsx';
import EmptyState from '../components/EmptyState.jsx';
import './pages.css';

function EmployeeProformaDetails() {
  const { id } = useParams();
  const [proforma, setProforma] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getEmployeeProformaById(id)
      .then((data) => {
        if (active) {
          if (!data || data.success === false) {
            setError("प्रोफॉर्मा नहीं मिला / Proforma Not Found");
          } else {
            setProforma(data);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Failed to load proforma details");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    getEmployeeProformaById(id)
      .then((data) => {
        if (!data || data.success === false) {
          setError("प्रोफॉर्मा नहीं मिला / Proforma Not Found");
        } else {
          setProforma(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load proforma details");
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="container page-body" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="loading-spinner" style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255, 124, 0, 0.1)',
          borderTopColor: 'var(--saffron-500)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }}></div>
        <p style={{ color: 'var(--text-500)', fontSize: '15px', fontWeight: 600 }}>विवरण लोड हो रहा है... / Loading details...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !proforma) {
    return (
      <div className="container page-body">
        <EmptyState
          title="प्रोफॉर्मा नहीं मिला / Proforma Not Found"
          message="यह प्रोफॉर्मा उपलब्ध नहीं है, हटा दिया गया है या सर्वर से लोड नहीं किया जा सका।"
        />
        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/proforma-files" className="btn btn-outline">
            सभी प्रोफॉर्मा देखें / View All
          </Link>
          {error && (
            <button className="btn btn-outline" onClick={handleRetry}>
              पुनः प्रयास करें / Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const orderTypeLabel = proforma.orderType === 'proforma_order' ? 'Employee Proforma' : 'Order';

  return (
    <>
      <div className="detail-hero">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'मुख्य पृष्ठ', to: '/' },
              { label: 'कर्मचारी प्रोफॉर्मा एवं फाइलें', to: '/proforma-files' },
              { label: proforma.title },
            ]}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
            <span
              className="tag tag-saffron"
              style={{
                fontSize: '11.5px',
                padding: '3px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                letterSpacing: '0.03em',
              }}
            >
              {orderTypeLabel}
            </span>
          </div>
          <h1 className="detail-hero__title">{proforma.title}</h1>
        </div>
      </div>

      <div className="container page-body">
        <div className="detail-meta">
          <div className="detail-meta__item">
            <span className="detail-meta__label">Proforma ID</span>
            <span className="detail-meta__value">{proforma.id || '-'}</span>
          </div>
          {proforma.proformaNumber && (
            <div className="detail-meta__item">
              <span className="detail-meta__label">Proforma Number</span>
              <span className="detail-meta__value">{proforma.proformaNumber}</span>
            </div>
          )}
          <div className="detail-meta__item">
            <span className="detail-meta__label">दिनांक / Date</span>
            <span className="detail-meta__value">{proforma.date || '-'}</span>
          </div>
        </div>

        <div className="detail-two-col">
          <div className="detail-section">
            <h2>विवरण</h2>
            <p>{proforma.description || 'कोई विवरण उपलब्ध नहीं है।'}</p>
          </div>

          <div className="detail-section">
            <h2>PDF दस्तावेज़</h2>
            <PDFViewer
              src={proforma.pdf}
              title={proforma.title}
              proformaId={proforma.id}
              onDownload={() => downloadProformaPdf(proforma.id, proforma.title, proforma.pdf)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeProformaDetails;
