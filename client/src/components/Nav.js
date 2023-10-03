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
      <a href="/explore" class="brand-title">
        <img
          className="logo"
          alt="prodcollab logo"
          src={require("../assets/prodcollab.png")}
        ></img>
      </a>
      {/* <nav className="navbar">
        <input type="checkbox" id="nav-check" />
        <div class="nav-btn">
          <label for="nav-check">
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>

        <div class="nav-links">
          <a href="/explore">Explore</a>

          <a href="/about">About</a>

          {Auth.loggedIn() ? (
            <>
              <a href="/profile">Profile</a>
              <a onClick={logout} href="/">
                Logout
              </a>
            </>
          ) : (
            <a href="/">Login</a>
          )}
        </div>
      </nav> */}
    </header>
  );
};

export default Nav;
