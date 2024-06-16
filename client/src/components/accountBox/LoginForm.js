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
    <div>
      <form className="flex flex-row w-full justify-between" id="login-container" onSubmit={handleFormSubmit}>
        <div className="flex flex-col justify-end items-start mb-1">
          Need an account?{" "}
          <div className="flex flex-row gap-2 text-gray-500 text-sm">
            <Link className="hover:text-white" id="bold" to="#" onClick={switchToSignup}>
              Sign Up
            </Link>
            |
            <Link className="hover:text-white" id="bold" to="#">
              Forgot my password
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <InputField
            id="login-input1"
            type="email"
            label="Please enter your email"
            placeholder="Email"
            name="email"
            value={formState.email}
            onChange={handleChange}
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
          />
          <button id="login-button" type="submit" className="bg-blue-600 w-full py-2 rounded-lg">
            Sign In
          </button>
        </div>
      </form>
      {error && <div className="text-red-500">Error logging in</div>}
    </div>

  );
}
