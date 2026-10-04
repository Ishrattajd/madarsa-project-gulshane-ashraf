/**
 * Navbar.jsx
 *
 * Uses design-system CSS classes from index.css:
 *   .navbar, .navbar-inner, .navbar-brand, .navbar-links
 *   .hamburger, .hamburger-bar (.open state)
 *   .lang-switcher, .lang-btn (.active state)
 *
 * Mobile: hamburger triggers .navbar-links.open (the UL becomes a
 * fixed full-width drawer below the sticky navbar).
 *
 * backdrop div closes the drawer when tapping outside.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/index.jsx';
import { useSiteSettings } from '../hooks/index.js';
import logoImg from '../assets/logo/logo-source.png';

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'ur', label: 'UR' },
  { code: 'kn', label: 'KN' },
];

export default function Navbar() {
  const { t, lang, setLang } = useLang();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: settings } = useSiteSettings();

  // Close mobile drawer on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const links = [
    { to: '/',           label: t('nav.home') },
    { to: '/about',      label: t('nav.about') },
    { to: '/programs',   label: t('nav.programs') },
    { to: '/gallery',    label: t('nav.gallery') },
    { to: '/events',     label: t('nav.events') },
    { to: '/contact',    label: t('nav.contact') },
    { to: '/admissions', label: t('nav.admissions') },
  ];

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const closeMenu = () => setMenuOpen(false);
  const institutionName = settings?.institution_name || 'Gulshan-e-Ashraf';

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="container navbar-inner">
          {/* Brand / Logo */}
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <img
              src={settings?.logo_url || logoImg}
              alt={institutionName}
              style={{ width: 42, height: 42, objectFit: 'contain', borderRadius: 6 }}
            />
            <div className="navbar-brand-text">
              <span className="brand-name">{institutionName}</span>
              <span className="brand-sub">Annigeri, Karnataka</span>
            </div>
          </Link>

          {/* Desktop links — hidden on mobile, shown as drawer when .open */}
          <ul
            id="main-nav-links"
            className={`navbar-links${menuOpen ? ' open' : ''}`}
            role="menubar"
          >
            {links.map((l) => (
              <li key={l.to} role="none">
                <Link
                  to={l.to}
                  className={isActive(l.to) ? 'active' : undefined}
                  role="menuitem"
                  onClick={closeMenu}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li role="none">
              <Link
                to="/donate"
                role="menuitem"
                onClick={closeMenu}
                style={{
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  padding: '0.35rem 0.8rem',
                  marginLeft: '0.25rem',
                }}
              >
                {t('nav.donate')}
              </Link>
            </li>
            {/* Admin link — only in mobile drawer */}
            <li className="mobile-admin-link" role="none" style={{ borderTop: '1px solid rgba(255,255,255,.1)', marginTop: '0.25rem' }}>
              <Link to="/admin" role="menuitem" onClick={closeMenu}>
                {t('nav.admin')}
              </Link>
            </li>
          </ul>

          {/* Right side: language switcher + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div className="lang-switcher" role="group" aria-label="Language switcher">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  className={`lang-btn${lang === code ? ' active' : ''}`}
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  aria-label={`Switch to ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Hamburger — visible below 900px via CSS */}
            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="main-nav-links"
              aria-label="Toggle navigation menu"
            >
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop — closes drawer when tapping outside; z-index below nav-links (99) */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 98,
            background: 'rgba(11,31,92,.55)',
            top: 67,  /* navbar height */
          }}
        />
      )}
    </>
  );
}
