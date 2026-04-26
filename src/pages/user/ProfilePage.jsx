import { useState } from 'react';
import { User, Lock, Save, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import authApi from '../../api/authApi';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, fetchProfile } = useAuth();
  const [tab, setTab] = useState('info');
  const [form, setForm] = useState({
    taiKhoan: user?.taiKhoan || '',
    email: user?.email || '',
    hoTen: user?.hoTen || '',
    soDt: user?.soDt || '',
    matKhau: '',
    maNhom: user?.maNhom || import.meta.env.VITE_MA_NHOM,
    maLoaiNguoiDung: user?.maLoaiNguoiDung || 'KhachHang',
  });
  const [newPwd, setNewPwd] = useState({ matKhauMoi: '', xacNhan: '' });
  const [saving, setSaving] = useState(false);
  const inp = 'w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors';

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    if (!form.matKhau) { toast.error('Nhập mật khẩu hiện tại để xác nhận'); return; }
    setSaving(true);
    try {
      await authApi.capNhatThongTinNguoiDung(form);
      await fetchProfile();
      toast.success('Cập nhật thành công');
    } catch (err) {
      toast.error(err.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePwd = async (e) => {
    e.preventDefault();
    if (newPwd.matKhauMoi !== newPwd.xacNhan) { toast.error('Mật khẩu xác nhận không khớp'); return; }
    if (newPwd.matKhauMoi.length < 6) { toast.error('Mật khẩu tối thiểu 6 ký tự'); return; }
    setSaving(true);
    try {
      // API capNhat dùng chung endpoint, truyền matKhau mới vào field matKhau
      await authApi.capNhatThongTinNguoiDung({ ...form, matKhau: newPwd.matKhauMoi });
      await fetchProfile();
      toast.success('Đổi mật khẩu thành công');
      setNewPwd({ matKhauMoi: '', xacNhan: '' });
    } catch (err) {
      toast.error(err.message || 'Đổi mật khẩu thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Avatar header */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 mb-6 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center text-3xl font-bold text-white">
          {(user?.hoTen || user?.taiKhoan || 'U')[0].toUpperCase()}
        </div>
        <h1 className="text-xl font-bold text-white">{user?.hoTen}</h1>
        <p className="text-gray-400 text-sm mt-1">{user?.taiKhoan} • {user?.email}</p>
        <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium ${user?.maLoaiNguoiDung === 'QuanTri' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-blue-900/50 text-blue-400'}`}>
          {user?.maLoaiNguoiDung === 'QuanTri' ? 'Quản trị viên' : 'Thành viên'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6">
        {[{ id: 'info', label: 'Thông tin', icon: User }, { id: 'password', label: 'Mật khẩu', icon: Lock }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            <t.icon size={15} />{t.label}
          </button>
        ))}
      </div>

      {tab === 'info' ? (
        <form onSubmit={handleUpdateInfo} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Tài khoản</label>
            <input value={form.taiKhoan} disabled className={`${inp} opacity-50 cursor-not-allowed`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Họ tên</label>
              <input value={form.hoTen} onChange={e => setForm({ ...form, hoTen: e.target.value })} placeholder="Nguyễn Văn A" className={inp} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Số điện thoại</label>
              <input value={form.soDt} onChange={e => setForm({ ...form, soDt: e.target.value })} placeholder="0912345678" className={inp} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inp} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Mật khẩu hiện tại (xác nhận)</label>
            <input type="password" value={form.matKhau} onChange={e => setForm({ ...form, matKhau: e.target.value })} placeholder="••••••••" className={inp} />
          </div>
          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
            {saving ? <><Loader size={16} className="animate-spin" />Đang lưu...</> : <><Save size={16} />Lưu thay đổi</>}
          </button>
        </form>
      ) : (
        <form onSubmit={handleChangePwd} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Mật khẩu mới</label>
            <input type="password" value={newPwd.matKhauMoi} onChange={e => setNewPwd({ ...newPwd, matKhauMoi: e.target.value })} required placeholder="Tối thiểu 6 ký tự" className={inp} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Xác nhận mật khẩu mới</label>
            <input type="password" value={newPwd.xacNhan} onChange={e => setNewPwd({ ...newPwd, xacNhan: e.target.value })} required placeholder="••••••••" className={inp} />
          </div>
          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors">
            {saving ? <><Loader size={16} className="animate-spin" />Đang lưu...</> : <><Lock size={16} />Đổi mật khẩu</>}
          </button>
        </form>
      )}
    </div>
  );
}
