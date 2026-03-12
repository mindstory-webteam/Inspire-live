const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Fetch all active services (used in Services list page + slug page nav)
 */
export const getAllServices = async () => {
  try {
    const res = await fetch(`${API_BASE}/services`, { cache: "no-store" });
    if (!res.ok) throw new Error("getAllServices: " + res.status);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("getAllServices error:", err.message);
    return [];
  }
};

/**
 * Fetch a single service by slug (used in [slug]/page.js)
 */
export const getServiceBySlug = async (slug) => {
  try {
    const res = await fetch(`${API_BASE}/services/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.error("getServiceBySlug error:", err.message);
    return null;
  }
};