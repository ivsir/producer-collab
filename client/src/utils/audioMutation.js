import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import axiosClient from "../config/axios";

const useMutation = ({ url, method = "POST" }, userId) => {
  const toast = useToast();
  const [state, setState] = useState({
    isloading: false,
    error: "",
    responseData: null,
  });

  const fn = async (data) => {
    setState((prev) => ({
      ...prev,
      isloading: false,
    }));
    
    try {
      axiosClient.defaults.headers.common["x-user-id"] = userId;
      console.log(userId)
      const response = await axiosClient({ url, method, data });
      const key = response.data.key;
      if (key) {
        console.log(key);
        setState({
          isloading: false,
          error: "",
          responseData: response.data,
        });
        toast({
          title: "Successfully Added Audio",
          status: "success",
          duration: 2000,
          position: "top",
        });
      } else {
        console.error("Key not found in the response data.");
      }
    } catch (error) {
      console.error("Error in the request:", error);
      setState({
        isloading: false,
        error: error.message,
        responseData: null,
      });
    }
  };

  return { mutate: fn, ...state };
};

export default useMutation;
