import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n/index.jsx';
import { useAdminResource, useSiteSettings } from '../hooks/index.js';
import { RESOURCE_CONFIGS } from './resourceConfigs.js';
import CrudPage from './CrudPage.jsx';
import AdminSettings from './AdminSettings.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import logoImg from '../assets/logo/logo-source.png';

const NAV_ITEMS = [
  { to: '/admin',             label: 'admin.dashboard',      exact: true },
  { to: '/admin/settings',    label: 'admin.settings' },
  { to: '/admin/banners',     label: 'admin.banners' },
  { to: '/admin/programs',    label: 'admin.programs' },
  { to: '/admin/instructors', label: 'admin.instructors' },
  { to: '/admin/events',      label: 'admin.events' },
  { to: '/admin/event-images', label: 'Event Images' },
  { to: '/admin/testimonials', label: 'admin.testimonials' },
  { to: '/admin/donation-funds', label: 'admin.donation_funds' },
  { to: '/admin/donations',   label: 'admin.donations' },
  { to: '/admin/enrollments', label: 'admin.enrollments' },
  { to: '/admin/volunteers',  label: 'admin.volunteers' },
  { to: '/admin/contacts',    label: 'admin.contacts' },
];

export default function AdminLayout() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: settings } = useSiteSettings();

  const handleLogout = () => {
    localStorage.removeItem('madarsa_access');
    localStorage.removeItem('madarsa_refresh');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-layout">
      {/* Mobile sidebar toggle bar */}
      <div style={{
        display: 'none',
        padding: '0.75rem 1rem',
        background: 'var(--clr-surface)',
        borderBottom: '1px solid var(--clr-border)',
        alignItems: 'center',
        justifyContent: 'space-between',
      }} className="admin-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src={settings?.logo_url || logoImg} alt="Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          <strong>Admin Panel</strong>
        </div>
        <button
          className={`hamburger${sidebarOpen ? ' open' : ''}`}
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--clr-border)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={settings?.logo_url || logoImg} alt="Logo" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4 }} />
          <strong style={{ color: 'var(--clr-accent)', fontSize: '0.95rem' }}>Admin Panel</strong>
        </div>
        <nav>
          {NAV_ITEMS.map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `admin-sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {t(label)}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.5rem', marginTop: 'auto', borderTop: '1px solid var(--clr-border)' }}>
          <button className="btn btn-danger btn-sm w-full" onClick={handleLogout}>{t('admin.logout')}</button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 199, background: 'rgba(0,0,0,0.5)' }}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="admin-main">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettings />} />
          {/* Config-driven CRUD routes — single CrudPage, different configs */}
          <Route path="banners"       element={<CrudPage config={RESOURCE_CONFIGS.banners} />} />
          <Route path="programs"      element={<CrudPage config={RESOURCE_CONFIGS.programs} />} />
          <Route path="instructors"   element={<CrudPage config={RESOURCE_CONFIGS.instructors} />} />
          <Route path="events"        element={<CrudPage config={RESOURCE_CONFIGS.events} />} />
          <Route path="testimonials"  element={<CrudPage config={RESOURCE_CONFIGS.testimonials} />} />
          <Route path="donation-funds" element={<CrudPage config={RESOURCE_CONFIGS['donation-funds']} />} />
          {/* Read-only tables for submissions */}
          <Route path="donations"    element={<ReadOnlyTable apiPath="/admin/donations/"    columns={['donor_name','amount','currency','status','created_at']} title="Donations" />} />
          <Route path="enrollments"  element={<ReadOnlyTable apiPath="/admin/enrollments/"  columns={['student_name','phone','status','created_at']} title="Enrollments" />} />
          <Route path="volunteers"   element={<ReadOnlyTable apiPath="/admin/volunteers/"   columns={['name','phone','status','created_at']} title="Volunteers" />} />
          <Route path="contacts"     element={<ReadOnlyTable apiPath="/admin/contact/" columns={['name','email','subject','is_read','created_at']} title="Contact Messages" />} />
        </Routes>
      </div>
    </div>
  );
}

/** Simple read-only table for submissions — no edit/delete. */
function ReadOnlyTable({ apiPath, columns, title }) {
  const { t } = useLang();
  const [refresh] = useState(0);
  const { data, loading, error } = useAdminResource(apiPath, refresh);
  const items = data?.results || data || [];

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>{title}</h2>
      {loading && <div className="spinner" />}
      {error   && <div className="alert alert-danger">{t('common.error')}</div>}
      {!loading && items.length === 0 && <p style={{ color: 'var(--clr-text-muted)' }}>{t('admin.no_items')}</p>}
      {items.length > 0 && (
        <div className="crud-table-wrapper">
          <table className="crud-table">
            <thead><tr>{columns.map((c) => <th key={c}>{c.replace(/_/g, ' ')}</th>)}</tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  {columns.map((c) => (
                    <td key={c}>{
                      typeof item[c] === 'boolean' ? (item[c] ? '✅' : '❌')
                      : String(item[c] ?? '—').slice(0, 60)
                    }</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Mobile cards */}
          <div className="crud-cards">
            {items.map((item) => (
              <div key={item.id} className="crud-card">
                {columns.map((c) => (
                  <div key={c} className="crud-card-row">
                    <span className="crud-card-label">{c.replace(/_/g, ' ')}</span>
                    <span>{typeof item[c] === 'boolean' ? (item[c] ? '✅' : '❌') : String(item[c] ?? '—')}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
