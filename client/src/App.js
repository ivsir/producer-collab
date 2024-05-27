import React from "react";
import Nav from "./components/Nav";
import AccountBox from "./components/accountBox";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import theme from "./config/theme";
import ExploreCard from "./components/accountBox/ExploreCard";
import About from "./components/accountBox/About";
import ProfileCard from "./components/accountBox/ProfileCard";
import ProjectForm from "./components/accountBox/ProjectForm";
import SingleProject from "./components/accountBox/SingleProject";
import Comments from "./components/accountBox/Comment";
import SideNav from "./components/accountBox/SideNav";

import { AppContainer, Container } from "./components/accountBox/Common";
import Profile from "./components/accountBox/Profile";

const httpLink = createHttpLink({
  uri: "/graphql",
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Nav />
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={<AppContainer>{<AccountBox />}</AppContainer>}
          />
          <Route
            path="/explore"
            element={
              <Container>
                <SideNav />
                <ExploreCard
                  key={ExploreCard.id}
                  projectTitle={ExploreCard.projectTitle}
                  projectAuthor={ExploreCard.projectAuthor}
                />
              </Container>
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/profile"
            element={
              <Container>
                <SideNav />
                <Profile
                  key={ProfileCard.id}
                  projectTitle={ProfileCard.projectTitle}
                  projectDescription={ProfileCard.projectDescription}
                />
              </Container>
            }
          />
          <Route
            path="/projectform"
            element={
              <Container>
                <SideNav />
                <ProjectForm
                  key={ProjectForm.id}
                  projectTitle={ProjectForm.projectTitle}
                  projectDescription={ProjectForm.projectDescription}
                />
              </Container>
            }
          />
          <Route
            path="projects/:projectId"
            element={
              <Container>
                <SideNav />
                <SingleProject
                  key={SingleProject.id}
                  projectTitle={SingleProject.projectTitle}
                  projectDescription={SingleProject.projectDescription}
                />
              </Container>
            }
          />
          <Route
            path="/comments"
            element={
              <Container>
                <SideNav />
                <Comments />
              </Container>
            }
          />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}
export default App;
