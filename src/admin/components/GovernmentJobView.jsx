import React from 'react';

function GovernmentJobView({ isOpen, job, onClose }) {
  if (!isOpen || !job) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">Government Job Details</h3>
          <button className="admin-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="admin-modal__body">
          <div style={{ marginBottom: '24px' }}>
            <span className="eyebrow" style={{ fontSize: '11px' }}>Recruitment Notice</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#151821', margin: '4px 0 0' }}>
              {job.title}
            </h2>
            {job.titleHindi && job.titleHindi !== job.title && (
              <p style={{ fontSize: '15px', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>
                {job.titleHindi}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              background: '#f8fafc',
              padding: '16px 20px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              marginBottom: '24px',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>JOB ID</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{job.id}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>DEPARTMENT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                {job.departmentHindi || job.department}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>TOTAL VACANCIES</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#16a34a' }}>
                {job.vacancies !== undefined ? job.vacancies.toLocaleString('en-IN') : 'N/A'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>PUBLISHED DATE</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{job.publishedDate}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>LAST DATE TO APPLY</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>{job.lastDate}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>STATUS</div>
              <div style={{ marginTop: '2px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: job.enabled !== false ? '#dcfce7' : '#fee2e2',
                    color: job.enabled !== false ? '#15803d' : '#b91c1c',
                  }}
                >
                  {job.enabled !== false ? 'Active' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 8px', color: '#334155' }}>
              Job Description &amp; Details
            </h4>
            <p
              style={{
                fontSize: '14.5px',
                lineHeight: 1.6,
                color: '#334155',
                background: '#ffffff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                margin: 0,
                whiteSpace: 'pre-line',
              }}
            >
              {job.description || 'No description provided.'}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 8px', color: '#334155' }}>
              Attached Recruitment Document (PDF)
            </h4>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                gap: '12px',
              }}
            >
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13.5px', color: '#64748b' }}>
                📄 {job.pdf || 'No PDF URL linked'}
              </div>
              {job.pdf && (
                <a
                  href={job.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-green btn-sm"
                  style={{ textDecoration: 'none', flexShrink: 0 }}
                >
                  View PDF ↗
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="admin-modal__footer">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default GovernmentJobView;
