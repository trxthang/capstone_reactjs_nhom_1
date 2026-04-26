import axiosClient from './axiosClient';

const authApi = {
  // POST body: { taiKhoan, matKhau }
  dangNhap: (data) => axiosClient.post('/QuanLyNguoiDung/DangNhap', data),

  // POST body: { taiKhoan, matKhau, email, soDt, maNhom, hoTen }
  dangKy: (data) => axiosClient.post('/QuanLyNguoiDung/DangKy', data),

  // POST – requires Bearer token, returns user info + danhSachVeDaDat
  thongTinTaiKhoan: () => axiosClient.post('/QuanLyNguoiDung/ThongTinTaiKhoan'),

  // POST – requires Bearer token, query param: taiKhoan
  layThongTinNguoiDung: (taiKhoan) =>
    axiosClient.post('/QuanLyNguoiDung/LayThongTinNguoiDung', null, {
      params: { taiKhoan },
    }),

  // PUT body: NguoiDungVM – requires Bearer token
  capNhatThongTinNguoiDung: (data) =>
    axiosClient.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', data),

  // POST body: NguoiDungVM – requires Bearer token (alternative endpoint)
  capNhatThongTinNguoiDungPost: (data) =>
    axiosClient.post('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', data),
};

export default authApi;
