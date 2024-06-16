import axiosClient from "../../config/axios";
import { QUERY_PROJECTS } from "../../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import SkeletonLoader from "../hooks/SkeletonLoader";
import AuthService from "../../utils/auth";
import AudioPlayer from "./AudioPlayer";
import LazyLoad from "react-lazyload";
import "../style/BackgroundVisualizer.css"
import Comments from "./Comments"; // Import Comments component
import { ADD_MEMBER } from "../../utils/mutations";


function ExploreCard(props) {
  const { loading: apolloLoading, data: apolloData } = useQuery(QUERY_PROJECTS);
  const projects = apolloData?.projects || [];

  const URL = "/singlepost-image";

  const [imageUrls, setImageUrls] = useState({});
  const [audioUrls, setAudioUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const [member, { error, dataMember }] = useMutation(ADD_MEMBER);

  useEffect(() => {
    setLoading(true);

    const fetchData = async (projectAuthor) => {
      try {
        const imageResponse = await axiosClient.get(URL, {
          headers: {
            "x-project-author": projectAuthor,
            "x-file-type": "image",
          },
        });
        const audioResponse = await axiosClient.get(URL, {
          headers: {
            "x-project-author": projectAuthor,
            "x-file-type": "audio",
          },
        });

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

  const handleAudioPlay = (audio) => {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
    }
    setCurrentAudio(audio);
  };

  return (
    <div className="w-full relative z-50">
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

        const handleJoin = async (event, projectId) => {
          event.preventDefault();
          const memberId = AuthService.getId();

          try {
            await member({
              variables: {
                projectId,
                memberId,
              },
            });
            setSelectedProjectId(projectId);
          } catch (error) {
            console.log(error);
          }
        };

        return (
          <div className="flex flex-row relative my-12">
            <div key={project._id} className="flex flex-col max-w-[45rem] rounded-xl border border-primary relative overflow-hidden">
              <LazyLoad height={200} once>
                <div className="overflow-hidden rounded-tl-xl rounded-tr-xl">
                  {loading ? (
                    <div className="flex justify-center items-center w-full min-w-[45rem] h-[45rem]">
                      <SkeletonLoader /> {/* Replace loading indicator */}
                    </div>
                  ) : (
                    projectImageUrl && (
                      <img
                        src={projectImageUrl}
                        alt="Project"
                        loading="lazy" // HTML attribute to lazy load images
                        style={{
                          width: "100%",
                          minHeight: "45rem",
                          height: "auto",
                          objectFit: "cover",
                        }} // Ensure responsive images
                      />
                    )
                  )}
                  {!loading && !projectImageUrl && (
                    <h2>No image available</h2>
                  )}
                </div>
              </LazyLoad>
              <div className="w-full absolute bottom-0">
                <div className="flex flex-col justify-center items-end bg-gradient-to-t from-[#0A0A0B] via-{#181819} to-transparent overflow-visible">
                  <div className="flex flex-row justify-between items-start w-full px-8 pt-[24rem] pb-4">
                    <h1 className="text-3xl font-semibold">
                      {project.projectTitle}
                    </h1>
                  </div>
                  <div className="w-full pb-8 px-8">
                    <AudioPlayer
                      id="waveform"
                      src={projectAudioUrl}
                      key={projectAudioUrl}
                      onPlay={handleAudioPlay}
                    />
                    <div className="flex flex-row justify-between items-center relative">
                      <h2 className="project-author"><span className="text-white opacity-50">prod. </span>@{currentAuthor}</h2>
                      <button onClick={(event) => handleJoin(event, project._id)} className="border border-secondary border-opacity-50 p-2 rounded-xl mt-4 overflow-hidden backdrop-blur-md">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 17.17L18.83 16H4V4H20V17.17ZM20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H18L22 22V4C22 2.9 21.1 2 20 2Z" fill="#FAFAFA" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              <div className="absolute right-[-8rem] bg-primary rounded-xl h-auto w-full max-w-[24rem] max-h-[32rem] overflow-scroll z-50">
                {selectedProjectId === project._id && (
                  <Comments projectId={selectedProjectId} />
                )}
              </div>
          </div>
        );
      })}
    </div>
  );
}

export default ExploreCard;
