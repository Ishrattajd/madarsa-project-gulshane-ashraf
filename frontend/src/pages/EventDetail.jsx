import { useParams, Link } from 'react-router-dom';
import { useEvent } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';

export default function EventDetail() {
  const { id } = useParams();
  const { t, getField } = useLang();
  const { data: event, loading, error } = useEvent(id);

  if (loading) {
    return (
      <div className="container section text-center">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container section text-center">
        <div className="alert alert-danger" style={{ maxWidth: 500, margin: '0 auto 2rem' }}>
          {t('common.error')}
        </div>
        <Link to="/events" className="btn btn-outline">
          ← {t('nav.events')}
        </Link>
      </div>
    );
  }

  const title = getField(event, 'title');
  const body = getField(event, 'body');

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <Link to="/events" style={{ color: 'var(--clr-accent)', fontSize: '0.9rem', display: 'inline-block', marginBottom: '0.5rem' }}>
            ← {t('nav.events')}
          </Link>
          <h1>{title}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="card">
            {event.cover_image && (
              <img
                className="card-img"
                src={event.cover_image}
                alt={title}
                style={{ maxHeight: 400, objectFit: 'cover' }}
              />
            )}
            <div className="card-body">
              {event.event_date && (
                <div style={{ color: 'var(--clr-accent)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>
                  📅 {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}

              <p style={{ color: 'var(--clr-text-muted)', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: '2rem' }}>
                {body}
              </p>

              {/* Event photo gallery */}
              {Array.isArray(event.images) && event.images.length > 0 && (
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--clr-border)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--clr-accent)' }}>
                    Event Gallery ({event.images.length} Photos)
                  </h3>
                  <div className="grid-2">
                    {event.images.map((imgObj) => (
                      <div key={imgObj.id} className="card" style={{ overflow: 'hidden' }}>
                        <img
                          src={imgObj.image}
                          alt={imgObj.caption || title}
                          style={{ width: '100%', height: 220, objectFit: 'cover' }}
                        />
                        {imgObj.caption && (
                          <div className="card-body" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>
                            {imgObj.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--clr-border)', paddingTop: '1.5rem', marginTop: '2rem' }}>
                <Link to="/events" className="btn btn-outline">
                  ← Back to Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
