// Settings.jsx — save as src/pages/Settings.jsx
import { useState, useRef } from 'react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  Eye, EyeOff, Lock, User, Camera, Briefcase,
  Shield, Plus, Trash2, Edit2, X, Check,
} from 'lucide-react';

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const styles = {
    superadmin: { background: '#7c3aed18', color: '#7c3aed', label: '⭐ Super Admin' },
    admin:      { background: '#1a598a18', color: '#1a598a', label: '🛡 Admin' },
    editor:     { background: '#1e8a8a18', color: '#1e8a8a', label: '✏️ Editor' },
  };
  const s = styles[role] || styles.editor;
  return (
    <span className="px-2 py-0.5 rounded-lg text-xs font-bold"
      style={{ background: s.background, color: s.color }}>
      {s.label}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ user, size = 64 }) => {
  if (user?.profileImage) {
    return (
      <img src={user.profileImage} alt={user.name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }} />
    );
  }
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.35,
        background: 'linear-gradient(135deg, #1a598a, #015599)' }}>
      {initials}
    </div>
  );
};

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', background: '#f8fafb', border: '1.5px solid #ecf0f0',
  color: '#0c1e21', borderRadius: '12px', padding: '10px 14px',
  fontSize: '14px', outline: 'none', transition: 'border-color 0.2s',
};
const card = {
  background: '#ffffff', border: '1px solid #ecf0f0',
  borderRadius: '16px', padding: '24px',
};
const btnPrimary = {
  background: 'linear-gradient(135deg, #1a598a, #015599)',
  color: '#fff', border: 'none', borderRadius: '12px',
  padding: '10px 20px', fontSize: '14px', fontWeight: 600,
  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
};
const btnDanger = {
  background: '#ef44441a', color: '#ef4444', border: 'none',
  borderRadius: '10px', padding: '6px 12px', fontSize: '13px',
  fontWeight: 600, cursor: 'pointer',
};

const METHOD_COLORS = {
  GET:    { bg: '#1a598a12', color: '#1a598a' },
  POST:   { bg: '#1e8a8a12', color: '#1e8a8a' },
  PUT:    { bg: '#d9770612', color: '#d97706' },
  DELETE: { bg: '#ef444412', color: '#ef4444' },
};

// ─── Create / Edit User Modal ─────────────────────────────────────────────────
function UserModal({ existing, onClose, onSaved, currentUserRole }) {
  const [form, setForm] = useState({
    name: existing?.name || '',
    email: existing?.email || '',
    password: '',
    role: existing?.role || 'editor',
    designation: existing?.designation || '',
    isActive: existing?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);

  const roleOptions = currentUserRole === 'superadmin'
    ? ['superadmin', 'admin', 'editor']
    : ['editor'];

  const handleSubmit = async () => {
    if (!form.name || !form.email) return toast.error('Name and email are required');
    if (!existing && !form.password) return toast.error('Password is required for new users');
    setLoading(true);
    try {
      if (existing) {
        const payload = { name: form.name, email: form.email, role: form.role,
          designation: form.designation, isActive: form.isActive };
        await authService.updateUser(existing._id, payload);
        toast.success('User updated');
      } else {
        await authService.createUser(form);
        toast.success('User created');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(12,30,33,0.4)', backdropFilter: 'blur(4px)' }}>
      <div style={{ ...card, width: '100%', maxWidth: 480 }} className="mx-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base" style={{ color: '#0c1e21' }}>
            {existing ? 'Edit User' : 'Create New User'}
          </h3>
          <button onClick={onClose} style={{ color: '#a9b8b8', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { key: 'name', label: 'Full Name', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            ...(!existing ? [{ key: 'password', label: 'Password', type: 'password' }] : []),
            { key: 'designation', label: 'Designation / Job Title', type: 'text' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: '#67787a' }}>{label}</label>
              <input type={type} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={inputStyle} placeholder={label}
                onFocus={e => e.target.style.borderColor = '#1a598a'}
                onBlur={e => e.target.style.borderColor = '#ecf0f0'} />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1"
              style={{ color: '#67787a' }}>Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              style={{ ...inputStyle }}>
              {roleOptions.map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>

          {existing && (
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
              <label htmlFor="isActive" className="text-sm" style={{ color: '#0c1e21' }}>Active Account</label>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={handleSubmit} disabled={loading} style={btnPrimary}>
            {loading
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Check size={15} />}
            {existing ? 'Save Changes' : 'Create User'}
          </button>
          <button onClick={onClose}
            style={{ ...btnDanger, background: '#f1f5f5', color: '#67787a' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────
export default function Settings() {
  const { user, updateUser: updateAuthUser } = useAuth();
  const isSuperAdmin = user?.role === 'superadmin';

  // Profile
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    designation: user?.designation || '',
  });
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [profileLoading, setProfileLoading] = useState(false);
  const fileRef = useRef();

  // Password
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  // User management (superadmin)
  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [userModal, setUserModal] = useState(null); // null | 'create' | { ...existingUser }
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Image picker ──────────────────────────────────────────────────────────
  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be under 2MB');
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleProfileSave = async () => {
    if (!profileForm.name.trim()) return toast.error('Name is required');
    setProfileLoading(true);
    try {
      const payload = {
        name: profileForm.name.trim(),
        designation: profileForm.designation.trim(),
        profileImage,
      };
      const { data } = await authService.updateProfile(payload);
      updateAuthUser && updateAuthUser(data.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Save password ─────────────────────────────────────────────────────────
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) return toast.error('Passwords do not match');
    if (pwdForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setPwdLoading(true);
    try {
      await authService.updatePassword({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      toast.success('Password updated');
      setPwdForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPwdLoading(false);
    }
  };

  // ── Load users (superadmin) ───────────────────────────────────────────────
  const loadUsers = async () => {
    try {
      const { data } = await authService.getAllUsers();
      setUsers(data.data);
      setUsersLoaded(true);
    } catch {
      toast.error('Failed to load users');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await authService.deleteUser(id);
      toast.success('User deleted');
      setDeleteConfirm(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#0c1e21' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: '#67787a' }}>Manage your account and team</p>
      </div>

      {/* ── Profile Card ──────────────────────────────────────────────────── */}
      <div style={card}>
        <div className="flex items-center gap-2 mb-5">
          <User size={16} style={{ color: '#1a598a' }} />
          <h2 className="font-semibold text-sm" style={{ color: '#0c1e21' }}>Profile</h2>
        </div>

        {/* Avatar + image upload */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <Avatar user={{ ...user, profileImage }} size={72} />
            <button onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: '#1a598a', border: '2px solid #fff' }}>
              <Camera size={13} color="#fff" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={handleImagePick} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#0c1e21' }}>{user?.name}</p>
            <p className="text-xs mt-0.5" style={{ color: '#a9b8b8' }}>{user?.email}</p>
            <div className="mt-1.5"><RoleBadge role={user?.role} /></div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: '#67787a' }}>Full Name</label>
            <input type="text" value={profileForm.name}
              onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#1a598a'}
              onBlur={e => e.target.style.borderColor = '#ecf0f0'} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: '#67787a' }}>
              <Briefcase size={12} className="inline mr-1" />Designation / Job Title
            </label>
            <input type="text" value={profileForm.designation}
              onChange={e => setProfileForm(f => ({ ...f, designation: e.target.value }))}
              style={inputStyle} placeholder="e.g. Content Manager"
              onFocus={e => e.target.style.borderColor = '#1a598a'}
              onBlur={e => e.target.style.borderColor = '#ecf0f0'} />
          </div>
        </div>

        {/* Read-only info */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: 'Email', value: user?.email },
            { label: 'Role', value: <RoleBadge role={user?.role} /> },
            { label: 'Status', value: user?.isActive ? '✅ Active' : '🚫 Inactive' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-3" style={{ background: '#f8fafb', border: '1px solid #ecf0f0' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a9b8b8' }}>{label}</p>
              <p className="text-sm font-semibold" style={{ color: '#0c1e21' }}>{value}</p>
            </div>
          ))}
        </div>

        <button onClick={handleProfileSave} disabled={profileLoading} style={{ ...btnPrimary, marginTop: 16 }}>
          {profileLoading
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : null}
          Save Profile
        </button>
      </div>

      {/* ── Change Password ───────────────────────────────────────────────── */}
      <div style={card}>
        <div className="flex items-center gap-2 mb-5">
          <Lock size={16} style={{ color: '#1a598a' }} />
          <h2 className="font-semibold text-sm" style={{ color: '#0c1e21' }}>Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confirm', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: '#67787a' }}>{label}</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={pwdForm[key]} required
                  onChange={e => setPwdForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{ ...inputStyle, paddingRight: key === 'currentPassword' ? '44px' : '14px' }}
                  placeholder="••••••••"
                  onFocus={e => e.target.style.borderColor = '#1a598a'}
                  onBlur={e => e.target.style.borderColor = '#ecf0f0'} />
                {key === 'currentPassword' && (
                  <button type="button" onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#a9b8b8', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit" disabled={pwdLoading} style={btnPrimary}>
            {pwdLoading
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : null}
            Update Password
          </button>
        </form>
      </div>

      {/* ── Team / User Management (SuperAdmin only) ──────────────────────── */}
      {isSuperAdmin && (
        <div style={card}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Shield size={16} style={{ color: '#7c3aed' }} />
              <h2 className="font-semibold text-sm" style={{ color: '#0c1e21' }}>Team Management</h2>
              <span className="text-xs px-2 py-0.5 rounded-lg font-semibold"
                style={{ background: '#7c3aed18', color: '#7c3aed' }}>Super Admin</span>
            </div>
            <div className="flex gap-2">
              {!usersLoaded && (
                <button onClick={loadUsers}
                  style={{ ...btnPrimary, padding: '7px 14px', fontSize: '13px', background: '#f1f5f5', color: '#67787a' }}>
                  Load Users
                </button>
              )}
              <button onClick={() => setUserModal('create')} style={{ ...btnPrimary, padding: '7px 14px', fontSize: '13px' }}>
                <Plus size={14} /> Add User
              </button>
            </div>
          </div>

          {usersLoaded ? (
            users.length === 0 ? (
              <p className="text-sm text-center py-6" style={{ color: '#a9b8b8' }}>No users found</p>
            ) : (
              <div className="space-y-2">
                {users.map(u => (
                  <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: '#f8fafb', border: '1px solid #ecf0f0' }}>
                    <Avatar user={u} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold truncate" style={{ color: '#0c1e21' }}>{u.name}</p>
                        <RoleBadge role={u.role} />
                        {!u.isActive && (
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#ef444418', color: '#ef4444' }}>
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#a9b8b8' }}>
                        {u.email}{u.designation ? ` · ${u.designation}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => setUserModal(u)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: '#1a598a18', color: '#1a598a', border: 'none', cursor: 'pointer' }}>
                        <Edit2 size={13} />
                      </button>
                      {u._id !== user?._id && (
                        <button onClick={() => setDeleteConfirm(u)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: '#ef444418', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-sm text-center py-4" style={{ color: '#a9b8b8' }}>
              Click "Load Users" to view the team
            </p>
          )}
        </div>
      )}

      {/* ── API Endpoints Reference ───────────────────────────────────────── */}
      {/* <div style={card}>
        <h2 className="font-semibold text-sm mb-4" style={{ color: '#0c1e21' }}>API Endpoints</h2>
        <div className="space-y-1 font-mono text-xs">
          {[
            ['GET',    '/api/auth/me',              'Current user'],
            ['PUT',    '/api/auth/update-profile',  'Update profile & image'],
            ['PUT',    '/api/auth/update-password', 'Change password'],
            ['GET',    '/api/auth/users',           '⭐ List all users'],
            ['POST',   '/api/auth/users',           '⭐ Create user'],
            ['PUT',    '/api/auth/users/:id',       '⭐ Update user'],
            ['DELETE', '/api/auth/users/:id',       '⭐ Delete user'],
            ['GET',    '/api/blogs',                'List published blogs'],
            ['POST',   '/api/auth/login',           'Admin login'],
            ['GET',    '/api/admin/blogs',          '🔒 All blogs'],
            ['POST',   '/api/admin/blogs',          '🔒 Create blog'],
            ['PUT',    '/api/admin/blogs/:id',      '🔒 Update blog'],
            ['DELETE', '/api/admin/blogs/:id',      '🔒 Delete blog'],
            ['GET',    '/api/admin/stats',          '🔒 Dashboard stats'],
          ].map(([method, path, desc]) => (
            <div key={path} className="flex items-center gap-3 py-2"
              style={{ borderBottom: '1px solid #ecf0f0' }}>
              <span className="w-14 text-center py-0.5 rounded-lg text-xs font-bold flex-shrink-0"
                style={{ background: METHOD_COLORS[method]?.bg, color: METHOD_COLORS[method]?.color }}>
                {method}
              </span>
              <span className="flex-1" style={{ color: '#1a425c' }}>{path}</span>
              <span className="hidden sm:block" style={{ color: '#a9b8b8' }}>{desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: '#a9b8b8' }}>
          ⭐ = Super Admin only &nbsp;·&nbsp; 🔒 = Admin / Super Admin
        </p>
      </div> */}

      {/* ── Create / Edit Modal ───────────────────────────────────────────── */}
      {userModal && (
        <UserModal
          existing={userModal === 'create' ? null : userModal}
          currentUserRole={user?.role}
          onClose={() => setUserModal(null)}
          onSaved={loadUsers}
        />
      )}

      {/* ── Delete Confirm ────────────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(12,30,33,0.4)', backdropFilter: 'blur(4px)' }}>
          <div style={{ ...card, maxWidth: 380 }} className="mx-4">
            <h3 className="font-bold text-base mb-2" style={{ color: '#0c1e21' }}>Delete User</h3>
            <p className="text-sm mb-5" style={{ color: '#67787a' }}>
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteUser(deleteConfirm._id)}
                style={{ ...btnPrimary, background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
                <Trash2 size={14} /> Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                style={{ ...btnDanger, background: '#f1f5f5', color: '#67787a' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}