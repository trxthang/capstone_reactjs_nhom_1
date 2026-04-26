import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Search, User, Ticket, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function UserLayout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/movies?q=${encodeURIComponent(search.trim())}`);
  };

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/movies', label: 'Phim' },
    { to: '/cinemas', label: 'Rạp chiếu' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <Film size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">CineMax</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-red-600/20 text-red-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
                }>
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm phim..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>
          </form>

          <div className="flex items-center gap-3 ml-auto">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 rounded-lg text-sm font-medium transition-colors">
                    Admin
                  </Link>
                )}
                <div className="relative">
                  <button onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-800 transition-colors">
                    <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {(user.name || user.hoTen || 'U')[0].toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm text-gray-300 max-w-24 truncate">
                      {user.name || user.hoTen}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm font-medium text-white truncate">{user.name || user.hoTen}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                          <User size={15} /> Hồ sơ
                        </Link>
                        <Link to="/my-tickets" onClick={() => setDropOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                          <Ticket size={15} /> Vé của tôi
                        </Link>
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 transition-colors">
                          <LogOut size={15} /> Đăng xuất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-1.5 text-sm text-gray-300 hover:text-white transition-colors">Đăng nhập</Link>
                <Link to="/register" className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors">Đăng ký</Link>
              </div>
            )}
            <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-4 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm phim..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500" />
              </div>
            </form>
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-red-600/20 text-red-400' : 'text-gray-400'}`}>
                {l.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
              <Film size={14} className="text-white" />
            </div>
            <span className="font-bold text-white">CineMax</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 CineMax. Hệ thống đặt vé xem phim trực tuyến.</p>
        </div>
      </footer>
    </div>
  );
}
