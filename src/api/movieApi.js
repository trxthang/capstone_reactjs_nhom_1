import axiosClient from './axiosClient';

const MA_NHOM = import.meta.env.VITE_MA_NHOM;

const movieApi = {
  layDanhSachBanner: () => axiosClient.get('/QuanLyPhim/LayDanhSachBanner'),

  layDanhSachPhim: (tenPhim = '') =>
    axiosClient.get('/QuanLyPhim/LayDanhSachPhim', {
      params: { maNhom: MA_NHOM, ...(tenPhim ? { tenPhim } : {}) },
    }),

  layDanhSachPhimPhanTrang: (soTrang = 1, soPhanTuTrenTrang = 12, tenPhim = '') =>
    axiosClient.get('/QuanLyPhim/LayDanhSachPhimPhanTrang', {
      params: { maNhom: MA_NHOM, tenPhim, soTrang, soPhanTuTrenTrang },
    }),

  layThongTinPhim: (maPhim) =>
    axiosClient.get('/QuanLyPhim/LayThongTinPhim', { params: { MaPhim: maPhim } }),

  themPhim: (formData) =>
    axiosClient.post('/QuanLyPhim/ThemPhimUploadHinh', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  capNhatPhim: (formData) =>
    axiosClient.post('/QuanLyPhim/CapNhatPhimUpload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  xoaPhim: (maPhim) =>
    axiosClient.delete('/QuanLyPhim/XoaPhim', { params: { MaPhim: maPhim } }),
};

export default movieApi;
