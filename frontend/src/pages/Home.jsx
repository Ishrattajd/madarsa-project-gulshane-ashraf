/**
 * Home.jsx
 *
 * Sections (in order):
 *   1. HeroCarousel — full-bleed real photo
 *   2. Stats strip — navy bg with gold numbers
 *   3. GeoDivider — Islamic geometric pattern band
 *   4. Programs preview — gold-top cards
 *   5. Founder section — arch-framed photo, navy bg
 *   6. Events preview — with real event photos
 *   7. Testimonials
 *   8. CTA strip — donate
 *
 * founder_name and founder_title: ONLY from SiteSettings API — never hardcoded.
 */

import HeroCarousel from '../components/HeroCarousel.jsx';
import ProgramCard from '../components/ProgramCard.jsx';
import TestimonialCard from '../components/TestimonialCard.jsx';
import { useSiteSettings, usePrograms, useTestimonials, useEvents } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';
import { Link } from 'react-router-dom';

// Real event photos from public/images/ — displayed in Events preview
const EVENT_PHOTOS = [
  '/images/event1.jpg',
  '/images/event2.jpg',
  '/images/event3.jpg',
  '/images/event4.jpg',
];

function GeoDivider() {
  return <div className="geo-divider" aria-hidden="true" />;
}

export default function Home() {
  const { t, getField }  = useLang();
  const { data: settings } = useSiteSettings();
  const { data: programsData, loading: programsLoading } = usePrograms({ is_active: true });
  const { data: testimonialsData } = useTestimonials();
  const { data: eventsData }       = useEvents({ is_published: true });

  // founder fields from SiteSettings API — NEVER hardcoded
  const founderName  = settings?.founder_name  || '';
  const founderTitle = settings?.founder_title || '';

  const programs     = programsData?.results     || programsData     || [];
  const testimonials = testimonialsData?.results || testimonialsData || [];
  const events       = eventsData?.results       || eventsData       || [];

  return (
    <>
      {/* 1 — Hero */}
      <HeroCarousel />

      {/* Geometric divider */}
      <GeoDivider />

      {/* 3 — Programs */}
      <section className="section">
        <div className="container">
          <h2 className="section-heading">{t('home.programs_heading')}</h2>
          {programsLoading ? (
            <div className="spinner" />
          ) : programs.length > 0 ? (
            <>
              <div className="grid-3">
                {programs.slice(0, 6).map((p) => <ProgramCard key={p.id} program={p} />)}
              </div>
              <div className="text-center mt-4">
                <Link to="/programs" className="btn btn-primary">{t('common.read_more')}</Link>
              </div>
            </>
          ) : (
            /* Fallback — show sample program cards before API data exists */
            <div className="grid-3">
              {[
                { id:'s1', en:'Nazra Quran', desc:'Recitation with Tajweed rules for all ages' },
                { id:'s2', en:'Hifz Programme', desc:'Complete memorisation of the Holy Quran' },
                { id:'s3', en:'Urdu & Arabic', desc:'Language and Islamic studies curriculum' },
              ].map((p) => (
                <div key={p.id} className="card program-card">
                  <div className="card-body">
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--navy)' }}>{p.en}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Geometric divider */}
      <GeoDivider />

      {/* 4 — Founder section — arch-framed, navy background */}
      {(founderName || founderTitle) && (
        <section className="section-sm founder-section">
          <div className="container text-center" style={{ position: 'relative' }}>
            {/* Arch-framed photo placeholder — actual photo set in admin */}
            {settings?.founder_photo && (
              <div className="founder-photo-frame">
                <img src={settings.founder_photo} alt={founderName} />
              </div>
            )}
            <h2 className="section-heading centered" style={{ color: 'var(--gold)' }}>
              {t('home.founder_section_heading')}
            </h2>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
              {founderName}
            </h3>
            <p style={{ color: 'var(--gold-pale)', marginBottom: '1.5rem' }}>{founderTitle}</p>
            {settings?.mission && (
              <p style={{ color: 'rgba(255,255,255,.75)', maxWidth: '60ch', margin: '0 auto' }}>
                {settings.mission.slice(0, 300)}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 5 — Events preview with real photos */}
      <section className="section section-warm">
        <div className="container">
          <h2 className="section-heading">{t('home.events_heading')}</h2>
          <div className="grid-2">
            {events.length > 0
              ? events.slice(0, 4).map((ev, idx) => (
                <div key={ev.id} className="card">
                  <img
                    className="card-img"
                    src={ev.cover_image || EVENT_PHOTOS[idx % EVENT_PHOTOS.length]}
                    alt={getField(ev, 'title')}
                    onError={(e) => { e.target.src = EVENT_PHOTOS[idx % EVENT_PHOTOS.length]; }}
                  />
                  <div className="card-body">
                    <h3 style={{ marginBottom: '0.5rem' }}>{getField(ev, 'title')}</h3>
                    {ev.event_date && (
                      <p style={{ color: 'var(--gold)', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                        📅 {new Date(ev.event_date).toLocaleDateString()}
                      </p>
                    )}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {getField(ev, 'body')?.slice(0, 120)}…
                    </p>
                  </div>
                </div>
              ))
              : /* Fallback with real photos */
              EVENT_PHOTOS.map((photo, i) => (
                <div key={i} className="card">
                  <img
                    className="card-img"
                    src={photo}
                    alt={`Madarsa event ${i + 1}`}
                  />
                  <div className="card-body">
                    <h3 style={{ color: 'var(--navy)', marginBottom: '0.5rem' }}>
                      {['Complete Quran Majeed Programme', 'Annual Julus Celebration', 'Graduation Ceremony', 'Community Event'][i]}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Celebrating milestones in Islamic education at Gulshan-e-Ashraf.
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="text-center mt-4">
            <Link to="/events" className="btn btn-primary">{t('common.read_more')}</Link>
          </div>
        </div>
      </section>

      {/* Geometric divider */}
      <GeoDivider />

      {/* 6 — Testimonials */}
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-heading">{t('home.testimonials_heading')}</h2>
            <div className="grid-3">
              {testimonials.slice(0, 3).map((t_) => (
                <TestimonialCard key={t_.id} testimonial={t_} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7 — CTA */}
      <div className="cta-strip">
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '0.75rem' }}>
            {t('home.donate_heading')}
          </h2>
          <p style={{ maxWidth: '52ch' }}>
            {settings?.mission?.slice(0, 180) || t('home.donate_subheading')}
          </p>
          <Link to="/donate" className="btn btn-accent btn-lg" style={{ marginTop: 'var(--space-xl)' }}>
            {t('home.donate_cta')}
          </Link>
        </div>
      </div>
    </>
  );
}
