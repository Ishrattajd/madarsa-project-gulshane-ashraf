/**
 * i18n system — language context, hook, and HTML dir/lang mutation.
 *
 * Supported languages:
 *   en — English (LTR)
 *   ur — Urdu (RTL)  → sets <html dir="rtl" lang="ur">
 *   kn — Kannada (LTR)
 *
 * The active language is persisted in localStorage under 'madarsa_lang'.
 * API content uses *_en / *_ur / *_kn fields; use getField(obj, 'title') to
 * automatically pick the right suffix for the active language.
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import en from './en.json';
import ur from './ur.json';
import kn from './kn.json';

const TRANSLATIONS = { en, ur, kn };

const RTL_LANGS = new Set(['ur']);

const STORAGE_KEY = 'madarsa_lang';

export const LangContext = createContext(null);

/** Resolve a dot-path like "donate.heading" from the translation object. */
function resolvePath(obj, path) {
  return path.split('.').reduce((cur, key) => cur?.[key], obj) ?? path;
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'en'
  );

  // Sync <html dir> and <html lang> whenever language changes
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', RTL_LANGS.has(lang) ? 'rtl' : 'ltr');
    // Also toggle a CSS class so components can apply RTL-specific overrides
    html.classList.toggle('rtl', RTL_LANGS.has(lang));
  }, [lang]);

  const setLang = useCallback((code) => {
    if (!TRANSLATIONS[code]) return;
    localStorage.setItem(STORAGE_KEY, code);
    setLangState(code);
  }, []);

  /** Translate a dot-path key, e.g. t('donate.heading') */
  const t = useCallback(
    (key) => resolvePath(TRANSLATIONS[lang], key),
    [lang]
  );

  /**
   * Pick the localised field from an API object.
   * e.g. getField(program, 'title') → program.title_ur when lang='ur'
   * Falls back to the _en field if the localised field is empty.
   */
  const getField = useCallback(
    (obj, field) => {
      if (!obj) return '';
      const localised = obj[`${field}_${lang}`];
      if (localised) return localised;
      return obj[`${field}_en`] || obj[field] || '';
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t, getField, isRtl: RTL_LANGS.has(lang) }}>
      {children}
    </LangContext.Provider>
  );
}

/** Hook to consume the i18n context. */
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
