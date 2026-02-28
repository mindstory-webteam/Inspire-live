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
  login:          (data) => api.post('/auth/login', data),
  getMe:          ()     => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/update-password', data),
};

// ── Blogs ──────────────────────────────────────────────────────────────────────
export const blogService = {
  getAll:   (params)    => api.get('/admin/blogs', { params }),
  getById:  (id)        => api.get(`/blogs/${id}`),
  create:   (data)      => api.post('/admin/blogs', data),
  update:   (id, data)  => api.put(`/admin/blogs/${id}`, data),
  delete:   (id)        => api.delete(`/admin/blogs/${id}`),
  getStats: ()          => api.get('/admin/stats'),
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
  getAll:     (params)   => api.get('/services', { params }),
  getBySlug:  (slug)     => api.get(`/services/slug/${slug}`),
  getAllAdmin: (params)   => api.get('/services/admin/all', { params }),
  getById:    (id)       => api.get(`/services/${id}`),
  create:     (data)     => api.post('/services', data),
  update:     (id, data) => api.put(`/services/${id}`, data),
  reorder:    (data)     => api.put('/services/reorder', data),
  delete:     (id)       => api.delete(`/services/${id}`),
};

// ── Events ─────────────────────────────────────────────────────────────────────
export const eventService = {
  getAll:   (params)   => api.get('/events', { params }),
  getById:  (id)       => api.get(`/events/${id}`),
  getAllAdmin: (params)   => api.get('/admin/events', { params }),
  create:     (formData) => api.post('/admin/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/admin/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  toggle:  (id)    => api.patch(`/admin/events/${id}/toggle`),
  reorder: (data)  => api.patch('/admin/events/reorder', data),
  delete:  (id)    => api.delete(`/admin/events/${id}`),
};

// ── Careers ────────────────────────────────────────────────────────────────────
export const careerService = {
  // ── Public ───────────────────────────────────────────────────────────────
  getAll:  (params) => api.get('/careers', { params }),
  getById: (id)     => api.get(`/careers/${id}`),

  // Apply — FormData (fullName, email, phone, coverLetter, resume file)
  apply: (id, formData) => api.post(`/careers/${id}/apply`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // ── Admin (JWT auto-attached via interceptor) ─────────────────────────────
  getStats:     ()        => api.get('/admin/careers/stats'),
  getAllAdmin:   (params)  => api.get('/admin/careers', { params }),
  getByIdAdmin: (id)      => api.get(`/admin/careers/${id}`),

  // create / update now send FormData so careerImage file can be uploaded
  create: (formData) => api.post('/admin/careers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/admin/careers/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  delete: (id)  => api.delete(`/admin/careers/${id}`),
  toggle: (id)  => api.patch(`/admin/careers/${id}/toggle`),

  getApplications: (careerId) => api.get(`/admin/careers/${careerId}/applications`),
  updateApplicationStatus: (careerId, appId, status) =>
    api.patch(`/admin/careers/${careerId}/applications/${appId}`, { status }),
};

export default api;