import { QUERY_PROJECTS } from "../../utils/queries";
import { useQuery } from "@apollo/client";

import { CircularProgress, Text } from "@chakra-ui/react";
import { ImageCard, ImageContainer } from "./Common.js";
import Auth from "../../utils/auth";
import imgQuery from "../../utils/imgQuery";
import { useState } from "react";

import {
  ExploreContainer,
  ExplorerCard,
  ExploreCardAuthor,
  ProjectAuthor,
  PostTime,
  CardTitle,
  ProjectTitle,
  CardImage,
} from "./Common.js";
import { Link } from "react-router-dom";
import Airforce from "../../assets/airforceanime.jpg";

function ExploreCard(props) {
  const { loading, data } = useQuery(QUERY_PROJECTS);
  const projects = data?.projects || [];
  console.log(projects);

  const [refetch, setRefetch] = useState(0);
  const userId = Auth.getProfile().data.username;
  const URL = "/images";

  const {
    data: imageUrls = [],
    isLoading: imagesLoading,
    error: fetchError,
  } = imgQuery(URL, refetch, userId);

  // const projectImageUrls = projects.map((project) => {
  //   const imageUrl = imageUrls.find((imageUrl) => imageUrl.includes(project.projectImage));
  //   return imageUrl || null;
  // });
  

  console.log(imageUrls);

  return (
    <ExploreContainer>
      {projects.map((projects) => (
        <ExplorerCard key={projects._id}>
          <CardImage src={Airforce} />
          <ExploreCardAuthor>
            <ProjectAuthor>@{projects.projectAuthor}</ProjectAuthor>
          </ExploreCardAuthor>
          <CardTitle>
            <ProjectTitle>
              <Link to={`/projects/${projects._id}`}>
                {projects.projectTitle}
              </Link>
              <PostTime>{projects.createdAt}</PostTime>
              <PostTime>@{projects.projecImage}</PostTime>
            </ProjectTitle>
          </CardTitle>
        </ExplorerCard>
      ))}
    </ExploreContainer>
  );
}

export default ExploreCard;
