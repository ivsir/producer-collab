import axiosClient from "../../config/axios";
import { QUERY_PROJECTS } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { CircularProgress, Text } from "@chakra-ui/react";
import AudioPlayer from "./AudioPlayer.js";
import LazyLoad from "react-lazyload";
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
  const { loading: apolloLoading, data: apolloData } = useQuery(QUERY_PROJECTS);
  const projects = apolloData?.projects || [];
  const URL = "/singlepost-image";
  const URL2 = "/audiofiles";
  // const URL = "/files";
// const URL2 = "/files";


  const [imageUrls, setImageUrls] = useState({});
  const [audioUrls, setAudioUrls] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchData = async (projectAuthor) => {
      axiosClient.defaults.headers.common["x-project-author"] = projectAuthor;

      try {
        const [imageResponse, audioResponse] = await Promise.all([
          axiosClient.get(URL),
          axiosClient.get(URL2),
        ]);

        // const imageResponse = await axiosClient.get(URL, {
        //   headers: {
        //     "x-project-author": projectAuthor,
        //     "x-file-type": "image",
        //   },
        // });


        // const audioResponse = await axiosClient.get(URL, {
        //   headers: {
        //     "x-project-author": projectAuthor,
        //     "x-file-type": "audio",
        //   },
        // });
        
        const imageData = imageResponse.data;
        const audioData = audioResponse.data;

        setImageUrls((prevImageUrls) => ({
          ...prevImageUrls,
          [projectAuthor]: imageData,
        }));
        setAudioUrls((prevAudioUrls) => ({
          ...prevAudioUrls,
          [projectAuthor]: audioData,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    projects.forEach((project) => {
      const currentAuthor = project.projectAuthor;
      fetchData(currentAuthor);
    });
  }, [projects]);

  const findProjectImageUrl = (projectImage, projectAuthor) => {
    const authorImageUrls = imageUrls[projectAuthor] || [];
    return authorImageUrls.find((imageUrl) => imageUrl.includes(projectImage));
  };

  const findProjectAudioUrl = (projectAudio, projectAuthor) => {
    const authorAudioUrls = audioUrls[projectAuthor] || [];
    return authorAudioUrls.find((audioUrl) => audioUrl.includes(projectAudio));
  };

  return (
    <ExploreContainer>
      {projects.map((project) => {
        const currentAuthor = project.projectAuthor;
        const projectImageUrl = findProjectImageUrl(
          project.projectImage,
          currentAuthor
        );
        const projectAudioUrl = findProjectAudioUrl(
          project.projectAudio,
          currentAuthor
        );
        return (
          <ExplorerCard key={project._id}>
            {/* <LazyLoad height={600} offset={100} debounce={false}> */}
              <CardImage
                src={projectImageUrl || Airforce}
                alt="Image"
                key={projectImageUrl}
              />
            {/* </LazyLoad> */}

            <ExploreCardAuthor>
              <ProjectAuthor>@{currentAuthor}</ProjectAuthor>
            </ExploreCardAuthor>
            <CardTitle>
              <ProjectTitle>
                <Link to={`/projects/${project._id}`}>
                  {project.projectTitle}
                </Link>
                <div>
                  {projectAudioUrl ? (
                    <AudioPlayer src={projectAudioUrl} key={projectAudioUrl} />
                  ) : (
                    <Text>No audio available</Text>
                  )}
                </div>
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
