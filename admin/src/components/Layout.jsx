import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, MessageSquare, Settings,
  LogOut, BookOpen, Menu, Layers, Calendar,
} from 'lucide-react';
import { useState } from 'react';

// ─── Add / remove nav items here ────────────────────────────────────────────
const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/blogs',     icon: FileText,        label: 'Blogs'     },
  { to: '/comments',  icon: MessageSquare,   label: 'Comments'  },
  { to: '/banner',    icon: Layers,          label: 'Banner'    },
  { to: '/services',  icon: Layers,          label: 'Services'  },
  { to: '/events',    icon: Calendar,        label: 'Events'    }, // ← NEW
  { to: '/settings',  icon: Settings,        label: 'Settings'  },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const Sidebar = () => (
    <aside className="w-64 flex flex-col h-full" style={{ background: '#ffffff', borderRight: '1px solid #ecf0f0' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid #ecf0f0' }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
          style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}
        >
          <BookOpen size={19} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: '#0c1e21' }}>Blog Admin</p>
          <p className="text-xs" style={{ color: '#a9b8b8' }}>Control Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? 'active-nav' : 'inactive-nav'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background: 'linear-gradient(135deg, #1a598a15, #1a598a08)',
                    color: '#1a598a',
                    borderLeft: '3px solid #1a598a',
                  }
                : {
                    color: '#67787a',
                    borderLeft: '3px solid transparent',
                  }
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} style={{ color: isActive ? '#1a598a' : '#a9b8b8' }} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4" style={{ borderTop: '1px solid #ecf0f0' }}>
        <div
          className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl"
          style={{ background: '#f8fafb' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
            style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}
          >
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#0c1e21' }}>{user?.name}</p>
            <p className="text-xs truncate capitalize" style={{ color: '#a9b8b8' }}>{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-red-50 group"
          style={{ color: '#67787a' }}
        >
          <LogOut size={15} className="group-hover:text-red-500 transition-colors" />
          <span className="group-hover:text-red-500 transition-colors">Logout</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f8fafb' }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0 shadow-sm">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 flex shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header
          className="flex items-center justify-between px-5 py-3.5 lg:hidden shadow-sm"
          style={{ background: '#ffffff', borderBottom: '1px solid #ecf0f0' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ color: '#67787a' }}
            className="hover:text-gray-900 transition-colors"
          >
            <Menu size={22} />
          </button>
          <p className="font-bold text-sm" style={{ color: '#0c1e21' }}>Blog Admin</p>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #1a598a, #015599)' }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}