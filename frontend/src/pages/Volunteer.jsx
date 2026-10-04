import { useState } from 'react';
import { useLang } from '../i18n/index.jsx';
import api from '../api/client.js';

export default function Volunteer() {
  const { t } = useLang();
  const [form, setForm]       = useState({ name: '', phone: '', email: '', skills: '', availability: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/volunteers/', form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="page-hero"><div className="container"><h1>{t('volunteer.heading')}</h1></div></div>
      <section className="section">
        <div className="container" style={{ maxWidth: 600 }}>
          {success ? <div className="alert alert-success">{t('volunteer.success')}</div> : (
            <form onSubmit={handleSubmit} className="card"><div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {[
                { id: 'v-name', key: 'name', label: 'volunteer.name_label', required: true },
                { id: 'v-phone', key: 'phone', label: 'volunteer.phone_label', type: 'tel', required: true },
                { id: 'v-email', key: 'email', label: 'volunteer.email_label', type: 'email' },
                { id: 'v-skills', key: 'skills', label: 'volunteer.skills_label' },
                { id: 'v-avail', key: 'availability', label: 'volunteer.availability_label' },
              ].map(({ id, key, label, type = 'text', required }) => (
                <div key={key} className="form-group">
                  <label className="form-label" htmlFor={id}>{t(label)}</label>
                  <input id={id} className="form-input" type={type} required={required}
                    value={form[key]} onChange={set(key)} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label" htmlFor="v-msg">{t('volunteer.message_label')}</label>
                <textarea id="v-msg" className="form-textarea" value={form.message} onChange={set('message')} />
              </div>
              <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                {loading ? t('common.loading') : t('volunteer.submit')}
              </button>
            </div></form>
          )}
        </div>
      </section>
    </>
  );
}
