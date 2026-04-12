import axios from 'axios';

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000/api/v1',
  withCredentials: true, // Crucial for M_LINK_ADMIN_REFRESH
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('admin-auth-storage');
  if (storedAuth) {
    try {
      const { state } = JSON.parse(storedAuth);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch (error) {
      console.error('Failed to parse admin auth storage', error);
    }
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return adminApi(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000/api/v1'}/admin-auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;

        const storedAuth = localStorage.getItem('admin-auth-storage');
        if (storedAuth) {
          const authObj = JSON.parse(storedAuth);
          authObj.state.accessToken = accessToken;
          localStorage.setItem('admin-auth-storage', JSON.stringify(authObj));
          window.dispatchEvent(new CustomEvent('admin-auth-token-refreshed', { detail: accessToken }));
        }

        adminApi.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return adminApi(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('admin-auth-storage');
        window.location.href = '/mlink-ctrl-9x4e/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;
