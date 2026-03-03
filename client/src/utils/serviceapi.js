/**
 * lib/api/services.js  (Next.js frontend)
 *
 * Server-side helpers for SSR / generateStaticParams.
 * Drop this in your lib/api/ (or utils/api/) folder.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch all active services (ordered).
 * Used in ServicesPrimary and generateStaticParams.
 */
export async function getAllServices(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE}/services${query ? '?' + query : ''}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

/**
 * Fetch full service detail by slug, including prevService / nextService slugs.
 * Used in ServicePage and generateMetadata.
 */
export async function getServiceBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE}/services/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

/**
 * Fetch a single service by Mongo _id.
 * Useful for admin preview pages.
 */
export async function getServiceById(id) {
  try {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}