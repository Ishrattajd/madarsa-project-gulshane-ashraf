/**
 * Shared data-fetching hooks.
 * Uses PublicDataContext to cache results in memory and prevent duplicate API calls.
 */

import { useState, useEffect, useMemo } from 'react';
import { usePublicData } from '../context/PublicDataContext.jsx';
import api from '../api/client.js';

function useFetch(url, params = {}) {
  const { cache, loadingMap, errorMap, fetchResource } = usePublicData();
  const paramStr = useMemo(() => JSON.stringify(params), [params]);

  const cacheKey = useMemo(() => {
    if (!url) return null;
    return `${url}?${paramStr}`;
  }, [url, paramStr]);

  useEffect(() => {
    if (!url) return;
    fetchResource(url, url, JSON.parse(paramStr)).catch(() => {});
  }, [url, paramStr, fetchResource]);

  const data = cacheKey ? cache[cacheKey] : null;
  const loading = cacheKey ? (loadingMap[cacheKey] ?? true) : false;
  const error = cacheKey ? (errorMap[cacheKey] ?? null) : null;

  return { data, loading, error };
}

export function useSiteSettings() {
  return useFetch('/site-settings/');
}

export function useBannerImages() {
  return useFetch('/banner-images/');
}

export function usePrograms(params) {
  return useFetch('/programs/', params);
}

export function useProgram(id) {
  return useFetch(id ? `/programs/${id}/` : null);
}

export function useGalleryAlbums() {
  return useFetch('/gallery/');
}

export function useGalleryAlbum(id) {
  return useFetch(id ? `/gallery/${id}/` : null);
}

export function useTestimonials() {
  return useFetch('/testimonials/');
}

export function useEvents(params) {
  return useFetch('/events/', params);
}

export function useEvent(id) {
  return useFetch(id ? `/events/${id}/` : null);
}

export function useInstructors() {
  return useFetch('/instructors/');
}

export function useDonationFunds() {
  return useFetch('/donation-funds/');
}

export function useDonateStatus() {
  return useFetch('/donations/status/');
}

/**
 * Admin hook: fetches any admin resource.
 * refresh is a counter — increment it to re-fetch after a mutation.
 */
export function useAdminResource(path, refresh = 0) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    setLoading(true);
    api.get(path)
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [path, refresh]);

  return { data, loading, error };
}
