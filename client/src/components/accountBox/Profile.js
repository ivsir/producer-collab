import React from "react";
import { useQuery } from "@apollo/client";
import AuthService from "../../utils/auth";
import { QUERY_USER } from "../../utils/queries";
import ProfilePic from "../../assets/images/Profile.png";
import ProfileCard from "../accountBox/ProfileCard";
import CollabButton from "../elements/CollabButton";

const Profile = (props) => {
  const { loading, data: userData } = useQuery(QUERY_USER, {
    variables: { username: AuthService.getUsername() },
  });
  const user = userData?.user.username || "";

  return (
    <div className="flex flex-col">
      
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-start items-center gap-4 mt-14 mb-8">
          <img
            className="min-w-16 h-16 border border-secondary rounded-full overflow-hidden"
            src={ProfilePic}
            alt="Profile"
          />
          <div className="flex flex-col gap-1">
            <p className="text-xl">@{user}</p>
            <p className="text-white text-opacity-50 text-sm">Looking for someone who can make great drum kits.</p>
          </div>
        </div>
        <div className="inline-block">
        <CollabButton />
        </div>
      </div>
    
      <ProfileCard />
    </div>

  );
};

export default Profile;
