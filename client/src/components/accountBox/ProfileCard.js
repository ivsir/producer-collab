
import React, { useState } from "react";
import {
  ProfileImageContainer,
  ImageGrid,
  ImageCard,
} from "./Common.js";
import { QUERY_USER } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import Auth from "../../utils/auth";

import AuthService from "../../utils/auth";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axiosClient from "../../config/axios.js";

function ProfileCard(props) {
  const userId = Auth.getProfile().data.username;
  const { loading, data: userData } = useQuery(QUERY_USER, {
    variables: { username: AuthService.getUsername() },
  });
  const projects = userData?.user.projects || [];
  const URL = "/dev/images";

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
    <ImageGrid>
      {/* <Flex
        // width="100%" // Display two images per row
        // p={10} // Adjust padding as needed
        // direction={"column-reverse"}
      > */}
      {/* <ProfileGrid> */}
      {projects.map((project) => {
        const projectImageUrl = findProjectImageUrl(
          project.projectImage,
          userId
        );

        return (
          <Link to={`/projects/${project._id}`}>
            <ProfileImageContainer>
              <ImageCard src={projectImageUrl} key={projectImageUrl} />
            </ProfileImageContainer>
          </Link>
        );
      })}
      {/* </ProfileGrid> */}
      {/* </Flex> */}
    </ImageGrid>
  );
}

export default ProfileCard;
