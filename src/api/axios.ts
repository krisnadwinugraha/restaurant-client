import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error: Server might be down.");
      return Promise.reject({ message: "Unable to connect to server. Please check your connection." });
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        break;
      case 422:
        return Promise.reject(data); 
      case 403:
        alert("You do not have permission to perform this action.");
        break;
      case 500:
        console.error("Backend Crash: Check Laravel logs.");
        break;
    }

    return Promise.reject(error);
  }
);
export default api;