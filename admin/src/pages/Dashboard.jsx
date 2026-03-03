import { useEffect, useState } from 'react';
import { blogService, eventService, careerService, contactService } from '../services/api';
import { Link } from 'react-router-dom';
import {
  FileText, TrendingUp, ArrowUpRight, Calendar, Briefcase, Mail, Layers, Tag,
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, bg, to }) => {
  const inner = (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ background: '#ffffff', border: '1px solid #ecf0f0' }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
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

// Helper: pick first truthy value from multiple possible field names
const pick = (obj, ...keys) => {
  for (const k of keys) if (obj?.[k]) return obj[k];
  return null;
};

export default function Dashboard() {
  const [stats,        setStats]        = useState(null);
  const [bannerSlides, setBannerSlides] = useState(null);
  const [eventCount,   setEventCount]   = useState(null);
  const [careerStats,  setCareerStats]  = useState(null);
  const [contactStats, setContactStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [blogs,        setBlogs]        = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const BASE  = import.meta.env.VITE_API_URL || '/api';

    const fetchAllApplications = async () => {
      try {
        const careersRes = await careerService.getAllAdmin();
        const careers    = careersRes.data?.data ?? careersRes.data ?? [];

        const appArrays = await Promise.all(
          careers.map((c) =>
            careerService.getApplications(c._id)
              .then((r) => {
                const list = r.data?.data ?? r.data?.applications ?? r.data ?? [];
                return list.map((app) => ({ ...app, jobTitle: c.title }));
              })
              .catch(() => [])
          )
        );

        return appArrays
          .flat()
          .sort((a, b) => new Date(b.createdAt || b.appliedAt || 0) - new Date(a.createdAt || a.appliedAt || 0))
          .slice(0, 6);
      } catch {
        return [];
      }
    };

    // Fetch recent blogs separately via admin blogs endpoint
    const fetchRecentBlogs = async () => {
      try {
        const res = await blogService.getAll({ limit: 5, sort: '-createdAt' });
        return res.data?.data ?? res.data?.blogs ?? res.data ?? [];
      } catch {
        return [];
      }
    };

    Promise.all([
      blogService.getStats().then((r) => r.data?.data ?? r.data).catch(() => null),

      fetch(`${BASE}/banner/admin`, { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json()).then((r) => r.data?.slides?.length ?? 0).catch(() => null),

      eventService.getAllAdmin()
        .then((r) => r.data?.count ?? r.data?.data?.length ?? r.data?.length ?? 0).catch(() => null),

      careerService.getStats().then((r) => r.data?.data ?? null).catch(() => null),

      contactService.getStats().then((r) => r.data?.data ?? null).catch(() => null),

      fetchAllApplications(),

      fetchRecentBlogs(),
    ]).then(([s, slides, evtCount, careers, contacts, apps, recentBlogs]) => {
      setStats(s);
      setBannerSlides(slides);
      setEventCount(evtCount);
      setCareerStats(careers);
      setContactStats(contacts);
      setApplications(apps);
      // Use recentBlogs from separate call OR fallback to stats.recentBlogs
      setBlogs(recentBlogs?.length ? recentBlogs : (s?.recentBlogs ?? []));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-8 flex justify-center items-center min-h-64">
      <div className="w-8 h-8 rounded-full animate-spin" style={{ border: '3px solid #ecf0f0', borderTopColor: '#1a598a' }} />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#0c1e21' }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: '#67787a' }}>Overview of your content</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard label="Banner Slides"      value={bannerSlides}                   icon={Layers}    color="#015599" bg="#01559912" to="/banner"   />
        <StatCard label="Total Events"       value={eventCount}                     icon={Calendar}  color="#059669" bg="#05966912" to="/events"   />
        <StatCard label="Active Jobs"        value={careerStats?.active}            icon={Briefcase} color="#b45309" bg="#b4530912" to="/careers"  />
        <StatCard label="Total Applications" value={careerStats?.totalApplications} icon={FileText}  color="#0369a1" bg="#0369a112" to="/careers"  />
        <StatCard label="New Messages"       value={contactStats?.new}              icon={Mail}      color="#dc2626" bg="#dc262612" to="/contacts" />
        <StatCard label="Total Messages"     value={contactStats?.total}            icon={Mail}      color="#7c3aed" bg="#7c3aed12" to="/contacts" />
      </div>

      {/* Recent Blog Cards */}
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #ecf0f0' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-sm" style={{ color: '#0c1e21' }}>Recent Posts</h2>
          <Link to="/blogs" className="text-xs font-medium hover:underline" style={{ color: '#1a598a' }}>View all</Link>
        </div>

        {blogs.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blogs/edit/${blog._id}`}
                className="group rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col"
                style={{ border: '1px solid #ecf0f0' }}
              >
                {/* Thumbnail */}
                <div className="relative h-32 overflow-hidden flex-shrink-0" style={{ background: '#ecf0f0' }}>
                  {pick(blog, 'img', 'image', 'thumbnail', 'coverImage') ? (
                    <img
                      src={pick(blog, 'img', 'image', 'thumbnail', 'coverImage')}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText size={28} style={{ color: '#a9b8b8' }} />
                    </div>
                  )}
                  {/* Status badge */}
                  <span
                    className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={blog.isPublished
                      ? { background: '#1e8a8a', color: '#fff' }
                      : { background: '#ecf0f0', color: '#67787a' }}
                  >
                    {blog.isPublished ? 'Live' : 'Draft'}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col gap-1 flex-1">
                  {blog.category && (
                    <div className="flex items-center gap-1">
                      <Tag size={10} style={{ color: '#1a598a' }} />
                      <span className="text-xs font-medium truncate" style={{ color: '#1a598a' }}>{blog.category}</span>
                    </div>
                  )}
                  <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: '#0c1e21' }}>
                    {blog.title}
                  </p>
                  <p className="text-xs mt-auto pt-1" style={{ color: '#a9b8b8' }}>
                    {pick(blog, 'createdAt', 'publishedAt', 'date')
                      ? new Date(pick(blog, 'createdAt', 'publishedAt', 'date')).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#a9b8b8' }}>No recent posts</p>
        )}
      </div>

      {/* Recent Applications */}
      <div className="rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #ecf0f0' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Briefcase size={17} style={{ color: '#b45309' }} />
            <h2 className="font-semibold text-sm" style={{ color: '#0c1e21' }}>Recent Applications</h2>
          </div>
          <Link to="/careers" className="text-xs font-medium hover:underline" style={{ color: '#1a598a' }}>View all</Link>
        </div>

        {applications.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '2px solid #ecf0f0' }}>
                  <th className="text-left pb-3 font-medium" style={{ color: '#67787a' }}>Applicant</th>
                  <th className="text-left pb-3 font-medium" style={{ color: '#67787a' }}>Position</th>
                  <th className="text-left pb-3 font-medium hidden sm:table-cell" style={{ color: '#67787a' }}>Email</th>
                  <th className="text-left pb-3 font-medium hidden md:table-cell" style={{ color: '#67787a' }}>Received</th>
                  <th className="text-left pb-3 font-medium" style={{ color: '#67787a' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => {
                  // Try all possible name fields
                  const name = pick(app, 'name', 'fullName', 'applicantName', 'firstName') 
                    || (app.firstName && app.lastName ? `${app.firstName} ${app.lastName}` : null)
                    || '—';

                  // Try all possible date fields
                  const dateRaw = pick(app, 'createdAt', 'appliedAt', 'submittedAt', 'date');

                  return (
                    <tr key={app._id ?? i} className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #ecf0f0' }}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                            style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}
                          >
                            {name !== '—' ? name[0].toUpperCase() : '?'}
                          </div>
                          <span className="font-medium" style={{ color: '#0c1e21' }}>{name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4" style={{ color: '#1a425c' }}>
                        {app.jobTitle || app.position || '—'}
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell" style={{ color: '#67787a' }}>
                        {app.email || '—'}
                      </td>
                      <td className="py-3 pr-4 hidden md:table-cell" style={{ color: '#a9b8b8' }}>
                        {dateRaw
                          ? new Date(dateRaw).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="py-3">
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-full font-medium capitalize"
                          style={
                            app.status === 'accepted'  ? { background: '#1e8a8a15', color: '#1e8a8a' }
                            : app.status === 'rejected' ? { background: '#dc262615', color: '#dc2626' }
                            : { background: '#d9770615', color: '#d97706' }
                          }
                        >
                          {app.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#a9b8b8' }}>No applications yet</p>
        )}
      </div>

    </div>
  );
}