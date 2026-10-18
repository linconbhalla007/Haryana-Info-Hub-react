import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import EmployeeProformaView from '../components/EmployeeProformaView.jsx';
import EmployeeProformaForm from '../components/EmployeeProformaForm.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import ToastNotification from '../components/ToastNotification.jsx';
import {
  getEmployeeProformas,
  createEmployeeProforma,
  updateEmployeeProforma,
  deleteEmployeeProforma,
} from '../services/adminApi.js';

function getShortProformaId(id) {
  if (!id) return '-';
  return id.replace(/^proforma-?/i, '') || id;
}

function EmployeeProformasCMS() {
  const [proformas, setProformas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modals & Action States
  const [selectedProforma, setSelectedProforma] = useState(null);
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

  const fetchProformas = async (pageToFetch = currentPage) => {
    setLoading(true);
    setError('');
    setProformas([]);
    try {
      const res = await getEmployeeProformas(pageToFetch, ITEMS_PER_PAGE);
      setProformas(res.data || []);
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
      setError(err.message || 'Failed to load employee proformas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProformas(currentPage);
  }, [currentPage]);

  // Unique departments for filter dropdown
  const departmentOptions = useMemo(() => {
    const set = new Set();
    proformas.forEach((p) => { if (p.department) set.add(p.department); });
    return Array.from(set).sort();
  }, [proformas]);

  // Filtered & Searched Proformas
  const filteredProformas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return proformas.filter((p) => {
      const matchesDept = selectedDepartment === 'ALL' || p.department === selectedDepartment;
      if (!matchesDept) return false;
      if (!q) return true;
      return (
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.department && p.department.toLowerCase().includes(q)) ||
        (p.departmentHindi && p.departmentHindi.toLowerCase().includes(q)) ||
        (p.proformaNumber && p.proformaNumber.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    });
  }, [proformas, searchQuery, selectedDepartment]);

  // Reset to page 1 on search / filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment]);

  // Handlers
  const handleOpenView = (proforma) => { setSelectedProforma(proforma); setIsViewOpen(true); };
  const handleOpenEdit = (proforma) => { setSelectedProforma(proforma); setFormError(''); setIsFormOpen(true); };
  const handleOpenAdd = () => { setSelectedProforma(null); setFormError(''); setIsFormOpen(true); };
  const handleOpenDelete = (proforma) => { setSelectedProforma(proforma); setIsDeleteOpen(true); };

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    setFormError('');
    try {
      if (selectedProforma) {
        await updateEmployeeProforma(selectedProforma.id, formData);
        setToast({ type: 'success', message: 'Employee proforma updated successfully!' });
      } else {
        const res = await createEmployeeProforma(formData);
        const newId = res?.data?.id || res?.id || res?.data?._id || '';
        setToast({
          type: 'success',
          message: `Employee proforma created successfully!${newId ? ` (ID: ${newId})` : ''}`,
        });
      }
      setIsFormOpen(false);
      fetchProformas(currentPage);
    } catch (err) {
      setFormError(err.message || 'Operation failed. Please check inputs.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProforma) return;
    setActionLoading(true);
    try {
      await deleteEmployeeProforma(selectedProforma.id);
      setToast({ type: 'success', message: 'Employee proforma deleted successfully!' });
      setIsDeleteOpen(false);
      const targetPage = proformas.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
      } else {
        fetchProformas(targetPage);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete proforma.' });
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
          <h1>Employee Proformas</h1>
          <p>Manage Haryana Government Employee Proformas &amp; Files</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          + Add Proforma
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
                placeholder="Search proformas, department, number..."
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

            {(searchQuery || selectedDepartment !== 'ALL') && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => { setSearchQuery(''); setSelectedDepartment('ALL'); }}
              >
                Reset Filters
              </button>
            )}
          </div>

          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Showing page {pagination.page} of {pagination.totalPages} — {pagination.total} total proformas
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
            <button className="btn btn-outline btn-sm" onClick={() => fetchProformas(currentPage)}>
              Retry Fetching
            </button>
          </div>
        ) : filteredProformas.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" style={{ marginBottom: '12px' }}>
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 4px' }}>
              No Employee Proformas Found
            </h3>
            <p style={{ fontSize: '13.5px', margin: 0 }}>
              Try adjusting your search filters or click &quot;+ Add Proforma&quot; to create one.
            </p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Proforma ID</th>
                    <th style={{ width: '30%' }}>Title</th>
                    <th>Department</th>
                    <th>Proforma No.</th>
                    <th>Date</th>
                    <th>PDF</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProformas.map((proforma) => (
                    <tr key={proforma.id}>
                      <td>
                        <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                          {getShortProformaId(proforma.id)}
                        </code>
                      </td>
                      <td className="admin-table__title">
                        <div>{proforma.title}</div>
                      </td>
                      <td>{proforma.departmentHindi || proforma.department}</td>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                          {proforma.proformaNumber}
                        </code>
                      </td>
                      <td>{proforma.date}</td>
                      <td>
                        {proforma.pdf ? (
                          <a
                            href={proforma.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--saffron-600)', fontWeight: 600, fontSize: 13 }}
                          >
                            View ↗
                          </a>
                        ) : (
                          <span style={{ color: '#cbd5e1' }}>None</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-table__actions" style={{ justifyContent: 'flex-end' }}>
                          <button className="admin-btn-action" onClick={() => handleOpenView(proforma)} title="View">View</button>
                          <button className="admin-btn-action" onClick={() => handleOpenEdit(proforma)} title="Edit">Edit</button>
                          <button className="admin-btn-action admin-btn-action--danger" onClick={() => handleOpenDelete(proforma)} title="Delete">Delete</button>
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
                Showing page {pagination.page} of {pagination.totalPages} — {pagination.total} total proformas
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
      <EmployeeProformaView
        isOpen={isViewOpen}
        proforma={selectedProforma}
        onClose={() => setIsViewOpen(false)}
      />

      {/* Form Add / Edit Modal */}
      <EmployeeProformaForm
        isOpen={isFormOpen}
        initialData={selectedProforma}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
        loading={actionLoading}
        apiError={formError}
      />

      {/* Delete Confirmation Modal — reuse existing shared component */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        order={selectedProforma}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
        loading={actionLoading}
      />
    </AdminLayout>
  );
}

export default EmployeeProformasCMS;
