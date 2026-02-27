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
  // ── Public (no auth needed) ──────────────────────────────────────────────
  // GET /api/events?type=conference&status=featured
  getAll:   (params)   => api.get('/events', { params }),
  getById:  (id)       => api.get(`/events/${id}`),

  // ── Admin (protected — token sent automatically via interceptor) ─────────
  // GET    /api/admin/events
  // POST   /api/admin/events          → FormData (with eventImage file)
  // PUT    /api/admin/events/:id      → FormData (with optional new image)
  // PATCH  /api/admin/events/:id/toggle
  // PATCH  /api/admin/events/reorder  → { orders: [{id, order}] }
  // DELETE /api/admin/events/:id
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

export default api;