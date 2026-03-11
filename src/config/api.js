import axios from 'axios';

const API_URL = 'https://dressappserver.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,  // sends httpOnly cookies automatically
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Log all API errors in dev
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(
            `API Error [${error.config?.method?.toUpperCase()} ${error.config?.url}]:`,
            error.response?.status,
            error.response?.data?.message || error.message
        );
        return Promise.reject(error);
    }
);

export default api;
export { API_URL };
