const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ── Subscribe (footer form) ───────────────────────────────────────────────────
export const subscribeNewsletter = async ({ email, agreedToTerms }) => {
  const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, agreedToTerms }),
  });
  const data = await res.json();
  return data; // { success, message }
};

// ── Unsubscribe via link ──────────────────────────────────────────────────────
export const unsubscribeNewsletter = async (email) => {
  const res = await fetch(
    `${API_BASE}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`
  );
  const data = await res.json();
  return data;
};