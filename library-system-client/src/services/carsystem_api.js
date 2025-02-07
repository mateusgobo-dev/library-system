import axios from "axios";
const carsystem_api = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" }
});
export default carsystem_api;