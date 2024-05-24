import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL  || "http://localhost:3000";;

const axiosClient = axios.create({
  baseURL,
});

export default axiosClient;
