import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { AccountContext } from "./AccountContext";
import Home from "../../assets/prodcollab.svg";

export default function AccountBox(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [active, setActive] = useState("signin");

  const switchToSignup = () => {
    setTimeout(() => {
      setActive("signup");
    }, 400);
  };

  const switchToSignin = () => {
    setTimeout(() => {
      setActive("signin");
    }, 400);
  };

  const contextValue = {
    switchToSignup,
    switchToSignin,
  };

  return (
    <AccountContext.Provider value={contextValue}>
      <div className="flex justify-center items-center w-full h-screen p-8">
        <div className="flex flex-col justify-between w-full max-w-[48rem] border bg-primary border-secondary rounded-3xl mx-auto p-8">
          {active === "signin" && (
          <div className="flex flex-row justify-between items-start h-full pb-8">
            <div className="flex flex-col justify-start h-full">
              <h2 className="text-3xl">Welcome Back</h2>
              <p className="text-white opacity-50">Please Enter Your Login Credentials</p>
            </div>
            <img src={Home} alt="Home" /> {/* Corrected usage of <Link> */}
          </div>
          )}
          {active === "signup" && (
            <div className="flex flex-row justify-between items-start h-full pb-8">
              <div className="flex flex-col justify-start h-full">
                <h2 className="text-3xl">Create Account</h2>
                <p className="text-white opacity-50">Please Sign-up to continue!</p>
              </div>
              <img src={Home} alt="Home" /> {/* Corrected usage of <Link> */}
            </div>
          )}
          <div>
            {active === "signin" && <LoginForm />}
            {active === "signup" && <SignupForm />}
          </div>
        </div>
      </div>
    </AccountContext.Provider>
  );
}
