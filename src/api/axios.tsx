import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/refresh") 
        ) {
            originalRequest._retry = true;
            try {
                await api.post("/auth/refresh");
                return api(originalRequest);
            } catch {
                window.location.href = "/";
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default api;