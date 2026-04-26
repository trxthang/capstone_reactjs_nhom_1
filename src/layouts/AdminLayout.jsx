import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Film, LayoutDashboard, Users, Clapperboard, Building2, LogOut, Menu, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/movies', label: 'Quản lý phim', icon: Film },
  { to: '/admin/cinemas', label: 'Hệ thống rạp', icon: Building2 },
  { to: '/admin/users', label: 'Quản lý người dùng', icon: Users },
  { to: '/admin/showtimes', label: 'Lịch chiếu', icon: Clapperboard },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất');
    navigate('/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'w-64' : collapsed ? 'w-16' : 'w-60'} flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300 h-full`}>
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-gray-800 ${collapsed && !mobile ? 'justify-center px-2' : 'gap-3 px-5'}`}>
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
          <Film size={16} className="text-white" />
        </div>
        {(!collapsed || mobile) && <span className="font-bold text-white">CineMax Admin</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/admin'}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                isActive ? 'bg-red-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }>
            <Icon size={18} className="shrink-0" />
            {(!collapsed || mobile) && <span>{label}</span>}
            {collapsed && !mobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className={`border-t border-gray-800 p-3 space-y-1`}>
        <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors`}>
          <ChevronRight size={16} className="rotate-180 shrink-0" />
          {(!collapsed || mobile) && 'Về trang chủ'}
        </Link>
        <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition-colors`}>
          <LogOut size={16} className="shrink-0" />
          {(!collapsed || mobile) && 'Đăng xuất'}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col relative">
        <Sidebar />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white z-10"
        >
          <ChevronRight size={12} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <button className="md:hidden p-1.5 text-gray-400 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.hoTen}</p>
              <p className="text-xs text-yellow-400">Quản trị viên</p>
            </div>
            <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
              {(user?.hoTen || user?.taiKhoan || 'A')[0].toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
