import { useState, useContext } from "react";
import { AccountContext } from "../../components/accountBox/AccountContext";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../utils/mutations";
import AuthService from "../../utils/auth";
import { Link } from "react-router-dom";
import InputField from "../elements/InputField";

export function LoginForm(props) {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error }] = useMutation(LOGIN_USER);

  // Update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // Submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });
      AuthService.login(data.login.token);
      setFormState({ email: "", password: "" }); // Clear form values after successful login
    } catch (e) {
      console.error('Login error:', e); // For debugging
    }
  };

  const { switchToSignup } = useContext(AccountContext);

  return (
    <div className="flex flex-row justify-between max-w-[1080px] overflow-hidden rounded-3xl border border-secondary">
      <div className="flex flex-col justify-between bg-secondary p-8">
        <div className="flex flex-col w-[18rem]">
          <h2 className="text-3xl mb-1">Welcome Back</h2>
          <p className="text-white text-opacity-50 text-sm">Please Enter Your Login Credentials</p>
        </div>
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-lg relative text-sm" role="alert">
            <span className="block  sm:inline">{error.message}</span>
          </div>
        )}
        <form className="flex flex-row w-fullw" id="login-container" onSubmit={handleFormSubmit}>
          <div className="flex flex-col w-full">
            <div className="flex flex-col">
              <InputField
                id="login-input1"
                type="email"
                label="Please enter your email"
                placeholder="Email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
              />
              <InputField
                id="login-input2"
                type="password"
                label="Please enter your password"
                variant="password"
                placeholder="Password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                required
              />
            </div>
            <button id="login-button" type="submit" className="bg-blue-600 w-full py-2 rounded-lg">
              Sign In
            </button>
            <h2 className="w-full flex flex-row gap-1 text-gray-500 justify-center items-center mt-4 text-sm">
              Need an account?{" "}
              <div className="flex flex-row gap-2 text-white text-sm">
                <Link id="bold" to="#" onClick={switchToSignup}>
                  Sign Up
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
