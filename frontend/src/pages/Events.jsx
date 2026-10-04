import { Link } from 'react-router-dom';
import { useEvents } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';

export default function Events() {
  const { t, getField } = useLang();
  const { data, loading, error } = useEvents({ is_published: true });
  const events = data?.results || data || [];
  return (
    <>
      <div className="page-hero">
        <div className="container"><h1>{t('events.heading')}</h1></div>
      </div>
      <section className="section">
        <div className="container">
          {loading && <div className="spinner" />}
          {error   && <div className="alert alert-danger">{t('common.error')}</div>}
          {!loading && events.length === 0 && (
            <p className="text-center text-muted">{t('events.no_events')}</p>
          )}
          <div className="grid-2">
            {events.map((ev) => (
              <div key={ev.id} className="card">
                {ev.cover_image && <img className="card-img" src={ev.cover_image} alt={getField(ev, 'title')} />}
                <div className="card-body">
                  <h3 style={{ marginBottom: '0.5rem' }}>
                    <Link to={`/events/${ev.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {getField(ev, 'title')}
                    </Link>
                  </h3>
                  {ev.event_date && (
                    <p style={{ color: 'var(--clr-accent)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                      📅 {new Date(ev.event_date).toLocaleDateString()}
                    </p>
                  )}
                  <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>
                    {getField(ev, 'body')?.slice(0, 140)}
                    {getField(ev, 'body')?.length > 140 ? '…' : ''}
                  </p>
                  <Link to={`/events/${ev.id}`} className="btn btn-outline btn-sm">
                    {t('common.read_more')} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
