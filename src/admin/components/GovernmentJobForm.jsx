import React, { useState, useEffect, useRef } from 'react';

const DEPARTMENT_OPTIONS = [
  'Haryana Police',
  'Haryana Staff Selection Commission (HSSC)',
  'Haryana Public Service Commission (HPSC)',
  'Education Department',
  'Health Department',
  'PWD Department',
  'Electric Department (DHBVN / UHBVN)',
  'Revenue Department',
  'Transport Department (Haryana Roadways)',
  'Urban Local Bodies',
  'Agriculture Department',
  'Social Justice & Empowerment Department',
  'Women & Child Development Department',
  'Finance Department',
  'Other Department',
];

function getTodayISODate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function parseToISODate(dateStr) {
  if (!dateStr) return getTodayISODate();
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return getTodayISODate();
}

function GovernmentJobForm({ isOpen, initialData, onSubmit, onClose, loading, apiError }) {
  const isEdit = Boolean(initialData);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    titleHindi: '',
    department: DEPARTMENT_OPTIONS[0],
    departmentHindi: '',
    publishedDate: getTodayISODate(),
    lastDate: getTodayISODate(),
    vacancies: '',
    description: '',
    enabled: true,
  });

  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [successInfo, setSuccessInfo] = useState(null);

  useEffect(() => {
    setSuccessInfo(null);
    setSelectedPdfFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (initialData) {
      setFormData({
        title: initialData.title || '',
        titleHindi: initialData.titleHindi || '',
        department:
          initialData.department && DEPARTMENT_OPTIONS.includes(initialData.department)
            ? initialData.department
            : DEPARTMENT_OPTIONS[0],
        departmentHindi: initialData.departmentHindi || '',
        publishedDate: parseToISODate(initialData.publishedDate),
        lastDate: parseToISODate(initialData.lastDate),
        vacancies: initialData.vacancies !== undefined ? String(initialData.vacancies) : '',
        description: initialData.description || '',
        enabled: initialData.enabled !== false,
      });
      setExistingPdfUrl(initialData.pdf || '');
    } else {
      setFormData({
        title: '',
        titleHindi: '',
        department: DEPARTMENT_OPTIONS[0],
        departmentHindi: '',
        publishedDate: getTodayISODate(),
        lastDate: getTodayISODate(),
        vacancies: '',
        description: '',
        enabled: true,
      });
      setExistingPdfUrl('');
    }
    setValidationErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setValidationErrors((prev) => ({ ...prev, pdf: 'Only PDF files (.pdf) are allowed.' }));
      setSelectedPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationErrors((prev) => ({ ...prev, pdf: 'PDF file size must not exceed 50 MB.' }));
      setSelectedPdfFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedPdfFile(file);
    if (validationErrors.pdf) setValidationErrors((prev) => ({ ...prev, pdf: '' }));
  };

  const handleRemoveFile = () => {
    setSelectedPdfFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Job Title is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    if (!formData.publishedDate.trim()) errors.publishedDate = 'Published Date is required';
    if (!formData.lastDate.trim()) errors.lastDate = 'Last Date to Apply is required';
    if (!formData.description.trim()) errors.description = 'Description is required';

    if (formData.vacancies === '' || isNaN(Number(formData.vacancies)) || Number(formData.vacancies) < 0) {
      errors.vacancies = 'Vacancies must be a positive number';
    }

    if (!isEdit && !selectedPdfFile) {
      errors.pdf = 'Official Notification PDF file is required';
    } else if (isEdit && !selectedPdfFile && !existingPdfUrl) {
      errors.pdf = 'Official Notification PDF file is required';
    } else if (selectedPdfFile) {
      const isPdf = selectedPdfFile.type === 'application/pdf' || selectedPdfFile.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) errors.pdf = 'Only PDF files (.pdf) are allowed.';
      else if (selectedPdfFile.size > MAX_FILE_SIZE_BYTES) errors.pdf = 'PDF file size must not exceed 50 MB.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || !validate()) return;

    const payload = new FormData();
    payload.append('title', formData.title.trim());
    payload.append('titleHindi', (formData.titleHindi.trim() || formData.title.trim()));
    payload.append('department', formData.department.trim());
    payload.append('departmentHindi', (formData.departmentHindi.trim() || formData.department.trim()));
    payload.append('publishedDate', formData.publishedDate.trim());
    payload.append('lastDate', formData.lastDate.trim());
    payload.append('vacancies', String(Math.floor(Number(formData.vacancies))));
    payload.append('description', formData.description.trim());
    payload.append('enabled', formData.enabled ? 'true' : 'false');

    if (selectedPdfFile) {
      payload.append('pdf', selectedPdfFile);
    }

    try {
      const res = await onSubmit(payload);
      if (!isEdit && res) {
        const savedData = res?.data?.data || res?.data || res;
        const savedId = savedData?.id || savedData?._id;
        if (savedId) setSuccessInfo({ id: savedId });
      }
      setFormData({
        title: '',
        titleHindi: '',
        department: DEPARTMENT_OPTIONS[0],
        departmentHindi: '',
        publishedDate: getTodayISODate(),
        lastDate: getTodayISODate(),
        vacancies: '',
        description: '',
        enabled: true,
      });
      setSelectedPdfFile(null);
      setExistingPdfUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      // Handled by parent
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3 className="admin-modal__title">
            {isEdit ? 'Edit Government Job' : 'Add New Government Job'}
          </h3>
          <button className="admin-modal__close" onClick={onClose} disabled={loading}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="admin-modal__body">
            {/* Success banner */}
            {successInfo && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '16px 20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(22,101,52,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '15px', color: '#15803d' }}>
                  <span>✅</span>
                  <span>Government Job created successfully</span>
                </div>
                <div style={{ marginTop: '8px', fontSize: '14px' }}>
                  <span style={{ color: '#334155' }}>Assigned Job ID: </span>
                  <code style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '14px' }}>
                    {successInfo.id}
                  </code>
                </div>
              </div>
            )}

            {/* API error */}
            {apiError && (
              <div className="admin-alert-error" style={{ marginBottom: '20px' }}>
                <span>⚠️</span>
                <div>{apiError}</div>
              </div>
            )}

            <div className="admin-form-grid">
              {/* Title */}
              <div className="admin-field-group admin-form-grid--full">
                <label htmlFor="job-title">Job Title (English) *</label>
                <input
                  type="text"
                  id="job-title"
                  name="title"
                  className="admin-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Haryana Police Constable Recruitment 2026"
                />
                {validationErrors.title && (
                  <span style={{ fontSize: '12px', color: '#dc2626' }}>{validationErrors.title}</span>
                )}
              </div>

              {/* Hindi Title */}
              <div className="admin-field-group admin-form-grid--full">
                <label htmlFor="job-title-hindi">Job Title (Hindi)</label>
                <input
                  type="text"
                  id="job-title-hindi"
                  name="titleHindi"
                  className="admin-input"
                  value={formData.titleHindi}
                  onChange={handleChange}
                  placeholder="उदा. हरियाणा पुलिस कांस्टेबल भर्ती 2026"
                />
              </div>

              {/* Department */}
              <div className="admin-field-group">
                <label htmlFor="job-department">Department *</label>
                <select
                  id="job-department"
                  name="department"
                  className="admin-select"
                  value={formData.department}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 16px' }}
                >
                  {DEPARTMENT_OPTIONS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {validationErrors.department && (
                  <span style={{ fontSize: '12px', color: '#dc2626' }}>{validationErrors.department}</span>
                )}
              </div>

              {/* Department Hindi */}
              <div className="admin-field-group">
                <label htmlFor="job-department-hindi">Department (Hindi)</label>
                <input
                  type="text"
                  id="job-department-hindi"
                  name="departmentHindi"
                  className="admin-input"
                  value={formData.departmentHindi}
                  onChange={handleChange}
                  placeholder="उदा. हरियाणा पुलिस"
                />
              </div>

              {/* Vacancies */}
              <div className="admin-field-group">
                <label htmlFor="job-vacancies">Total Vacancies *</label>
                <input
                  type="number"
                  min="0"
                  id="job-vacancies"
                  name="vacancies"
                  className="admin-input"
                  value={formData.vacancies}
                  onChange={handleChange}
                  placeholder="e.g. 1200"
                />
                {validationErrors.vacancies && (
                  <span style={{ fontSize: '12px', color: '#dc2626' }}>{validationErrors.vacancies}</span>
                )}
              </div>

              {/* Published Date */}
              <div className="admin-field-group">
                <label htmlFor="job-published-date">Published Date *</label>
                <input
                  type="date"
                  id="job-published-date"
                  name="publishedDate"
                  className="admin-input"
                  value={formData.publishedDate}
                  onChange={handleChange}
                />
                {validationErrors.publishedDate && (
                  <span style={{ fontSize: '12px', color: '#dc2626' }}>{validationErrors.publishedDate}</span>
                )}
              </div>

              {/* Last Date */}
              <div className="admin-field-group">
                <label htmlFor="job-last-date">Last Date to Apply *</label>
                <input
                  type="date"
                  id="job-last-date"
                  name="lastDate"
                  className="admin-input"
                  value={formData.lastDate}
                  onChange={handleChange}
                />
                {validationErrors.lastDate && (
                  <span style={{ fontSize: '12px', color: '#dc2626' }}>{validationErrors.lastDate}</span>
                )}
              </div>

              {/* Status Toggle */}
              <div className="admin-field-group" style={{ justifyContent: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '24px' }}>
                  <input
                    type="checkbox"
                    name="enabled"
                    checked={formData.enabled}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--saffron-600, #ea580c)', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                    Active &amp; Visible to Public
                  </span>
                </label>
              </div>

              {/* Description */}
              <div className="admin-field-group admin-form-grid--full">
                <label htmlFor="job-description">Description &amp; Eligibility Criteria *</label>
                <textarea
                  id="job-description"
                  name="description"
                  className="admin-input"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter eligibility criteria, age limit, qualification, and application details..."
                />
                {validationErrors.description && (
                  <span style={{ fontSize: '12px', color: '#dc2626' }}>{validationErrors.description}</span>
                )}
              </div>

              {/* PDF Document Upload */}
              <div className="admin-field-group admin-form-grid--full">
                <label htmlFor="job-pdf-input">Official Notification Document (PDF) *</label>
                <input
                  type="file"
                  id="job-pdf-input"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                />

                {!selectedPdfFile && !existingPdfUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()}>
                      Choose PDF File
                    </button>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>No file selected (Max 50 MB)</span>
                  </div>
                ) : selectedPdfFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>
                      <span>📄</span>
                      <span>{selectedPdfFile.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" className="admin-btn-action" onClick={() => fileInputRef.current?.click()}>Change</button>
                      <button type="button" className="admin-btn-action admin-btn-action--danger" onClick={handleRemoveFile}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>
                      <span>📄</span>
                      <span>Existing Notification PDF</span>
                    </div>
                    <button type="button" className="admin-btn-action" onClick={() => fileInputRef.current?.click()}>Replace PDF</button>
                  </div>
                )}

                {validationErrors.pdf && (
                  <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{validationErrors.pdf}</span>
                )}
              </div>
            </div>
          </div>

          <div className="admin-modal__footer">
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose} disabled={loading}>
              {successInfo ? 'Close' : 'Cancel'}
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              {loading ? (
                <span className="admin-spinner" style={{ width: 14, height: 14, borderTopColor: '#fff' }} />
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Create Job Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GovernmentJobForm;
