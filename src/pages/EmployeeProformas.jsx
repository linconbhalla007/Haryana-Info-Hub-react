import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getEmployeeProformas } from '../services/proformaService.js';
import EmptyState from '../components/EmptyState.jsx';
import ListToolbar from '../components/ListToolbar.jsx';
import Toast from '../components/Toast.jsx';
import { downloadProformaPdf } from '../utils/downloadHelper.js';
import './pages.css';
import './GovernmentOrders.css';

function EmployeeProformas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;

  const [proformas, setProformas] = useState([]);
  const [pagination, setPagination] = useState({
    page: currentPage,
    limit: 15,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [toast, setToast] = useState(null);
  const ITEMS_PER_PAGE = 15;

  const fetchProformas = (pageToFetch) => {
    setLoading(true);
    setProformas([]); // Do not display old page data while loading newly requested page
    setError(null);

    getEmployeeProformas(pageToFetch, ITEMS_PER_PAGE)
      .then((res) => {
        setProformas(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load employee proformas.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProformas(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (pagination.totalPages || 1)) return;
    setSearchParams({ page: newPage });
  };

  const filteredProformas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return proformas;
    return proformas.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.department && p.department.toLowerCase().includes(q)) ||
        (p.departmentHindi && p.departmentHindi.toLowerCase().includes(q)) ||
        (p.proformaNumber && p.proformaNumber.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [query, proformas]);

  const handleRetry = () => {
    fetchProformas(currentPage);
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1 className="page-header__title">सरकारी कर्मचारियों के उपयोगी प्रोफॉर्मा एवं फाइलें</h1>
          <p className="page-header__desc">
            कर्मचारियों के उपयोग हेतु आवश्यक प्रोफॉर्मा, आवेदन पत्र, मेडिकल, एलटीसी एवं पेंशन फाइलें यहां से देखें व डाउनलोड करें।
          </p>
        </div>
      </div>

      {loading ? (
        <div className="container page-body" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div
            className="loading-spinner"
            style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255, 124, 0, 0.1)',
              borderTopColor: 'var(--saffron-500)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px',
            }}
          ></div>
          <p style={{ color: 'var(--text-500)', fontSize: '15px', fontWeight: 600 }}>
            प्रोफॉर्मा लोड हो रहे हैं... / Loading proformas...
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : error ? (
        <div className="container page-body">
          <EmptyState
            title="डेटा लोड करने में त्रुटि / Error Loading Data"
            message="सर्वर से प्रोफॉर्मा लोड नहीं किए जा सके। कृपया इंटरनेट कनेक्शन की जांच करें या पुनः प्रयास करें।"
          />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn-outline" onClick={handleRetry}>
              पुनः प्रयास करें / Retry
            </button>
          </div>
        </div>
      ) : (
        <div className="container page-body">
          <ListToolbar
            value={query}
            onChange={setQuery}
            placeholder="प्रोफॉर्मा खोजें..."
            count={filteredProformas.length}
          />

          {/* Summary */}
          <div style={{ marginBottom: '16px', fontSize: '13.5px', color: 'var(--text-500)', fontWeight: 600 }}>
            Showing page {pagination.page} of {pagination.totalPages} — {pagination.total} total employee proformas
          </div>

          {filteredProformas.length === 0 ? (
            <EmptyState message="अलग शब्दों से खोजने का प्रयास करें।" />
          ) : (
            <>
              <div className="orders-stack-layout">
                {filteredProformas.map((proforma) => (
                  <div className="order-row-card" key={proforma.id}>
                    <div className="order-row-card__meta">
                      <span className="order-row-card__date">{proforma.date}</span>
                    </div>
                    <div className="order-row-card__content">
                      <h3 className="order-row-card__title">
                        <Link to={`/proforma-files/${proforma.id}`}>
                          {proforma.title}
                        </Link>
                      </h3>
                      <p className="order-row-card__desc">{proforma.description}</p>
                      <Link to={`/proforma-files/${proforma.id}`} className="order-row-card__readmore-hint">
                        पूरा प्रोफॉर्मा और PDF देखने के लिए यहाँ क्लिक करें →
                      </Link>
                    </div>
                    <div className="order-row-card__actions">
                      <Link
                        to={`/proforma-files/${proforma.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        विवरण देखें
                      </Link>
                      {proforma.pdf && (
                        <button
                          type="button"
                          disabled={downloadingId === proforma.id}
                          onClick={async (e) => {
                            e.preventDefault();
                            setDownloadingId(proforma.id);
                            setToast(null);
                            try {
                              await downloadProformaPdf(proforma.id, proforma.title, proforma.pdf);
                              setToast({ type: 'success', message: 'PDF सफलतापूर्वक डाउनलोड हो गई।' });
                            } catch (err) {
                              setToast({ type: 'error', message: err.message || 'डाउनलोड विफल रहा।' });
                            } finally {
                              setDownloadingId(null);
                            }
                          }}
                          className="btn btn-green btn-sm"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: downloadingId === proforma.id ? 'wait' : 'pointer'
                          }}
                        >
                          {downloadingId === proforma.id && (
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
                          <span>{downloadingId === proforma.id ? 'डाउनलोड हो रहा है...' : 'PDF डाउनलोड करें'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Server-Side Pagination Controls */}
              <div className="pagination" style={{ marginTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <button
                  className="pagination__btn"
                  disabled={!pagination.hasPreviousPage || loading}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  ← Previous
                </button>

                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy-800)' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  className="pagination__btn"
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}

export default EmployeeProformas;
