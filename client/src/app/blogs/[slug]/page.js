'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/header/Header';
import BackToTop from '@/components/shared/others/BackToTop';
import HeaderSpace from '@/components/shared/others/HeaderSpace';
import HeroInner from '@/components/sections/hero/HeroInner';
import Footer from '@/components/layout/footer/Footer';
import Cta from '@/components/sections/cta/Cta';
import ClientWrapper from '@/components/shared/wrappers/ClientWrapper';

/* ─── API ───────────────────────────────────────────────────────────────── */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchBlogBySlug(slug) {
  const res = await fetch(`${API_BASE_URL}/blogs/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch blog: ${res.statusText}`);
  return res.json();
}

async function fetchRecentBlogs() {
  const res = await fetch(`${API_BASE_URL}/blogs?limit=5&isPublished=true`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch recent blogs');
  return res.json();
}

async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/blogs/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

async function postComment(blogId, data) {
  const res = await fetch(`${API_BASE_URL}/blogs/${blogId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to post comment');
  return res.json();
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function resolveImg(src) {
  if (!src || typeof src !== 'string' || src.trim() === '') return null;
  if (src.startsWith('http')) return src;
  const base = API_BASE_URL.replace(/\/api\/?$/, '');
  return base + (src.startsWith('/') ? src : '/' + src);
}

/* ─── SafeImg ───────────────────────────────────────────────────────────── */
function SafeImg({ src, alt = '', className = '', style = {} }) {
  const [err, setErr] = useState(false);
  const full = resolveImg(src);
  if (!full || err) return null;
  return <img src={full} alt={alt} className={className} style={style} onError={() => setErr(true)} />;
}

/* ─── BlogTopList ───────────────────────────────────────────────────────── */
function BlogTopList({ items = [] }) {
  if (!items?.length) return null;
  return (
    <div className="bd-top-list">
      {items.map((item, i) => (
        <a key={i} href={item.path || '#'} className="bd-top-list-item" target="_blank" rel="noreferrer">
          {item.iconName && <span className="bd-top-list-icon">{item.iconName}</span>}
          {item.name && <span>{item.name}</span>}
        </a>
      ))}
    </div>
  );
}

/* ─── Tags ──────────────────────────────────────────────────────────────── */
function Tags({ tags }) {
  if (!tags?.length) return null;
  return (
    <div className="bd-tags">
      <span className="bd-label">Tags:</span>
      {tags.map(t => (
        <Link key={t} href={`/blogs?tag=${encodeURIComponent(t)}`} className="bd-tag">{t}</Link>
      ))}
    </div>
  );
}

/* ─── ShareRow ──────────────────────────────────────────────────────────── */
function ShareRow({ title }) {
  const [url, setUrl] = useState('');
  useEffect(() => { setUrl(window.location.href); }, []);
  const enc = encodeURIComponent;
  const socials = [
    { label: 'Twitter/X', href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`, d: 'M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, d: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  ];
  return (
    <div className="bd-share">
      <span className="bd-label">Share:</span>
      {socials.map(s => (
        <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="bd-share-btn" aria-label={s.label}>
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d={s.d} /></svg>
        </a>
      ))}
    </div>
  );
}

/* ─── VideoPlayer ───────────────────────────────────────────────────────── */
function VideoPlayer({ videoUrl, popupVideo, videoImg }) {
  const src = videoUrl || popupVideo;
  if (!src) return null;
  const embedSrc = src.includes('watch?v=') ? src.replace('watch?v=', 'embed/') : src;
  return (
    <div className="bd-video-wrap">
      {videoImg && (
        <div className="bd-video-thumb">
          <SafeImg src={videoImg} alt="Video thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      <iframe src={embedSrc} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Blog video" />
    </div>
  );
}

/* ─── CommentForm ───────────────────────────────────────────────────────── */
function CommentForm({ blogId, onPosted }) {
  const [form, setForm] = useState({ authorName: '', email: '', desc: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState(null);

  function handle(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.authorName || !form.desc) return;
    setSending(true); setErr(null);
    postComment(blogId, form)
      .then(() => { setSuccess(true); setForm({ authorName: '', email: '', desc: '' }); onPosted?.(); })
      .catch(() => setErr('Could not post comment. Please try again.'))
      .finally(() => setSending(false));
  }

  return (
    <form className="bd-comment-form" onSubmit={submit}>
      <h3 className="bd-section-title">Leave a Comment</h3>
      {success && <div className="bd-alert bd-alert-ok">Comment submitted — awaiting approval. Thank you!</div>}
      {err && <div className="bd-alert bd-alert-err">{err}</div>}
      <div className="bd-form-row">
        <input className="bd-input" name="authorName" placeholder="Your Name *" value={form.authorName} onChange={handle} required />
        <input className="bd-input" name="email" type="email" placeholder="Email (optional)" value={form.email} onChange={handle} />
      </div>
      <textarea className="bd-textarea" name="desc" placeholder="Write your comment…" value={form.desc} onChange={handle} rows={5} required />
      <button className="bd-submit-btn" type="submit" disabled={sending}>{sending ? 'Posting…' : 'Post Comment'}</button>
    </form>
  );
}

/* ─── CommentList ───────────────────────────────────────────────────────── */
function CommentList({ comments = [] }) {
  const list = comments.filter(c => c.isApproved);
  if (!list.length) return null;
  return (
    <div className="bd-comments-section">
      <h3 className="bd-section-title">{list.length} Comment{list.length !== 1 ? 's' : ''}</h3>
      {list.map(c => (
        <div key={c._id} className="bd-comment">
          <div className="bd-avatar">
            {c.img
              ? <SafeImg src={c.img} alt={c.authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span>{(c.authorName || 'A').slice(0, 2).toUpperCase()}</span>}
          </div>
          <div className="bd-comment-body">
            <div className="bd-comment-meta">
              <strong>{c.authorName}</strong>
              <span className="bd-comment-date">{formatDate(c.date || c.createdAt)}</span>
            </div>
            <p className="bd-comment-text">{c.desc}</p>
            {c.replies?.length > 0 && (
              <div className="bd-replies">
                {c.replies.map(r => (
                  <div key={r._id} className="bd-reply">
                    <div className="bd-avatar bd-avatar-sm">
                      {r.img
                        ? <SafeImg src={r.img} alt={r.authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span>{(r.authorName || 'A').slice(0, 2).toUpperCase()}</span>}
                    </div>
                    <div className="bd-comment-body">
                      <div className="bd-comment-meta">
                        <strong>{r.authorName}</strong>
                        <span className="bd-comment-date">{formatDate(r.date || r.createdAt)}</span>
                      </div>
                      <p className="bd-comment-text">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Sidebar ───────────────────────────────────────────────────────────── */
function Sidebar({ currentId }) {
  const [recent, setRecent] = useState([]);
  const [cats, setCats] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    fetchRecentBlogs()
      .then(d => {
        const list = Array.isArray(d) ? d : (d.blogs || d.data || []);
        setRecent(list.filter(b => b._id !== currentId).slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoadingRecent(false));

    fetchCategories()
      .then(d => setCats(Array.isArray(d) ? d : (d.categories || d.data || [])))
      .catch(() => {});
  }, [currentId]);

  return (
    <aside className="bd-sidebar">
      {/* Recent Posts */}
      <div className="bd-sidebar-card">
        <h4 className="bd-sidebar-title">Recent Posts</h4>
        {loadingRecent ? (
          <div className="bd-sidebar-loading">
            {[1, 2, 3].map(i => <div key={i} className="bd-skeleton-item" />)}
          </div>
        ) : recent.length > 0 ? recent.map(b => (
          <Link key={b._id} href={`/blogs/${b.slug || b._id}`} className="bd-recent-item">
            <div className="bd-recent-img">
              {(b.smallImg || b.img)
                ? <SafeImg src={b.smallImg || b.img} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div className="bd-recent-fallback" />}
            </div>
            <div>
              <p className="bd-recent-title">{b.title}</p>
              <span className="bd-recent-date">
                {b.day && b.month ? `${b.day} ${b.month}` : formatDate(b.createdAt)}
              </span>
            </div>
          </Link>
        )) : <p style={{ fontSize: '.85rem', color: 'var(--tb3)' }}>No recent posts.</p>}
      </div>

      {/* Categories */}
      <div className="bd-sidebar-card">
        <h4 className="bd-sidebar-title">Categories</h4>
        {(cats.length > 0 ? cats : ['Tutorial', 'Tips', 'Freebies', 'News']).map(cat => {
          const name = typeof cat === 'string' ? cat : (cat.name || cat);
          return (
            <Link key={name} href={`/blogs?category=${encodeURIComponent(name)}`} className="bd-sidebar-cat">
              <span>{name}</span>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>

      <Link href="/blogs" className="bd-back-to-blog">
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to All Posts
      </Link>
    </aside>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────────────────── */
export default function BlogDetailsPage() {
  const params = useParams();
  const slug = params?.slug || params?.id;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function loadBlog() {
    if (!slug) return;
    setLoading(true); setError(null);
    fetchBlogBySlug(slug)
      .then(d => {
        const b = d?.blog || d?.data || d?.post || (d?._id ? d : null);
        if (!b) throw new Error('No blog data returned from server.');
        setBlog(b);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadBlog(); }, [slug]);

  const approvedComments = blog ? (blog.comments || []).filter(c => c.isApproved) : [];

  // ── FIX: collect ALL image fields from schema ──────────────────────────
  const hasImgGrid1  = blog && (blog.img1 || blog.img2);
  const hasImgGrid2  = blog && (blog.img3 || blog.img4);
  const hasImgGrid3  = blog && (blog.img5 || blog.img6);
  const hasSlider    = blog?.slider?.length > 0;
  const hasVideo     = blog?.videoUrl || blog?.popupVideo;
  const displayDate  = blog?.day && blog?.month
    ? `${blog.day} ${blog.month}`
    : formatDate(blog?.createdAt);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        :root {
          --tp:#1a598a; --td:#0c1e21; --td2:#18292c; --td3:#015599;
          --tbg:#9ed3fb; --tbg2:#ffffff; --tbg3:#202e30;
          --tb:#1a425c; --tb3:#67787a; --tg1:#ecf0f0; --tg2:#a9b8b8; --tbr5:#1e8a8a26;
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .bd-page{background:var(--tg1);min-height:100vh;font-family:'DM Sans',sans-serif;}

        /* LAYOUT */
        .bd-layout{max-width:1240px;margin:0 auto;padding:60px 40px 100px;display:grid;grid-template-columns:1fr 300px;gap:48px;align-items:start;}
        @media(max-width:960px){.bd-layout{grid-template-columns:1fr;padding:40px 24px 80px;}}

        /* FEATURED */
        .bd-featured-badge{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:.72rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;padding:4px 14px;border-radius:100px;margin-bottom:16px;}

        /* COVER */
        .bd-cover{width:100%;border-radius:20px;overflow:hidden;aspect-ratio:16/9;margin-bottom:36px;background:var(--td2);box-shadow:0 4px 32px rgba(26,89,138,.13);}
        .bd-cover img{width:100%;height:100%;object-fit:cover;display:block;}
        .bd-cover-fallback{width:100%;height:100%;background:linear-gradient(135deg,var(--td) 0%,var(--tp) 100%);display:flex;align-items:center;justify-content:center;}

        /* META */
        .bd-meta-bar{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-bottom:20px;}
        .bd-meta-chip{display:inline-flex;align-items:center;gap:6px;font-size:.74rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--tp);background:rgba(26,89,138,.08);padding:4px 14px;border-radius:100px;border:1px solid rgba(26,89,138,.18);text-decoration:none;transition:all .2s;}
        .bd-meta-chip:hover{background:var(--tp);color:#fff;}
        .bd-meta-status{display:inline-flex;align-items:center;font-size:.72rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--tb3);background:var(--tg1);padding:4px 12px;border-radius:100px;border:1px solid var(--tg2);}
        .bd-meta-item{display:flex;align-items:center;gap:6px;font-size:.82rem;color:var(--tb3);}
        .bd-meta-item svg{color:var(--tg2);}

        /* TITLE */
        .bd-title{font-family:'Playfair Display',serif;font-size:clamp(1.7rem,4vw,2.4rem);font-weight:700;color:var(--td);line-height:1.3;margin-bottom:28px;}

        /* TOP LIST */
        .bd-top-list{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:28px;}
        .bd-top-list-item{display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:100px;background:var(--tbg2);border:1.5px solid var(--tg2);font-size:.8rem;color:var(--tb3);text-decoration:none;transition:all .2s;}
        .bd-top-list-item:hover{background:var(--tp);color:#fff;border-color:var(--tp);}

        /* ── FIX: paragraph spacing ── */
        .bd-desc{
          font-size:1rem;
          color:var(--tb);
          line-height:1.9;
          margin-bottom:28px;   /* was missing — adds space below every paragraph */
        }
        .bd-desc:last-of-type{ margin-bottom: 0; }

        /* BODY */
        .bd-body{font-size:1rem;color:var(--tb);line-height:1.9;margin-bottom:32px;}
        .bd-body h1,.bd-body h2,.bd-body h3{font-family:'Playfair Display',serif;color:var(--td);margin:32px 0 14px;}
        .bd-body p{margin:0 0 20px;}           /* space between HTML paragraphs in body */
        .bd-body p:last-child{margin-bottom:0;}
        .bd-body img{max-width:100%;border-radius:12px;margin:16px 0;display:block;}
        .bd-body a{color:var(--tp);text-decoration:underline;}
        .bd-body ul,.bd-body ol{padding-left:24px;margin-bottom:18px;}
        .bd-body li{margin-bottom:6px;}

        /* ── FIX: image grid — always show with proper aspect ratio ── */
        .bd-img-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:16px;
          margin:28px 0 32px;   /* top + bottom spacing around every image pair */
        }
        .bd-img-grid-cell{
          border-radius:14px;
          overflow:hidden;
          aspect-ratio:4/3;
          background:var(--tg1);
          display:block;
        }
        .bd-img-grid-cell img{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
        }
        @media(max-width:560px){.bd-img-grid{grid-template-columns:1fr;}}

        /* SLIDER */
        .bd-slider{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin:28px 0 32px;}
        .bd-slider-img{border-radius:14px;overflow:hidden;aspect-ratio:16/9;background:var(--tg1);}
        .bd-slider-img img{width:100%;height:100%;object-fit:cover;display:block;}

        /* QUOTE */
        .bd-quote{border-left:4px solid var(--tp);background:var(--tbg2);padding:24px 28px;border-radius:0 16px 16px 0;margin:32px 0;box-shadow:0 2px 16px var(--tbr5);}
        .bd-quote p{font-family:'Playfair Display',serif;font-style:italic;font-size:1.12rem;color:var(--td);line-height:1.75;margin:0;}

        /* VIDEO */
        .bd-video-wrap{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:16/9;background:var(--td2);margin:32px 0;box-shadow:0 4px 24px rgba(0,0,0,.14);}
        .bd-video-wrap iframe{width:100%;height:100%;border:none;display:block;position:relative;z-index:1;}
        .bd-video-thumb{position:absolute;inset:0;z-index:0;}

        /* DIVIDER */
        .bd-divider{height:1px;background:var(--tbr5);margin:36px 0;}

        /* TAGS + SHARE */
        .bd-tags{display:flex;flex-wrap:wrap;align-items:center;gap:8px;}
        .bd-share{display:flex;align-items:center;gap:10px;}
        .bd-label{font-size:.8rem;font-weight:700;color:var(--td);margin-right:4px;}
        .bd-tag{background:var(--tbg2);border:1.5px solid var(--tg2);padding:4px 14px;border-radius:100px;font-size:.77rem;color:var(--tb3);text-decoration:none;transition:all .2s;}
        .bd-tag:hover{background:var(--tp);color:#fff;border-color:var(--tp);}
        .bd-share-btn{width:36px;height:36px;border-radius:50%;background:var(--tbg2);border:1.5px solid var(--tg2);display:flex;align-items:center;justify-content:center;color:var(--tb3);text-decoration:none;transition:all .2s;}
        .bd-share-btn:hover{background:var(--tp);color:#fff;border-color:var(--tp);}

        /* AUTHOR */
        .bd-author-card{background:var(--tbg2);border-radius:20px;padding:28px;display:flex;gap:20px;align-items:flex-start;margin:36px 0;border:1px solid var(--tbr5);box-shadow:0 2px 20px rgba(26,89,138,.07);}
        .bd-author-avatar{width:72px;height:72px;border-radius:50%;flex-shrink:0;overflow:hidden;background:var(--td);display:flex;align-items:center;justify-content:center;color:var(--tbg);font-size:1.4rem;font-weight:700;}
        .bd-author-avatar img{width:100%;height:100%;object-fit:cover;display:block;}
        .bd-author-name{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--td);margin-bottom:2px;}
        .bd-author-role{font-size:.75rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--tp);margin-bottom:8px;}
        .bd-author-bio{font-size:.88rem;color:var(--tb3);line-height:1.65;}

        /* COMMENTS */
        .bd-section-title{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:var(--td);margin:0 0 24px;padding-bottom:12px;border-bottom:2px solid var(--tbr5);}
        .bd-comments-section{background:var(--tbg2);border-radius:20px;padding:32px;margin-bottom:28px;border:1px solid var(--tbr5);box-shadow:0 2px 20px rgba(26,89,138,.07);}
        .bd-comment{display:flex;gap:16px;margin-bottom:28px;}
        .bd-comment:last-child{margin-bottom:0;}
        .bd-avatar{width:44px;height:44px;border-radius:50%;flex-shrink:0;background:var(--td);display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;color:var(--tbg);overflow:hidden;}
        .bd-avatar-sm{width:36px!important;height:36px!important;font-size:.7rem!important;}
        .bd-comment-body{flex:1;}
        .bd-comment-meta{display:flex;align-items:baseline;gap:10px;margin-bottom:6px;}
        .bd-comment-meta strong{font-size:.9rem;color:var(--td);}
        .bd-comment-date{font-size:.74rem;color:var(--tg2);}
        .bd-comment-text{font-size:.88rem;color:var(--tb3);line-height:1.65;}
        .bd-replies{margin-top:16px;padding-left:16px;border-left:2px solid var(--tbr5);}
        .bd-reply{display:flex;gap:12px;margin-top:16px;}

        /* COMMENT FORM */
        .bd-comment-form{background:var(--tbg2);border-radius:20px;padding:32px;border:1px solid var(--tbr5);box-shadow:0 2px 20px rgba(26,89,138,.07);}
        .bd-form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
        @media(max-width:560px){.bd-form-row{grid-template-columns:1fr;}}
        .bd-input,.bd-textarea{width:100%;padding:12px 16px;border:1.5px solid var(--tg2);border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.88rem;color:var(--td);outline:none;transition:border-color .2s,background .2s;background:var(--tg1);}
        .bd-input:focus,.bd-textarea:focus{border-color:var(--tp);background:#fff;}
        .bd-textarea{display:block;resize:vertical;margin-bottom:14px;}
        .bd-submit-btn{background:var(--tp);color:#fff;padding:13px 36px;border:none;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:.9rem;font-weight:600;cursor:pointer;transition:background .2s,transform .15s;}
        .bd-submit-btn:hover{background:var(--td3);transform:translateY(-2px);}
        .bd-submit-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;}
        .bd-alert{border-radius:10px;padding:12px 16px;font-size:.85rem;margin-bottom:16px;}
        .bd-alert-ok{background:#f0fdf4;border:1px solid #86efac;color:#166534;}
        .bd-alert-err{background:#fdf0f0;border:1px solid #f5c2c2;color:#7b2020;}

        /* SIDEBAR */
        .bd-sidebar{display:flex;flex-direction:column;}
        .bd-sidebar-card{background:var(--tbg2);border-radius:20px;padding:24px;margin-bottom:24px;border:1px solid var(--tbr5);box-shadow:0 2px 20px rgba(26,89,138,.07);}
        .bd-sidebar-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:var(--td);margin:0 0 18px;padding-bottom:10px;border-bottom:2px solid var(--tbr5);}
        .bd-sidebar-loading{display:flex;flex-direction:column;gap:12px;}
        .bd-skeleton-item{height:54px;border-radius:10px;background:linear-gradient(90deg,var(--tg1) 25%,#e0e8e8 50%,var(--tg1) 75%);background-size:200% 100%;animation:_shimmer 1.4s infinite;}
        @keyframes _shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .bd-recent-item{display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;text-decoration:none;}
        .bd-recent-item:last-child{margin-bottom:0;}
        .bd-recent-img{width:68px;height:54px;border-radius:10px;overflow:hidden;flex-shrink:0;background:var(--tg1);}
        .bd-recent-fallback{width:100%;height:100%;background:var(--tg1);}
        .bd-recent-title{font-size:.82rem;font-weight:600;color:var(--td);line-height:1.4;margin:0 0 4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;transition:color .2s;}
        .bd-recent-item:hover .bd-recent-title{color:var(--tp);}
        .bd-recent-date{font-size:.72rem;color:var(--tg2);}
        .bd-sidebar-cat{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--tbr5);font-size:.86rem;color:var(--tb3);text-decoration:none;transition:color .2s;font-weight:500;}
        .bd-sidebar-cat:last-child{border-bottom:none;}
        .bd-sidebar-cat:hover{color:var(--tp);}
        .bd-sidebar-cat svg{color:var(--tg2);transition:color .2s;}
        .bd-sidebar-cat:hover svg{color:var(--tp);}
        .bd-back-to-blog{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;background:var(--td);color:#fff;border-radius:100px;font-size:.85rem;font-weight:600;text-decoration:none;transition:background .2s,transform .2s;align-self:flex-start;}
        .bd-back-to-blog:hover{background:var(--tp);transform:translateY(-2px);}

        /* STATES */
        .bd-state{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;gap:16px;padding:60px 24px;}
        .bd-spinner{width:46px;height:46px;border:3px solid var(--tg1);border-top-color:var(--tp);border-radius:50%;animation:_sp .7s linear infinite;}
        @keyframes _sp{to{transform:rotate(360deg);}}
        .bd-state p{font-size:.95rem;color:var(--tb3);}
        .bd-error-box{max-width:480px;width:100%;background:#fdf0f0;border:1px solid #f5c2c2;border-radius:20px;padding:40px;text-align:center;}
        .bd-error-title{font-family:'Playfair Display',serif;font-size:1.25rem;color:#7b2020;margin-bottom:8px;}
        .bd-error-msg{color:#9b4444;font-size:.9rem;margin-bottom:20px;}
        .bd-error-link{display:inline-flex;align-items:center;gap:6px;color:var(--tp);font-size:.9rem;font-weight:600;text-decoration:none;}
        .bd-error-link:hover{text-decoration:underline;}

        @media(max-width:560px){
          .bd-meta-bar{gap:10px;}
          .bd-title{font-size:1.5rem;}
          .bd-author-card{flex-direction:column;}
        }
      `}</style>

      <div className="bd-page">
        <BackToTop />
        <Header />
        <Header isStickyHeader={true} />
        <HeaderSpace />
        <HeroInner
          title={blog ? blog.title : 'Blog Details'}
          text={blog ? blog.title : 'Blog Details'}
          breadcrums={[{ name: 'Blogs', path: '/blogs' }]}
        />

        {/* Loading */}
        {loading && (
          <div className="bd-state">
            <div className="bd-spinner" />
            <p>Loading article…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bd-state">
            <div className="bd-error-box">
              <p className="bd-error-title">Could not load article</p>
              <p className="bd-error-msg">{error}</p>
              <Link href="/blogs" className="bd-error-link">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                Back to Blog
              </Link>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && blog && (
          <div className="bd-layout">
            <article>

              {/* isFeatured */}
              {blog.isFeatured && (
                <div className="bd-featured-badge">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Featured
                </div>
              )}

              {/* Cover — detailsImg > img */}
              <div className="bd-cover">
                {(blog.detailsImg || blog.img)
                  ? <SafeImg
                      src={blog.detailsImg || blog.img}
                      alt={blog.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  : <div className="bd-cover-fallback">
                      <svg width="64" height="64" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                }
              </div>

              {/* Meta */}
              <div className="bd-meta-bar">
                {blog.category && (
                  <Link href={`/blogs?category=${encodeURIComponent(blog.category)}`} className="bd-meta-chip">
                    {blog.category}
                  </Link>
                )}
                {blog.status && blog.status !== 'Draft' && (
                  <span className="bd-meta-status">{blog.status}</span>
                )}
                {blog.author && (
                  <span className="bd-meta-item">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    {blog.author}
                  </span>
                )}
                <span className="bd-meta-item">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {displayDate}
                </span>
                <span className="bd-meta-item">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {approvedComments.length} Comment{approvedComments.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Title */}
              <h1 className="bd-title">{blog.title}</h1>

              {/* blogTopList */}
              {blog.blogTopList?.length > 0 && <BlogTopList items={blog.blogTopList} />}

              {/* ── FIX: desc — short excerpt with bottom spacing ── */}
              {blog.desc && (
                <p className="bd-desc">{blog.desc}</p>
              )}

              {/* ── FIX: img1 + img2 — rendered with bd-img-grid-cell for proper sizing ── */}
              {hasImgGrid1 && (
                <div className="bd-img-grid">
                  {blog.img1 && (
                    <div className="bd-img-grid-cell">
                      <SafeImg
                        src={blog.img1}
                        alt={`${blog.title} – image 1`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}
                  {blog.img2 && (
                    <div className="bd-img-grid-cell">
                      <SafeImg
                        src={blog.img2}
                        alt={`${blog.title} – image 2`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── FIX: desc1 with spacing ── */}
              {blog.desc1 && (
                <p className="bd-desc">{blog.desc1}</p>
              )}

              {/* ── FIX: desc2 — blockquote if isBlogQuote, otherwise normal paragraph ── */}
              {blog.desc2 && (
                blog.isBlogQuote
                  ? <blockquote className="bd-quote"><p>{blog.desc2}</p></blockquote>
                  : <p className="bd-desc">{blog.desc2}</p>
              )}

              {/* ── FIX: img3 + img4 grid ── */}
              {hasImgGrid2 && (
                <div className="bd-img-grid">
                  {blog.img3 && (
                    <div className="bd-img-grid-cell">
                      <SafeImg
                        src={blog.img3}
                        alt={`${blog.title} – image 3`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}
                  {blog.img4 && (
                    <div className="bd-img-grid-cell">
                      <SafeImg
                        src={blog.img4}
                        alt={`${blog.title} – image 4`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── FIX: img5 + img6 grid ── */}
              {hasImgGrid3 && (
                <div className="bd-img-grid">
                  {blog.img5 && (
                    <div className="bd-img-grid-cell">
                      <SafeImg
                        src={blog.img5}
                        alt={`${blog.title} – image 5`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}
                  {blog.img6 && (
                    <div className="bd-img-grid-cell">
                      <SafeImg
                        src={blog.img6}
                        alt={`${blog.title} – image 6`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── FIX: slider[] images ── */}
              {hasSlider && (
                <div className="bd-slider">
                  {blog.slider.map((src, i) => (
                    <div key={i} className="bd-slider-img">
                      <SafeImg
                        src={src}
                        alt={`Slide ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* videoUrl / popupVideo + videoImg */}
              {hasVideo && (
                <VideoPlayer videoUrl={blog.videoUrl} popupVideo={blog.popupVideo} videoImg={blog.videoImg} />
              )}

              {/* body — full rich-text HTML */}
              {blog.body && (
                <div className="bd-body" dangerouslySetInnerHTML={{ __html: blog.body }} />
              )}

              {/* Tags + Share */}
              <div className="bd-divider" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                <Tags tags={blog.tags} />
                <ShareRow title={blog.title} />
              </div>
              <div className="bd-divider" />

              {/* Author */}
              <div className="bd-author-card">
                <div className="bd-author-avatar">
                  {blog.authorImg
                    ? <SafeImg src={blog.authorImg} alt={blog.author}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    : <span>{(blog.author || 'Admin').slice(0, 2).toUpperCase()}</span>}
                </div>
                <div>
                  <p className="bd-author-name">{blog.author || 'Admin'}</p>
                  <p className="bd-author-role">{blog.author_role || 'Author'}</p>
                  <p className="bd-author-bio">Passionate writer sharing insights and knowledge with our community.</p>
                </div>
              </div>

              <div className="bd-divider" />

              {/* Comments */}
              <CommentList comments={blog.comments} />

              {/* Comment form */}
              <CommentForm blogId={blog._id} onPosted={loadBlog} />

            </article>

            <Sidebar currentId={blog._id} />
          </div>
        )}

        <Cta />
      </div>

      <Footer />
      <ClientWrapper />
    </>
  );
}