import { useEffect, useState } from 'react';
import { blogService, eventService } from '../services/api';
import { Link } from 'react-router-dom';
import {
  FileText, CheckCircle, Star, MessageSquare,
  Plus, TrendingUp, Layers, ArrowUpRight, Calendar,
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, bg, to }) => {
  const inner = (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ background: '#ffffff', border: '1px solid #ecf0f0' }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: bg }}
      >
        <Icon size={21} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold" style={{ color: '#0c1e21' }}>{value ?? '—'}</p>
        <p className="text-sm" style={{ color: '#67787a' }}>{label}</p>
      </div>
      {to && <ArrowUpRight size={16} style={{ color: '#a9b8b8' }} />}
    </div>
  );
  return to ? <Link to={to} className="block">{inner}</Link> : inner;
};

export default function Dashboard() {
  const [stats, setStats]           = useState(null);
  const [bannerSlides, setBannerSlides] = useState(null);
  const [eventCount, setEventCount] = useState(null); // ← NEW
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

    Promise.all([
      // Blog stats
      blogService.getStats()
        .then((r) => r.data.data)
        .catch(() => null),

      // Banner slides count
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/banner/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((r) => r.data?.slides?.length ?? 0)
        .catch(() => null),

      // Events count — uses shared axios instance (token auto-attached)
      eventService.getAllAdmin()
        .then((r) => r.data?.count ?? r.data?.data?.length ?? 0)
        .catch(() => null),
    ]).then(([s, slides, evtCount]) => {
      setStats(s);
      setBannerSlides(slides);
      setEventCount(evtCount);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 flex justify-center items-center min-h-64">
      <div
        className="w-8 h-8 rounded-full animate-spin"
        style={{ border: '3px solid #ecf0f0', borderTopColor: '#1a598a' }}
      />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0c1e21' }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: '#67787a' }}>Overview of your blog content</p>
        </div>
        <Link
          to="/blogs/new"
          className="flex items-center gap-2 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}
        >
          <Plus size={15} /> New Blog
        </Link>
      </div>

      {/* Stat Cards — now 6 items (2 rows on sm, 3 cols on xl) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          label="Total Blogs"
          value={stats?.total}
          icon={FileText}
          color="#1a598a"
          bg="#1a598a12"
        />
        <StatCard
          label="Published"
          value={stats?.published}
          icon={CheckCircle}
          color="#1e8a8a"
          bg="#1e8a8a12"
        />
        <StatCard
          label="Featured"
          value={stats?.featured}
          icon={Star}
          color="#d97706"
          bg="#d9770612"
        />
        <StatCard
          label="Pending Comments"
          value={stats?.pendingComments}
          icon={MessageSquare}
          color="#7c3aed"
          bg="#7c3aed12"
        />
        <StatCard
          label="Banner Slides"
          value={bannerSlides}
          icon={Layers}
          color="#015599"
          bg="#01559912"
          to="/banner"
        />
        {/* ── NEW — Events stat card ── */}
        <StatCard
          label="Total Events"
          value={eventCount}
          icon={Calendar}
          color="#059669"
          bg="#05966912"
          to="/events"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Category breakdown */}
        <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #ecf0f0' }}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={17} style={{ color: '#1a598a' }} />
            <h2 className="font-semibold text-sm" style={{ color: '#0c1e21' }}>Posts by Category</h2>
          </div>
          {stats?.categoryStats?.length ? (
            <div className="space-y-3">
              {stats.categoryStats.map((cat, i) => {
                const DOT_COLORS = ['#1a598a', '#1e8a8a', '#d97706', '#7c3aed'];
                const pct = Math.round((cat.count / (stats.total || 1)) * 100);
                return (
                  <div key={cat._id}>
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: DOT_COLORS[i % DOT_COLORS.length] }}
                      />
                      <span className="text-sm flex-1" style={{ color: '#1a425c' }}>
                        {cat._id || 'Uncategorized'}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: '#0c1e21' }}>
                        {cat.count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full ml-5" style={{ background: '#ecf0f0' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: DOT_COLORS[i % DOT_COLORS.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm" style={{ color: '#a9b8b8' }}>No data yet</p>
          )}
        </div>

        {/* Recent blogs */}
        <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #ecf0f0' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-sm" style={{ color: '#0c1e21' }}>Recent Posts</h2>
            <Link to="/blogs" className="text-xs font-medium hover:underline" style={{ color: '#1a598a' }}>
              View all
            </Link>
          </div>
          <div className="space-y-1">
            {stats?.recentBlogs?.map((blog) => (
              <div
                key={blog._id}
                className="flex items-center gap-3 py-2.5 rounded-xl px-2 hover:bg-gray-50 transition-colors"
                style={{ borderBottom: '1px solid #ecf0f0' }}
              >
                {blog.img ? (
                  <img
                    src={blog.img}
                    alt=""
                    className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg flex-shrink-0" style={{ background: '#ecf0f0' }} />
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/blogs/edit/${blog._id}`}
                    className="text-sm font-medium hover:underline truncate block"
                    style={{ color: '#0c1e21' }}
                  >
                    {blog.title}
                  </Link>
                  <p className="text-xs" style={{ color: '#a9b8b8' }}>{blog.category}</p>
                </div>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                  style={
                    blog.isPublished
                      ? { background: '#1e8a8a15', color: '#1e8a8a' }
                      : { background: '#ecf0f0', color: '#67787a' }
                  }
                >
                  {blog.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick-links row — Banner + Events */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Banner quick link */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #1a598a08, #01559908)', border: '1px solid #1a598a20' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}
            >
              <Layers size={19} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#0c1e21' }}>Hero Banner</p>
              <p className="text-xs" style={{ color: '#67787a' }}>
                {bannerSlides ?? 0} slide{bannerSlides !== 1 ? 's' : ''} configured
              </p>
            </div>
          </div>
          <Link
            to="/banner"
            className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}
          >
            Manage Banner
          </Link>
        </div>

        {/* ── NEW — Events quick link ── */}
        <div
          className="rounded-2xl p-5 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #05966908, #05966904)', border: '1px solid #05966920' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
            >
              <Calendar size={19} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#0c1e21' }}>Campus Events</p>
              <p className="text-xs" style={{ color: '#67787a' }}>
                {eventCount ?? 0} event{eventCount !== 1 ? 's' : ''} configured
              </p>
            </div>
          </div>
          <Link
            to="/events"
            className="flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}
          >
            Manage Events
          </Link>
        </div>
      </div>
    </div>
  );
}