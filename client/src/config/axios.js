import axios from "axios";

// const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4001/dev"
// const baseURL = window.location.origin
// const baseURL = "https://5wgel7uoui.execute-api.us-east-1.amazonaws.com"
const baseURL = "https://hhixki9fn4.execute-api.us-west-1.amazonaws.com/dev"
console.log("base url",baseURL)
const axiosClient = axios.create({
  baseURL,
});

export default axiosClient;
