
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { ADD_COMMENT } from "../../utils/mutations";
import { QUERY_SINGLE_PROJECT } from "../../utils/queries";
import Auth from "../../utils/auth";
import Profile from "./Profile"

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
            <Profile/>
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
    <div className="relative px-8 border border-primary rounded-xl">
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
