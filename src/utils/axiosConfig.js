import axios from 'axios';

// 1. Konfigurasi Dasar (Wajib agar Session & Cookie sinkron)
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000'; 
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// 2. Setting XSRF (Standar Laravel Sanctum)
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// 3. Helper untuk ambil Cookie
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

/**
 * Fungsi Sakti: Memastikan CSRF Token Siap
 * Dipanggil sebelum Login atau Register agar tidak error 419.
 */
export const ensureCsrfToken = async () => {
  try {
    const existingToken = getCookie('XSRF-TOKEN');
    
    // Kalau token belum ada atau baru buka browser, panggil Sanctum
    if (!existingToken) {
      await axios.get('/sanctum/csrf-cookie');
      // Beri jeda sedikit agar browser selesai memproses cookie
      await new Promise(resolve => setTimeout(resolve, 300)); 
    }
    
    return true;
  } catch (error) {
    console.error('Gagal mengambil CSRF Token:', error);
    return false;
  }
};

export default axios;