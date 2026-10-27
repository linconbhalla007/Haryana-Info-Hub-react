import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getJobs } from '../services/jobService.js';
import { downloadJobPdf } from '../utils/downloadHelper.js';
import EmptyState from '../components/EmptyState.jsx';
import ListToolbar from '../components/ListToolbar.jsx';
import Toast from '../components/Toast.jsx';
import './pages.css';
import './Jobs.css';

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;

  const [jobsList, setJobsList] = useState([]);
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

  const fetchJobsList = (pageToFetch) => {
    setLoading(true);
    setJobsList([]);
    setError(null);

    getJobs(pageToFetch, ITEMS_PER_PAGE)
      .then((res) => {
        setJobsList(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load government jobs.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJobsList(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > (pagination.totalPages || 1)) return;
    setSearchParams({ page: newPage });
  };

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobsList;
    return jobsList.filter(
      (j) =>
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.titleHindi && j.titleHindi.toLowerCase().includes(q)) ||
        (j.department && j.department.toLowerCase().includes(q)) ||
        (j.departmentHindi && j.departmentHindi.toLowerCase().includes(q)) ||
        (j.description && j.description.toLowerCase().includes(q))
    );
  }, [query, jobsList]);

  const handleDownload = async (e, job) => {
    e.preventDefault();
    e.stopPropagation();

    if (downloadingId) return;

    setDownloadingId(job.id);
    try {
      await downloadJobPdf(job.id, job.titleHindi || job.title, job.pdf);
      setToast({
        type: 'success',
        message: `अधिसूचना सफलतापूर्वक डाउनलोड हो गई / PDF Downloaded`,
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'डाउनलोड विफल रहा / Download Failed',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleRetry = () => {
    fetchJobsList(currentPage);
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <span className="eyebrow">भर्ती एवं रोजगार</span>
          <h1 className="page-header__title">सरकारी भर्तियाँ एवं रोजगार जानकारी</h1>
          <p className="page-header__desc">
            हरियाणा सरकार के विभिन्न विभागों में जारी आधिकारिक भर्ती अधिसूचनाएं, परीक्षा अपडेट एवं रिक्तियों का विवरण।
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
            भर्तियाँ लोड हो रही हैं... / Loading jobs...
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
            message="सर्वर से नवीनतम सरकारी भर्तियाँ लोड नहीं की जा सकीं। कृपया इंटरनेट कनेक्शन की जांच करें या पुनः प्रयास करें।"
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
            placeholder="नौकरी, विभाग या पद खोजें..."
            count={filteredJobs.length}
          />

          {/* Small Summary */}
          <div style={{ marginBottom: '16px', fontSize: '13.5px', color: 'var(--text-500)', fontWeight: 600 }}>
            Showing page {pagination.page} of {pagination.totalPages} — {pagination.total} total recruitment notices
          </div>

          {filteredJobs.length === 0 ? (
            <EmptyState message="अलग शब्दों से खोजने का प्रयास करें।" />
          ) : (
            <>
              <div className="jobs-stack-layout">
                {filteredJobs.map((job) => (
                  <div className="job-row-card" key={job.id}>
                    <div className="job-row-card__meta">
                      <span className="tag tag-saffron">
                        {job.departmentHindi || job.department}
                      </span>
                      <div className="job-row-card__meta-details">
                        {job.publishedDate && (
                          <span className="job-row-card__date">
                            प्रकाशित: {job.publishedDate}
                          </span>
                        )}
                        {job.lastDate && (
                          <span className="job-row-card__date" style={{ fontWeight: 700, color: '#dc2626' }}>
                            अंतिम तिथि: {job.lastDate}
                          </span>
                        )}
                        {job.vacancies !== undefined && (
                          <span className="job-row-card__vacancies">
                            रिक्तियां: <strong>{job.vacancies.toLocaleString('en-IN')}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="job-row-card__content">
                      <h3 className="job-row-card__title">
                        <Link to={`/jobs/${job.id}`}>
                          {job.titleHindi || job.title}
                        </Link>
                      </h3>
                      {job.titleHindi && job.titleHindi !== job.title && (
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 6px 0', fontWeight: 500 }}>
                          {job.title}
                        </p>
                      )}
                      <p className="job-row-card__desc">{job.description}</p>
                    </div>
                    <div className="job-row-card__actions">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        विवरण देखें
                      </Link>
                      {job.pdf && (
                        <button
                          type="button"
                          className="btn btn-green btn-sm"
                          onClick={(e) => handleDownload(e, job)}
                          disabled={downloadingId === job.id}
                        >
                          {downloadingId === job.id ? 'डाउनलोड हो रहा है...' : 'अधिसूचना डाउनलोड'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Server-Side Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="pagination" style={{ marginTop: '32px' }}>
                  <button
                    className="pagination__btn"
                    disabled={!pagination.hasPreviousPage || loading}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    « पिछला / Previous
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination__btn ${currentPage === page ? 'pagination__btn--active' : ''}`}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="pagination__btn"
                    disabled={!pagination.hasNextPage || loading}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    अगला / Next »
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default Jobs;
