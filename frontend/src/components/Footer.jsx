import { Link } from 'react-router-dom';
import { useLang } from '../i18n/index.jsx';
import { useSiteSettings } from '../hooks/index.js';

export default function Footer() {
  const { t } = useLang();
  const { data: s } = useSiteSettings();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <h3 style={{ color: 'var(--clr-accent)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
              {s?.institution_name || 'Gulshan-e-Ashraf Arbi Madarsa'}
            </h3>
            {s?.tagline && (
              <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem' }}>{s.tagline}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer.address_label')}
            </h4>
            {s?.address && <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', marginBottom: '0.5rem' }}>{s.address}</p>}
            {s?.phone  && <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>{s.phone}</p>}
            {s?.email  && <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>{s.email}</p>}
          </div>

          {/* Links */}
          <div>
            <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('footer.follow_us')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {s?.facebook_url  && <a href={s.facebook_url}  target="_blank" rel="noreferrer" style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>Facebook</a>}
              {s?.instagram_url && <a href={s.instagram_url} target="_blank" rel="noreferrer" style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>Instagram</a>}
              {s?.youtube_url   && <a href={s.youtube_url}   target="_blank" rel="noreferrer" style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>YouTube</a>}
              {s?.whatsapp_number && (
                <a href={`https://wa.me/${s.whatsapp_number}`} target="_blank" rel="noreferrer" style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>WhatsApp</a>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--clr-text-dim)' }}>
          <span>© {new Date().getFullYear()} {s?.institution_name}. {t('footer.rights')}</span>
          <Link to="/admin" style={{ color: 'var(--clr-text-dim)' }}>{t('nav.admin')}</Link>
        </div>
      </div>
    </footer>
  );
}
