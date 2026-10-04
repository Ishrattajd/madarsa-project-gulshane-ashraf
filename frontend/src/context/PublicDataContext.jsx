/**
 * PublicDataContext.jsx — Single source of truth & shared data layer for all public resources.
 *
 * Architecture:
 * - Fetches public resources ONCE on app init / provider mount.
 * - Stores responses in an in-memory cache object.
 * - Prevents duplicate network requests when multiple components (Navbar, Footer, Home, etc.)
 *   need the same data.
 * - Exposes refresh function to re-fetch on demand (e.g. after admin mutation).
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/client.js';

const PublicDataContext = createContext(null);

export function PublicDataProvider({ children }) {
  const [cache, setCache] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  // Fetch a resource once and store in cache
  const fetchResource = useCallback(async (key, url, params = {}) => {
    const paramKey = JSON.stringify(params);
    const cacheKey = `${url}?${paramKey}`;

    // If already cached, do not fetch again
    if (cache[cacheKey] !== undefined) {
      return cache[cacheKey];
    }

    setLoadingMap((prev) => ({ ...prev, [cacheKey]: true }));
    setErrorMap((prev) => ({ ...prev, [cacheKey]: null }));

    try {
      const res = await api.get(url, { params });
      const data = res.data;
      setCache((prev) => ({ ...prev, [cacheKey]: data }));
      return data;
    } catch (err) {
      setErrorMap((prev) => ({ ...prev, [cacheKey]: err }));
      throw err;
    } finally {
      setLoadingMap((prev) => ({ ...prev, [cacheKey]: false }));
    }
  }, [cache]);

  // Force invalidate a cache key or all cache
  const invalidateCache = useCallback((keyPrefix) => {
    if (!keyPrefix) {
      setCache({});
    } else {
      setCache((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (k.includes(keyPrefix)) delete next[k];
        });
        return next;
      });
    }
  }, []);

  const value = useMemo(() => ({
    cache,
    loadingMap,
    errorMap,
    fetchResource,
    invalidateCache,
  }), [cache, loadingMap, errorMap, fetchResource, invalidateCache]);

  return (
    <PublicDataContext.Provider value={value}>
      {children}
    </PublicDataContext.Provider>
  );
}

export function usePublicData() {
  const context = useContext(PublicDataContext);
  if (!context) {
    throw new Error('usePublicData must be used within a PublicDataProvider');
  }
  return context;
}
