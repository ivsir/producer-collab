// const { gql } = require("apollo-server-express");
const { gql } = require("apollo-server-lambda");


const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    projects: [Project]
  }

  type Project {
    _id: ID
    projectTitle: String!
    projectDescription: String!
    projectImage: String!
    projectAudio: String
    projectAuthor: String
    projectMembers: [Member]
    createdAt: String
    comments: [Comment]
    likes: [Likes]
  }

  type Comment {
    _id: ID
    commentText: String!
    commentAuthor: String!
    createdAt: String!
  }

  type Likes {
    _id: ID
    userId: ID!
    username: String!
  }

  type Member {
    _id: ID
    memberUsername: String
    memberId: ID
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String): User
    projects(username: String): [Project]
    project(projectId: ID): Project
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    removeUser(email: String!, password: String!): Auth
    addFolder(userId: ID!, folderName: String!): User
    login(email: String!, password: String!): Auth
    addMember(projectId: ID!, memberId: ID!): Project
    addProject(
      projectTitle: String!
      projectDescription: String!
      projectImage: String!
      projectAudio: String
    ): Project
    addComment(
      projectId: ID!
      commentText: String!
      commentAuthor: String!
    ): Project
    addLike(projectId: ID!): Project
    removeLike(projectId: ID!): Project
    removeProject(projectId: ID!): Project
    removeComment(projectId: ID!, commentId: ID!): Project
  }
`;

module.exports = typeDefs;
