import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById } from '../services/jobService.js';
import { downloadJobPdf } from '../utils/downloadHelper.js';
import Breadcrumb from '../components/Breadcrumb.jsx';
import PDFViewer from '../components/PDFViewer.jsx';
import EmptyState from '../components/EmptyState.jsx';
import './pages.css';

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getJobById(id)
      .then((data) => {
        if (active) {
          if (!data || data.success === false) {
            setError('भर्ती अधिसूचना नहीं मिली / Job Notification Not Found');
          } else {
            setJob(data);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Failed to load job details');
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
    getJobById(id)
      .then((data) => {
        if (!data || data.success === false) {
          setError('भर्ती अधिसूचना नहीं मिली / Job Notification Not Found');
        } else {
          setJob(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load job details');
        setLoading(false);
      });
  };

  if (loading) {
    return (
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
          भर्ती विवरण लोड हो रहा है... / Loading job details...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container page-body">
        <EmptyState
          title="भर्ती नहीं मिली / Job Not Found"
          message="यह भर्ती अधिसूचना उपलब्ध नहीं है, हटा दी गई है या सर्वर से लोड नहीं की जा सकी।"
        />
        <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Link to="/jobs" className="btn btn-outline">
            सभी नौकरियां देखें / View All Jobs
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

  const jobTitleDisplay = job.titleHindi || job.title;

  return (
    <>
      <div className="detail-hero">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'मुख्य पृष्ठ', to: '/' },
              { label: 'सरकारी भर्तियाँ', to: '/jobs' },
              { label: jobTitleDisplay },
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
              सरकारी भर्ती / Government Job
            </span>
            {job.enabled === false && (
              <span
                style={{
                  background: '#fee2e2',
                  color: '#b91c1c',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                Inactive / Archive
              </span>
            )}
          </div>
          <h1 className="detail-hero__title">{jobTitleDisplay}</h1>
          {job.titleHindi && job.titleHindi !== job.title && (
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.85)', marginTop: '4px' }}>
              {job.title}
            </p>
          )}
        </div>
      </div>

      <div className="container page-body">
        <div className="detail-meta">
          <div className="detail-meta__item">
            <span className="detail-meta__label">विभाग / Department</span>
            <span className="detail-meta__value">{job.departmentHindi || job.department}</span>
          </div>
          <div className="detail-meta__item">
            <span className="detail-meta__label">कुल रिक्तियां / Vacancies</span>
            <span className="detail-meta__value" style={{ color: '#16a34a', fontWeight: 800 }}>
              {job.vacancies !== undefined ? job.vacancies.toLocaleString('en-IN') : '-'}
            </span>
          </div>
          <div className="detail-meta__item">
            <span className="detail-meta__label">प्रकाशित तिथि / Published</span>
            <span className="detail-meta__value">{job.publishedDate || '-'}</span>
          </div>
          <div className="detail-meta__item">
            <span className="detail-meta__label">अंतिम तिथि / Last Date</span>
            <span className="detail-meta__value" style={{ color: '#dc2626', fontWeight: 700 }}>
              {job.lastDate || '-'}
            </span>
          </div>
          <div className="detail-meta__item">
            <span className="detail-meta__label">Job ID</span>
            <span className="detail-meta__value">{job.id || '-'}</span>
          </div>
        </div>

        <div className="detail-two-col">
          <div className="detail-section">
            <h2>भर्ती विवरण एवं पात्रता (Details &amp; Eligibility)</h2>
            <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
              {job.description || 'कोई विवरण उपलब्ध नहीं है।'}
            </p>
          </div>

          <div className="detail-section">
            <h2>आधिकारिक अधिसूचना (Official PDF)</h2>
            <PDFViewer
              src={job.pdf}
              title={jobTitleDisplay}
              onDownload={() => downloadJobPdf(job.id, jobTitleDisplay, job.pdf)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default JobDetail;
