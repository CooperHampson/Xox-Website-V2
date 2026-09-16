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

export default api;