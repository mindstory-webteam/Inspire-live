
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://inspire-live.onrender.com/api";
const SERVER_BASE = API_BASE.replace("/api", "");

function resolveImage(src) {
  if (!src) return "/images/team/team-1.webp";
  if (src.startsWith("http") || src.startsWith("/images")) return src;
  return SERVER_BASE + src;
}

function shapeMember(m) {
  return {
    id:        m._id,
    name:      m.name,
    desig:     m.desig,
    img:       resolveImage(m.img),
    email:     m.email     || "",
    facebook:  m.facebook  || "https://www.facebook.com/",
    instagram: m.instagram || "https://www.instagram.com/",
    twitter:   m.twitter   || "https://x.com/",
    linkedin:  m.linkedin  || "https://www.linkedin.com/",
    order:     m.order     ?? 0,
    isActive:  m.isActive  ?? true,
  };
}

function authHeaders() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || localStorage.getItem("token") || ""
      : "";
  return { Authorization: `Bearer ${token}` };
}

function buildFormData(fields, imgFile) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  if (imgFile) fd.append("img", imgFile);
  return fd;
}

export async function fetchResourceMembersClient() {
  const res = await fetch(`${API_BASE}/ourresourceperson`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.data || []).map(shapeMember);
}

export async function getAllResourceMembers() {
  return fetchResourceMembersClient();
}

export async function getResourceMemberById(id) {
  const res = await fetch(`${API_BASE}/ourresourceperson/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return shapeMember(data.data);
}


export async function adminGetAllResourceMembers() {
  const res = await fetch(`${API_BASE}/admin/ourresourceperson`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.data || [];
}

export async function adminCreateResourceMember(fields, imgFile = null) {
  const fd = buildFormData(fields, imgFile);
  const res = await fetch(`${API_BASE}/admin/ourresourceperson`, {
    method:  "POST",
    headers: authHeaders(),
    body:    fd,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Create failed");
  return data.data;
}

export async function adminUpdateResourceMember(id, fields, imgFile = null) {
  const fd = buildFormData(fields, imgFile);
  const res = await fetch(`${API_BASE}/admin/ourresourceperson/${id}`, {
    method:  "PUT",
    headers: authHeaders(),
    body:    fd,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Update failed");
  return data.data;
}

export async function adminDeleteResourceMember(id) {
  const res = await fetch(`${API_BASE}/admin/ourresourceperson/${id}`, {
    method:  "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Delete failed");
}

export async function adminToggleResourceMember(id) {
  const res = await fetch(`${API_BASE}/admin/ourresourceperson/${id}/toggle`, {
    method:  "PATCH",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Toggle failed");
  return data.data;
}