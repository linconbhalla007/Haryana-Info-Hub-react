import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import GovernmentJobView from '../components/GovernmentJobView.jsx';
import GovernmentJobForm from '../components/GovernmentJobForm.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import ToastNotification from '../components/ToastNotification.jsx';
import {
  getGovernmentJobs,
  createGovernmentJob,
  updateGovernmentJob,
  deleteGovernmentJob,
} from '../services/adminApi.js';

function getShortJobId(id) {
  if (!id) return '-';
  return id.replace(/^job-?/i, '') || id;
}

function GovernmentJobsCMS() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modals & Action States
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const fetchJobs = async (pageToFetch = currentPage) => {
    setLoading(true);
    setError('');
    try {
      const res = await getGovernmentJobs(pageToFetch, ITEMS_PER_PAGE);
      setJobs(res.data || []);
      const pageMeta = res.pagination || {
        page: pageToFetch,
        limit: ITEMS_PER_PAGE,
        total: res.data?.length || 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      setPagination(pageMeta);
      setCurrentPage(pageMeta.page);
    } catch (err) {
      setError(err.message || 'Failed to load government jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  // Unique departments for filter dropdown
  const departmentOptions = useMemo(() => {
    const set = new Set();
    jobs.forEach((j) => {
      if (j.department) set.add(j.department);
    });
    return Array.from(set).sort();
  }, [jobs]);

  // Filtered & Searched Jobs
  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchesDept = selectedDepartment === 'ALL' || j.department === selectedDepartment;
      if (!matchesDept) return false;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && j.enabled !== false) ||
        (statusFilter === 'DISABLED' && j.enabled === false);
      if (!matchesStatus) return false;

      if (!q) return true;
      return (
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.titleHindi && j.titleHindi.toLowerCase().includes(q)) ||
        (j.department && j.department.toLowerCase().includes(q)) ||
        (j.departmentHindi && j.departmentHindi.toLowerCase().includes(q)) ||
        (j.description && j.description.toLowerCase().includes(q)) ||
        (j.id && j.id.toLowerCase().includes(q))
      );
    });
  }, [jobs, searchQuery, selectedDepartment, statusFilter]);

  // Reset to page 1 on search / filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, statusFilter]);

  // Handlers
  const handleOpenView = (job) => {
    setSelectedJob(job);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (job) => {
    setSelectedJob(job);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedJob(null);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenDelete = (job) => {
    setSelectedJob(job);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    setFormError('');
    try {
      if (selectedJob) {
        await updateGovernmentJob(selectedJob.id, formData);
        setToast({ type: 'success', message: 'Government Job updated successfully!' });
      } else {
        const res = await createGovernmentJob(formData);
        const newId = res?.data?.id || res?.id || res?.data?._id || '';
        setToast({
          type: 'success',
          message: `Government Job created successfully!${newId ? ` (ID: ${newId})` : ''}`,
        });
      }
      setIsFormOpen(false);
      fetchJobs(currentPage);
    } catch (err) {
      setFormError(err.message || 'Operation failed. Please check inputs.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJob) return;
    setActionLoading(true);
    try {
      await deleteGovernmentJob(selectedJob.id);
      setToast({ type: 'success', message: 'Government Job deleted successfully!' });
      setIsDeleteOpen(false);
      const targetPage = jobs.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
      } else {
        fetchJobs(targetPage);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete job.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Top Header */}
      <div className="admin-page-header">
        <div className="admin-page-header__info">
          <h1>Government Jobs</h1>
          <p>Manage Haryana Government Recruitment Notices &amp; Vacancies</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          + Add Job
        </button>
      </div>

      {/* Table Card */}
      <div className="admin-card">
        {/* Filters Toolbar */}
        <div className="admin-card__header">
          <div className="admin-filters-bar">
            {/* Search Box */}
            <div className="admin-search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="admin-input"
                placeholder="Search jobs, department, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <select
              className="admin-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="ALL">All Departments ({departmentOptions.length})</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="DISABLED">Disabled Only</option>
            </select>

            {(searchQuery || selectedDepartment !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('ALL');
                  setStatusFilter('ALL');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>

          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Showing page {pagination.page} of {pagination.totalPages} — {pagination.total} total jobs
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div className="admin-spinner" />
            <p style={{ marginTop: '12px', color: '#64748b', fontSize: '14px' }}>Fetching MongoDB records...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '40px 20px' }}>
            <div className="admin-alert-error" style={{ marginBottom: '16px' }}>
              <span>⚠️</span>
              <div>{error}</div>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => fetchJobs(currentPage)}>
              Retry Fetching
            </button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 4px' }}>
              No Government Jobs Found
            </h3>
            <p style={{ fontSize: '13.5px', margin: 0 }}>
              Try adjusting your search filters or click &quot;+ Add Job&quot; to create a new recruitment notice.
            </p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th style={{ width: '28%' }}>Title</th>
                    <th>Department</th>
                    <th>Vacancies</th>
                    <th>Last Date</th>
                    <th>Status</th>
                    <th>PDF</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                          {getShortJobId(job.id)}
                        </code>
                      </td>
                      <td className="admin-table__title">
                        <div style={{ fontWeight: 600 }}>{job.title}</div>
                        {job.titleHindi && job.titleHindi !== job.title && (
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            {job.titleHindi}
                          </div>
                        )}
                      </td>
                      <td>{job.departmentHindi || job.department}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '13.5px' }}>
                          {job.vacancies !== undefined ? job.vacancies.toLocaleString('en-IN') : '-'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#dc2626' }}>
                          {job.lastDate}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            background: job.enabled !== false ? '#dcfce7' : '#fee2e2',
                            color: job.enabled !== false ? '#15803d' : '#b91c1c',
                          }}
                        >
                          {job.enabled !== false ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        {job.pdf ? (
                          <a
                            href={job.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--saffron-600, #ea580c)', fontWeight: 600, fontSize: 13 }}
                          >
                            View ↗
                          </a>
                        ) : (
                          <span style={{ color: '#cbd5e1' }}>None</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-table__actions" style={{ justifyContent: 'flex-end' }}>
                          <button className="admin-btn-action" onClick={() => handleOpenView(job)} title="View">View</button>
                          <button className="admin-btn-action" onClick={() => handleOpenEdit(job)} title="Edit">Edit</button>
                          <button className="admin-btn-action admin-btn-action--danger" onClick={() => handleOpenDelete(job)} title="Delete">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="admin-table-pagination">
              <div className="admin-table-pagination__info">
                Showing page {pagination.page} of {pagination.totalPages} — {pagination.total} total jobs
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={!pagination.hasPreviousPage || loading}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  ← Previous
                </button>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', padding: '0 4px' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={!pagination.hasNextPage || loading}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Modal */}
      <GovernmentJobView
        isOpen={isViewOpen}
        job={selectedJob}
        onClose={() => setIsViewOpen(false)}
      />

      {/* Form Add / Edit Modal */}
      <GovernmentJobForm
        isOpen={isFormOpen}
        initialData={selectedJob}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
        loading={actionLoading}
        apiError={formError}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        order={selectedJob}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
        loading={actionLoading}
      />
    </AdminLayout>
  );
}

export default GovernmentJobsCMS;
