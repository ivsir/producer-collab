import axios from "axios";

// const baseURL = process.env.REACT_APP_API_URL
const baseURL = window.location.origin

const axiosClient = axios.create({
  baseURL,
});

export default axiosClient;
