import React from "react";
import Auth from "../../utils/auth.js";
import { Link } from "react-router-dom";
import Home from "../../assets/prodcollab.svg";
import Upload from "../../assets/Upload.png";

function SideNav() {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <div className="inline-flex relative">
      <nav className="flex flex-col gap-4 p-12 text-nowrap w-[16rem] h-screen sticky top-0">
        <Link to="/explore">
          <img src={Home} alt="Home" /> {/* Corrected usage of <Link> */}
        </Link>
        {Auth.loggedIn() ? (
          <>
            <Link to="/projectform">
              <h2 className="text-lg">Add Song</h2>
            </Link>
            <Link to="/profile">
              <h2 className="text-lg">My Profile</h2>
            </Link>
            <Link onClick={logout} to="/">
              <h2 className="text-lg">Logout</h2>
            </Link>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </nav>
    </div>
  );
}

export default SideNav;
