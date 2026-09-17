import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('xox_auth');

  if (storedAuth) {
    const { accessToken } = JSON.parse(storedAuth);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('xox_auth');

      window.dispatchEvent(
        new Event('xox-auth-expired'),
      );
    }

    return Promise.reject(error);
  },
);

export default api;