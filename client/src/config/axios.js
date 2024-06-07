import axios from "axios";

// const baseURL = process.env.REACT_APP_API_URL
const baseURL = window.location.origin
// const baseURL = "https://5wgel7uoui.execute-api.us-east-1.amazonaws.com"
// const baseURL = "https://17yjc57zyk.execute-api.us-east-1.amazonaws.com/dev"
console.log("base url",baseURL)
const axiosClient = axios.create({
  baseURL,
});

export default axiosClient;
