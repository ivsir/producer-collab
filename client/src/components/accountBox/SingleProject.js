import React from "react";

import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import AuthService from "../../utils/auth";
import { useNavigate } from "react-router-dom";

import { CircularProgress, Text } from "@chakra-ui/react";
import { ImageCard, ImageContainer } from "./Common.js";
import Auth from "../../utils/auth";
import imgQuery from "../../utils/imgQuery";
import imgQueries from "../../utils/imgQueries";
import { useState } from "react";

import { QUERY_SINGLE_PROJECT } from "../../utils/queries";
import { SinglePostContainer } from "./Common";
import { ADD_MEMBER } from "../../utils/mutations";

const SingleProject = () => {
  const [member, { error, dataMember }] = useMutation(ADD_MEMBER);
  // Use `useParams()` to retrieve value of the route parameter `:profileId`
  const { projectId } = useParams();
  const navigate = useNavigate();

  const onJoin = async (event) => {
    event.preventDefault();
    const memberId = AuthService.getId();

    try {
      const { data } = await member({
        variables: {
          projectId: projectId,
          memberId: memberId,
        },
      });
      console.log(project);
      navigate("/comments", {
        state: {
          projectId: projectId,
          memberId: memberId,
          projects: project,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { loading, data } = useQuery(QUERY_SINGLE_PROJECT, {
    // pass URL parameter
    variables: { projectId: projectId },
  });

  // console.log(data);
  const project = data?.project || {};
  const [refetch, setRefetch] = useState(0);
  const userId = Auth.getProfile().data.username;
  const URL = "/images";
  // const URL =  "/all-user-images"
  // const URL ="/user-folders"

  const {
    data: imageUrls = [],
    isLoading: imagesLoading,
    error: fetchError,
    } = imgQuery(URL, refetch, userId);
  // } = imgQueries(URL, refetch);

  console.log(imageUrls)

  const projectImageUrl = imageUrls
    ? imageUrls.find((imageUrl) => imageUrl.includes(project.projectImage))
    : null;

  console.log("images", imageUrls);

  const ErrorText = ({ children, ...props }) => (
    <Text fontSize="lg" color="red.300" {...props}>
      {children}
    </Text>
  );

  // console.log(project);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SinglePostContainer>
      <div className="my-3 single-post-container">
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
          {/* {imageUrls?.length > 0 &&
            imageUrls.map((url) => (
              <ImageCard src={url} alt="Image" key={url} />
              ))} */}
          <ImageCard src={projectImageUrl} alt="Image" key={projectImageUrl} />
        </ImageContainer>
        <h2 className="card-header bg-dark text-light p-2 m-0">
          {project.projectTitle} <br />
        </h2>
        <h3 className="card-header bg-dark text-light p-2 m-0">
          {project.projectAuthor} created this project on {project.createdAt}
        </h3>
        <div className="bg-light py-4 blockquote-container">
          <blockquote
            className="p-4"
            style={{
              fontSize: "1.5rem",
              fontStyle: "italic",
              lineHeight: "1.5",
              overflow: "auto",
            }}
          >
            {project.projectDescription}
          </blockquote>{" "}
        </div>
      </div>
      <div className="link-button-wrapper">
        <button onClick={onJoin} className="profile-button content">
          Join project
        </button>
      </div>
    </SinglePostContainer>
  );
};

export default SingleProject;
