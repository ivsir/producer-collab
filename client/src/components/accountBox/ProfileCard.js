import {
  Box,
  Button,
  CircularProgress,
  Image,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  ProfileContainer,
  ImageGrid,
  ImageCard,
  ImageContainer,
} from "./Common.js";
import imgQuery from "../../utils/imgQuery";
import { QUERY_USER, QUERY_PROJECTS } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import Auth from "../../utils/auth";

import AuthService from "../../utils/auth";
import { Link } from "react-router-dom";

function ProfileCard(props) {
  const [refetch, setRefetch] = useState(0);
  const { loading, data: userData } = useQuery(QUERY_USER, {
    variables: { username: AuthService.getUsername() },
  });
  console.log(userData,"user")
  const projects = userData?.user.projects || [];

  const { data: projectData } = useQuery(QUERY_PROJECTS);
  console.log(projects,"projects")
  const URL = "/images";

  if (loading && !userData && userData?.length <= 0 && !projectData) {
    return;
  }
  const ErrorText = ({ children, ...props }) => (
    <Text fontSize="lg" color="red.300" {...props}>
      {children}
    </Text>
  );


  const userId= Auth.getProfile().data.username; 

  const {
    data: imageUrls = [],
    isLoading: imagesLoading,
    error: fetchError,
  } = imgQuery(URL, refetch, userId);

  const findTargetProjects = () => {
    if (!projectData) {
      return;
    }

    const allProjects = projectData.projects;

    const profileId = AuthService.getId();

    const final = allProjects
      .filter((project) => {
        const members = project.projectMembers;
        return members.some((member) => member.memberId === profileId);
      })
      .map((project, index) => (
        <div key={index} className="explore__card">
          <div className="explore__card__title">
            <h3 className="project__title">
              <Link to={`/projects/${project._id}`}>
                Project Title: {project.projectTitle}
              </Link>
            </h3>
          </div>
          <div className="explore__card__content">
            <h4 className="project__author">
              Project Description: {project.projectDescription}
            </h4>
          </div>
        </div>
      ));
    return final;
  };

  const renderProjects = () => {
    let result = null;

    if (projects) {
      result = projects.map((project, i) => {
        return (
          <div key={i} className="explore__card">
            <div className="explore__card__title">
              <h3 className="project__title">
                {/* <a href="projects/1234asdf">Project TItle: blah</a> */}
                <Link to={`/projects/${project._id}`}>
                  Project Title: {project.projectTitle}
                </Link>
              </h3>
            </div>
            <div className="explore__card__content">
              <h4 className="project__author">
                Project Description: {project.projectDescription}
              </h4>
              {/* <button className="share-button"> share your project</button> */}
            </div>
          </div>
        );
      });
    }
    return result;
  };

  return (
    <ProfileContainer>
      {/* <div className="profile-button"><a href="projectform">Create a Project</a></div> */}
      <Text textAlign="left" mb={4}>
        Posts
      </Text>
      {imagesLoading && (
        <CircularProgress
          color="gray.600"
          trackColor="blue.300"
          size={7}
          thickness={10}
          isIndeterminate
        />
      )}
      {fetchError && (
        <ErrorText textAlign="left">Failed to load images</ErrorText>
      )}
      {!fetchError && imageUrls?.length === 0 && (
        <Text textAlign="left" fontSize="lg" color="gray.500">
          No images found
        </Text>
      )}
      <ImageContainer>
        <ImageGrid>
          {imageUrls?.length > 0 &&
            imageUrls.map((url) => (
              <ImageCard src={url} alt="Image" key={url} />
            ))}
        </ImageGrid>
      </ImageContainer>
      {renderProjects()}
      {findTargetProjects()}
      <Link to="/projectform">
        <div className="btn-container">
          <button className="profile-button content">
            Create a new project
          </button>
        </div>
      </Link>
    </ProfileContainer>
  );
}
export default ProfileCard;
