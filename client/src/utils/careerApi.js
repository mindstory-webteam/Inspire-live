/**
 * careerApi.js — PUBLIC + ADMIN Career API
 *
 * Usage (frontend / Next.js pages):
 *   import { careerService } from '@/utils/careerApi';
 *
 *   const { data } = await careerService.getAll({ page: 1, limit: 6 });
 *   const { data } = await careerService.getById(slug); // now uses slug
 *   await careerService.apply(slug, formData);
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─── Shared axios instance ────────────────────────────────────────────────────
const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC CAREER SERVICE  →  /api/careers/*
// ═══════════════════════════════════════════════════════════════════════════════

export const careerService = {
  /** Get all active careers (public listing page) */
  getAll: (params = {}) => api.get('/careers', { params }),

  /**
   * Get single career by slug or _id (backwards compat)
   * @param {string} slugOrId  - career slug (preferred) or MongoDB _id
   */
  getById: (slugOrId) => api.get(`/careers/${slugOrId}`),

  /**
   * Submit a job application with optional resume file upload.
   * @param {string}   slugOrId  - career slug (preferred) or MongoDB _id
   * @param {FormData} formData  - fullName*, email*, phone, coverLetter, resume (file)
   */
  apply: (slugOrId, formData) =>
    api.post(`/careers/${slugOrId}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  getAllAdmin:              (params = {})       => api.get('/admin/careers', { params }),
  getByIdAdmin:            (id)                => api.get(`/admin/careers/${id}`),
  create:                  (fd)                => api.post('/admin/careers', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:                  (id, fd)            => api.put(`/admin/careers/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:                  (id)                => api.delete(`/admin/careers/${id}`),
  toggle:                  (id)                => api.patch(`/admin/careers/${id}/toggle`),
  getStats:                ()                  => api.get('/admin/careers/stats'),
  getApplications:         (id)                => api.get(`/admin/careers/${id}/applications`),
  updateApplicationStatus: (careerId, appId, status) =>
    api.patch(`/admin/careers/${careerId}/applications/${appId}`, { status }),
};

export default careerService;