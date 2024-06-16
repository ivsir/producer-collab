// import React from "react";
// import { useLocation } from "react-router-dom";
// import { useState } from "react";
// import { useMutation, useQuery } from "@apollo/client";
// import { Link } from "react-router-dom";
// import styled from "styled-components";

// import { ADD_COMMENT } from "../../utils/mutations";
// import { QUERY_SINGLE_PROJECT } from "../../utils/queries";

// import Auth from "../../utils/auth";

// const CommentBox = styled.div`
//   h3 {
//     border: 2px solid var(--color-dark-blue);
//     padding: 0.5rem 0.5rem 0.5rem 2rem;
//     border-radius: 0.5rem;
//     margin: 0.5rem 1rem;
//     background-color: var(--color-dark-blue);
//     color: var(--color-yellow);
//     text-shadow: 0.1rem 0.1rem 0.25rem var(--color-bg);
//     font-family: montserrat;
//   }

//   h4 {
//     margin: 0.5rem 1.5rem;
//     color: var(--color-yellow);
//     text-shadow: 0.1rem 0.1rem 0.25rem var(--color-light-blue);
//     text-align: right;
//     margin-right: 1.5rem;
//   }
// `;

// const CommentContainer = styled.div`
//   form {
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//     margin: 0 auto;
//     max-width: 800px;
//     padding: 1rem;
//     width: 100%;
//     border: 1px solid var(--color-dark-blue);
//     border-radius: 0.5rem;
//     background-color: var(--color-dark-blue);
//     box-shadow: 0 0 0.5rem var(--color-dark-blue);
//     padding: 1rem 2rem;
//     transition: 0.2s ease-in-out;
//   }

//   h1 {
//     display: flex;
//     justify-content: center;
//     margin: 0 1rem 0.5rem 1rem;
//     color: var(--color-yellow);
//     text-shadow: 0.1rem 0.1rem 0.25rem var(--color-bg);
//     font-size: 1.8rem;
//     font-family: montserrat;
//   }

//   h2 {
//     display: flex;
//     justify-content: center;
//     margin: 0 0 0.5rem 0;
//     color: var(--color-yellow);
//     text-shadow: 0.1rem 0.1rem 0.25rem var(--color-bg);
//     font-size: 1.2rem;
//     font-family: montserrat;
//   }

//   comment__form {
//     width: 600px;
//     // display: flex;
//     // flex-direction: column;
//     // justify-content: center;
//   }

//   textarea {
//     resize: none;
//     margin: 0.5rem 0;
//     padding: 0.5rem;
//     color: var(--color-dark-blue);
//     font-size: 1rem;
//     font-family: montserrat;
//     border: 1px solid var(--color-light-blue);
//     border-radius: 0.5rem;
//     background-color: var(--color-light-blue);
//     box-shadow: 0 0 0.5rem var(--color-dark-blue);
//     transition: 0.2s ease-in-out;
//   }

//   textarea::-webkit-scrollbar {
//     width:0;
//   }

//   button {
//     margin: 0.5rem 0;
//     padding: 0.5rem;
//     color: var(--color-yellow);
//     text-shadow: 0.1rem 0.1rem 0.25rem var(--color-bg);
//     font-weight: bold;
//     font-size: 1.2rem;
//     border: 1px solid var(--color-light-blue);
//     border-radius: 0.5rem;
//     background-color: var(--color-light-blue);
//     box-shadow: 0 0 0.5rem var(--color-dark-blue);
//     transition: 0.2s ease-in-out;
//   }

//   button:hover {
//     margin: 0.5rem 0;
//     padding: 0.5rem;
//     color: var(--color-light-blue);
//     font-weight: bold;
//     font-size: 1.2rem;
//     border: 1px solid var(--color-yellow);
//     border-radius: 0.5rem;
//     background-color: var(--color-yellow);
//     box-shadow: 0.25rem 0.25rem 0.5rem var(--color-bg);
//     transition: 0.2s ease-in-out;
// `;

// function Comments({ projectId }) {
//   const [commentText, setCommentText] = useState("");
//   const [addComment, { error }] = useMutation(ADD_COMMENT);

//   // this is the data from the join button
//   const location = useLocation();
//   console.log("location",location)
//   const { loading, data } = useQuery(QUERY_SINGLE_PROJECT, {
//     // pass URL parameter
//     variables: { projectId: location.state.projects._id },
//   });

//   function handleCommentChange(event) {
//     const { name, value } = event.target;

//     if (name === "commentText" && value.length <= 280) {
//       setCommentText(value);
//     }
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const { data } = await addComment({
//         variables: {
//           projectId: location.state.projects._id,
//           commentText,
//           commentAuthor: Auth.getProfile().data.username,
//         },
//       });
//       // Handle submitting the comment to the server or state management system
//       setCommentText("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const renderComments = () => {
//     const comments = data?.project.comments || {};
//     let result = null;

//     if (comments.length > 0) {
//       result = comments.map((comment, i) => {
//         return (
//           <CommentBox>
//             <div key={i} className="comment-box__card">
//               <div className="explore__card__title">
//                 <h3 className="comment">{comment.commentText}</h3>
//               </div>
//               <div className="explore__card__content">
//                 <h4 className="project__author">
//                   {comment.commentAuthor} posted on {comment.createdAt} UTC.
//                 </h4>
//               </div>
//             </div>
//           </CommentBox>
//         );
//       });
//     }
//     return result;
//   };

//   return (
//     <CommentContainer>
//       <div className="comment__ctn">
//         <h1 className="comment__title">Comments</h1>
//         <h2 className="comment__disc">Join this discussion</h2>
//         <div>{renderComments()}</div>
//         <form className="comment__form" onSubmit={handleSubmit}>
//           <div className="comment__form-ctn">
//             <textarea
//               name="commentText"
//               placeholder="Add your comment..."
//               value={commentText}
//               className="comment__textarea"
//               style={{ width: "600px" }}
//               onChange={handleCommentChange}
//             ></textarea>
//           </div>

//           <div className="comment__btn">
//             <button className="comment__btn-btn" type="submit">
//               Post Comment
//             </button>
//           </div>
//         </form>
//       </div>
//     </CommentContainer>
//   );
// }
// export default Comments;

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "styled-components";

import { ADD_COMMENT } from "../../utils/mutations";
import { QUERY_SINGLE_PROJECT } from "../../utils/queries";
import Auth from "../../utils/auth";
import Profile from "./Profile";


function Comments({ projectId }) {
  const [commentText, setCommentText] = useState("");
  const [addComment, { error }] = useMutation(ADD_COMMENT);

  const { loading, data, refetch } = useQuery(QUERY_SINGLE_PROJECT, {
    variables: { projectId },
  });

  useEffect(() => {
    refetch();
  }, [projectId, refetch]);

  const handleCommentChange = (event) => {
    const { name, value } = event.target;

    if (name === "commentText" && value.length <= 280) {
      setCommentText(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addComment({
        variables: {
          projectId,
          commentText,
          commentAuthor: Auth.getProfile().data.username,
        },
      });
      setCommentText("");
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const renderComments = () => {
    const comments = data?.project.comments || [];
    return comments.map((comment, i) => (
      <div key={i}>
        <div className="flex flex-row gap-3 border border-secondary px-4 py-4 rounded-xl mb-4 justify-start">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary">
            <Profile />
          </div>
          <div className="flex flex-col justify-start">
            <h4 className="text-white text-sm opacity-50 flex flex-col justify-between">
              @{comment.commentAuthor}
            </h4>
            <h3 className="comment">{comment.commentText}</h3>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="relative px-8">
      <div className="sticky top-0 bg-gradient-to-b from-[#0A0A0B] py-8 z-50 backdrop-blur-sm">
        <h1 className="text-2xl font-semibold text-white">Comments</h1>
        <h2 className="text-sm text-white opacity-50">Join this discussion</h2>
      </div>
      <div className="overflow-scroll">
        {renderComments()}
      </div>
      <form className="mx-auto sticky bottom-0 bg-primary" onSubmit={handleSubmit}>
        <div className="sticky bottom-0">
          <textarea
            name="commentText"
            placeholder="Add your comment..."
            value={commentText}
            onChange={handleCommentChange}
            className="w-full bg-primary text-white border border-secondary rounded-xl p-4 mb-4 min-h-[6rem]"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-200 hover:bg-blue-500 absolute bottom-8 right-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Comments;