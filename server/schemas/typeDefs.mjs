// const { gql } = require("apollo-server-express");
import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    projects: [Project]
    # folderName: String!
  }

  type Project {
    _id: ID
    projectTitle: String!
    projectDescription: String
    projectAuthor: String
    projectMembers: [Member]
    createdAt: String
    comments: [Comment]
  }

  type Comment {
    _id: ID
    commentText: String!
    commentAuthor: String!
    createdAt: String!
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
    addFolder(userId: ID!, folderName: String!): User
    login(email: String!, password: String!): Auth
    addMember(projectId: ID!, memberId: ID!): Project
    addProject(projectTitle: String!, projectDescription: String!): Project
    addComment(
      projectId: ID!
      commentText: String!
      commentAuthor: String!
    ): Project
    removeProject(projectId: ID!): Project
    removeComment(projectId: ID!, commentId: ID!): Project
  }
`;

export default typeDefs;
