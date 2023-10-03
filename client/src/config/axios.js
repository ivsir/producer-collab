// import axios from "axios";

// const baseURL = process.env.REACT_APP_API_URL;
// // const USER_ID = "allusers";
// const USER_FOLDER = "ivsir44"

// const axiosClient = axios.create({
//   baseURL,
//   headers: {
//     // "x-user-id": USER_ID,
//     "x-user-id": USER_FOLDER,
//   },
// }); 

// export default axiosClient;
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const axiosClient = axios.create({
  baseURL,
});

export default axiosClient;
