import { useState, useEffect, useMemo } from 'react';
import { Search, Pencil, Trash2, Plus, Loader, ShieldCheck, User } from 'lucide-react';
import userApi from '../../api/userApi';
import { toArray } from '../../api/utils';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Loading from '../../components/common/Loading';
import toast from 'react-hot-toast';

const MA_NHOM = import.meta.env.VITE_MA_NHOM;

function UserForm({ initial, onSave, onClose }) {
  const isEdit = !!initial;
  const [form, setForm] = useState({
    taiKhoan: initial?.taiKhoan || '',
    matKhau: '',
    hoTen: initial?.hoTen || '',
    email: initial?.email || '',
    soDt: initial?.soDt || '',
    maLoaiNguoiDung: initial?.maLoaiNguoiDung || 'KhachHang',
    maNhom: MA_NHOM,
  });
  const [saving, setSaving] = useState(false);
  const set = f => e => setForm({ ...form, [f]: e.target.value });
  const inp = 'w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm transition-colors';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) await userApi.capNhatThongTinNguoiDung(form);
      else await userApi.themNguoiDung(form);
      toast.success(isEdit ? 'Cập nhật thành công' : 'Thêm người dùng thành công');
      onSave();
    } catch (err) { toast.error(err.message || 'Thao tác thất bại'); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Tài khoản *</label>
          <input required value={form.taiKhoan} onChange={set('taiKhoan')} disabled={isEdit}
            className={`${inp} ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">{isEdit ? 'Mật khẩu mới' : 'Mật khẩu *'}</label>
          <input type="password" required={!isEdit} value={form.matKhau} onChange={set('matKhau')}
            placeholder={isEdit ? '(để trống = giữ nguyên)' : '••••••••'} className={inp} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Họ tên</label>
          <input value={form.hoTen} onChange={set('hoTen')} className={inp} />
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1.5 block">Số điện thoại</label>
          <input value={form.soDt} onChange={set('soDt')} className={inp} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
          <input type="email" value={form.email} onChange={set('email')} className={inp} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-400 mb-1.5 block">Loại tài khoản</label>
          <select value={form.maLoaiNguoiDung} onChange={set('maLoaiNguoiDung')} className={inp}>
            <option value="KhachHang">Khách hàng</option>
            <option value="QuanTri">Quản trị viên</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors">Hủy</button>
        <button type="submit" disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
          {saving ? <Loader size={15} className="animate-spin" /> : null}
          {isEdit ? 'Cập nhật' : 'Thêm người dùng'}
        </button>
      </div>
    </form>
  );
}

export default function UserManagePage() {
  const [allUsers, setAllUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const PAGE_SIZE = 10;

  const load = () => {
    setLoading(true);
    userApi.layDanhSachNguoiDung()
      .then(res => setAllUsers(toArray(res)))
      .catch(() => setAllUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!search) return allUsers;
    const q = search.toLowerCase();
    return allUsers.filter(u =>
      u.taiKhoan?.toLowerCase().includes(q) ||
      u.hoTen?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  }, [allUsers, search]);

  const users = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const total = filtered.length;

  const handleDelete = async (taiKhoan) => {
    if (!confirm(`Xóa tài khoản "${taiKhoan}"?`)) return;
    try { await userApi.xoaNguoiDung(taiKhoan); toast.success('Đã xóa tài khoản'); load(); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý người dùng</h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} tài khoản – nhóm {import.meta.env.VITE_MA_NHOM}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm người dùng..."
              className="bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 w-56" />
          </div>
          <button onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors">
            <Plus size={16} /> Thêm
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-4 text-xs font-medium text-gray-400 uppercase">Người dùng</th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Liên hệ</th>
              <th className="text-left px-4 py-4 text-xs font-medium text-gray-400 uppercase">Phân quyền</th>
              <th className="text-right px-5 py-4 text-xs font-medium text-gray-400 uppercase">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={4} className="py-12"><Loading /></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="py-16 text-center text-gray-500">Không có người dùng</td></tr>
            ) : users.map(u => {
              const isAdmin = u.maLoaiNguoiDung === 'QuanTri';
              return (
                <tr key={u.taiKhoan} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${isAdmin ? 'bg-yellow-600' : 'bg-red-600'}`}>
                        {(u.hoTen || u.taiKhoan || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{u.hoTen || '—'}</p>
                        <p className="text-gray-500 text-xs">{u.taiKhoan}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-gray-400 text-sm">{u.email}</p>
                    <p className="text-gray-600 text-xs">{u.soDt || '—'}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isAdmin ? 'bg-yellow-900/50 text-yellow-400' : 'bg-blue-900/50 text-blue-400'}`}>
                      {isAdmin ? <ShieldCheck size={11} /> : <User size={11} />}
                      {isAdmin ? 'Admin' : 'Khách hàng'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditing(u); setModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(u.taiKhoan)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={Math.ceil(total / PAGE_SIZE)} onChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}>
        <UserForm initial={editing} onSave={() => { setModalOpen(false); load(); }} onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
