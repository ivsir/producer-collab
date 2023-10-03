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

// export const ADD_FOLDER = gql`
//   mutation addFolder($userId: ID!, $folderName: String) {
//     addFolder(userId: $userId, folderName: $folderName) {
//       userId
//       folderName
//       user {
//         _id
//         username
//       }
//     }
//   }
// `;

export const ADD_PROJECT = gql`
  mutation addProject($projectTitle: String!, $projectDescription: String!) {
    addProject(
      projectTitle: $projectTitle
      projectDescription: $projectDescription
    ) {
      _id
      projectTitle
      projectDescription
      projectAuthor
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
