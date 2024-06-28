// import { useEffect, useState } from "react";
// import axiosClient from "../config/axios";

// const useQuery = (url, refetch, projectAuthor) => {
//   const [state, setState] = useState({
//     data: null,
//     isLoading: true,
//     error: "",
//   });

//   useEffect(() => {
//     const fetch = async () => {
//       axiosClient.defaults.headers.common["x-project-author"] = projectAuthor;

//       axiosClient
//         .get(url)
//         .then(({ data }) => setState({ data, isLoading: false, error: "" }))
//         .catch((error) =>
//           setState({ data: null, isLoading: false, error: error.message })
//         );
//     };

//     fetch();
//   }, [url, refetch, projectAuthor]);

//   return state;
// };

// export default useQuery;

import { useEffect, useState } from "react";
import axiosClient from "../config/axios";

const useQuery = (url, refetch, projectAuthor) => {
  const [state, setState] = useState({
    data: null,
    isloading: false,
    error: "",
  });

  useEffect(() => {
    const fetch = async () => {
      axiosClient.defaults.headers.common["x-project-author"] = projectAuthor;

      axiosClient
        .get(url)
        .then(({ data }) => setState({ data, isloading: false, error: "" }))
        .catch((error) =>
          setState({ data: null, isloading: false, error: error.message })
        );
    };

    fetch();
  }, [url, refetch, projectAuthor]);

  return state;
};

export default useQuery;

