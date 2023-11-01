import axiosClient from "../../config/axios";
import { QUERY_PROJECTS } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState, useMemo } from "react";
import { CircularProgress, Text } from "@chakra-ui/react";
import { ImageCard, ImageContainer } from "./Common.js";
import imgQueries from "../../utils/imgQueries";
import Auth from "../../utils/auth";
import imgQuery from "../../utils/imgQuery";
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

// function ExploreCard(props) {
//   const { loading, data } = useQuery(QUERY_PROJECTS);
//   const projects = data?.projects || [];
//   const [refetch, setRefetch] = useState(0);
//   console.log(projects);
//   const URL = "/singlepost-image";

//   return (
//     <ExploreContainer>
//       {projects.map((project) => {
//         const currentAuthor = project.projectAuthor;
//         // setCurrentAuthor(project.projectAuthor)
//         const {
//           data: imageUrls = [],
//           isLoading: imagesLoading,
//           error: fetchError,
//         } = imgQueries(URL, refetch, currentAuthor);
//         const projectImageUrl =
//           imageUrls && imageUrls.length
//             ? imageUrls.find((imageUrl) =>
//                 imageUrl.includes(project.projectImage)
//               )
//             : null;

//         return (
//           <ExplorerCard key={project._id}>
//             <CardImage
//               src={projectImageUrl || Airforce}
//               alt="Image"
//               key={projectImageUrl}
//             />
//             <ExploreCardAuthor>
//               <ProjectAuthor>@{currentAuthor}</ProjectAuthor>
//             </ExploreCardAuthor>
//             <CardTitle>
//               <ProjectTitle>
//                 <Link to={`/projects/${project._id}`}>
//                   {project.projectTitle}
//                 </Link>
//                 <PostTime>{project.createdAt}</PostTime>
//               </ProjectTitle>
//             </CardTitle>
//           </ExplorerCard>
//         );
//       })}
//     </ExploreContainer>
//   );
// }

// export default ExploreCard;

// import React, { useEffect, useState } from "react";
// import { useQuery } from "@apollo/client";
// import { QUERY_PROJECTS } from "../../utils/queries";
// import { ExploreContainer, ExplorerCard, ExploreCardAuthor, ProjectAuthor, PostTime, CardTitle, ProjectTitle, CardImage } from "./Common.js";
// import { Link } from "react-router-dom";
// import Airforce from "../../assets/airforceanime.jpg";

function ExploreCard(props) {
  const { loading: apolloLoading, data: apolloData } = useQuery(QUERY_PROJECTS);
  const projects = apolloData?.projects || [];
  const URL = "/singlepost-image";

  const [imageUrls, setImageUrls] = useState({});
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    const fetchData = async (projectAuthor) => {
      axiosClient.defaults.headers.common["x-project-author"] = projectAuthor;

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

    projects.forEach((project) => {
      const currentAuthor = project.projectAuthor;
      fetchData(currentAuthor);
    });
  }, [projects, refetch]);

  const findProjectImageUrl = (projectImage, projectAuthor) => {
    const authorImageUrls = imageUrls[projectAuthor] || [];
    return authorImageUrls.find((imageUrl) => imageUrl.includes(projectImage));
  };

  return (
    <ExploreContainer>
      {projects.map((project) => {
        const currentAuthor = project.projectAuthor;
        const projectImageUrl = findProjectImageUrl(
          project.projectImage,
          currentAuthor
        );

        return (
          <ExplorerCard key={project._id}>
            <CardImage
              src={projectImageUrl || Airforce}
              alt="Image"
              key={projectImageUrl}
            />
            <ExploreCardAuthor>
              <ProjectAuthor>@{currentAuthor}</ProjectAuthor>
            </ExploreCardAuthor>
            <CardTitle>
              <ProjectTitle>
                <Link to={`/projects/${project._id}`}>
                  {project.projectTitle}
                </Link>
                <PostTime>{project.createdAt}</PostTime>
              </ProjectTitle>
            </CardTitle>
          </ExplorerCard>
        );
      })}
    </ExploreContainer>
  );
}

export default ExploreCard;
