import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "ec2-54-153-127-238.us-west-1.compute.amazonaws.com"

const axiosClient = axios.create({
  baseURL,
});

export default axiosClient;
