const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ─── Auth header helper ───────────────────────────────────────────────────────
const authHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── Public ───────────────────────────────────────────────────────────────────

/**
 * GET /api/banner
 * Fetch the active banner with its active slides (public — no auth required)
 * @returns {{ success: boolean, data: { slides: Slide[] } }}
 */
export const getPublicBanner = async () => {
  const res = await fetch(`${API_BASE}/banner`);
  if (!res.ok) throw new Error(`Failed to fetch banner: ${res.status}`);
  return res.json();
};

// ─── Admin ────────────────────────────────────────────────────────────────────

/**
 * GET /api/banner/admin
 * Fetch full banner including inactive slides (admin only)
 */
export const getAdminBanner = async () => {
  const res = await fetch(`${API_BASE}/banner/admin`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Failed to fetch admin banner: ${res.status}`);
  return res.json();
};

/**
 * POST /api/banner/admin/slides
 * Add a new slide. Pass a FormData object so that file upload works.
 * @param {FormData} formData — must include:
 *   - media (File)       the image or video file
 *   - title (string)
 *   - type  ('image' | 'video')
 *   - subtitle, description, buttonText, buttonUrl, isActive (optional)
 */
export const addSlide = async (formData) => {
  const res = await fetch(`${API_BASE}/banner/admin/slides`, {
    method: "POST",
    headers: { ...authHeaders() }, // NOTE: do NOT set Content-Type — browser sets it with boundary
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to add slide: ${res.status}`);
  return res.json();
};

/**
 * PUT /api/banner/admin/slides/:slideId
 * Update an existing slide. Pass FormData (same shape as addSlide).
 * @param {string}   slideId
 * @param {FormData} formData
 */
export const updateSlide = async (slideId, formData) => {
  const res = await fetch(`${API_BASE}/banner/admin/slides/${slideId}`, {
    method: "PUT",
    headers: { ...authHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error(`Failed to update slide: ${res.status}`);
  return res.json();
};

/**
 * DELETE /api/banner/admin/slides/:slideId
 * @param {string} slideId
 */
export const deleteSlide = async (slideId) => {
  const res = await fetch(`${API_BASE}/banner/admin/slides/${slideId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Failed to delete slide: ${res.status}`);
  return res.json();
};

/**
 * PUT /api/banner/admin/slides/reorder
 * @param {{ id: string, order: number }[]} order
 */
export const reorderSlides = async (order) => {
  const res = await fetch(`${API_BASE}/banner/admin/slides/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ order }),
  });
  if (!res.ok) throw new Error(`Failed to reorder slides: ${res.status}`);
  return res.json();
};

/**
 * PUT /api/banner/admin/toggle
 * Toggle the whole banner's isActive state
 */
export const toggleBanner = async () => {
  const res = await fetch(`${API_BASE}/banner/admin/toggle`, {
    method: "PUT",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Failed to toggle banner: ${res.status}`);
  return res.json();
};