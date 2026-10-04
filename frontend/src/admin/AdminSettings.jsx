/**
 * AdminSettings.jsx — edit the singleton SiteSettings.
 *
 * Includes founder_name and founder_title fields — these are the ONLY
 * place those strings are stored. Editing here updates Home.jsx and About.jsx
 * automatically via the public site-settings API.
 */

import { useState, useEffect } from 'react';
import { useAdminResource } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';
import api from '../api/client.js';

const FIELDS = [
  { key: 'institution_name', label: 'Institution Name', required: true },
  { key: 'tagline',          label: 'Tagline' },
  { key: 'mission',          label: 'Mission',          type: 'textarea' },
  // Founder — editable here; never hardcoded in any component
  { key: 'founder_name',     label: 'Founder Name (displayed on Home & About)' },
  { key: 'founder_title',    label: 'Founder Title / Designation' },
  { key: 'founder_photo',    label: 'Founder Photo',     type: 'image' },
  // Contact
  { key: 'address',          label: 'Address',          type: 'textarea' },
  { key: 'phone',            label: 'Phone' },
  { key: 'email',            label: 'Email',            type: 'email' },
  // Social
  { key: 'facebook_url',     label: 'Facebook URL',     type: 'url' },
  { key: 'instagram_url',    label: 'Instagram URL',    type: 'url' },
  { key: 'youtube_url',      label: 'YouTube URL',      type: 'url' },
  { key: 'twitter_url',      label: 'Twitter URL',      type: 'url' },
  { key: 'whatsapp_number',  label: 'WhatsApp Number' },
  // Theme
  { key: 'primary_color',    label: 'Primary Color (hex)', type: 'color' },
  { key: 'secondary_color',  label: 'Accent Color (hex)',  type: 'color' },
];

export default function AdminSettings() {
  const { t } = useLang();
  const [refresh, setRefresh] = useState(0);
  const { data, loading }     = useAdminResource('/admin/site-settings/', refresh);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  const setFile = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.files[0] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setSaved(false); setError('');

    const hasFile = Object.values(form).some((v) => v instanceof File);

    try {
      if (hasFile) {
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => {
          if (v === null || v === undefined) return;
          if (k === 'founder_photo' && typeof v === 'string') return; // skip string URL
          formData.append(k, v);
        });
        await api.patch('/admin/site-settings/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.patch('/admin/site-settings/', form);
      }
      setSaved(true);
      setRefresh((r) => r + 1);
    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>{t('admin.settings')}</h2>

      {saved  && <div className="alert alert-success mb-2">Settings saved successfully.</div>}
      {error  && <div className="alert alert-danger mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">
          {FIELDS.map(({ key, label, type = 'text', required }) => (
            <div key={key} className="form-group">
              <label className="form-label" htmlFor={`s-${key}`}>{label}</label>
              {type === 'textarea' ? (
                <textarea id={`s-${key}`} className="form-textarea" value={form[key] || ''} onChange={set(key)} />
              ) : type === 'image' ? (
                <>
                  {form[key] && typeof form[key] === 'string' && (
                    <img src={form[key]} alt="Current founder photo" style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: '0.5rem', display: 'block' }} />
                  )}
                  <input id={`s-${key}`} className="form-input" type="file" accept="image/*" onChange={setFile(key)} />
                </>
              ) : (
                <input id={`s-${key}`} className="form-input" type={type} required={required} value={form[key] || ''} onChange={set(key)} />
              )}
            </div>
          ))}

          <button className="btn btn-primary w-full" type="submit" disabled={saving}>
            {saving ? t('common.loading') : t('admin.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
