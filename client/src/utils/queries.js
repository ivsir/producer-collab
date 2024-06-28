import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      projects {
        _id
        projectTitle
        projectDescription
        projectImage
        projectAudio
        createdAt
      }
    }
  }
`;

export const QUERY_PROJECTS = gql`
  query getProjects {
    projects {
      _id
      projectTitle
      projectDescription
      projectImage
      projectAuthor
      projectAudio
      createdAt
      comments {
        _id
        commentText
        commentAuthor
        createdAt
      }
      projectMembers {
        _id
        memberUsername
        memberId
      }
    }
  }
`;

export const QUERY_SINGLE_PROJECT = gql`
  query getSingleProject($projectId: ID!) {
    project(projectId: $projectId) {
      _id
      projectTitle
      projectDescription
      projectImage
      projectAuthor
      projectAudio
      createdAt
      comments {
        _id
        commentText
        commentAuthor
        createdAt
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      projects {
        _id
        projectTitle
        projectText
        projectImage
        projectAudio
        projectAuthor
        createdAt
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment($projectId: ID!, $commentText: String!, $commentAuthor: String!) {
    addComment(projectId: $projectId, commentText: $commentText, commentAuthor: $commentAuthor) {
      _id
      commentText
      commentAuthor
      createdAt
    }
  }
`;