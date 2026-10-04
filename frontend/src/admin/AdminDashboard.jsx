import { useState } from 'react';
import { useAdminResource } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';

export default function AdminDashboard() {
  const { t } = useLang();

  const { data: donations }   = useAdminResource('/admin/donations/');
  const { data: enrollments } = useAdminResource('/admin/enrollments/');
  const { data: volunteers }  = useAdminResource('/admin/volunteers/');
  const { data: contacts }    = useAdminResource('/admin/contact/');
  const { data: programs }    = useAdminResource('/admin/programs/');

  const cards = [
    { label: t('admin.programs'),    value: programs?.count    ?? programs?.length   ?? '—', color: 'var(--clr-accent)' },
    { label: t('admin.donations'),   value: donations?.count   ?? donations?.length  ?? '—', color: 'var(--clr-success)' },
    { label: t('admin.enrollments'), value: enrollments?.count ?? enrollments?.length ?? '—', color: 'var(--clr-accent)' },
    { label: t('admin.volunteers'),  value: volunteers?.count  ?? volunteers?.length  ?? '—', color: '#7c3aed' },
    { label: t('admin.contacts'),    value: contacts?.count    ?? contacts?.length   ?? '—', color: '#db2777' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>{t('admin.dashboard')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {cards.map((c) => (
          <div key={c.label} style={{
            background: 'var(--clr-surface)',
            border: '1px solid var(--clr-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            borderTop: `3px solid ${c.color}`,
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: c.color, marginBottom: '0.5rem' }}>
              {c.value}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', fontWeight: 600 }}>
              {c.label}
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-warning mt-4">
        <strong>Admin Note:</strong> This panel uses phone + OTP authentication only.
        Make sure your phone number is registered as an admin staff account in Django admin.
      </div>
    </div>
  );
}
