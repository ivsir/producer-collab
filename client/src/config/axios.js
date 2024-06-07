import axios from "axios";

// const baseURL = process.env.REACT_APP_API_URL
const baseURL = "http://localhost:3001"
const axiosClient = axios.create({
  baseURL,
});

export default axiosClient;
