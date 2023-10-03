import React from "react";
// import "./style/nav.css";
import { SideNav, NavLinks, LinkStyle, NavLinkA, NavIcon } from "./Common.js";
import Auth from "../../utils/auth.js";
import { Link } from "react-router-dom";
import Home from "../../assets/Home.png";
import Upload from "../../assets/Upload.png";
import Profile from "../../assets/Profile.png";

function sideNav() {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <SideNav>
      <NavLinks>
        <Link style={LinkStyle} to="/explore">
          <NavIcon src={Home} />
          <NavLinkA>Home</NavLinkA>
        </Link>
        {Auth.loggedIn() ? (
          <>
            <Link style={LinkStyle} to="/projectform">
              <NavIcon src={Upload} />
              <NavLinkA>Upload</NavLinkA>
            </Link>
            <Link style={LinkStyle} to="/profile">
              <NavIcon src={Profile} />
              <NavLinkA>Profile</NavLinkA>
            </Link>
            <Link style={LinkStyle} onClick={logout} to="/">
              <NavLinkA>Logout</NavLinkA>
            </Link>
          </>
        ) : (
          <Link style={LinkStyle} to="/">
            <NavLinkA>Login</NavLinkA>
          </Link>
        )}
      </NavLinks>
    </SideNav>
  );
}

export default sideNav;
