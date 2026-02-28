/**
 * careerApi.js — PUBLIC Career API
 *
 * Usage (frontend / Next.js pages):
 *   import { careerService } from '@/utils/careerApi';
 *
 *   const { data } = await careerService.getAll({ page: 1, limit: 6 });
 *   const { data } = await careerService.getById(id);
 *   await careerService.apply(id, formData);   // FormData with resume file
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─── Shared axios instance (no auth needed for public routes) ─────────────────
const api = axios.create({ baseURL: API_BASE });

// ─── Reuse token interceptor (same pattern as eventApi / blogApi) ─────────────
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
// PUBLIC CAREER SERVICE
// Maps to: /api/careers/*
// ═══════════════════════════════════════════════════════════════════════════════

export const careerService = {
  /**
   * Get all active careers (public listing page)
   *
   * @param {Object} params
   * @param {number}  [params.page=1]
   * @param {number}  [params.limit=6]
   * @param {string}  [params.category]   - filter by category
   * @param {string}  [params.location]   - filter by location
   * @param {string}  [params.need]       - "Full Time" | "Part Time" | "Contract" | "Internship" | "Remote"
   * @param {string}  [params.search]     - full-text search
   *
   * @returns {Promise<{
   *   data: Career[],
   *   pagination: { total, page, limit, totalPages }
   * }>}
   *
   * @example
   *   const res = await careerService.getAll({ page: 1, limit: 6 });
   *   const careers = res.data.data;
   *   const { totalPages } = res.data.pagination;
   */
  getAll: (params = {}) => api.get('/careers', { params }),

  /**
   * Get single career by MongoDB _id (public detail page)
   *
   * @param {string} id - MongoDB _id
   * @returns {Promise<{ data: Career }>}
   *
   * @example
   *   const res = await careerService.getById('64abc...');
   *   const career = res.data.data;
   */
  getById: (id) => api.get(`/careers/${id}`),

  /**
   * Submit a job application with optional resume file upload.
   * Sends multipart/form-data so the resume PDF/DOC goes to Cloudinary.
   *
   * @param {string} id         - Career _id
   * @param {FormData} formData - Fields: fullName*, email*, phone, coverLetter, resume (file)
   * @returns {Promise<{ message: string }>}
   *
   * @example
   *   const fd = new FormData();
   *   fd.append('fullName', 'Jane Doe');
   *   fd.append('email', 'jane@example.com');
   *   fd.append('coverLetter', 'I am interested...');
   *   fd.append('resume', fileInputRef.current.files[0]);
   *   await careerService.apply(career._id, fd);
   */
  apply: (id, formData) =>
    api.post(`/careers/${id}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default careerService;