import React from "react";
import "./style/nav.css";
import Auth from "../utils/auth.js";

const Nav = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  return (
    <header>
      <a href="/explore" className="brand-title">
        <img
          className="logo"
          alt="prodcollab logo"
          src={require("../assets/prodcollab.png")}
        ></img>
      </a>
    </header>
  );
};

export default Nav;
