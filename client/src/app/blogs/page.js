'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { fetchBlogs } from '@/utils/blogApi';
import Header from '@/components/layout/header/Header';
import BackToTop from '@/components/shared/others/BackToTop';
import HeaderSpace from '@/components/shared/others/HeaderSpace';
import HeroInner from '@/components/sections/hero/HeroInner';
import Footer from '@/components/layout/footer/Footer';
import Cta from '@/components/sections/cta/Cta';
import ClientWrapper from '@/components/shared/wrappers/ClientWrapper';

/*
  Theme tokens from SCSS variables:
  --color-primary      : #1a598a   (theme.primary)
  --color-dark         : #0c1e21   (theme.dark / heading.primary)
  --color-dark-2       : #18292c   (theme.dark-2)
  --color-dark-3       : #015599   (theme.dark-3)
  --color-bg           : #9ed3fb   (theme.bg)
  --color-bg-2         : #fff      (theme.bg-2)
  --color-bg-3         : #202e30   (theme.bg-3)
  --color-body         : #1a425c   (text.body)
  --color-body-3       : #67787a   (text.body-3)
  --color-body-4       : #18292c   (text.body-4)
  --color-grey-1       : #ecf0f0   (grey.1)
  --color-grey-2       : #a9b8b8   (grey.2)
  --color-border-5     : #1e8a8a26 (border.5)
*/

var PER_PAGE = 6;

function BlogCard(props) {
  var blog = props.blog;

  var date = null;
  if (blog.day && blog.month) {
    date = { day: blog.day, month: blog.month };
  } else if (blog.createdAt) {
    var d = new Date(blog.createdAt);
    date = {
      day: d.getDate(),
      month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
    };
  }

  var href = '/blogs/' + (blog.slug || blog._id);

  var base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  var imgSrc = blog.img
    ? blog.img.startsWith('http')
      ? blog.img
      : base + (blog.img.startsWith('/') ? blog.img : '/' + blog.img)
    : null;

  return (
    <div className="bc-card">

      {/* ── Image panel ── */}
      <div className="bc-img-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={blog.title} loading="lazy" />
        ) : (
          <div className="bc-img-fallback">
            <svg width="48" height="48" fill="none" stroke="#a9b8b8" strokeWidth="1.2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
        )}

        {/* Date badge */}
        {date && (
          <div className="bc-date">
            <span className="bc-date-day">{date.day}</span>
            <span className="bc-date-month">{date.month}</span>
          </div>
        )}
      </div>

      {/* ── Content panel ── */}
      <div className="bc-body">
        <div>
          <div className="bc-meta">
            {blog.category && <span className="bc-category">{blog.category}</span>}
            {blog.author   && <span className="bc-author">By {blog.author}</span>}
          </div>
          <h3 className="bc-title">{blog.title}</h3>
        </div>

        <Link href={href} className="bc-readmore">
          Read More
          <span className="bc-readmore-icon">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function BlogsGridPrimary() {
  var blogsState      = useState([]);
  var blogs           = blogsState[0];      var setBlogs      = blogsState[1];

  var loadingState    = useState(true);
  var loading         = loadingState[0];    var setLoading    = loadingState[1];

  var errorState      = useState(null);
  var error           = errorState[0];      var setError      = errorState[1];

  var pageState       = useState(1);
  var page            = pageState[0];       var setPage       = pageState[1];

  var totalPagesState = useState(1);
  var totalPages      = totalPagesState[0]; var setTotalPages = totalPagesState[1];

  var fetchBlogsData = useCallback(function () {
    setLoading(true);
    setError(null);
    fetchBlogs({ page: page, limit: PER_PAGE })
      .then(function (d) {
        if (Array.isArray(d)) {
          setBlogs(d); setTotalPages(1);
        } else {
          setBlogs(d.blogs || d.data || []);
          setTotalPages(d.pages || d.totalPages || 1);
        }
      })
      .catch(function (e) { setError('Failed to load blogs: ' + e.message); })
      .finally(function () { setLoading(false); });
  }, [page]);

  useEffect(function () { fetchBlogsData(); }, [fetchBlogsData]);

  return (
    <>
      <style>{`
       

        /* ─── CSS tokens from SCSS vars ─── */
        :root {
          --tp:   #1a598a;   /* theme.primary    */
          --td:   #0c1e21;   /* theme.dark       */
          --td2:  #18292c;   /* theme.dark-2     */
          --td3:  #015599;   /* theme.dark-3     */
          --tbg:  #9ed3fb;   /* theme.bg         */
          --tbg2: #ffffff;   /* theme.bg-2       */
          --tbg3: #202e30;   /* theme.bg-3       */
          --tb:   #1a425c;   /* text.body        */
          --tb3:  #67787a;   /* text.body-3      */
          --tg1:  #ecf0f0;   /* grey.1           */
          --tg2:  #a9b8b8;   /* grey.2           */
          --tbr5: #1e8a8a26; /* border.5         */
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bg-page {
          background: var(--tg1);
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Section ── */
        .bg-section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 72px 40px 100px;
        }

        /* ── 2-column grid ── */
        .bg-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
        }
        @media (max-width: 900px) { .bg-grid { grid-template-columns: 1fr; } }

        /* ────────────────────────────────
           CARD — horizontal layout
        ──────────────────────────────── */
        .bc-card {
          background: var(--tbg2);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          min-height: 270px;
          border: 1px solid var(--tbr5);
          box-shadow: 0 2px 20px rgba(26,89,138,.07);
          transition: transform .3s cubic-bezier(.22,.61,.36,1),
                      box-shadow .3s;
        }
        .bc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(26,89,138,.14);
        }

        /* ── Image panel ── */
        .bc-img-wrap {
          position: relative;
          width: 42%;
          flex-shrink: 0;
          overflow: hidden;
          background: var(--tg1);
        }
        .bc-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .5s cubic-bezier(.22,.61,.36,1);
        }
        .bc-card:hover .bc-img-wrap img { transform: scale(1.06); }
        .bc-img-fallback {
          width: 100%;
          height: 100%;
          min-height: 270px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--tg1);
        }

        /* ── Date badge ── */
        .bc-date {
          position: absolute;
          bottom: 16px;
          left: 16px;
          background: rgba(255,255,255,.96);
          border-radius: 12px;
          padding: 8px 14px;
          text-align: center;
          min-width: 58px;
          box-shadow: 0 4px 14px rgba(12,30,33,.18);
          backdrop-filter: blur(6px);
          line-height: 1;
        }
        .bc-date-day {
          display: block;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--td);
          line-height: 1;
        }
        .bc-date-month {
          display: block;
          font-size: .6rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--tg2);
          margin-top: 4px;
        }

        /* ── Body panel ── */
        .bc-body {
          flex: 1;
          padding: 28px 26px 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
        }

        /* ── Meta row ── */
        .bc-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .bc-category {
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--tp);
        }
        .bc-author {
          font-size: .78rem;
          color: var(--tg2);
          font-weight: 400;
        }

        /* ── Title ── */
        .bc-title {
         
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--td);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 0;
        }

        /* ── Read More ── */
        .bc-readmore {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: .84rem;
          font-weight: 700;
          color: var(--td);
          text-decoration: none;
          transition: gap .22s, color .22s;
          margin-top: 22px;
          align-self: flex-start;
        }
        .bc-readmore:hover { gap: 14px; color: var(--tp); }
        .bc-readmore-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--td);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background .22s, transform .25s;
        }
        .bc-readmore:hover .bc-readmore-icon {
          background: var(--tp);
          transform: rotate(45deg);
        }

        /* ── Pagination ── */
        .bg-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding-top: 60px;
        }
        .bg-page-btn {
          min-width: 42px;
          height: 42px;
          padding: 0 14px;
          border-radius: 10px;
          border: 1.5px solid var(--tg2);
          background: var(--tbg2);
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s;
          color: var(--tb3);
        }
        .bg-page-btn.active,
        .bg-page-btn:hover:not(:disabled) {
          background: var(--tp);
          border-color: var(--tp);
          color: #fff;
        }
        .bg-page-btn:disabled { opacity: .35; cursor: default; }

        /* ── States ── */
        .bg-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 40vh;
          gap: 16px;
          padding: 80px 24px;
        }
        .bg-spinner {
          width: 46px;
          height: 46px;
          border: 3px solid var(--tg1);
          border-top-color: var(--tp);
          border-radius: 50%;
          animation: _spin .7s linear infinite;
        }
        @keyframes _spin { to { transform: rotate(360deg); } }
        .bg-state p { font-size: .95rem; color: var(--tb3); }
        .bg-error-box {
          max-width: 480px;
          width: 100%;
          background: #fff0f0;
          border: 1px solid #f5c2c2;
          border-radius: 16px;
          padding: 36px;
          text-align: center;
        }
        .bg-error-title {
        
          color: #7b2020;
          font-size: 1.2rem;
          margin-bottom: 8px;
        }
        .bg-error-msg { color: #9b4444; font-size: .88rem; }

        /* ── Mobile stack ── */
        @media (max-width: 560px) {
          .bc-card { flex-direction: column; min-height: unset; }
          .bc-img-wrap { width: 100%; height: 220px; }
          .bc-body { padding: 22px 20px 22px; }
          .bg-section { padding: 48px 20px 80px; }
        }
      `}</style>

      <div className="bg-page">
        <BackToTop />
        <Header />
        <Header isStickyHeader={true} />

        <HeaderSpace />
        <HeroInner title={"Blog Grid"} text={"Blog Grid"} />

        <div className="bg-section">
          {loading ? (
            <div className="bg-state">
              <div className="bg-spinner" />
              <p>Loading articles…</p>
            </div>
          ) : error ? (
            <div className="bg-state">
              <div className="bg-error-box">
                <p className="bg-error-title">Could not load blogs</p>
                <p className="bg-error-msg">{error}</p>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-state">
              <p>No blog posts found.</p>
            </div>
          ) : (
            <>
              <div className="bg-grid">
                {blogs.map(function (blog) {
                  return <BlogCard key={blog._id} blog={blog} />;
                })}
              </div>

              {totalPages > 1 && (
                <div className="bg-pagination">
                  <button
                    className="bg-page-btn"
                    onClick={function () { setPage(function (p) { return p - 1; }); }}
                    disabled={page === 1}
                  >‹</button>

                  {Array.from({ length: totalPages }, function (_, i) { return i + 1; }).map(function (p) {
                    return (
                      <button
                        key={p}
                        className={'bg-page-btn' + (page === p ? ' active' : '')}
                        onClick={function () { setPage(p); }}
                      >{p}</button>
                    );
                  })}

                  <button
                    className="bg-page-btn"
                    onClick={function () { setPage(function (p) { return p + 1; }); }}
                    disabled={page === totalPages}
                  >›</button>
                </div>
              )}
            </>
          )}
        </div>

        <Cta />
      </div>

      <Footer />
      <ClientWrapper />
    </>
  );
}