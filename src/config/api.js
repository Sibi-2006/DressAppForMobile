import axios from 'axios';

const API_URL = 'https://dressappserver.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,  // sends httpOnly cookies automatically
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // increased for slow render backends
});

// Request interceptor: Attach token if it exists in AsyncStorage
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.log('AsyncStorage token reading error:', error.message);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

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
