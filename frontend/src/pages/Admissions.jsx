import { useState } from 'react';
import { useLang } from '../i18n/index.jsx';
import { usePrograms } from '../hooks/index.js';
import api from '../api/client.js';

export default function Admissions() {
  const { t, getField } = useLang();
  const { data: programsData } = usePrograms({ is_active: true });
  const programs = programsData?.results || programsData || [];

  const [form, setForm]       = useState({ student_name: '', parent_name: '', phone: '', email: '', program: '', age: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/enrollments/', { ...form, program: +form.program, age: +form.age });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || t('common.error'));
    } finally { setLoading(false); }
  };

  return (
    <>
      <div className="page-hero"><div className="container"><h1>{t('admissions.heading')}</h1></div></div>
      <section className="section">
        <div className="container" style={{ maxWidth: 640 }}>
          {success ? <div className="alert alert-success">{t('admissions.success')}</div> : (
            <form onSubmit={handleSubmit} className="card"><div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-group">
                <label className="form-label" htmlFor="a-student">{t('admissions.student_name_label')}</label>
                <input id="a-student" className="form-input" required value={form.student_name} onChange={set('student_name')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="a-parent">{t('admissions.parent_name_label')}</label>
                <input id="a-parent" className="form-input" value={form.parent_name} onChange={set('parent_name')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="a-phone">{t('admissions.phone_label')}</label>
                <input id="a-phone" className="form-input" type="tel" required value={form.phone} onChange={set('phone')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="a-email">{t('admissions.email_label')}</label>
                <input id="a-email" className="form-input" type="email" value={form.email} onChange={set('email')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="a-prog">{t('admissions.program_label')}</label>
                <select id="a-prog" className="form-select" required value={form.program} onChange={set('program')}>
                  <option value="">— Select Program —</option>
                  {programs.map((p) => <option key={p.id} value={p.id}>{getField(p, 'title')}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="a-age">{t('admissions.age_label')}</label>
                <input id="a-age" className="form-input" type="number" min="1" max="80" required value={form.age} onChange={set('age')} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="a-msg">{t('admissions.message_label')}</label>
                <textarea id="a-msg" className="form-textarea" value={form.message} onChange={set('message')} />
              </div>
              <button className="btn btn-accent w-full" type="submit" disabled={loading}>
                {loading ? t('common.loading') : t('admissions.submit')}
              </button>
            </div></form>
          )}
        </div>
      </section>
    </>
  );
}
