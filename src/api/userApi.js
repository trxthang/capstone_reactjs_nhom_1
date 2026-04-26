import axiosClient from './axiosClient';

const MA_NHOM = import.meta.env.VITE_MA_NHOM;

const userApi = {
  layDanhSachNguoiDung: (tuKhoa = '') =>
    axiosClient.get('/QuanLyNguoiDung/LayDanhSachNguoiDung', {
      params: { MaNhom: MA_NHOM, tuKhoa },
    }),

  layDanhSachNguoiDungPhanTrang: (soTrang = 1, soPhanTuTrenTrang = 10, tuKhoa = '') =>
    axiosClient.get('/QuanLyNguoiDung/LayDanhSachNguoiDungPhanTrang', {
      params: { MaNhom: MA_NHOM, tuKhoa, soTrang, soPhanTuTrenTrang },
    }),

  layDanhSachLoaiNguoiDung: () =>
    axiosClient.get('/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung'),

  themNguoiDung: (data) =>
    axiosClient.post('/QuanLyNguoiDung/ThemNguoiDung', { ...data, maNhom: MA_NHOM }),

  capNhatThongTinNguoiDung: (data) =>
    axiosClient.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', { ...data, maNhom: MA_NHOM }),

  xoaNguoiDung: (taiKhoan) =>
    axiosClient.delete('/QuanLyNguoiDung/XoaNguoiDung', { params: { TaiKhoan: taiKhoan } }),
};

export default userApi;
