/**
 * utils/testimonialApi.js
 * Client-side API helpers for testimonials.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('adminToken') || ''
      : '';
  return { Authorization: `Bearer ${token}` };
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

export const getTestimonialsClient = () =>
  fetch(`${API_BASE}/testimonials`, {
    headers: { 'Content-Type': 'application/json' },
  }).then(handleResponse);

export const getTestimonialById = (id) =>
  fetch(`${API_BASE}/testimonials/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  }).then(handleResponse);

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminGetAllTestimonials = (params = {}) => {
  const q = new URLSearchParams();
  if (params.page)                              q.set('page',   params.page);
  if (params.limit)                             q.set('limit',  params.limit);
  if (params.search)                            q.set('search', params.search);
  if (params.status && params.status !== 'all') q.set('status', params.status);
  return fetch(`${API_BASE}/admin/testimonials?${q}`, {
    headers: getAuthHeaders(),
  }).then(handleResponse);
};

export const createTestimonial = (formData) =>
  fetch(`${API_BASE}/admin/testimonials`, {
    method: 'POST',
    headers: getAuthHeaders(), // NO Content-Type — browser sets multipart boundary
    body: formData,
  }).then(handleResponse);

export const updateTestimonial = (id, formData) =>
  fetch(`${API_BASE}/admin/testimonials/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData,
  }).then(handleResponse);

export const toggleTestimonialStatus = (id) =>
  fetch(`${API_BASE}/admin/testimonials/${id}/toggle`, {
    method: 'PATCH',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
  }).then(handleResponse);

export const reorderTestimonials = (items) =>
  fetch(`${API_BASE}/admin/testimonials/reorder`, {
    method: 'PATCH',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  }).then(handleResponse);

export const deleteTestimonial = (id) =>
  fetch(`${API_BASE}/admin/testimonials/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  }).then(handleResponse);

const testimonialApi = {
  getAll:      getTestimonialsClient,
  getById:     getTestimonialById,
  adminGetAll: adminGetAllTestimonials,
  create:      createTestimonial,
  update:      updateTestimonial,
  toggle:      toggleTestimonialStatus,
  reorder:     reorderTestimonials,
  delete:      deleteTestimonial,
};

export default testimonialApi;