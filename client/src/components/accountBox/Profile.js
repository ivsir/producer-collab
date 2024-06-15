import React from "react";
import { useQuery } from "@apollo/client";
import AuthService from "../../utils/auth";
import ProfileCard from "./ProfileCard";
import { QUERY_USER } from "../../utils/queries";

const Profile = (props) => {
  const { loading, data: userData } = useQuery(QUERY_USER, {
    variables: { username: AuthService.getUsername() },
  });
  const user = userData?.user.username || "";

  return (
    <div className="profile-container">
      <div className="profile-info">
        <div className="profile-image">
          <img
            className="profile-img"
            src="https://bit.ly/kent-c-dodds"
            alt="Profile"
          />
        </div>
        <div className="profile-username">
          <p>@{user}</p>
        </div>
        <div className="profile-description">
          <p></p>
        </div>
      </div>
      <div className="profile-grid">
        <div/>
      </div>
    </div>
  );
};

export default Profile;
