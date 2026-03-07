/**
 * lib/api/services.js
 * Server-side fetch helpers for SSR pages & generateStaticParams.
 *
 * BUG FIXED:
 *   `next: { revalidate: 60 }` was caching responses for 60 seconds.
 *   After saving in admin the frontend kept showing OLD data for up to a
 *   minute. Changed to `cache: "no-store"` so every page request always
 *   hits the backend and returns fresh data.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getAllServices() {
  try {
    const res = await fetch(`${API_BASE}/services`, {
      cache: "no-store", // ← FIX: was revalidate:60 → stale for 60 s after edit
    });
    if (!res.ok) { console.error(`getAllServices HTTP ${res.status}`); return []; }
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("getAllServices:", err.message);
    return [];
  }
}

export async function getServiceBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE}/services/slug/${slug}`, {
      cache: "no-store", // ← FIX: edits never showed up on detail page
    });
    if (!res.ok) { console.error(`getServiceBySlug(${slug}) HTTP ${res.status}`); return null; }
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.error(`getServiceBySlug(${slug}):`, err.message);
    return null;
  }
}

export async function getServiceById(id) {
  try {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) { console.error(`getServiceById(${id}) HTTP ${res.status}`); return null; }
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.error(`getServiceById(${id}):`, err.message);
    return null;
  }
}