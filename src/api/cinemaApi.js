import axiosClient from './axiosClient';

const MA_NHOM = import.meta.env.VITE_MA_NHOM;

const cinemaApi = {
  layThongTinHeThongRap: (maHeThongRap = '') =>
    axiosClient.get('/QuanLyRap/LayThongTinHeThongRap', {
      params: { maHeThongRap },
    }),

  layThongTinCumRapTheoHeThong: (maHeThongRap = '') =>
    axiosClient.get('/QuanLyRap/LayThongTinCumRapTheoHeThong', {
      params: { maHeThongRap },
    }),

  layThongTinLichChieuHeThongRap: (maHeThongRap = '') =>
    axiosClient.get('/QuanLyRap/LayThongTinLichChieuHeThongRap', {
      params: { maHeThongRap, maNhom: MA_NHOM },
    }),

  layThongTinLichChieuPhim: (maPhim) =>
    axiosClient.get('/QuanLyRap/LayThongTinLichChieuPhim', {
      params: { MaPhim: maPhim },
    }),
};

export default cinemaApi;
