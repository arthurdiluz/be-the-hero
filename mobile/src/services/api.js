// Axios is HTTP Client which can communicate with the backend
import axios from "axios";

const api = axios.create({
  // IMPORTANT: baseURL value must be your computer's IP with the port
  baseURL: "http://192.168.1.102:3333", // IMPORTANT: UPDATE THE URL!!
  timeout: 1000 * 30, // wait for 60s
});

export default api;
