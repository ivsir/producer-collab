import React from "react";
import Auth from "../utils/auth.js";

const Nav = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
  <>
  </>
  );
};

export default Nav;
