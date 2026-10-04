/**
 * About.jsx
 *
 * Sections:
 *   1. Page-hero — navy bg with dot pattern and gold underline
 *   2. Geo divider
 *   3. Mission / Tagline — warm bg
 *   4. Founder block — arch-framed photo on navy, name+title from API only
 *   5. Faculty grid — instructor cards with arch avatar
 *   6. Contact info cards — green-left-border style
 */

import { useSiteSettings, useInstructors } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';

function GeoDivider() {
  return <div className="geo-divider" aria-hidden="true" />;
}

/** Arch-shaped avatar — green bg with white initial, or photo if available */
function ArchAvatar({ src, alt, initial }) {
  const clip = 'polygon(0% 100%, 0% 38%, 50% 0%, 100% 38%, 100% 100%)';
  if (src) {
    return (
      <div style={{ width: 100, height: 120, margin: '0 auto 1rem', position: 'relative' }}>
        {/* gold border layer */}
        <div style={{
          position: 'absolute', inset: -3,
          clipPath: clip,
          background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
          borderRadius: '0 0 8px 8px',
        }} />
        <img
          src={src} alt={alt}
          style={{
            position: 'relative', zIndex: 1,
            width: '100%', height: '100%',
            objectFit: 'cover',
            clipPath: clip,
            borderRadius: '0 0 8px 8px',
            display: 'block',
          }}
        />
      </div>
    );
  }
  return (
    <div style={{
      width: 80, height: 80,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--green), var(--green-light))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 1rem',
      fontSize: '1.6rem', fontWeight: 700, color: '#fff',
      fontFamily: 'var(--font-heading)',
      boxShadow: 'var(--shadow-gold)',
    }}>
      {initial}
    </div>
  );
}

export default function About() {
  const { t, getField } = useLang();
  const { data: settings, loading } = useSiteSettings();
  const { data: instructorsData }   = useInstructors();

  // founder_name and founder_title ALWAYS from SiteSettings API — NEVER hardcoded
  const founderName  = settings?.founder_name  || '';
  const founderTitle = settings?.founder_title || '';

  const instructors = instructorsData?.results || instructorsData || [];

  if (loading) return <div className="spinner" />;

  return (
    <>
      {/* 1 — Page hero */}
      <div className="page-hero">
        <div className="container">
          <h1>{t('about.heading')}</h1>
          {settings?.tagline && (
            <p style={{ color: 'var(--gold-pale)', marginTop: '0.75rem', maxWidth: 580 }}>
              {settings.tagline}
            </p>
          )}
        </div>
      </div>

      <GeoDivider />

      {/* 2 — Mission */}
      {settings?.mission && (
        <section className="section section-warm">
          <div className="container" style={{ maxWidth: 820 }}>
            <h2 className="section-heading">{t('about.mission_heading')}</h2>
            <p style={{
              color: 'var(--text-muted)',
              lineHeight: 1.95,
              fontSize: '1.05rem',
              fontFamily: 'var(--font-heading)',
              fontStyle: 'italic',
              borderLeft: '4px solid var(--gold)',
              paddingLeft: '1.5rem',
            }}>
              {settings.mission}
            </p>
          </div>
        </section>
      )}

      {/* 3 — Founder — arch-framed, navy background, API-only fields */}
      {(founderName || founderTitle) && (
        <section className="section-sm founder-section">
          <div className="container text-center" style={{ position: 'relative', maxWidth: 720 }}>
            {/* Arch-framed photo — only shown if admin uploaded one */}
            {settings?.founder_photo && (
              <div className="founder-photo-frame" style={{ margin: '0 auto var(--space-xl)' }}>
                <img src={settings.founder_photo} alt={founderName} />
              </div>
            )}

            {/* If no photo, show gold initial circle */}
            {!settings?.founder_photo && founderName && (
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.2rem', fontWeight: 700, color: 'var(--navy)',
                margin: '0 auto var(--space-xl)',
                fontFamily: 'var(--font-heading)',
              }}>
                {founderName.charAt(0)}
              </div>
            )}

            <h2 className="section-heading centered" style={{
              color: 'var(--gold)',
              fontFamily: 'var(--font-heading)',
            }}>
              {t('about.founder_heading')}
            </h2>

            <h3 style={{
              color: '#fff', fontSize: '1.4rem',
              fontFamily: 'var(--font-heading)',
              marginBottom: '0.5rem',
            }}>
              {founderName}
            </h3>
            <p style={{ color: 'var(--gold-pale)', marginBottom: '1.5rem' }}>
              {founderTitle}
            </p>

            {settings?.mission && (
              <p style={{ color: 'rgba(255,255,255,.75)', maxWidth: '60ch', margin: '0 auto' }}>
                {settings.mission.slice(0, 280)}
                {settings.mission.length > 280 ? '…' : ''}
              </p>
            )}
          </div>
        </section>
      )}

      <GeoDivider />

      {/* 4 — Faculty */}
      {instructors.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-heading">{t('about.faculty_heading') || 'Our Faculty'}</h2>
            <div className="grid-3">
              {instructors.map((ins) => (
                <div key={ins.id} className="card" style={{ textAlign: 'center', borderLeft: 'none', borderTop: '4px solid var(--green)' }}>
                  <div className="card-body">
                    <ArchAvatar
                      src={ins.show_photo ? ins.photo : null}
                      alt={ins.name}
                      initial={ins.name?.charAt(0) || '?'}
                    />
                    <h3 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.25rem' }}>
                      {ins.name}
                    </h3>
                    {ins.title && (
                      <p style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 600 }}>
                        {ins.title}
                      </p>
                    )}
                    {ins.bio && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        {ins.bio.slice(0, 100)}…
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5 — Contact info */}
      {settings && (settings.address || settings.phone || settings.email) && (
        <section className="section section-warm">
          <div className="container" style={{ maxWidth: 820 }}>
            <h2 className="section-heading">Contact Information</h2>
            <div className="grid-2">
              {settings.address && (
                <div className="card">
                  <div className="card-body">
                    <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                      📍 Address
                    </h4>
                    <p style={{ color: 'var(--text-muted)' }}>{settings.address}</p>
                  </div>
                </div>
              )}
              {(settings.phone || settings.email) && (
                <div className="card">
                  <div className="card-body">
                    <h4 style={{ color: 'var(--gold)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                      Get In Touch
                    </h4>
                    {settings.phone && (
                      <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        📞 {settings.phone}
                      </p>
                    )}
                    {settings.email && (
                      <p style={{ color: 'var(--text-muted)' }}>
                        ✉️ {settings.email}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
