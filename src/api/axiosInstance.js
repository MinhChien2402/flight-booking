import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7018/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

export default axiosInstance;
