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
import ExploreCard from "./components/accountBox/ExploreCard";
import About from "./components/accountBox/About";
import ProfileCard from "./components/accountBox/ProfileCard";
import ProjectForm from "./components/accountBox/ProjectForm";
import SingleProject from "./components/accountBox/SingleProject";
import Comments from "./components/accountBox/Comments";
import SideNav from "./components/accountBox/SideNav";
import Profile from "./components/accountBox/Profile";


const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
  // uri: "https://hhixki9fn4.execute-api.us-west-1.amazonaws.com/dev/graphql",
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
        {/* <div className="glow-container">
          <div className="ball"></div>
          <div className="ball" style={{ animationDelay: '-12s', transform: 'scale(0.35)', animationDuration: '25s' }}></div>
          <div className="ball" style={{ animationDelay: '-10s', transform: 'scale(0.3)', animationDuration: '15s' }}></div>
        </div> */}
      <Nav />
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={<div>{<AccountBox />}</div>}
          />
          <Route
            path="/home"
            element={
              <div className="flex flex-row w-full max-w-[80rem] mx-auto h-auto relative">
                <SideNav />
                <ExploreCard
                  key={ExploreCard.id}
                  projectTitle={ExploreCard.projectTitle}
                  projectAuthor={ExploreCard.projectAuthor}
                />
              </div>
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/profile"
            element={
              <div className="flex flex-row w-full max-w-[80rem] mx-auto h-auto relative">
                <SideNav />
                <Profile
                  key={ProfileCard.id}
                  projectTitle={ProfileCard.projectTitle}
                  projectDescription={ProfileCard.projectDescription}
                />
              </div>
            }
          />
          <Route
            path="/projectform"
            element={
              <div className="flex flex-row w-full max-w-[80rem] mx-auto h-auto relative">
                <SideNav />
                <ProjectForm
                  key={ProjectForm.id}
                  projectTitle={ProjectForm.projectTitle}
                  projectDescription={ProjectForm.projectDescription}
                />
              </div>
            }
          />
          <Route
            path="projects/:projectId"
            element={
              <div className="flex flex-row w-full max-w-[80rem] mx-auto h-auto relative">
                <SideNav />
                <SingleProject
                  key={SingleProject.id}
                  projectTitle={SingleProject.projectTitle}
                  projectDescription={SingleProject.projectDescription}
                />
              </div>
            }
          />
          <Route
            path="/comments"
            element={
              <div className="flex flex-row w-full max-w-[80rem] mx-auto h-auto relative">
                <SideNav />
                <Comments />
              </div>
            }
          />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}
export default App;