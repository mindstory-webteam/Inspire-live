/**
 * src/utils/contactInfoApi.js  (Next.js client)
 *
 * Drop this in your Next.js `src/utils/` folder alongside your other *Api.js files.
 * It mirrors the pattern already used by contactApi.js in your codebase.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => ({ 'Content-Type': 'application/json' });

const getAuthHeaders = () => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('adminToken') || ''
      : '';
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data?.message || 'Request failed');
    error.response = { data, status: res.status };
    throw error;
  }
  return { data };
};

// ── Public ────────────────────────────────────────────────────────────────────

/**
 * GET /api/contact-info
 * Fetch all active contact info cards for display in ContactTop
 */
export const getContactInfo = () =>
  fetch(`${API_BASE}/contact-info`, { headers: getHeaders() }).then(handleResponse);

// ── Admin ─────────────────────────────────────────────────────────────────────

export const getAllContactInfo = () =>
  fetch(`${API_BASE}/admin/contact-info`, { headers: getAuthHeaders() }).then(handleResponse);

export const updateContactInfo = (type, payload) =>
  fetch(`${API_BASE}/admin/contact-info/${type}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  }).then(handleResponse);

export const toggleContactInfo = (type) =>
  fetch(`${API_BASE}/admin/contact-info/${type}/toggle`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  }).then(handleResponse);

export const reorderContactInfo = (items) =>
  fetch(`${API_BASE}/admin/contact-info/reorder`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ items }),
  }).then(handleResponse);

export const seedContactInfoDefaults = () =>
  fetch(`${API_BASE}/admin/contact-info/seed`, {
    method: 'POST',
    headers: getAuthHeaders(),
  }).then(handleResponse);

const contactInfoApi = {
  get:         getContactInfo,
  getAll:      getAllContactInfo,
  update:      updateContactInfo,
  toggle:      toggleContactInfo,
  reorder:     reorderContactInfo,
  seedDefaults: seedContactInfoDefaults,
};

export default contactInfoApi;