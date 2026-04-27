const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://inspireeducationservice.com/api";

const getALlServices = async () => {
  try {
    const res = await fetch(`${API_BASE}/services`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed: " + res.status);
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("getALlServices error:", err.message);
    return [];
  }
};

export default getALlServices;