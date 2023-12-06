import React from "react";

import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import AuthService from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import AudioPlayer from "./AudioPlayer.js";
import { CircularProgress, Text, Box, Skeleton } from "@chakra-ui/react";
import {
  ProjectImageCard,
  ImageContainer,
  ExploreContainer,
  ExplorerCard,
  ExploreCardAuthor,
  ProjectAuthor,
  PostTime,
  CardTitle,
  ProjectTitle,
  ImageCard,
} from "./Common.js";
import imgQueries from "../../utils/imgQueries";
import { useState } from "react";

import { QUERY_SINGLE_PROJECT } from "../../utils/queries";
import { SinglePostContainer } from "./Common";
import { ADD_MEMBER } from "../../utils/mutations";

const SingleProject = () => {
  const [refetch, setRefetch] = useState(0);
  const { projectId } = useParams();

  const URL = "/singlepost-image";
  const URL2 = "/audiofiles";
  const { loading, data } = useQuery(QUERY_SINGLE_PROJECT, {
    // pass URL parameter
    variables: { projectId: projectId },
  });
  const project = data?.project || {};
  const currentAuthor = project.projectAuthor;
  const {
    data: imageUrls = [],
    isLoading: imagesLoading,
    error: fetchError,
  } = imgQueries(URL, refetch, currentAuthor);
  const {
    data: audioUrls = [],
    isLoading: audioLoading,
    error: fetchAudioError,
  } = imgQueries(URL2, refetch, currentAuthor);
  // Use `useParams()` to retrieve value of the route parameter `:profileId`
  const navigate = useNavigate();
  const [member, { error, dataMember }] = useMutation(ADD_MEMBER);

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

  const projectImageUrl = imageUrls
    ? imageUrls.find((imageUrl) => imageUrl.includes(project.projectImage))
    : null;

  const projectAudioUrl = audioUrls
    ? audioUrls.find((audioUrl) => audioUrl.includes(project.projectAudio))
    : null;

  const ErrorText = ({ children, ...props }) => (
    <Text fontSize="lg" color="red.300" {...props}>
      {children}
    </Text>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ExploreContainer>
      <SinglePostContainer>
        <ExplorerCard key={project._id}>
          {loading ? (
            <Skeleton
              height="25rem"
              // isLoaded={true}
              bg="green.500"
              color="white"
              fadeDuration={1}
            >
              <Box>Hello React!</Box>
              <CircularProgress isIndeterminate color="green.300" />
            </Skeleton>
          ) : (
            projectImageUrl && (
              <ImageCard src={projectImageUrl} key={projectImageUrl} />
            )
          )}ç
          {!loading && !projectImageUrl && <Text>No image available</Text>}
          <ExploreCardAuthor>
            <ProjectAuthor>@{currentAuthor}</ProjectAuthor>
          </ExploreCardAuthor>
          <CardTitle>
            <ProjectTitle>
              <Link to={`/projects/${project._id}`}>
                {project.projectTitle}
              </Link>
              <div>
                {loading ? (
                  <CircularProgress isIndeterminate color="green.300" />
                ) : (
                  projectAudioUrl && (
                    <AudioPlayer src={projectAudioUrl} key={projectAudioUrl} />
                  )
                )}
                {!loading && !projectAudioUrl && (
                  <Text>No audio available</Text>
                )}
              </div>
              <PostTime>
                {project.projectAuthor} created this project on{" "}
                {project.createdAt}
              </PostTime>
            </ProjectTitle>
          </CardTitle>
        </ExplorerCard>

        <div className="link-button-wrapper">
          <button onClick={onJoin} className="profile-button content">
            Join project
          </button>
        </div>
      </SinglePostContainer>
    </ExploreContainer>
  );
};

export default SingleProject;
