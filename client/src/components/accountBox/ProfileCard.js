// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useQuery } from "@apollo/client";
// import AuthService from "../../utils/auth";
// import axiosClient from "../../config/axios";
// import { QUERY_USER } from "../../utils/queries";
// import Auth from "../../utils/auth";

// function ProfileCard(props) {
//   const userId = Auth.getProfile().data.username;
//   const { loading, data: userData } = useQuery(QUERY_USER, {
//     variables: { username: AuthService.getUsername() },
//   });
//   const projects = userData?.user.projects || [];
//   const URL = "/images";

//   const [imageUrls, setImageUrls] = useState({});
//   const [refetch, setRefetch] = useState(0);

//   useEffect(() => {
//     const fetchData = async (projectAuthor) => {
//       axiosClient.defaults.headers.common["x-user-id"] = projectAuthor;
//       try {
//         const response = await axiosClient.get(URL);
//         const data = response.data;

//         setImageUrls((prevImageUrls) => ({
//           ...prevImageUrls,
//           [projectAuthor]: data,
//         }));
//       } catch (error) {
//         console.error("Error fetching image data:", error);
//       }
//     };

//     const currentUser = Auth.getProfile().data.username;
//     fetchData(currentUser);
//   }, [projects, refetch]);

//   const findProjectImageUrl = (projectImage, currentUser) => {
//     const profileImageUrls = imageUrls[currentUser] || [];
//     return profileImageUrls.find((imageUrl) => imageUrl.includes(projectImage));
//   };

//   return (
//     <div className="image-grid">
//       {projects.map((project) => {
//         const projectImageUrl = findProjectImageUrl(
//           project.projectImage,
//           userId
//         );

//         return (
//           <Link to={`/projects/${project._id}`} key={project._id}>
//             <div className="profile-image-container">
//               <img className="image-card" src={projectImageUrl} alt={project.projectImage} />
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }

// export default ProfileCard;


import axiosClient from "../../config/axios";
import { useEffect, useState, useMemo } from "react";
import SkeletonLoader from "../hooks/SkeletonLoader";
import LazyLoad from "react-lazyload";
import { useQuery } from "@apollo/client";
import { QUERY_PROJECTS, QUERY_USER } from "../../utils/queries";
import Comments from "./Comments";
import AuthService from "../../utils/auth";
import Auth from "../../utils/auth";
import { ADD_MEMBER } from "../../utils/mutations";

function ProfileCard(props) {
  const { loading: apolloLoading, data: apolloData } = useQuery(QUERY_PROJECTS);
  const projects = useMemo(() => apolloData?.projects || [], [apolloData]);

  const URL = "/singlepost-image";

  const [imageUrls, setImageUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [likes, setLikes] = useState({});
  const [commentsCount, setCommentsCount] = useState({});

  useEffect(() => {
    setLoading(true);

    const fetchData = async (projectAuthor) => {
      try {
        const imageResponse = await axiosClient.get(`${URL}?${new Date().getTime()}`, {
          headers: {
            "x-project-author": projectAuthor,
            "x-file-type": "image",
          },
        });

        const imageData = imageResponse.data;
        setImageUrls((prevImageUrls) => ({
          ...prevImageUrls,
          [projectAuthor]: imageData,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    const currentAuthor = Auth.getProfile().data.username;
    fetchData(currentAuthor);
  }, [projects]);

  const findProjectImageUrl = (projectImage, projectAuthor) => {
    const authorImageUrls = imageUrls[projectAuthor] || [];
    return authorImageUrls.find((imageUrl) => imageUrl.includes(projectImage));
  };

  const currentAuthor = Auth.getProfile().data.username;
  const userProjects = projects.filter((project) => project.projectAuthor === currentAuthor);


  useEffect(() => {
    const initialLikes = {};
    const initialCommentsCount = {};

    projects.forEach((project) => {
      initialLikes[project._id] = project.likes?.length || 0;
      // initialLiked[project._id] = project.likes?.some((like) => like.username === AuthService.getProfile().data.username);
      initialCommentsCount[project._id] = project.comments?.length || 0; // Initialize comment count
    });

    setLikes(initialLikes);
    setCommentsCount(initialCommentsCount); // Set initial comment counts
  }, [projects]);

  return (
    <LazyLoad className="w-full max-h-[20rem]" once>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {userProjects.map((project) => {
          const projectImageUrl = findProjectImageUrl(project.projectImage, currentAuthor);
          return (
            <div key={project._id} className="flex flex-col relative rounded-xl border border-primary overflow-hidden">
              <div className="flex justify-center items-center w-full min-w-[45rem] relative">
                <SkeletonLoader />
              </div>
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
                        minHeight: "20rem",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  )
                )}
                {!loading && !projectImageUrl && (
                  <h2 className="w-full text-3xl text-center">Loading content...</h2>
                )}
              </div>

              <div className="w-full absolute bottom-0 bg-gradient-to-t from-[#0A0A0B] to-transparent">
                <div className="flex flex-col justify-center items-end overflow-visible">
                  <div className="w-full pb-8 pt-40 px-4">
                    <div className="flex flex-row justify-between items-center relative w-full gap-8">
                      <div className="flex flex-col justify-start items-start w-full gap-2">
                        <h1 className="text-xl font-semibold">{project.projectTitle}</h1>
                        {/* Any other project details */}
                      </div>

                      <div className="inline-flex flex-col gap-2">
                        <div className="flex flex-col justify-center items-center gap-1">
                          {likes[project._id] ?? 0}
                          {/* Like button */}
                        </div>
                        <div className="flex flex-col justify-center items-center gap-1">
                          {commentsCount[project._id] ?? 0}
                          {/* Join button */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute right-[-26rem] bg-primary rounded-xl h-auto w-full max-w-[24rem] max-h-[32rem] overflow-scroll z-50">
                {selectedProjectId === project._id && (
                  <Comments
                    projectId={project._id}
                    setCommentsCount={(count) =>
                      setCommentsCount((prev) => ({ ...prev, [project._id]: count }))
                    }
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </LazyLoad>
  );
}

export default ProfileCard;
