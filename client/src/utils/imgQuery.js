// import { useEffect, useState } from 'react';
// import axiosClient from '../config/axios';

// const useQuery = (url, refetch, userId) => {
//   const [state, setState] = useState({
//     data: null,
//     isLoading: true,
//     error: '',
//   });

//   useEffect(() => {
//     const fetch = async () => {
//       axiosClient.defaults.headers.common["x-user-id"] = userId;
      
//       axiosClient
//         .get(url)
//         .then(({ data }) => setState({ data, isLoading: false, error: '' }))
//         .catch(error =>
//           setState({ data: null, isLoading: false, error: error.message })
//         );
//     };

//     fetch();
//   }, [url, refetch, userId]);

//   return state;
// };

// export default useQuery;

import { useEffect, useState } from 'react';
import axiosClient from '../config/axios';

const useQuery = (url, refetch, userId) => {
  const [state, setState] = useState({
    data: null,
    isloading: false,
    error: '',
  });

  useEffect(() => {
    const fetch = async () => {
      axiosClient.defaults.headers.common["x-user-id"] = userId;
      
      axiosClient
        .get(url)
        .then(({ data }) => setState({ data, isloading: false, error: '' }))
        .catch(error =>
          setState({ data: null, isloading: false, error: error.message })
        );
    };

    fetch();
  }, [url, refetch, userId]);

  return state;
};

export default useQuery;
