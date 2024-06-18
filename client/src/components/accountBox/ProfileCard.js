import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import AuthService from "../../utils/auth";
import axiosClient from "../../config/axios";
import { QUERY_USER } from "../../utils/queries";
import Auth from "../../utils/auth";

function ProfileCard(props) {
  const userId = Auth.getProfile().data.username;
  const { loading, data: userData } = useQuery(QUERY_USER, {
    variables: { username: AuthService.getUsername() },
  });
  const projects = userData?.user.projects || [];
  const URL = "/images";

  const [imageUrls, setImageUrls] = useState({});
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const fetchData = async (projectAuthor) => {
      axiosClient.defaults.headers.common["x-user-id"] = projectAuthor;
      try {
        const response = await axiosClient.get(URL);
        const data = response.data;

        setImageUrls((prevImageUrls) => ({
          ...prevImageUrls,
          [projectAuthor]: data,
        }));
      } catch (error) {
        console.error("Error fetching image data:", error);
      }
    };

    const currentUser = Auth.getProfile().data.username;
    fetchData(currentUser);
  }, [projects, refetch]);

  const findProjectImageUrl = (projectImage, currentUser) => {
    const profileImageUrls = imageUrls[currentUser] || [];
    return profileImageUrls.find((imageUrl) => imageUrl.includes(projectImage));
  };

  return (
    <div className="image-grid">
      {projects.map((project) => {
        const projectImageUrl = findProjectImageUrl(
          project.projectImage,
          userId
        );

        return (
          <Link to={`/projects/${project._id}`} key={project._id}>
            <div className="profile-image-container">
              <img className="image-card" src={projectImageUrl} alt={project.projectImage} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileCard;
