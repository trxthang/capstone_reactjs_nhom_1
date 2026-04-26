import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Film, Loader, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import authApi from '../../api/authApi';
import toast from 'react-hot-toast';

// Kiểm tra yêu cầu mật khẩu của Cybersoft
function checkPassword(pwd) {
  return {
    length: pwd.length >= 6,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
}

function PwdRule({ ok, label }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-400' : 'text-gray-500'}`}>
      {ok ? <CheckCircle size={11} /> : <XCircle size={11} />}
      {label}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    taiKhoan: '',
    matKhau: '',
    email: '',
    soDt: '',
    hoTen: '',
    maNhom: import.meta.env.VITE_MA_NHOM,
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pwdFocused, setPwdFocused] = useState(false);

  const set = (field) => (e) => { setForm({ ...form, [field]: e.target.value }); setError(''); };
  const pwdCheck = checkPassword(form.matKhau);
  const pwdValid = Object.values(pwdCheck).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.taiKhoan || form.taiKhoan.length < 4) {
      setError('Tài khoản phải có ít nhất 4 ký tự'); return;
    }
    if (!pwdValid) {
      setError('Mật khẩu chưa đáp ứng yêu cầu'); return;
    }

    setLoading(true);
    try {
      await authApi.dangKy(form);
      toast.success('Đăng ký thành công! Hãy đăng nhập.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại. Tài khoản hoặc email có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  const inp = 'w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors';

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80" alt="Cinema"
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-r from-gray-950/20 to-gray-950" />
        <div className="absolute bottom-12 left-12 max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Film size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CineMax</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Tham gia cộng đồng yêu phim</h2>
          <p className="text-gray-300">Hàng ngàn bộ phim, suất chiếu linh hoạt đang chờ bạn.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Film size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">CineMax</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">Tạo tài khoản</h1>
          <p className="text-gray-400 mb-6">Miễn phí, nhanh chóng, tiện lợi.</p>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-700 rounded-xl mb-5 text-sm text-red-400">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Tài khoản * <span className="text-gray-600 text-xs">(≥4 ký tự)</span>
                </label>
                <input required value={form.taiKhoan} onChange={set('taiKhoan')}
                  placeholder="username" autoComplete="username" className={inp} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Họ tên *</label>
                <input required value={form.hoTen} onChange={set('hoTen')}
                  placeholder="Nguyễn Văn A" className={inp} />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email *</label>
              <input type="email" required value={form.email} onChange={set('email')}
                placeholder="you@example.com" autoComplete="email" className={inp} />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Số điện thoại</label>
              <input value={form.soDt} onChange={set('soDt')} placeholder="0912345678"
                pattern="[0-9]{10,11}" title="Nhập 10-11 chữ số" className={inp} />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Mật khẩu *</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={form.matKhau}
                  onChange={set('matKhau')}
                  onFocus={() => setPwdFocused(true)}
                  onBlur={() => setPwdFocused(false)}
                  placeholder="VD: Abc123!"
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength checklist */}
              {(pwdFocused || form.matKhau) && (
                <div className="mt-2 p-3 bg-gray-900 border border-gray-800 rounded-xl grid grid-cols-2 gap-1.5">
                  <PwdRule ok={pwdCheck.length}  label="Ít nhất 6 ký tự" />
                  <PwdRule ok={pwdCheck.upper}   label="Có chữ HOA (A-Z)" />
                  <PwdRule ok={pwdCheck.lower}   label="Có chữ thường (a-z)" />
                  <PwdRule ok={pwdCheck.number}  label="Có chữ số (0-9)" />
                  <PwdRule ok={pwdCheck.special} label="Có ký tự đặc biệt (!@#...)" />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader size={18} className="animate-spin" />Đang đăng ký...</> : 'Đăng ký'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">Đăng nhập</Link>
          </p>

          <div className="mt-6 p-3 bg-gray-900/60 border border-gray-800 rounded-xl text-xs text-gray-500 space-y-1">
            <p className="text-gray-400 font-medium">Ví dụ mật khẩu hợp lệ:</p>
            <p className="font-mono text-gray-300">Abc123!  |  Hello@2024  |  Pass1234#</p>
          </div>
        </div>
      </div>
    </div>
  );
}
