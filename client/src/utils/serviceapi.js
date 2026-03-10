/**
 * utils/serviceApi.js
 * Client-side API helpers for services.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

var authHeaders = function () {
  var token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: "Bearer " + token } : {};
};

// ═══ PUBLIC ══════════════════════════════════════════════════════════════════

export var getAllServices = async function () {
  var res = await fetch(API_BASE + "/services", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("getAllServices: " + res.status);
  var data = await res.json();
  return data.data || [];
};

export var getServiceBySlug = async function (slug) {
  var res = await fetch(API_BASE + "/services/slug/" + slug, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("getServiceBySlug \"" + slug + "\": " + res.status);
  var data = await res.json();
  return data.data || null;
};

export var getServiceById = async function (id) {
  var res = await fetch(API_BASE + "/services/" + id, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("getServiceById \"" + id + "\": " + res.status);
  var data = await res.json();
  return data.data || null;
};

// ═══ ADMIN ════════════════════════════════════════════════════════════════════

export var getAdminAllServices = async function () {
  var res = await fetch(API_BASE + "/services/admin/all", {
    cache: "no-store",
    headers: Object.assign({}, authHeaders()),
  });
  if (!res.ok) throw new Error("getAdminAllServices: " + res.status);
  var data = await res.json();
  return data.data || [];
};

export var createService = async function (formData) {
  var res = await fetch(API_BASE + "/services", {
    method: "POST",
    headers: Object.assign({}, authHeaders()),
    body: formData,
  });
  if (!res.ok) throw new Error("createService: " + res.status);
  return res.json();
};

export var updateService = async function (id, formData) {
  var res = await fetch(API_BASE + "/services/" + id, {
    method: "PUT",
    headers: Object.assign({}, authHeaders()),
    body: formData,
  });
  if (!res.ok) throw new Error("updateService: " + res.status);
  return res.json();
};

export var deleteService = async function (id) {
  var res = await fetch(API_BASE + "/services/" + id, {
    method: "DELETE",
    headers: Object.assign({}, authHeaders()),
  });
  if (!res.ok) throw new Error("deleteService: " + res.status);
  return res.json();
};

export var toggleServiceStatus = async function (id) {
  var res = await fetch(API_BASE + "/services/" + id + "/toggle", {
    method: "PATCH",
    headers: Object.assign({}, authHeaders()),
  });
  if (!res.ok) throw new Error("toggleServiceStatus: " + res.status);
  return res.json();
};

export var toggleServiceHidden = async function (id) {
  var res = await fetch(API_BASE + "/services/" + id + "/hide", {
    method: "PATCH",
    headers: Object.assign({}, authHeaders()),
  });
  if (!res.ok) throw new Error("toggleServiceHidden: " + res.status);
  return res.json();
};

export var reorderServices = async function (order) {
  var res = await fetch(API_BASE + "/services/reorder", {
    method: "PUT",
    headers: Object.assign({ "Content-Type": "application/json" }, authHeaders()),
    body: JSON.stringify({ order: order }),
  });
  if (!res.ok) throw new Error("reorderServices: " + res.status);
  return res.json();
};