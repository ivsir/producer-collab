import React from "react";

import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import AuthService from "../../utils/auth";
import { useNavigate } from "react-router-dom";

import { QUERY_SINGLE_PROJECT } from "../../utils/queries";
import { ADD_MEMBER } from "../../utils/mutations";
import styled from "styled-components";

const SinglePostContainer = styled.div`
  .single-post-container {
    border: 1px solid var(--color-light-blue);
    border-radius: 5px;
    padding: 4rem;
    margin: 4rem;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  h2 {
    margin-left: 1rem;
    font-size: 1.5rem;
    font-family: montserrat;
    font-weight: bold;
    color: var(--color-yellow);
  }

  h3 {
    margin-left: 2rem;
    font-size: 1rem;
    font-weight: bold;
    color: var(--color-light-blue);
    font-style: italic;
    font-family: montserrat;
  }

  p {
    font-size: 2rem;
    color: var(--color-yellow);
  }

  .blockquote-container {
    flex: 1; /* set to 1 to fill remaining space */
    border: 1px solid var(--color-yellow);
    border-radius: 5px;
    padding: 1rem;
    margin: 1rem;
    background-color: var(--color-dark-blue);
    overflow: auto;
  }

  blockquote {
    font-size: 1rem;
    font-family: montserrat;
    color: var(--color-yellow);
    border: none;
    padding: 0.5rem;
    overflow: auto;
    max-height: 100%;
    white-space: pre-wrap;
    padding: 1rem;
  }

  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: montserrat;
    width: 200px;
    color: var(--color-dark-blue);
    font-size: 1.4rem;
    font-weight: bold;
    padding: 10px;
    padding-top: 7px;
    transition: 0.5s;
    cursor: pointer;
    border-radius: 0.5rem;
    border: none;
    background: var(--color-yellow);
    margin-top: 20px;
    margin-bottom: 25px;
    box-shadow: 0px 7px 0px 0px #cf920d;
  }

  button:hover {
    box-shadow: none;
    transform: translateY(5px);
    transition: all 0.1s linear;
  }

  button:focus {
    outline: none;
  }
  .link-button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    text-decoration: none;
    font-family: "Courier Prime", monospace;
  }
`;

const SingleProject = () => {
  const [member, { error, dataMember }] = useMutation(ADD_MEMBER);
  // Use `useParams()` to retrieve value of the route parameter `:profileId`
  const { projectId } = useParams();
  const navigate = useNavigate();

  const onJoin = async (event) => {
    event.preventDefault();
    const memberId = AuthService.getId();

    try {
      const { data } = await member({
        variables: {
          projectId: projectId,
          memberId: memberId,
        },
      });
      console.log(project);
      navigate("/comments", {
        state: {
          projectId: projectId,
          memberId: memberId,
          projects: project,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { loading, data } = useQuery(QUERY_SINGLE_PROJECT, {
    // pass URL parameter
    variables: { projectId: projectId },
  });

  // console.log(data);
  const project = data?.project || {};

  // console.log(project);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <SinglePostContainer>
      <div className="my-3 single-post-container">
        <h2 className="card-header bg-dark text-light p-2 m-0">
          {project.projectTitle} <br />
        </h2>
        <h3 className="card-header bg-dark text-light p-2 m-0">
          {project.projectAuthor} created this project on {project.createdAt}
        </h3>
        <div className="bg-light py-4 blockquote-container">
          <blockquote
            className="p-4"
            style={{
              fontSize: "1.5rem",
              fontStyle: "italic",
              lineHeight: "1.5",
              overflow: "auto",
            }}
          >
            {project.projectDescription}
          </blockquote>
        </div>
      </div>
      <div className="link-button-wrapper">
        <button onClick={onJoin} className="profile-button content">
          Join project
        </button>
      </div>
    </SinglePostContainer>
  );
};

export default SingleProject;
