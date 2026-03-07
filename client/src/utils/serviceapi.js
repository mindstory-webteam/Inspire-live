/**
 * utils/serviceApi.js
 * Client-side API helpers for services.
 *
 * BUG FIXED:
 *   Client-side fetches had no Cache-Control header, so browsers / CDNs
 *   could serve a cached GET response even after a PUT/POST. Added
 *   `cache: "no-store"` on all GET calls so the browser always re-fetches.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ═══ PUBLIC ══════════════════════════════════════════════════════════════════

export const getAllServices = async () => {
  const res = await fetch(`${API_BASE}/services`, {
    cache: "no-store", // always fresh
  });
  if (!res.ok) throw new Error(`getAllServices: ${res.status}`);
  const data = await res.json();
  return data.data || [];
};

export const getServiceBySlug = async (slug) => {
  const res = await fetch(`${API_BASE}/services/slug/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`getServiceBySlug "${slug}": ${res.status}`);
  const data = await res.json();
  return data.data || null;
};

export const getServiceById = async (id) => {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`getServiceById "${id}": ${res.status}`);
  const data = await res.json();
  return data.data || null;
};

// ═══ ADMIN ════════════════════════════════════════════════════════════════════

export const getAdminAllServices = async () => {
  const res = await fetch(`${API_BASE}/services/admin/all`, {
    cache: "no-store",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`getAdminAllServices: ${res.status}`);
  const data = await res.json();
  return data.data || [];
};

/**
 * Create — pass FormData so file uploads work.
 * Do NOT set Content-Type manually; browser adds multipart boundary.
 */
export const createService = async (formData) => {
  const res = await fetch(`${API_BASE}/services`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error(`createService: ${res.status}`);
  return res.json();
};

export const updateService = async (id, formData) => {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: "PUT",
    headers: { ...authHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error(`updateService: ${res.status}`);
  return res.json();
};

export const deleteService = async (id) => {
  const res = await fetch(`${API_BASE}/services/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`deleteService: ${res.status}`);
  return res.json();
};

export const toggleServiceStatus = async (id) => {
  const res = await fetch(`${API_BASE}/services/${id}/toggle`, {
    method: "PATCH",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`toggleServiceStatus: ${res.status}`);
  return res.json();
};

export const toggleServiceHidden = async (id) => {
  const res = await fetch(`${API_BASE}/services/${id}/hide`, {
    method: "PATCH",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`toggleServiceHidden: ${res.status}`);
  return res.json();
};

export const reorderServices = async (order) => {
  const res = await fetch(`${API_BASE}/services/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ order }),
  });
  if (!res.ok) throw new Error(`reorderServices: ${res.status}`);
  return res.json();
};