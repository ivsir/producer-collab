import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL  || "https://gentle-headland-15406-059764510da4.herokuapp.com/";

const axiosClient = axios.create({
  baseURL,
});

export default axiosClient;
