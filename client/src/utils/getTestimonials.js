/**
 * libs/getTestimonials.js
 *
 * Server-side fetch for Next.js — called in Server Components or getStaticProps.
 * Falls back to [] on any error so the page never breaks.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getTestimonials = async () => {
  try {
    const res = await fetch(`${API_BASE}/testimonials`, {
      next: { revalidate: 60 }, // ISR — refresh every 60 s (Next.js 13+)
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.error(`getTestimonials: API returned ${res.status}`);
      return [];
    }

    const json = await res.json();
    // API response shape: { success, count, data: [...] }
    return json?.data ?? [];
  } catch (err) {
    console.error('getTestimonials fetch error:', err.message);
    return [];
  }
};

export default getTestimonials;