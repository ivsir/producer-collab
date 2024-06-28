// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useQuery } from "@apollo/client";
// import AuthService from "../../utils/auth";
// import axiosClient from "../../config/axios";
// import { QUERY_USER } from "../../utils/queries";

// function ProfileCard(props) {
//   const { loading, data: userData } = useQuery(QUERY_USER, {
//     variables: { username: AuthService.getUsername() },
//   });

//   const projects = userData?.user?.projects || [];
//   const [imageUrls, setImageUrls] = useState({});
//   const currentUser = AuthService.getUsername();
//   const URL = "/images";

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

//     projects.forEach((project) => {
//       fetchData(project.projectAuthor);
//     });
//   }, [projects]);

//   const findProjectImageUrl = (projectImage, projectAuthor) => {
//     const profileImageUrls = imageUrls[projectAuthor] || [];
//     return profileImageUrls.find((imageUrl) => imageUrl.includes(projectImage));
//   };

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//       {projects.map((project) => {
//         const projectImageUrl = findProjectImageUrl(
//           project.projectImage,
//           project.projectAuthor
//         );

//         return (
//           <Link to={`/projects/${project._id}`} key={project._id}>
//             <div className="relative group overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg">
//               <img
//                 className="object-cover w-full h-48 sm:h-64 md:h-48 lg:h-56"
//                 src={projectImageUrl}
//                 alt={project.projectImage}
//               />
//               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
//                 <div className="text-center text-white">
//                   <h3 className="text-lg font-bold">{project.projectTitle}</h3>
//                   <p className="mt-1">{project.projectDescription}</p>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }

// export default ProfileCard;

import axiosClient from "../../config/axios";
import { useEffect, useState } from "react";
import SkeletonLoader from "../hooks/SkeletonLoader";
import LazyLoad from "react-lazyload";
import { useQuery } from "@apollo/client";
import { QUERY_PROJECTS } from "../../utils/queries";
import Comments from "./Comments";
import AuthService from "../../utils/auth";
import { ADD_MEMBER } from "../../utils/mutations";

function ProfileCard(props) {
  const { loading: apolloLoading, data: apolloData } = useQuery(QUERY_PROJECTS);
  const projects = apolloData?.projects || [];

  const URL = "/singlepost-image";

  const [imageUrls, setImageUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [likes, setLikes] = useState({});
  const [liked, setLiked] = useState({});
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

    projects.forEach((project) => {
      const currentAuthor = project.projectAuthor;
      fetchData(currentAuthor);
    });
  }, [projects]);

  const findProjectImageUrl = (projectImage, projectAuthor) => {
    const authorImageUrls = imageUrls[projectAuthor] || [];
    return authorImageUrls.find((imageUrl) => imageUrl.includes(projectImage));
  };

  useEffect(() => {
    const initialLikes = {};
    const initialLiked = {};
    const initialCommentsCount = {};

    projects.forEach((project) => {
      initialLikes[project._id] = project.likes || 0;
      initialLiked[project._id] = false;
      initialCommentsCount[project._id] = project.commentsCount || 0;
    });

    setLikes(initialLikes);
    setLiked(initialLiked);
    setCommentsCount(initialCommentsCount);
  }, [projects]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {projects.map((project) => {
        const currentAuthor = project.projectAuthor;
        const projectImageUrl = findProjectImageUrl(project.projectImage, currentAuthor);

        return (
          <div key={project._id} className="flex flex-col relative rounded-xl border border-primary overflow-hidden">
            <LazyLoad className="w-full max-h-[20rem]" once>
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
            </LazyLoad>

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
                        {likes[project._id]}
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
  );
}

export default ProfileCard;
