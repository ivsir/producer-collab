import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import axiosClient from "../config/axios";

const useMutation = ({ url, method = "POST" }, userId, imageKey) => {
  const toast = useToast();
  const [state, setState] = useState({
    isLoading: false,
    error: "",
    responseData: null, // Add a responseData field to store the response
  });

  const fn = async (data) => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    axiosClient.defaults.headers.common["x-user-id"] = userId;
    axiosClient({ url, method, data })
      .then((response) => {
        // Store the response data
        console.log("response", response.data);
        setState({
          isLoading: false,
          error: "",
          responseData: response.data, // Store the response data
        });
        toast({
          title: "Successfully Added Image",
          status: "success",
          duration: 2000,
          position: "top",
        });
      })
      .catch((error) => {
        setState({
          isLoading: false,
          error: error.message,
          responseData: null, // Clear responseData on error
        });
      });
  };

  return { mutate: fn, ...state };
};

export default useMutation;
