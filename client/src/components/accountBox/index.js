import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { AccountContext } from "./AccountContext";
import Home from "../../assets/images/prodcollab.png";

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
        <div>
          {active === "signin" && (
            <></>
          )}
          {active === "signup" && (
            <></>
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
