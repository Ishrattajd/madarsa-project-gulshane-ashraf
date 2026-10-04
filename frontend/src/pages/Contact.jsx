import { useState } from 'react';
import { useLang } from '../i18n/index.jsx';
import api from '../api/client.js';

export default function Contact() {
  const { t } = useLang();
  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contact/', form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-hero"><div className="container"><h1>{t('contact.heading')}</h1></div></div>
      <section className="section">
        <div className="container" style={{ maxWidth: 600 }}>
          {success ? (
            <div className="alert alert-success">{t('contact.success')}</div>
          ) : (
            <form onSubmit={handleSubmit} className="card"><div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-group">
                <label className="form-label" htmlFor="c-name">{t('contact.name_label')}</label>
                <input id="c-name" className="form-input" required value={form.name} onChange={set('name')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="c-email">{t('contact.email_label')}</label>
                <input id="c-email" className="form-input" type="email" required value={form.email} onChange={set('email')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="c-phone">{t('contact.phone_label')}</label>
                <input id="c-phone" className="form-input" type="tel" value={form.phone} onChange={set('phone')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="c-subject">{t('contact.subject_label')}</label>
                <input id="c-subject" className="form-input" value={form.subject} onChange={set('subject')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="c-message">{t('contact.message_label')}</label>
                <textarea id="c-message" className="form-textarea" required value={form.message} onChange={set('message')} />
              </div>
              <button className="btn btn-primary w-full" type="submit" disabled={loading}>
                {loading ? t('common.loading') : t('contact.submit')}
              </button>
            </div></form>
          )}
        </div>
      </section>
    </>
  );
}
