/**
 * HeroCarousel.jsx
 *
 * Priority order:
 *   1. Banner images uploaded via Django admin (from /api/v1/banner-images/)
 *   2. LOCAL_SLIDES fallback — real madarsa event photos from public/images/
 *
 * The local fallback ensures the hero always shows a real photo,
 * not a plain color block, even before the admin uploads any banners.
 * All local images are referenced as absolute /images/ paths (Vite public dir)
 * — NOT as static string src attributes that break silently.
 */

import { useState, useEffect, useRef } from 'react';
import { useBannerImages } from '../hooks/index.js';
import { useLang } from '../i18n/index.jsx';
import { Link } from 'react-router-dom';

// Real madarsa photos — copied to frontend/public/images/
// Referenced as /images/... so Vite serves them as static assets
const LOCAL_SLIDES = [
  {
    id: 'l1',
    image: '/images/hero1.jpg',
    title: 'Gulshan-e-Ashraf Arbi Madarsa',
    subtitle: 'Darul Uloom Tajdar-e-Ahle Sunnat Lilbanat, Annigeri',
  },
  {
    id: 'l2',
    image: '/images/hero2.jpg',
    title: 'Nurturing the Next Generation',
    subtitle: 'Quality Islamic education for over a decade',
  },
  {
    id: 'l3',
    image: '/images/hero3.jpg',
    title: 'Complete Quran Majeed Programme',
    subtitle: 'Celebrating our students\' achievements',
  },
  {
    id: 'l4',
    image: '/images/hero4.jpg',
    title: 'Knowledge, Character & Community',
    subtitle: 'Join us in building a better future',
  },
];

export default function HeroCarousel() {
  const { data, loading } = useBannerImages();
  const { t, getField }   = useLang();
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  // Use API banners if they exist, otherwise fall back to real local photos
  const slides = (data && data.length > 0) ? data : LOCAL_SLIDES;

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setActive(i);
    timerRef.current = setInterval(() => {
      setActive((idx) => (idx + 1) % slides.length);
    }, 5500);
  };

  if (loading) {
    return (
      <div className="hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  const getTitle    = (s) => s.title_en || s.title || s.title || '';
  const getSubtitle = (s) => s.subtitle_en || s.subtitle || '';

  return (
    <div className="hero" aria-label="Hero carousel">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`hero-slide${i === active ? ' active' : ''}`}
          aria-hidden={i !== active}
        >
          {/* Real photo — /images/ path served from public/ */}
          <img
            src={slide.image}
            alt={getTitle(slide) || 'Madarsa event'}
            loading={i === 0 ? 'eager' : 'lazy'}
            onError={(e) => {
              // If image fails (e.g. admin uploaded a bad URL), show navy bg
              e.target.style.display = 'none';
            }}
          />
          <div className="hero-overlay">
            <div className="hero-content">
              {getTitle(slide) && <h1>{getTitle(slide)}</h1>}
              {getSubtitle(slide) && <p>{getSubtitle(slide)}</p>}
              <div className="hero-ctas">
                <Link to="/about"  className="btn btn-accent btn-lg">{t('home.hero_cta')}</Link>
                <Link to="/donate" className="btn btn-outline-light btn-lg">{t('home.donate_cta')}</Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="hero-dots" role="tablist" aria-label="Carousel navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === active ? ' active' : ''}`}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
