import axios from 'axios';
import { BASE_URL, tokens } from '../../constants/constants';

const createApi = () => axios.create({ baseURL: BASE_URL + '/api' });

const $mainApi = createApi();
const $authApi = createApi();

$mainApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(tokens.access);
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

$authApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(tokens.access);
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

$authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const ogRequest = error.config || {};
    const { useAuth } = await import('../../hooks/useAuth');
    const { logout } = useAuth.getState();

    if (error.response?.status === 401 && ogRequest && !ogRequest._isRetry) {
      ogRequest._isRetry = true;
      const refresh_token = localStorage.getItem(tokens.refresh);

      if (!refresh_token) {
        logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token,
        });

        localStorage.setItem(tokens.access, response.data.access_token);
        localStorage.setItem(tokens.refresh, response.data.refresh_token);

        ogRequest.headers = ogRequest.headers || {};
        ogRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

        return $authApi.request(ogRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { $authApi, $mainApi };
