import React from "react";
import { LoginForm } from "./LoginForm";
import { useState } from "react";
import { AccountContext } from "./AccountContext";
import { SignupForm } from "./SignupForm";
import {
  BoxContainer,
  HeaderContainer,
  HeaderText,
  SmallText,
  InnerContainer,
} from "./Common";
// import  AccountBox from "../accountBox";

// const expandingTransition = {
//   type: "spring",
//   duration: 2.3,
//   stiffness: 30,
// };

//  this collapses the form when you click on the button

export default function AccountBox(props) {
  //this is the state that toggles the form

  const [isExpanded, setExpanded] = useState(false);

  //this is the state that toggles the form between signin and signup
  const [active, setActive] = useState("signin");

  //   this toggles
  // const playExpandingAnimation = () => {
  //   setExpanded(true);
  //   setTimeout(() => {
  //     setExpanded(false);
  //   }, expandingTransition.duration * 1000 - 1500);
  // };

  //   this toggles
  const switchToSignup = () => {
    console.log("running");
    // playExpandingAnimation();
    setTimeout(() => {
      setActive("signup");
    }, 400);
  };

  //   this toggles
  const switchToSignin = () => {
    // playExpandingAnimation();
    setTimeout(() => {
      setActive("signin");
    }, 400);
  };

  //this is the context value that is passed to the children components

  const contextValue = {
    switchToSignup,
    switchToSignin,
    // playExpandingAnimation,
  };

  return (
    <AccountContext.Provider value={contextValue}>
      <BoxContainer>
        {/* <TopContainer> */}
        {/* <BackDrop
            initial={false}
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={backdropVariants}
            transition={expandingTransition}
          /> */}
        {active === "signin" && (
          <HeaderContainer>
            <HeaderText>Welcome Back</HeaderText>
            <SmallText>Please Enter Your Login Credentials</SmallText>
          </HeaderContainer>
        )}
        {active === "signup" && (
          <HeaderContainer>
            <HeaderText>Create Account</HeaderText>
            <SmallText>Please Sign-up to continue!</SmallText>
          </HeaderContainer>
        )}
        {/* </TopContainer> */}
        <InnerContainer>
          {active === "signin" && <LoginForm />}

          {active === "signup" && <SignupForm />}
        </InnerContainer>
      </BoxContainer>
    </AccountContext.Provider>
  );
}
