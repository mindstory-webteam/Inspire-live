// utils/teamApi.js
// All API calls for Team Members.
// Used by:
//   - Team1.jsx  (imports fetchTeamMembersClient)
//   - AdminTeamPage / TeamPage (imports adminCreate, adminUpdate, etc.)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SERVER_BASE = API_BASE.replace("/api", "");

// ─── Image URL resolver ───────────────────────────────────────────────────────
function resolveImage(src) {
  if (!src) return "/images/team/team-1.webp";
  if (src.startsWith("http") || src.startsWith("/images")) return src;
  return SERVER_BASE + src;
}

// ─── Shape a raw API member object into the frontend shape ───────────────────
function shapeMember(m) {
  return {
    id:        m._id,
    name:      m.name,
    desig:     m.desig,
    img:       resolveImage(m.img),
    email:     m.email     || "info@bexon.com",
    facebook:  m.facebook  || "https://www.facebook.com/",
    instagram: m.instagram || "https://www.instagram.com/",
    twitter:   m.twitter   || "https://x.com/",
    linkedin:  m.linkedin  || "https://www.linkedin.com/",
  };
}

// ─── Auth header (admin calls only) ──────────────────────────────────────────
function authHeaders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("adminToken")
      : "";
  return { Authorization: `Bearer ${token}` };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC — client-side fetch (used by Team1.jsx inside useEffect)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * fetchTeamMembersClient
 * Client-side fetch of all active team members.
 * Import: import { fetchTeamMembersClient } from "@/utils/teamApi";
 */
export async function fetchTeamMembersClient() {
  const res = await fetch(`${API_BASE}/team`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.data || []).map(shapeMember);
}

/**
 * getAllTeamMembers
 * Alias of fetchTeamMembersClient — same thing, different name.
 */
export async function getAllTeamMembers() {
  return fetchTeamMembersClient();
}

/**
 * getTeamMemberById
 * Fetch a single active team member by MongoDB _id.
 */
export async function getTeamMemberById(id) {
  const res = await fetch(`${API_BASE}/team/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return shapeMember(data.data);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN — require Bearer token
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * adminGetAllTeamMembers
 * Fetch ALL members including hidden (admin only).
 */
export async function adminGetAllTeamMembers() {
  const res = await fetch(`${API_BASE}/admin/team`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.data || [];
}

/**
 * adminCreateTeamMember
 * @param {Object} fields  Plain object of form fields
 * @param {File|null} imgFile  Optional image File
 */
export async function adminCreateTeamMember(fields, imgFile = null) {
  const fd = buildFormData(fields, imgFile);
  const res = await fetch(`${API_BASE}/admin/team`, {
    method: "POST",
    headers: authHeaders(),
    body: fd,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Create failed");
  return data.data;
}

/**
 * adminUpdateTeamMember
 * @param {string} id
 * @param {Object} fields
 * @param {File|null} imgFile
 */
export async function adminUpdateTeamMember(id, fields, imgFile = null) {
  const fd = buildFormData(fields, imgFile);
  const res = await fetch(`${API_BASE}/admin/team/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: fd,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Update failed");
  return data.data;
}

/**
 * adminDeleteTeamMember
 * @param {string} id
 */
export async function adminDeleteTeamMember(id) {
  const res = await fetch(`${API_BASE}/admin/team/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Delete failed");
}

/**
 * adminToggleTeamMember
 * @param {string} id
 */
export async function adminToggleTeamMember(id) {
  const res = await fetch(`${API_BASE}/admin/team/${id}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Toggle failed");
  return data.data;
}

// ─── Private helper ───────────────────────────────────────────────────────────
function buildFormData(fields, imgFile) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  if (imgFile) fd.append("img", imgFile);
  return fd;
}