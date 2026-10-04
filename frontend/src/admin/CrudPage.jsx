/**
 * CrudPage.jsx — Generic config-driven CRUD page.
 *
 * Used for: Programs, Instructors, Events, Testimonials, Donation Funds, Banners.
 * Driven entirely by a resourceConfig object from resourceConfigs.js.
 * No separate admin page is written per resource.
 *
 * Features:
 * - Table on desktop / card layout on mobile (≤767px) — no horizontal scroll
 * - Modal form for create/edit
 * - Confirm dialog before delete
 * - Image upload via multipart/form-data
 * - All inputs min-height 44px
 */

import { useState } from 'react';
import { useAdminResource } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';
import api from '../api/client.js';

function FieldInput({ field, value, onChange }) {
  const { type, key: fkey, label, options, required } = field;

  if (type === 'bool') {
    return (
      <label className="form-checkbox-row">
        <input
          type="checkbox"
          id={`f-${fkey}`}
          checked={!!value}
          onChange={(e) => onChange(fkey, e.target.checked)}
        />
        {label}
      </label>
    );
  }
  if (type === 'textarea') {
    return (
      <textarea
        id={`f-${fkey}`}
        className="form-textarea"
        value={value || ''}
        onChange={(e) => onChange(fkey, e.target.value)}
        required={required}
      />
    );
  }
  if (type === 'select') {
    return (
      <select
        id={`f-${fkey}`}
        className="form-select"
        value={value || ''}
        onChange={(e) => onChange(fkey, e.target.value)}
        required={required}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (type === 'image') {
    return (
      <>
        {value && typeof value === 'string' && (
          <img src={value} alt="current" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }} />
        )}
        <input
          id={`f-${fkey}`}
          type="file"
          accept="image/*"
          className="form-input"
          style={{ padding: '0.375rem' }}
          onChange={(e) => onChange(fkey, e.target.files[0])}
        />
      </>
    );
  }
  return (
    <input
      id={`f-${fkey}`}
      className="form-input"
      type={type || 'text'}
      value={value ?? ''}
      onChange={(e) => onChange(fkey, e.target.value)}
      required={required}
    />
  );
}

function CrudModal({ config, item, onClose, onSaved }) {
  const { t } = useLang();
  const isEdit = !!item?.id;
  const [formData, setFormData] = useState(() => {
    if (isEdit) return { ...config.defaults, ...item };
    return { ...config.defaults };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (key, val) => setFormData((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // If any field is an image type and has a File object, use FormData
    const hasFile = config.fields.some(
      (f) => f.type === 'image' && formData[f.key] instanceof File
    );

    try {
      let payload;
      let headers = {};
      if (hasFile) {
        payload = new FormData();
        config.fields.forEach(({ key: k, type }) => {
          const v = formData[k];
          if (v === undefined || v === null) return;
          if (type === 'image' && !(v instanceof File)) return; // skip URL strings
          payload.append(k, v === true ? 'true' : v === false ? 'false' : v);
        });
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        payload = {};
        config.fields.forEach(({ key: k, type }) => {
          if (type === 'image') return; // skip image field if no new file
          payload[k] = formData[k];
        });
      }

      if (isEdit) {
        await api.patch(`${config.apiPath}${item.id}/`, payload, { headers });
      } else {
        await api.post(config.apiPath, payload, { headers });
      }
      onSaved();
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === 'string' ? data : JSON.stringify(data) || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '2rem 1rem',
        overflowY: 'auto',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div style={{ background: 'var(--clr-surface)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 600, border: '1px solid var(--clr-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--clr-border)' }}>
          <h3 style={{ fontSize: '1.1rem' }}>{isEdit ? t('admin.edit') : t('admin.add_new')} — {config.label}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--clr-text-muted)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, minHeight: 44, minWidth: 44 }} aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {error && <div className="alert alert-danger">{error}</div>}

          {config.fields.map((field) => (
            <div key={field.key} className="form-group">
              <label className="form-label" htmlFor={`f-${field.key}`}>{field.label}</label>
              <FieldInput
                field={field}
                value={formData[field.key]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? t('common.loading') : t('admin.save')}
            </button>
            <button type="button" className="btn btn-outline" onClick={onClose}>{t('admin.cancel')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CrudPage({ config }) {
  const { t } = useLang();
  const [refresh, setRefresh]       = useState(0);
  const [page, setPage]             = useState(1);
  const [modalItem, setModalItem]   = useState(null);  // null=closed, {}=new, obj=edit
  const [deleting, setDeleting]     = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchUrl = page > 1 ? `${config.apiPath}?page=${page}` : config.apiPath;
  const { data, loading, error } = useAdminResource(fetchUrl, refresh);

  const items = Array.isArray(data?.results)
    ? data.results
    : (Array.isArray(data) ? data : []);

  const totalCount = data?.count ?? items.length;
  const hasNext = !!data?.next;
  const hasPrev = !!data?.previous || page > 1;

  const openCreate = () => setModalItem({});
  const openEdit   = (item) => setModalItem(item);
  const closeModal = () => setModalItem(null);
  const onSaved    = () => { setModalItem(null); setRefresh((r) => r + 1); };

  const handleDelete = async (item) => {
    if (!window.confirm(t('admin.confirm_delete'))) return;
    setDeleting(item.id);
    setDeleteError('');
    try {
      await api.delete(`${config.apiPath}${item.id}/`);
      setRefresh((r) => r + 1);
    } catch {
      setDeleteError('Delete failed. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const mainCol = config.columns.find((c) => c.main) || config.columns[0];

  const renderValue = (item, col) => {
    const v = item[col.key];
    if (col.type === 'bool') return v ? '✅' : '❌';
    if (v === null || v === undefined || v === '') return <span style={{ color: 'var(--clr-text-dim)' }}>—</span>;
    return String(v).slice(0, 60);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.4rem' }}>{config.label}</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>{t('admin.add_new')}</button>
      </div>

      {deleteError && <div className="alert alert-danger">{deleteError}</div>}
      {loading     && <div className="spinner" />}
      {error       && <div className="alert alert-danger">{t('common.error')}</div>}

      {!loading && items.length === 0 && (
        <p style={{ color: 'var(--clr-text-muted)' }}>{t('admin.no_items')}</p>
      )}

      {/* Desktop table */}
      {items.length > 0 && (
        <div className="crud-table-wrapper">
          <table className="crud-table">
            <thead>
              <tr>
                {config.columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {config.columns.map((col) => (
                    <td key={col.key}>{renderValue(item, col)}</td>
                  ))}
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}>{t('admin.edit')}</button>
                      <button
                        className="btn btn-danger btn-sm"
                        disabled={deleting === item.id}
                        onClick={() => handleDelete(item)}
                      >
                        {deleting === item.id ? '…' : t('admin.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile card list */}
          <div className="crud-cards">
            {items.map((item) => (
              <div key={item.id} className="crud-card">
                {config.columns.map((col) => (
                  <div key={col.key} className="crud-card-row">
                    <span className="crud-card-label">{col.label}</span>
                    <span>{renderValue(item, col)}</span>
                  </div>
                ))}
                <div className="crud-card-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(item)}>{t('admin.edit')}</button>
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={deleting === item.id}
                    onClick={() => handleDelete(item)}
                  >
                    {deleting === item.id ? '…' : t('admin.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination controls */}
      {(hasNext || page > 1) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>
            Showing page {page} ({items.length} of {totalCount} items)
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-outline btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Previous
            </button>
            <button
              className="btn btn-outline btn-sm"
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalItem !== null && (
        <CrudModal
          config={config}
          item={modalItem}
          onClose={closeModal}
          onSaved={onSaved}
        />
      )}
    </div>
  );
}
