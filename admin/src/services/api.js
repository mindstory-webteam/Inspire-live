/**
 * src/services/api.js  (admin panel)
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: API_BASE });

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ───────────────────────────────────────────────────────────────────────
export const authService = {
  login:          (data)     => api.post('/auth/login', data),
  getMe:          ()         => api.get('/auth/me'),
  updatePassword: (data)     => api.put('/auth/update-password', data),
  updateProfile:  (data)     => api.put('/auth/update-profile', data),
  getAllUsers:     ()         => api.get('/auth/users'),
  createUser:     (data)     => api.post('/auth/users', data),
  updateUser:     (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser:     (id)       => api.delete(`/auth/users/${id}`),
};

// ── Blogs ──────────────────────────────────────────────────────────────────────
export const blogService = {
  getAll:   (params)   => api.get('/admin/blogs', { params }),
  getById:  (id)       => api.get(`/blogs/${id}`),
  create:   (data)     => api.post('/admin/blogs', data),
  update:   (id, data) => api.put(`/admin/blogs/${id}`, data),
  delete:   (id)       => api.delete(`/admin/blogs/${id}`),
  getStats: ()         => api.get('/admin/stats'),
};

// ── Comments ───────────────────────────────────────────────────────────────────
export const commentService = {
  approve: (blogId, commentId) =>
    api.patch(`/admin/blogs/${blogId}/comments/${commentId}/approve`),
  delete: (blogId, commentId) =>
    api.delete(`/admin/blogs/${blogId}/comments/${commentId}`),
  reply: (blogId, commentId, data) =>
    api.post(`/admin/blogs/${blogId}/comments/${commentId}/reply`, data),
};

// ── Services ───────────────────────────────────────────────────────────────────
export const serviceService = {
  getAll:     (params) => api.get('/services', { params }),
  getBySlug:  (slug)   => api.get(`/services/slug/${slug}`),
  getById:    (id)     => api.get(`/services/${id}`),
  getAllAdmin: (params) => api.get('/services/admin/all', { params }),
  create: (formData) =>
    api.post('/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/services/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggle:  (id)   => api.patch(`/services/${id}/toggle`),
  reorder: (data) => api.put('/services/reorder', data),
  delete:  (id)   => api.delete(`/services/${id}`),
};

// ── Events ─────────────────────────────────────────────────────────────────────
export const eventService = {
  getAll:     (params) => api.get('/events', { params }),
  getById:    (id)     => api.get(`/events/${id}`),
  getAllAdmin: (params) => api.get('/admin/events', { params }),
  create: (formData) =>
    api.post('/admin/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/admin/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggle:  (id)   => api.patch(`/admin/events/${id}/toggle`),
  reorder: (data) => api.patch('/admin/events/reorder', data),
  delete:  (id)   => api.delete(`/admin/events/${id}`),
};

// ── Careers ────────────────────────────────────────────────────────────────────
export const careerService = {
  getAll:  (params) => api.get('/careers', { params }),
  getById: (id)     => api.get(`/careers/${id}`),
  apply: (id, formData) =>
    api.post(`/careers/${id}/apply`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getStats:     ()       => api.get('/admin/careers/stats'),
  getAllAdmin:   (params) => api.get('/admin/careers', { params }),
  getByIdAdmin: (id)     => api.get(`/admin/careers/${id}`),
  create: (formData) =>
    api.post('/admin/careers', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/admin/careers/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:  (id) => api.delete(`/admin/careers/${id}`),
  toggle:  (id) => api.patch(`/admin/careers/${id}/toggle`),
  getApplications: (careerId) => api.get(`/admin/careers/${careerId}/applications`),
  updateApplicationStatus: (careerId, appId, status) =>
    api.patch(`/admin/careers/${careerId}/applications/${appId}`, { status }),
};

// ── Contacts ───────────────────────────────────────────────────────────────────
export const contactService = {
  submit:       (data)       => api.post('/contact', data),
  getStats:     ()           => api.get('/admin/contacts/stats'),
  getAll:       (params)     => api.get('/admin/contacts', { params }),
  getById:      (id)         => api.get(`/admin/contacts/${id}`),
  updateStatus: (id, status) => api.patch(`/admin/contacts/${id}/status`, { status }),
  delete:       (id)         => api.delete(`/admin/contacts/${id}`),
  bulkDelete:   (ids)        => api.delete('/admin/contacts/bulk', { data: { ids } }),
};

// ── Team ───────────────────────────────────────────────────────────────────────
export const teamService = {
  getAll:  (params) => api.get('/team', { params }),
  getById: (id)     => api.get(`/team/${id}`),
  getAllAdmin: (params) => api.get('/admin/team', { params }),
  create: (formData) =>
    api.post('/admin/team', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) =>
    api.put(`/admin/team/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggle: (id) => api.patch(`/admin/team/${id}/toggle`),
  delete: (id) => api.delete(`/admin/team/${id}`),
};

// ── Testimonials ───────────────────────────────────────────────────────────────
export const testimonialService = {
  getAll:  (params)        => api.get('/admin/testimonials', { params }),
  create:  (formData)      => api.post('/admin/testimonials', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:  (id, formData)  => api.put(`/admin/testimonials/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggle:  (id)            => api.patch(`/admin/testimonials/${id}/toggle`),
  reorder: (data)          => api.patch('/admin/testimonials/reorder', data),
  delete:  (id)            => api.delete(`/admin/testimonials/${id}`),
};

export default api;


export const newsletterService = {
  // Stats card for dashboard
  getStats: () =>
    api.get('/admin/newsletter/stats'),

  // Paginated list  — params: { page, limit, status, search, sort }
  getAll: (params) =>
    api.get('/admin/newsletter', { params }),

  // Single subscriber detail
  getById: (id) =>
    api.get(`/admin/newsletter/${id}`),

  // Toggle active ↔ unsubscribed
  toggle: (id) =>
    api.patch(`/admin/newsletter/${id}/toggle`),

  // Delete single subscriber
  delete: (id) =>
    api.delete(`/admin/newsletter/${id}`),

  // Bulk delete  —  ids: string[]
  bulkDelete: (ids) =>
    api.delete('/admin/newsletter/bulk', { data: { ids } }),

  // Download CSV   — params: { status: 'active' | 'unsubscribed' }
  exportCSV: (params) =>
    api.get('/admin/newsletter/export', {
      params,
      responseType: 'blob',   // triggers file download
    }),
};
