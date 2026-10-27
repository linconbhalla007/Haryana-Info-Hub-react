import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';
import GovernmentOrderView from '../components/GovernmentOrderView.jsx';
import GovernmentOrderForm from '../components/GovernmentOrderForm.jsx';
import EmployeeProformaView from '../components/EmployeeProformaView.jsx';
import EmployeeProformaForm from '../components/EmployeeProformaForm.jsx';
import GovernmentJobView from '../components/GovernmentJobView.jsx';
import GovernmentJobForm from '../components/GovernmentJobForm.jsx';
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx';
import ToastNotification from '../components/ToastNotification.jsx';
import {
  getGovernmentOrders,
  createGovernmentOrder,
  updateGovernmentOrder,
  deleteGovernmentOrder,
  getEmployeeProformas,
  createEmployeeProforma,
  updateEmployeeProforma,
  deleteEmployeeProforma,
  getGovernmentJobs,
  createGovernmentJob,
  updateGovernmentJob,
  deleteGovernmentJob,
} from '../services/adminApi.js';

function getShortId(id) {
  if (!id) return '-';
  return id.replace(/^(order|proforma|job)-?/i, '') || id;
}

function AdminDashboard() {
  // Active dashboard type: 'government_orders' | 'employee_proformas' | 'government_jobs'
  const [dashboardType, setDashboardType] = useState('government_orders');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Modals state
  const [selectedItem, setSelectedItem] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast] = useState(null);

  const isProforma = dashboardType === 'employee_proformas';
  const isJob = dashboardType === 'government_jobs';

  const fetchItems = async (pageToFetch = currentPage) => {
    setLoading(true);
    setError('');
    setItems([]);
    try {
      let fetchApi = getGovernmentOrders;
      if (isProforma) {
        fetchApi = getEmployeeProformas;
      } else if (isJob) {
        fetchApi = getGovernmentJobs;
      }

      const res = await fetchApi(pageToFetch, 5);
      setItems(res.data || []);
      const pageMeta = res.pagination || {
        page: pageToFetch,
        limit: 5,
        total: res.data?.length || 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      setPagination(pageMeta);
      setCurrentPage(pageMeta.page);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when dashboardType or currentPage changes
  useEffect(() => {
    fetchItems(currentPage);
  }, [dashboardType, currentPage]);

  const handleDashboardChange = (e) => {
    const newType = e.target.value;
    setDashboardType(newType);
    setCurrentPage(1);
    setSelectedItem(null);
    setIsViewOpen(false);
    setIsFormOpen(false);
    setIsDeleteOpen(false);
  };

  // Calculate statistics from actual API response
  const stats = useMemo(() => {
    const totalItems = pagination.total;
    const departmentsSet = new Set(items.map((o) => o.department || 'Other').filter(Boolean));
    const totalDepartments = departmentsSet.size;

    let latestDate = 'N/A';
    let totalVacancies = 0;

    if (items.length > 0) {
      const sorted = [...items].sort((a, b) => {
        const dateA = a.date || a.publishedDate || a.createdAt || '';
        const dateB = b.date || b.publishedDate || b.createdAt || '';
        const timeA = new Date(dateA).getTime() || 0;
        const timeB = new Date(dateB).getTime() || 0;
        return timeB - timeA;
      });
      latestDate = sorted[0].date || sorted[0].publishedDate || 'N/A';

      if (isJob) {
        totalVacancies = items.reduce((acc, curr) => acc + (Number(curr.vacancies) || 0), 0);
      }
    }

    const recentCount = items.length;

    return {
      totalItems,
      recentCount,
      latestDate,
      totalDepartments,
      totalVacancies,
    };
  }, [items, pagination.total, isJob]);

  // Department distribution for chart
  const departmentChartData = useMemo(() => {
    const counts = {};
    items.forEach((o) => {
      const dept = o.departmentHindi || o.department || 'अन्य';
      counts[dept] = (counts[dept] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const maxCount = entries.length > 0 ? entries[0][1] : 1;

    return entries.map(([dept, count]) => ({
      dept,
      count,
      percentage: Math.round((count / maxCount) * 100),
    }));
  }, [items]);

  // Handlers
  const handleOpenView = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    setFormError('');
    try {
      if (isJob) {
        if (selectedItem) {
          await updateGovernmentJob(selectedItem.id, formData);
          setToast({ type: 'success', message: 'Government Job updated successfully!' });
        } else {
          const res = await createGovernmentJob(formData);
          const newId = res?.data?.id || res?.id || res?.data?._id || '';
          setToast({
            type: 'success',
            message: `Government Job created successfully! ${newId ? `(ID: ${newId})` : ''}`,
          });
        }
      } else if (isProforma) {
        if (selectedItem) {
          await updateEmployeeProforma(selectedItem.id, formData);
          setToast({ type: 'success', message: 'Employee proforma updated successfully!' });
        } else {
          const res = await createEmployeeProforma(formData);
          const newId = res?.data?.id || res?.id || res?.data?._id || '';
          setToast({
            type: 'success',
            message: `Employee proforma created successfully! ${newId ? `(ID: ${newId})` : ''}`,
          });
        }
      } else {
        if (selectedItem) {
          await updateGovernmentOrder(selectedItem.id, formData);
          setToast({ type: 'success', message: 'Government order updated successfully!' });
        } else {
          const res = await createGovernmentOrder(formData);
          const newId = res?.data?.id || res?.id || res?.data?._id || '';
          setToast({
            type: 'success',
            message: `Government order created successfully! ${newId ? `(ID: ${newId})` : ''}`,
          });
        }
      }
      setIsFormOpen(false);
      fetchItems(currentPage);
    } catch (err) {
      setFormError(err.message || 'Operation failed. Please check inputs.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      if (isJob) {
        await deleteGovernmentJob(selectedItem.id);
        setToast({ type: 'success', message: 'Government Job deleted successfully!' });
      } else if (isProforma) {
        await deleteEmployeeProforma(selectedItem.id);
        setToast({ type: 'success', message: 'Employee proforma deleted successfully!' });
      } else {
        await deleteGovernmentOrder(selectedItem.id);
        setToast({ type: 'success', message: 'Government order deleted successfully!' });
      }
      setIsDeleteOpen(false);

      const targetPage = items.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
      } else {
        fetchItems(targetPage);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete record.' });
    } finally {
      setActionLoading(false);
    }
  };

  const getSectionTitle = () => {
    if (isJob) return 'Government Jobs';
    if (isProforma) return 'Employee Proforma';
    return 'Government Order';
  };

  const getSectionPlural = () => {
    if (isJob) return 'jobs';
    if (isProforma) return 'proformas';
    return 'orders';
  };

  const getManageAllLink = () => {
    if (isJob) return '/admin/government-jobs';
    if (isProforma) return '/admin/employee-proformas';
    return '/admin/government-orders';
  };

  return (
    <AdminLayout>
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      <div className="admin-page-header">
        <div className="admin-page-header__info">
          <h1>
            Dashboard Overview — {getSectionTitle()}
          </h1>
          <p>Real-time analytics and management summary for Haryana Info Hub.</p>
        </div>

        {/* Dashboard Switcher Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="dashboard-select" style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
            Section:
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="dashboard-select"
              value={dashboardType}
              onChange={handleDashboardChange}
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                padding: '9px 36px 9px 14px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            >
              <option value="government_orders">Government Order</option>
              <option value="employee_proformas">Employee Proforma</option>
              <option value="government_jobs">Government Jobs</option>
            </select>
            <span
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#64748b',
                fontSize: '11px',
              }}
            >
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card__info">
            <h3>{isJob ? 'Total Jobs' : isProforma ? 'Total Proformas' : 'Total Orders'}</h3>
            <div className="admin-stat-card__value">{loading ? '...' : stats.totalItems}</div>
            <div className="admin-stat-card__subtext">Live Mongo records</div>
          </div>
          <div className="admin-stat-card__icon admin-stat-card__icon--saffron">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__info">
            <h3>{isJob ? 'Vacancies (Recent)' : isProforma ? 'Recent Proformas' : 'Recent Orders'}</h3>
            <div className="admin-stat-card__value">
              {loading ? '...' : isJob ? stats.totalVacancies.toLocaleString('en-IN') : stats.recentCount}
            </div>
            <div className="admin-stat-card__subtext">{isJob ? 'Across recent listings' : 'Top recent entries'}</div>
          </div>
          <div className="admin-stat-card__icon admin-stat-card__icon--blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__info">
            <h3>{isJob ? 'Latest Published Date' : isProforma ? 'Latest Proforma Date' : 'Latest Order Date'}</h3>
            <div className="admin-stat-card__value" style={{ fontSize: '18px', paddingTop: '4px' }}>
              {loading ? '...' : stats.latestDate}
            </div>
            <div className="admin-stat-card__subtext">Most recent publish</div>
          </div>
          <div className="admin-stat-card__icon admin-stat-card__icon--green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__info">
            <h3>Total Departments</h3>
            <div className="admin-stat-card__value">{loading ? '...' : stats.totalDepartments}</div>
            <div className="admin-stat-card__subtext">Active departments</div>
          </div>
          <div className="admin-stat-card__icon admin-stat-card__icon--purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-two-col">
        {/* Recent Items Table */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title">
              Recent {getSectionTitle()}
            </h2>
            <Link
              to={getManageAllLink()}
              style={{ fontSize: '13px', color: 'var(--saffron-600, #ea580c)', fontWeight: 600 }}
            >
              Manage All →
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="admin-spinner" />
              <p style={{ marginTop: '12px', color: '#64748b' }}>Loading records...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '30px' }}>
              <div className="admin-alert-error">
                <span>⚠️</span>
                <div>{error}</div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No {getSectionPlural()} available.
            </div>
          ) : (
            <>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{isJob ? 'Job ID' : isProforma ? 'Proforma ID' : 'Order ID'}</th>
                      <th>Title</th>
                      <th>Department</th>
                      {isJob ? (
                        <>
                          <th>Vacancies</th>
                          <th>Last Date</th>
                        </>
                      ) : (
                        <>
                          <th>{isProforma ? 'Proforma No.' : 'Order No.'}</th>
                          <th>Date</th>
                        </>
                      )}
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontWeight: 700, color: '#0f172a' }}>
                            {getShortId(item.id)}
                          </code>
                        </td>
                        <td className="admin-table__title">
                          <div style={{ fontWeight: 600 }}>{item.title}</div>
                        </td>
                        <td>{item.departmentHindi || item.department}</td>
                        {isJob ? (
                          <>
                            <td>
                              <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '13.5px' }}>
                                {item.vacancies !== undefined ? item.vacancies.toLocaleString('en-IN') : '-'}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: '13px', fontWeight: 500, color: '#dc2626' }}>
                                {item.lastDate}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>
                              <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>
                                {isProforma ? (item.proformaNumber || '-') : item.orderNumber}
                              </code>
                            </td>
                            <td>{item.date}</td>
                          </>
                        )}
                        <td>
                          <span
                            className={item.enabled !== false ? 'tag tag-green' : 'tag'}
                            style={{
                              fontSize: 11,
                              background: item.enabled !== false ? '#dcfce7' : '#fee2e2',
                              color: item.enabled !== false ? '#15803d' : '#b91c1c',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 700,
                            }}
                          >
                            {item.enabled !== false ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table__actions">
                            <button
                              className="admin-btn-action"
                              onClick={() => handleOpenView(item)}
                              title="View"
                            >
                              View
                            </button>
                            <button
                              className="admin-btn-action"
                              onClick={() => handleOpenEdit(item)}
                              title="Edit"
                            >
                              Edit
                            </button>
                            <button
                              className="admin-btn-action admin-btn-action--danger"
                              onClick={() => handleOpenDelete(item)}
                              title="Delete"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Server-Side Pagination Controls */}
              <div className="admin-table-pagination" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Showing page {pagination.page} of {pagination.totalPages} — {pagination.total} total {getSectionPlural()}
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

        {/* Dynamic Analytics: By Department */}
        <div className="admin-card" style={{ padding: '18px 20px' }}>
          <h2 className="admin-card__title" style={{ marginBottom: '14px', fontSize: '15px' }}>
            {getSectionTitle()} by Department
          </h2>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div className="admin-spinner" />
            </div>
          ) : departmentChartData.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px' }}>Analytics will appear as data is added.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {departmentChartData.slice(0, 5).map((item) => (
                <div key={item.dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', fontWeight: 600 }}>
                    <span style={{ color: '#334155' }}>{item.dept}</span>
                    <span style={{ color: '#64748b' }}>{item.count} {getSectionPlural()}</span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--saffron-500, #ff7c00), var(--saffron-600, #e06200))',
                        borderRadius: '999px',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Modals */}
      {isJob ? (
        <GovernmentJobView
          isOpen={isViewOpen}
          job={selectedItem}
          onClose={() => setIsViewOpen(false)}
        />
      ) : isProforma ? (
        <EmployeeProformaView
          isOpen={isViewOpen}
          proforma={selectedItem}
          onClose={() => setIsViewOpen(false)}
        />
      ) : (
        <GovernmentOrderView
          isOpen={isViewOpen}
          order={selectedItem}
          onClose={() => setIsViewOpen(false)}
        />
      )}

      {/* Form Add / Edit Modals */}
      {isJob ? (
        <GovernmentJobForm
          isOpen={isFormOpen}
          initialData={selectedItem}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
          loading={actionLoading}
          apiError={formError}
        />
      ) : isProforma ? (
        <EmployeeProformaForm
          isOpen={isFormOpen}
          initialData={selectedItem}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
          loading={actionLoading}
          apiError={formError}
        />
      ) : (
        <GovernmentOrderForm
          isOpen={isFormOpen}
          initialData={selectedItem}
          onSubmit={handleFormSubmit}
          onClose={() => setIsFormOpen(false)}
          loading={actionLoading}
          apiError={formError}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        order={selectedItem}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteOpen(false)}
        loading={actionLoading}
      />
    </AdminLayout>
  );
}

export default AdminDashboard;
