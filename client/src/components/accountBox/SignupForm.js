import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";
import AuthService from "../../utils/auth";
import axios from "axios";
import { AccountContext } from "../../components/accountBox/AccountContext";
import InputField from "../elements/InputField";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export function SignupForm() {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [addUser] = useMutation(ADD_USER);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!formState.username || !formState.email || !formState.password) {
      setError("All fields are required to Sign Up.");
      return;
    }

    setError("");

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      const userId = data.addUser.user.username;
      console.log("User ID:", userId);

      const response = await axios.post(`${baseURL}/create-s3-folder`, {
        userId,
        headers: {
          "x-user-id": userId,
        },
      });
      console.log("S3 Folder Creation Response:", response);

      if (response.status === 200) {
        AuthService.login(data.addUser.token);
        console.log("User Token:", data.addUser.token);
      } else {
        console.error("Failed to create folder:", response.data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const { switchToSignin } = useContext(AccountContext);

  return (
    <div className="flex flex-row justify-between max-w-[1080px] overflow-hidden rounded-3xl border border-secondary">
      <div className="flex flex-col justify-between bg-secondary p-8">
        <div className="flex flex-col w-[18rem]">
          <h2 className="text-3xl mb-1">Create Account</h2>
          <p className="text-white text-opacity-50 text-sm text-nowrap">Please Sign-up to continue!</p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="flex flex-row w-full" id="login-container" onSubmit={handleFormSubmit}>
          <div className="flex flex-col w-full">
            <div className="flex flex-col">
              <InputField
                id="signup-input1"
                type="text"
                placeholder="Username"
                label="Please enter your username"
                name="username"
                value={formState.username}
                onChange={handleChange}
              />
              <InputField
                id="signup-input2"
                type="email"
                placeholder="Email"
                label="Please enter your email"
                name="email"
                value={formState.email}
                onChange={handleChange}
              />
              <InputField
                id="signup-input3"
                type="password"
                variant="password"
                label="Please enter your password"
                placeholder="Password"
                name="password"
                value={formState.password}
                onChange={handleChange}
              />
            </div>

            <button id="signup-button" type="submit" className="bg-blue-600 w-full py-2 rounded-lg">
              Sign Up
            </button>
            <h2 className="w-full flex flex-row gap-1 text-gray-500 justify-center items-center mt-4 text-sm">
              Have an account?{" "}
              <div className="flex flex-row gap-2 text-white text-sm">
                <Link id="bold" to="#" onClick={switchToSignin}>
                  Sign In
                </Link>
              </div>
            </h2>
          </div>
        </form>
      </div>
      <img src="/images/visual.svg" alt="Home" className="w-full h-[540px] object-cover object-left-top" />
    </div>
  );
}
