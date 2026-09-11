import axios from 'axios'

const url = "http://localhost:3000";
const AxiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
});



AxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },

  (error) => {
    console.error("Request error :", error);
    return Promise.reject(error);
  }
);


AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await AxiosInstance.post('/users/refresh');
        const { access_token } = response.data;

        localStorage.setItem('accessToken', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return AxiosInstance(originalRequest);
      } catch (error) {
        window.location.href = '/login';
        console.log(error);
      }
    }

    return Promise.reject(error);
  }
);




export default AxiosInstance