const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://www.inspireeducationservice.com/api";

// ─── Public ───────────────────────────────────────────────────────────────────

/**
 * GET /api/events
 * Always returns a plain array regardless of backend response shape.
 */
export const getEvents = async ({ category, type } = {}) => {
  const url = new URL(`${API_BASE}/events`);
  if (category && category !== "all") url.searchParams.set("category", category);
  if (type && type !== "all") url.searchParams.set("type", type);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

  const json = await res.json();

  // Normalise: backend may return array OR { success, data: [...] } OR { success, events: [...] }
  if (Array.isArray(json)) return json;
  if (json.data && Array.isArray(json.data)) return json.data;
  if (json.events && Array.isArray(json.events)) return json.events;
  return [];
};

/**
 * GET /api/events/:id
 */
export const getEventById = async (id) => {
  const res = await fetch(`${API_BASE}/events/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
};

// ─── Admin ────────────────────────────────────────────────────────────────────

const authHeaders = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || localStorage.getItem("token")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminGetEvents = async () => {
  const res = await fetch(`${API_BASE}/admin/events`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  const json = await res.json();
  if (Array.isArray(json)) return json;
  if (json.data && Array.isArray(json.data)) return json.data;
  return [];
};

export const createEvent = async (formData) => {
  const res = await fetch(`${API_BASE}/admin/events`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
};

export const updateEvent = async (id, formData) => {
  const res = await fetch(`${API_BASE}/admin/events/${id}`, {
    method: "PUT",
    headers: { ...authHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
};

export const toggleEventStatus = async (id) => {
  const res = await fetch(`${API_BASE}/admin/events/${id}/toggle`, {
    method: "PATCH",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
};

export const deleteEvent = async (id) => {
  const res = await fetch(`${API_BASE}/admin/events/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
};

export const reorderEvents = async (order) => {
  const res = await fetch(`${API_BASE}/admin/events/reorder`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ order }),
  });
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
  return res.json();
};