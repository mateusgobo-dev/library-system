import axios from "axios";

const librarysystem_api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {"Content-Type": "application/json"},
    timeout: 5000
});
librarysystem_api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 404) {
            return Promise.reject(error);
        }
    }
);
export default librarysystem_api;