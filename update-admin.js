/**
 * Script cập nhật thông tin admin
 * Chạy: node update-admin.js
 */

const API_URL = 'https://movieenew.cybersoft.edu.vn/api';

// Thông tin cập nhật
const ADMIN_INFO = {
  taiKhoan: "thangadmin3",
  matKhau: "123456789",
  email: "thangadmin3@gmail.com",
  soDt: "0123456789",
  maNhom: "GP00",
  maLoaiNguoiDung: "QuanTri",
  hoTen: "Trần Xuân Thắng"
};

// Bước 1: Đăng nhập để lấy token
async function login() {
  try {
    const response = await fetch(`${API_URL}/QuanLyNguoiDung/DangNhap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        taiKhoan: ADMIN_INFO.taiKhoan,
        matKhau: ADMIN_INFO.matKhau
      })
    });

    const json = await response.json();
    
    if (json.statusCode === 200 && json.content?.accessToken) {
      console.log('✅ Đăng nhập thành công!');
      console.log('👤 User:', json.content.hoTen);
      return {
        token: json.content.accessToken,
        tokenCybersoft: json.content.tokenCybersoft
      };
    } else {
      throw new Error('Đăng nhập thất bại: ' + json.message);
    }
  } catch (error) {
    throw new Error('Lỗi khi đăng nhập: ' + error.message);
  }
}

// Bước 2: Cập nhật thông tin admin
async function updateAdminInfo(token) {
  try {
    const response = await fetch(`${API_URL}/QuanLyNguoiDung/CapNhatThongTinNguoiDung`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ADMIN_INFO)
    });

    const json = await response.json();
    
    if (json.statusCode === 200) {
      console.log('✅ Cập nhật thông tin thành công!');
      console.log('📧 Email:', json.content?.email);
      console.log('📱 Số điện thoại:', json.content?.soDt);
      console.log('👤 Họ tên:', json.content?.hoTen);
      return json.content;
    } else {
      throw new Error('Cập nhật thất bại: ' + json.message);
    }
  } catch (error) {
    throw new Error('Lỗi khi cập nhật: ' + error.message);
  }
}

// Main flow
async function main() {
  try {
    console.log('🔄 Bắt đầu cập nhật thông tin admin...\n');
    
    // Bước 1: Đăng nhập
    const { token } = await login();
    
    // Bước 2: Cập nhật
    console.log('\n📝 Đang cập nhật thông tin...');
    await updateAdminInfo(token);
    
    console.log('\n✨ Hoàn thành cập nhật!');
  } catch (error) {
    console.error('\n❌ Lỗi:', error.message);
    process.exit(1);
  }
}

main();
