// utils/eventApi.js
// Mirrors the pattern of blogApi.js / serviceapi.js in your utils folder

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Helper ──────────────────────────────────────────────────────────────────

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed with status ${res.status}`);
  }
  return res.json();
};

// ─── Public API calls ─────────────────────────────────────────────────────────

/**
 * GET /api/events
 * Fetch all active events (public).
 *
 * @param {{ type?: string, status?: string }} [filters={}]
 * @returns {Promise<Array>}  Array of event objects
 *
 * Usage:
 *   import { getEvents } from '@/utils/eventApi';
 *   const events = await getEvents({ type: 'conference' });
 */
export const getEvents = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.set('type', filters.type);
  if (filters.status) params.set('status', filters.status);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE_URL}/api/events${query}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 }, // Next.js ISR — re-fetch every 60 s
  });

  const json = await handleResponse(res);
  // Backend returns { success, count, data: [...] }
  return Array.isArray(json) ? json : (json.data ?? json.events ?? []);
};

/**
 * GET /api/events/:id
 * Fetch a single active event by its MongoDB _id (public).
 *
 * @param {string} id  MongoDB ObjectId string
 * @returns {Promise<Object>} Event object
 */
export const getEventById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/events/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const json = await handleResponse(res);
  return json.data ?? json;
};

// ─── Admin API calls (require auth token) ────────────────────────────────────

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

/**
 * GET /api/admin/events
 * Fetch all events including drafts (admin only).
 *
 * @param {string} token  JWT access token
 * @param {{ type?: string, status?: string, search?: string }} [filters={}]
 * @returns {Promise<Array>}
 */
export const adminGetAllEvents = async (token, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.set('type', filters.type);
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${BASE_URL}/api/admin/events${query}`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const json = await handleResponse(res);
  return Array.isArray(json) ? json : (json.data ?? []);
};

/**
 * POST /api/admin/events
 * Create a new event (admin only). Accepts multipart/form-data for image upload.
 *
 * @param {string}    token    JWT access token
 * @param {FormData}  formData Fields + optional eventImage file
 * @returns {Promise<Object>} Created event
 */
export const createEvent = async (token, formData) => {
  const res = await fetch(`${BASE_URL}/api/admin/events`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }, // NO Content-Type — let browser set multipart boundary
    body: formData,
  });

  const json = await handleResponse(res);
  return json.data ?? json;
};

/**
 * PUT /api/admin/events/:id
 * Update an existing event (admin only). Accepts multipart/form-data.
 *
 * @param {string}    token    JWT access token
 * @param {string}    id       Event MongoDB _id
 * @param {FormData}  formData Changed fields + optional new eventImage
 * @returns {Promise<Object>} Updated event
 */
export const updateEvent = async (token, id, formData) => {
  const res = await fetch(`${BASE_URL}/api/admin/events/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const json = await handleResponse(res);
  return json.data ?? json;
};

/**
 * PATCH /api/admin/events/:id/toggle
 * Toggle isActive for an event (admin only).
 *
 * @param {string} token  JWT access token
 * @param {string} id     Event MongoDB _id
 * @returns {Promise<Object>} Updated event
 */
export const toggleEventStatus = async (token, id) => {
  const res = await fetch(`${BASE_URL}/api/admin/events/${id}/toggle`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });

  const json = await handleResponse(res);
  return json.data ?? json;
};

/**
 * DELETE /api/admin/events/:id
 * Delete an event and its Cloudinary image (admin only).
 *
 * @param {string} token  JWT access token
 * @param {string} id     Event MongoDB _id
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteEvent = async (token, id) => {
  const res = await fetch(`${BASE_URL}/api/admin/events/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  return handleResponse(res);
};

/**
 * PATCH /api/admin/events/reorder
 * Bulk-reorder events (admin only).
 *
 * @param {string} token   JWT access token
 * @param {Array<{ id: string, order: number }>} orders
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const reorderEvents = async (token, orders) => {
  const res = await fetch(`${BASE_URL}/api/admin/events/reorder`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ orders }),
  });

  return handleResponse(res);
};