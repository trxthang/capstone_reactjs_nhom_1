import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Film, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ taiKhoan: '', matKhau: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Chào mừng, ${data.hoTen || data.taiKhoan}!`);
      const isAdmin = data.maLoaiNguoiDung === 'QuanTri';
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    } catch (err) {
      const msg = err.message || 'Tài khoản hoặc mật khẩu không đúng';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80"
          alt="Cinema"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-gray-950/20 to-gray-950" />
        <div className="absolute bottom-12 left-12 max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Film size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CineMax</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Trải nghiệm điện ảnh đỉnh cao</h2>
          <p className="text-gray-300 leading-relaxed">
            Đặt vé xem phim, chọn ghế yêu thích, tận hưởng không gian chiếu phim hiện đại nhất.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Film size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CineMax</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Đăng nhập</h1>
          <p className="text-gray-400 mb-8">Chào mừng bạn trở lại!</p>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-700 rounded-xl mb-6 text-sm text-red-400">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tài khoản</label>
              <input
                required
                autoComplete="username"
                value={form.taiKhoan}
                onChange={e => { setForm({ ...form, taiKhoan: e.target.value }); setError(''); }}
                placeholder="Nhập tài khoản"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Mật khẩu</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={form.matKhau}
                  onChange={e => { setForm({ ...form, matKhau: e.target.value }); setError(''); }}
                  placeholder="••••••••"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <><Loader size={18} className="animate-spin" />Đang đăng nhập...</> : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-red-400 hover:text-red-300 font-medium">
              Đăng ký ngay
            </Link>
          </p>

          <div className="mt-8 p-4 bg-gray-900/60 rounded-xl border border-gray-800 text-xs text-gray-500 space-y-1">
            <p className="font-medium text-gray-400 mb-1">Lưu ý:</p>
            <p>• Tài khoản là do bạn tự đăng ký hoặc được cấp bởi CyberSoft</p>
            <p>• Quản trị viên: tài khoản có maLoaiNguoiDung = "QuanTri"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
