import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000/api/v1',
  withCredentials: true, // Crucial for receiving and sending the M_LINK_REFRESH_TOKEN cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can't import the store directly at the top level to avoid circular dependencies
// so we'll inject the token dynamically or access the store inside the interceptors.
api.interceptors.request.use((config) => {
  // Try to get token from local storage directly for Axios
  const storedAuth = localStorage.getItem('auth-storage');
  if (storedAuth) {
    try {
      const { state } = JSON.parse(storedAuth);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    } catch (error) {
      console.error('Failed to parse auth storage', error);
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

api.interceptors.response.use(
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
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get refresh token from localStorage
        const storedAuth = localStorage.getItem('auth-storage');
        let refreshToken = null;
        
        if (storedAuth) {
          const authObj = JSON.parse(storedAuth);
          refreshToken = authObj.state?.refreshToken;
        }
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Send refresh token in request body (not relying on cookies)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000/api/v1'}/auth/refresh`,
          { refreshToken }, // Send in body
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;

        // Update the Zustand store
        if (storedAuth) {
          const authObj = JSON.parse(storedAuth);
          authObj.state.accessToken = accessToken;
          localStorage.setItem('auth-storage', JSON.stringify(authObj));
          // Dispatch a custom event so Zustand can sync if necessary
          window.dispatchEvent(new CustomEvent('auth-token-refreshed', { detail: accessToken }));
        }

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // If refresh fails (e.g., cookie expired), clear state
        localStorage.removeItem('auth-storage');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
