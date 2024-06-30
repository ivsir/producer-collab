import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


export const ADD_PROJECT = gql`
  mutation addProject($projectTitle: String!, $projectDescription: String!, $projectImage: String!, $projectAudio: String!) {
    addProject(
      projectTitle: $projectTitle
      projectDescription: $projectDescription
      projectImage: $projectImage
      projectAudio: $projectAudio
    ) {
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
      }
    }
  }
`;

export const ADD_MEMBER = gql`
  mutation AddMember($projectId: ID!, $memberId: ID!) {
    addMember(projectId: $projectId, memberId: $memberId) {
      _id
      createdAt
      projectAuthor
      projectDescription
      projectImage
      projectAudio
      projectMembers {
        _id
        memberUsername
      }
      projectTitle
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment(
    $projectId: ID!
    $commentText: String!
    $commentAuthor: String!
  ) {
    addComment(
      projectId: $projectId
      commentText: $commentText
      commentAuthor: $commentAuthor
    ) {
      _id
      createdAt
      projectAuthor
      projectDescription
      projectTitle
      projectImage
      projectAudio
      projectMembers {
        _id
        memberUsername
      }
      comments {
        _id
        commentAuthor
        commentText
        createdAt
      }
    }
  }
`;

export const ADD_LIKE = gql`
  mutation addLike($projectId: ID!) {
    addLike(projectId: $projectId) {
      _id
      likes {
        _id
        userId
        username
      }
    }
  }
`;


export const REMOVE_LIKE = gql`
  mutation removeLike($projectId: ID!) {
    removeLike(projectId: $projectId) {
      _id
      likes {
        _id
        userId
        username
      }
    }
  }
`;