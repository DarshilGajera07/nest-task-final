import axios from 'axios'

const url = "http://localhost:3000/tasks";
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

// Add a response interceptor
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post('/users/refresh');
        const { access_token } = response.data;

        localStorage.setItem('accessToken', access_token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
      }
    }

    return Promise.reject(error);
  }
);




export default AxiosInstance