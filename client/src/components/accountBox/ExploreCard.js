// import axiosClient from "../../config/axios";
// import { QUERY_PROJECTS } from "../../utils/queries";
// import { ADD_MEMBER } from "../../utils/mutations";
// import { useQuery, useMutation } from "@apollo/client";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { CircularProgress, Text } from "@chakra-ui/react";
// import AudioPlayer from "./AudioPlayer.js";
// import Comments from "./Comment.js";
// // import LazyLoad from "react-lazyload";
// import {
//   ExploreContainer,
//   ExplorerCard,
//   ExploreCardAuthor,
//   ProjectAuthor,
//   PostTime,
//   CardTitle,
//   ProjectTitle,
//   CardImage,
// } from "./Common.js";
// import { Link } from "react-router-dom";
// import Airforce from "../../assets/airforceanime.jpg";
// import district from "../../assets/district.mp3";
// import AuthService from "../../utils/auth";


// function ExploreCard(props) {

//   const { loading: apolloLoading, data: apolloData } = useQuery(QUERY_PROJECTS);
//   const projects = apolloData?.projects || [];
//   const URL = "/singlepost-image";

//   const navigate = useNavigate();

//   const [imageUrls, setImageUrls] = useState({});
//   const [audioUrls, setAudioUrls] = useState({});
//   const [loading, setLoading] = useState(true);

//   const [member, { error, dataMember }] = useMutation(ADD_MEMBER);


//   useEffect(() => {
//     setLoading(true);

//     const fetchData = async (projectAuthor) => {
//       try {
//         const imageResponse = await axiosClient.get(URL, {
//           headers: {
//             "x-project-author": projectAuthor,
//             "x-file-type": "image",
//           },
//         });
//         const audioResponse = await axiosClient.get(URL, {
//           headers: {
//             "x-project-author": projectAuthor,
//             "x-file-type": "audio",
//           },
//         });

//         const imageData = imageResponse.data;
//         const audioData = audioResponse.data;

//         setImageUrls((prevImageUrls) => ({
//           ...prevImageUrls,
//           [projectAuthor]: imageData,
//         }));
//         setAudioUrls((prevAudioUrls) => ({
//           ...prevAudioUrls,
//           [projectAuthor]: audioData,
//         }));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     projects.forEach((project) => {
//       const currentAuthor = project.projectAuthor;
//       fetchData(currentAuthor);
//     });
//   }, [projects]);

//   const findProjectImageUrl = (projectImage, projectAuthor) => {
//     const authorImageUrls = imageUrls[projectAuthor] || [];

//     return authorImageUrls.find((imageUrl) => imageUrl.includes(projectImage));
//   };

//   const findProjectAudioUrl = (projectAudio, projectAuthor) => {
//     const authorAudioUrls = audioUrls[projectAuthor] || [];
//     return authorAudioUrls.find((audioUrl) => audioUrl.includes(projectAudio));
//   };

//   return (
//     <ExploreContainer>
//       {projects.map((project) => {
//         // const currentAuthor = project.projectAuthor;
//         // const projectImageUrl = Airforce; // Example: Replace with logic to get the correct image URL
//         // const projectAudioUrl = district; // Example: Replace with logic to get the correct audio URL


//         const onJoin = async (event) => {
//           event.preventDefault();
//           const memberId = AuthService.getId();

//           const { data } = await member({
//             variables: {
//               projectId: project._id,
//               memberId: memberId,
//             },
//           });
//           try {
//             const { data } = await member({
//               variables: {
//                 projectId: project._id,
//                 memberId: memberId,
//               },
//             });
//             console.log(project);
//             navigate("/comments", {
//               state: {
//                 projectId: project._id,
//                 memberId: memberId,
//                 projects: project,
//               },
//             });
//           } catch (error) {
//             console.log(error);
//           }
//         };

//         const currentAuthor = project.projectAuthor;
//         const projectImageUrl = findProjectImageUrl(
//           project.projectImage,
//           currentAuthor
//         );
//         console.log(projectImageUrl)
//         const projectAudioUrl = findProjectAudioUrl(
//           project.projectAudio,
//           currentAuthor
//         );
//         return (
//           <ExplorerCard key={project._id}>
//             {loading ? (
//               <CircularProgress isIndeterminate color="green.300" />
//             ) : (
//               projectImageUrl && (
//                 <CardImage src={projectImageUrl} key={projectImageUrl} />
//               )
//             )}
//             {!loading && !projectImageUrl && <Text>No image available</Text>}
//             {/* <CardImage src={projectImageUrl} key={projectImageUrl} /> */}
//             <ExploreCardAuthor>
//               <ProjectAuthor>@{currentAuthor}</ProjectAuthor>
//             </ExploreCardAuthor>
//             <CardTitle>
//               <ProjectTitle>
//                 <Link to={`/projects/${project._id}`}>
//                   {project.projectTitle}
//                 </Link>
//                 <div>
//                   {loading ? (
//                     <CircularProgress isIndeterminate color="green.300" />
//                   ) : (
//                     projectAudioUrl && (
//                       <AudioPlayer
//                         src={projectAudioUrl}
//                         key={projectAudioUrl}
//                       />
//                     )
//                   )}
//                   {!loading && !projectAudioUrl && (
//                     <Text>No audio available</Text>
//                   )}
//                 </div>
//                 {/* <div>
//                   <AudioPlayer src={projectAudioUrl} key={projectAudioUrl} />
//                 </div> */}

//                 <PostTime>{project.createdAt}</PostTime>
//               </ProjectTitle>
//             </CardTitle>
//             <button onClick={onJoin} className="profile-button content">
//               Add Comment
//             </button>
//             {/* <Comments key={project._id}/> */}
//           </ExplorerCard>
//         );
//       })}
//     </ExploreContainer>
//   );
// }

// export default ExploreCard;

import axiosClient from "../../config/axios";
import { QUERY_PROJECTS } from "../../utils/queries";
import { ADD_MEMBER } from "../../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState, useRef } from "react";
import { CircularProgress, Text } from "@chakra-ui/react";
import AudioPlayer from "./AudioPlayer.js";
import Comments from "./Comment.js";
// import LazyLoad from "react-lazyload";
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
import district from "../../assets/district.mp3";
import AuthService from "../../utils/auth";
import WaveSurfer from 'wavesurfer.js';

function ExploreCard() {
  const { loading: apolloLoading, data: apolloData } = useQuery(QUERY_PROJECTS);
  const projects = apolloData?.projects || [];
  const URL = "/singlepost-image";

  const [imageUrls, setImageUrls] = useState({});
  const [audioUrls, setAudioUrls] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  



  const [member, { error, dataMember }] = useMutation(ADD_MEMBER);

  const wavesurfer = useRef(null);



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

  const handleWaveformReady = () => {
    console.log('WaveSurfer is ready');
    // Optionally, you can do something when WaveSurfer is ready
  };

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  return (
    <ExploreContainer>
      {projects.map((project) => {
        const currentAuthor = project.projectAuthor;
        const projectImageUrl = findProjectImageUrl(project.projectImage, currentAuthor);
        const projectAudioUrl = findProjectAudioUrl(project.projectAudio, currentAuthor);

        return (
          <ExplorerCard key={project._id}>
            {loading ? (
              <CircularProgress isIndeterminate color="green.300" />
            ) : (
              projectImageUrl && <CardImage src={projectImageUrl} key={projectImageUrl} />
            )}
            {!loading && !projectImageUrl && <Text>No image available</Text>}
            <ExploreCardAuthor>
              <ProjectAuthor>@{currentAuthor}</ProjectAuthor>
            </ExploreCardAuthor>
            <CardTitle>
              <ProjectTitle>
                <Link to={`/projects/${project._id}`}>{project.projectTitle}</Link>
                {/* <div>
                  {loading ? (
                    <CircularProgress isIndeterminate color="green.300" />
                  ) : (
                    projectAudioUrl && <AudioPlayer src={projectAudioUrl} key={projectAudioUrl} />
                  )}
                  {!loading && !projectAudioUrl && <Text>No audio available</Text>}
                </div> */}
                <div>
                  {
                    projectAudioUrl && (
                      <>
                        <div ref={(ref) => {
                          if (ref && !wavesurfer.current) {
                            wavesurfer.current = WaveSurfer.create({
                              container: ref,
                              waveColor: 'violet',
                              progressColor: 'purple',
                              cursorColor: 'navy',
                              height: 100,
                              barWidth: 2,
                              backend: 'WebAudio',
                            });

                            wavesurfer.current.load(projectAudioUrl);
                            wavesurfer.current.on('ready', handleWaveformReady);
                          }
                        }} />
                        <button onClick={handlePlayPause}>Play/Pause</button>
                      </>
                    )
                  }
                  {/* {!loading && !projectAudioUrl && <Text>No audio available</Text>} */}
                </div>

                <PostTime>{project.createdAt}</PostTime>
              </ProjectTitle>

            </CardTitle>
            <button onClick={(event) => handleJoin(event, project._id)} className="profile-button content">
              Add Comment
            </button>
            {selectedProjectId === project._id && (
              <Comments projectId={selectedProjectId} />
            )}
     
          </ExplorerCard>
        );
      })}
    </ExploreContainer>
  );
}

export default ExploreCard;
