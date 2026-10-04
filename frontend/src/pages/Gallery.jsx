/**
 * Gallery.jsx
 *
 * Image priority:
 *   1. Album cover_image / item.image from Django API (served from backend/media/)
 *   2. LOCAL_PHOTOS fallback — real madarsa photos from public/images/
 *      displayed as a single "Photo Gallery" pseudo-album when no API albums exist
 *
 * Uses masonry-style .gallery-grid CSS class.
 * Clicking any photo opens a full-screen lightbox.
 */

import { useState } from 'react';
import { useGalleryAlbums, useGalleryAlbum } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';

// All real madarsa event photos copied to public/images/
const LOCAL_PHOTOS = [
  { id: 'p1',  src: '/images/hero1.jpg',    caption: 'Madarsa students at julus' },
  { id: 'p2',  src: '/images/hero2.jpg',    caption: 'Annual gathering' },
  { id: 'p3',  src: '/images/hero3.jpg',    caption: 'Quran Majeed programme — students on stage' },
  { id: 'p4',  src: '/images/hero4.jpg',    caption: 'Julus procession' },
  { id: 'p5',  src: '/images/event1.jpg',   caption: 'Ceremony decoration' },
  { id: 'p6',  src: '/images/event2.jpg',   caption: 'Event proceedings' },
  { id: 'p7',  src: '/images/event3.jpg',   caption: 'Students celebrating' },
  { id: 'p8',  src: '/images/event4.jpg',   caption: 'On stage ceremony' },
  { id: 'p9',  src: '/images/event5.jpg',   caption: 'Group photo' },
  { id: 'p10', src: '/images/event6.jpg',   caption: 'Madarsa event' },
  { id: 'p11', src: '/images/event7.jpg',   caption: 'Community gathering' },
  { id: 'p12', src: '/images/event8.jpg',   caption: 'Students at madarsa' },
  { id: 'p13', src: '/images/gallery1.jpg', caption: 'Graduation ceremony' },
  { id: 'p14', src: '/images/gallery2.jpg', caption: 'Prize distribution' },
  { id: 'p15', src: '/images/gallery3.jpg', caption: 'Religious celebration' },
  { id: 'p16', src: '/images/gallery4.jpg', caption: 'Annual event 2024' },
  { id: 'p17', src: '/images/gallery5.jpg', caption: 'Students and staff' },
  { id: 'p18', src: '/images/gallery6.jpg', caption: 'School programme' },
  { id: 'p19', src: '/images/gallery7.jpg', caption: 'Special event' },
  { id: 'p20', src: '/images/gallery8.jpg', caption: 'Community event' },
  { id: 'p21', src: '/images/gallery9.jpg', caption: 'Madarsa students' },
  { id: 'p22', src: '/images/gallery10.jpg',caption: 'Snapchat event' },
];

/** Full-screen lightbox */
function Lightbox({ photo, onClose }) {
  if (!photo) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(11,31,92,.96)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        cursor: 'zoom-out',
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '88vh' }}>
        <img
          src={photo.src || photo.image}
          alt={photo.caption || 'Gallery'}
          style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8, display: 'block', boxShadow: '0 8px 40px rgba(0,0,0,.5)' }}
        />
        {(photo.caption) && (
          <p style={{
            color: 'var(--gold-pale)', textAlign: 'center',
            marginTop: '0.75rem', fontSize: '0.9rem',
          }}>{photo.caption}</p>
        )}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: -16, right: -16,
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--gold)', color: 'var(--navy)',
            border: 'none', fontWeight: 700, fontSize: '1.1rem',
            cursor: 'pointer', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>
      </div>
    </div>
  );
}

function LocalGallery() {
  const [lightbox, setLightbox] = useState(null);
  return (
    <>
      <div className="gallery-grid">
        {LOCAL_PHOTOS.map((photo) => (
          <div
            key={photo.id}
            className="gallery-item"
            onClick={() => setLightbox(photo)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setLightbox(photo)}
            aria-label={photo.caption}
          >
            <img src={photo.src} alt={photo.caption} loading="lazy" />
          </div>
        ))}
      </div>
      <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}

function AlbumGrid({ onSelect }) {
  const { t } = useLang();
  const { data, loading } = useGalleryAlbums();
  const albums = data?.results || data || [];

  if (loading) return <div className="spinner" />;

  // No API albums — show real local photos instead
  if (albums.length === 0) return <LocalGallery />;

  return (
    <div className="grid-3">
      {albums.map((album, idx) => (
        <div
          key={album.id}
          className="card"
          onClick={() => onSelect(album)}
          style={{ cursor: 'pointer', borderLeft: 'none', borderTop: '4px solid var(--gold)' }}
        >
          <img
            className="card-img"
            src={album.cover_image || LOCAL_PHOTOS[idx % LOCAL_PHOTOS.length].src}
            alt={album.title}
            onError={(e) => { e.target.src = LOCAL_PHOTOS[idx % LOCAL_PHOTOS.length].src; }}
          />
          <div className="card-body">
            <h3 style={{ fontSize: '1rem', color: 'var(--navy)', marginBottom: '0.5rem' }}>
              {album.title}
            </h3>
            <p style={{ color: 'var(--gold)', fontSize: '0.85rem', fontWeight: 600 }}>
              {t('gallery.view_album')} →
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AlbumDetail({ albumId, onBack }) {
  const { t } = useLang();
  const { data, loading } = useGalleryAlbum(albumId);
  const items = data?.items || [];
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <button className="btn btn-outline mb-3" onClick={onBack}>← {t('common.back')}</button>
      {data && (
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--navy)', fontFamily: 'var(--font-heading)' }}>
          {data.title}
        </h2>
      )}
      {loading && <div className="spinner" />}
      <div className="gallery-grid">
        {items.map((item) => item.image && (
          <div
            key={item.id}
            className="gallery-item"
            onClick={() => setLightbox({ src: item.image, caption: item.caption })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setLightbox({ src: item.image, caption: item.caption })}
          >
            <img
              src={item.image}
              alt={item.caption || 'Gallery image'}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}

export default function Gallery() {
  const { t } = useLang();
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>{t('gallery.heading')}</h1>
          <p style={{ color: 'var(--gold-pale)', marginTop: '0.5rem' }}>
            Moments from our programmes, events, and celebrations
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {selectedAlbum
            ? <AlbumDetail albumId={selectedAlbum.id} onBack={() => setSelectedAlbum(null)} />
            : <AlbumGrid onSelect={setSelectedAlbum} />
          }
        </div>
      </section>
    </>
  );
}
