import axios from 'axios';
import axiosClient from "../../config/axios";
import { QUERY_PROJECTS, QUERY_SINGLE_PROJECT } from "../../utils/queries";
import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState, useRef, useMemo } from "react";
import SkeletonLoader from "../hooks/SkeletonLoader";
import AuthService from "../../utils/auth";
import LazyLoad from "react-lazyload";
import "../style/BackgroundVisualizer.css";
import Comments from "./Comments";
import { ADD_MEMBER } from "../../utils/mutations";
import WaveSurfer from "wavesurfer.js";

function ExploreCard(props) {
  const { loading: apolloLoading, data: apolloData } = useQuery(QUERY_PROJECTS);
  const projects = useMemo(() => apolloData?.projects || [], [apolloData]);
  const URL = "/singlepost-image";
  const [imageUrls, setImageUrls] = useState({});
  const [audioUrls, setAudioUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const wavesurfers = useRef({});
  const currentPlaying = useRef(null); // Track the currently playing audio



  useEffect(() => {

    const abortControllers = {};

    const fetchData = async (projectAuthor) => {

      if (abortControllers[projectAuthor]) {
        abortControllers[projectAuthor].abort();
      }
      const abortController = new AbortController();
      abortControllers[projectAuthor] = abortController;

      try {
        const imageResponse = await axiosClient.get(`${URL}?${new Date().getTime()}`, {
          headers: {
            "x-project-author": projectAuthor,
            "x-file-type": "image",
          },
          signal: abortController.signal,
        });
        const audioResponse = await axiosClient.get(`${URL}?${new Date().getTime()}`, {
          headers: {
            "x-project-author": projectAuthor,
            "x-file-type": "audio",
          },
          signal: abortController.signal,
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
        // console.error("Error fetching data:", error);
        if (axios.isAxiosError(error) && error.code !== 'ERR_CANCELED') {
          console.error("Error fetching data:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    const fetchAllData = async () => {
      for (const project of projects) {
        await fetchData(project.projectAuthor);
      }
    };

    fetchAllData();

    return () => {
      Object.values(abortControllers).forEach((controller) => controller.abort());
    };

  }, [projects]);


  const findProjectImageUrl = (projectImage, projectAuthor) => {
    const authorImageUrls = imageUrls[projectAuthor] || [];
    return authorImageUrls.find((imageUrl) => imageUrl.includes(projectImage));
  };

  const findProjectAudioUrl = (projectAudio, projectAuthor) => {
    const authorAudioUrls = audioUrls[projectAuthor] || [];
    return authorAudioUrls.find((audioUrl) => audioUrl.includes(projectAudio));
  };

  // const handleJoin = async (event, projectId) => {
  //   event.preventDefault();
  //   try {
  //     setSelectedProjectId(projectId);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  
  const handleJoin = async (event, projectId) => {
    event.preventDefault();
    setSelectedProjectId((prevSelectedProjectId) =>
      prevSelectedProjectId === projectId ? null : projectId
    );
  };

  const initializeWaveSurfer = (containerRef, audioUrl, projectId) => {
    if (containerRef && !wavesurfers.current[projectId]) {
      const wavesurfer = WaveSurfer.create({
        container: containerRef,
        waveColor: 'gray',
        progressColor: 'white',
        cursorColor: 'transparent',
        height: 100,
        barWidth: 4,
        barGap: 4,
        barRadius: 8,
        backend: 'MediaElement',
      });

      wavesurfer.load(audioUrl);
      wavesurfer.on('ready', () => {
        console.log('WaveSurfer is ready');
      });

      wavesurfers.current[projectId] = wavesurfer;

      return () => {
        wavesurfer.destroy(); // Ensure each instance is destroyed on unmount
        delete wavesurfers.current[projectId];
      };
    }
  };


  const handlePlayPause = (projectId) => {
    if (wavesurfers.current[projectId]) {
      if (currentPlaying.current && currentPlaying.current !== projectId) {
        wavesurfers.current[currentPlaying.current].pause();
      }
      wavesurfers.current[projectId].playPause();
      currentPlaying.current = projectId;
    }
  };

  const handleLike = (projectId) => {
    setLiked((prevLiked) => {
      const newLiked = !prevLiked[projectId];
      return {
        ...prevLiked,
        [projectId]: newLiked,
      };
    });

    setLikes((prevLikes) => {
      const newLiked = !liked[projectId];
      return {
        ...prevLikes,
        [projectId]: newLiked ? prevLikes[projectId] + 1 : prevLikes[projectId] - 1,
      };
    });
  };

  useEffect(() => {
    const initialLikes = {};
    const initialLiked = {};
    const initialCommentsCount = {};

    projects.forEach((project) => {
      initialLikes[project._id] = project.likes || 0;
      initialLiked[project._id] = false;
      initialCommentsCount[project._id] = project.comments.length || 0; // Initialize comment count
    });

    setLikes(initialLikes);
    setLiked(initialLiked);
    setCommentsCount(initialCommentsCount); // Set initial comment counts
  }, [projects]);



  return (
    <div className="w-full relative z-50">
      {projects.map((project) => {
        const currentAuthor = project.projectAuthor;
        const projectImageUrl = findProjectImageUrl(project.projectImage, currentAuthor);
        const projectAudioUrl = findProjectAudioUrl(project.projectAudio, currentAuthor);
        return (
          <div className="flex flex-row max-w-[45rem] h-[90vh] relative my-12" key={project._id}>
            <div className="flex flex-col relative rounded-xl border border-primary overflow-hidden">
              <LazyLoad className="w-full min-w-[45rem]" once>
                {/* <div className="flex justify-center items-center w-full min-w-[45rem] relative">
                  <SkeletonLoader />
                </div> */}
                <div className="overflow-hidden rounded-tl-xl rounded-tr-xl">
                  {loading ? (
                    <div className="flex justify-center items-center w-full min-w-[45rem] relative">
                      <SkeletonLoader />
                    </div>
                  ) : (
                    projectImageUrl && (
                      <img
                        src={projectImageUrl}
                        alt="Project"
                        loading="lazy"
                        style={{
                          width: "100%",
                          minHeight: "90vh",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    )
                  )}
                  {!loading && !projectImageUrl && (
                    <div className="flex justify-center items-center w-full min-w-[45rem] relative">
                      <SkeletonLoader />
                    </div>
                  )}
                </div>
              </LazyLoad>

              <div className="w-full absolute bottom-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B] to-transparent">
                <div className="flex flex-col justify-center items-end overflow-visible">
                  <div className="w-full pb-8 pt-40 px-8">
                    <div className="flex flex-row justify-between items-center relative w-full gap-8">

                      <div className="flex flex-col justify-start items-start w-full gap-2">
                        <h1 className="text-3xl font-semibold">
                          {project.projectTitle}
                        </h1>
                        <h2><span className="text-white opacity-50">prod. </span>@{currentAuthor}</h2>
                        {loading ? (
                          <div />
                        ) : (
                          projectAudioUrl && (
                            <>
                              <div
                                className="w-full pt-4 pb-6"
                                ref={(ref) => {
                                  initializeWaveSurfer(ref, projectAudioUrl, project._id);
                                }}
                              />
                            </>
                          )
                        )}
                        {!loading && !projectAudioUrl && <h2>No audio available</h2>}
                      </div>

                      <div className="inline-flex flex-col gap-2">
                        <div className="flex flex-col justify-center items-center gap-1">
                          {likes[project._id]}
                          <button onClick={() => handleLike(project._id)} className="border border-secondary border-opacity-50 p-[6px] rounded-xl overflow-hidden bg-secondary">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill={liked[project._id] ? "red" : "none"} xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.4116 6.41369L11.9979 7L12.5832 6.41473C13.489 5.5089 14.7176 5 15.9987 5C17.2788 5 18.5067 5.5082 19.4123 6.41296L19.4355 6.43605C19.8094 6.80957 20.1225 7.24502 20.3589 7.71773C21.3335 9.66691 20.9606 12.0394 19.4196 13.5804L13.4142 19.5858C12.6332 20.3668 11.3668 20.3668 10.5858 19.5858L4.58192 13.5819C3.04002 12.04 2.66744 9.66511 3.64263 7.71475C3.87794 7.24412 4.18957 6.81023 4.56144 6.43798L4.58392 6.41547C5.48924 5.50921 6.71768 5 7.99865 5C9.27876 5 10.5064 5.50852 11.4116 6.41369Z" stroke={liked[project._id] ? "none" : "white"} strokeWidth="1.5" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1">
                          {commentsCount[project._id] ?? 0}
                          <button onClick={(event) => handleJoin(event, project._id)} className="border border-secondary border-opacity-50 p-2 rounded-xl overflow-hidden bg-secondary">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 17.17L18.83 16H4V4H20V17.17ZM20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H18L22 22V4C22 2.9 21.1 2 20 2Z" fill="#FAFAFA" />
                            </svg>
                          </button>
                        </div>
                      </div>

                    </div>
                    <div className="flex justify-between items-center">
                      <button onClick={() => handlePlayPause(project._id)}>
                        <svg className="bg-secondary rounded-full hover:bg-blue-600 transition-all ease-out 200ms" width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M44 29.6906C45.7778 30.717 45.7778 33.283 44 34.3094L28 43.547C26.2222 44.5734 24 43.2904 24 41.2376V22.7624C24 20.7096 26.2222 19.4266 28 20.453L44 29.6906Z" fill="#FAFAFA" />
                        </svg>
                      </button>
                      <button type="button" className="border border-secondary py-2 px-4 flex flex-row justify-center items-center gap-2 rounded-xl bg-gradient-to-tr from-[#181819] to-[#181819]  hover:from-blue-600 hover:to-purple-600 transition-all ease-out 200ms">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 13C5.1 13 6 12.1 6 11C6 9.9 5.1 9 4 9C2.9 9 2 9.9 2 11C2 12.1 2.9 13 4 13ZM5.13 14.1C4.76 14.04 4.39 14 4 14C3.01 14 2.07 14.21 1.22 14.58C0.48 14.9 0 15.62 0 16.43V18H4.5V16.39C4.5 15.56 4.73 14.78 5.13 14.1ZM20 13C21.1 13 22 12.1 22 11C22 9.9 21.1 9 20 9C18.9 9 18 9.9 18 11C18 12.1 18.9 13 20 13ZM24 16.43C24 15.62 23.52 14.9 22.78 14.58C21.93 14.21 20.99 14 20 14C19.61 14 19.24 14.04 18.87 14.1C19.27 14.78 19.5 15.56 19.5 16.39V18H24V16.43ZM16.24 13.65C15.07 13.13 13.63 12.75 12 12.75C10.37 12.75 8.93 13.14 7.76 13.65C6.68 14.13 6 15.21 6 16.39V18H18V16.39C18 15.21 17.32 14.13 16.24 13.65ZM8.07 16C8.16 15.77 8.2 15.61 8.98 15.31C9.95 14.93 10.97 14.75 12 14.75C13.03 14.75 14.05 14.93 15.02 15.31C15.79 15.61 15.83 15.77 15.93 16H8.07ZM12 8C12.55 8 13 8.45 13 9C13 9.55 12.55 10 12 10C11.45 10 11 9.55 11 9C11 8.45 11.45 8 12 8ZM12 6C10.34 6 9 7.34 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 7.34 13.66 6 12 6Z" fill="#FAFAFA" />
                        </svg>
                        <p className="text-sm">Collab</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute right-[-26rem] bg-primary rounded-xl h-auto w-full max-w-[24rem] max-h-[32rem] overflow-scroll z-50">
              {selectedProjectId === project._id && (
                <Comments
                  projectId={project._id}
                  // setCommentsCount={props.setCommentsCount}
                />)}
            </div>
          </div >
        );
      })}
    </div>
  );
}

export default ExploreCard;
