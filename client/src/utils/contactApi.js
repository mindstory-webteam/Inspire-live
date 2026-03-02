const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => ({ 'Content-Type': 'application/json' });

const getAuthHeaders = () => {
  // SSR guard — localStorage is not available on the server
  const token = typeof window !== 'undefined'
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
export const submitContact = (formData) =>
  fetch(`${API_BASE}/contact`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(formData),
  }).then(handleResponse);

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getContactStats = () =>
  fetch(`${API_BASE}/admin/contacts/stats`, { headers: getAuthHeaders() })
    .then(handleResponse);

export const getAllContacts = (params = {}) => {
  const q = new URLSearchParams();
  if (params.page)                             q.set('page',   params.page);
  if (params.limit)                            q.set('limit',  params.limit);
  if (params.search)                           q.set('search', params.search);
  if (params.status && params.status !== 'all') q.set('status', params.status);
  return fetch(`${API_BASE}/admin/contacts?${q}`, { headers: getAuthHeaders() })
    .then(handleResponse);
};

export const getContactById = (id) =>
  fetch(`${API_BASE}/admin/contacts/${id}`, { headers: getAuthHeaders() })
    .then(handleResponse);

export const updateContactStatus = (id, status) =>
  fetch(`${API_BASE}/admin/contacts/${id}/status`, {
    method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify({ status }),
  }).then(handleResponse);

export const deleteContact = (id) =>
  fetch(`${API_BASE}/admin/contacts/${id}`, {
    method: 'DELETE', headers: getAuthHeaders(),
  }).then(handleResponse);

export const bulkDeleteContacts = (ids) =>
  fetch(`${API_BASE}/admin/contacts/bulk`, {
    method: 'DELETE', headers: getAuthHeaders(), body: JSON.stringify({ ids }),
  }).then(handleResponse);

const contactApi = {
  submit:       submitContact,
  getStats:     getContactStats,
  getAll:       getAllContacts,
  getById:      getContactById,
  updateStatus: updateContactStatus,
  delete:       deleteContact,
  bulkDelete:   bulkDeleteContacts,
};

export default contactApi;