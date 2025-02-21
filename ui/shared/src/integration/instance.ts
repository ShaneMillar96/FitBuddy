import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // Retrieve token
        if (token) {
            console.log(token);
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        console.log(config);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
