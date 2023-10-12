import {
  Box,
  Button,
  CircularProgress,
  Image,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { UploadButton } from "./Common";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT } from "../../utils/mutations";
import imgMutation from "../../utils/imgMutation";

import { FormContainer } from "./Common";
import Auth from "../../utils/auth";

const validFileTypes = ["image/jpg", "image/jpeg", "image/png"];

const URL = "/images";
// const ErrorText = ({ children, ...props }) => (
//   <Text fontSize="lg" color="red.300" {...props}>
//     {children}
//   </Text>
// );
const ErrorText = ({ error }) => {
  if (error) {
    return (
      <Text fontSize="lg" color="red.300">
        {error}
      </Text>
    );
  }
  return null; // Return null when there is no error
};

const ProjectForm = () => {
  // Handles Image
  const [refetch, setRefetch] = useState(0);
  const [imgError, setImgError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [projectImage, setProjectImage] = useState("");


  const userId = Auth.getProfile().data.username; // Adjust this line based on your Auth implementation
  const {
    mutate: uploadImage,
    responseData: imageKeyResponse,
    // isLoading: uploading,

    error: uploadError,
  } = imgMutation({ url: URL }, userId);

  const handleUpload = async (file) => {
    // setImgError("");
    if (!validFileTypes.find((type) => type === file.type)) {
      setImgError("File must be in JPG/PNG format");
      return;
    }

    const form = new FormData();
    form.append("image", file);
    
    console.log(form);
    try {
      const data = await uploadImage(form);

      if (imageKeyResponse && imageKeyResponse.key) {
        setProjectImage(imageKeyResponse.key);
      }

  
      setTimeout(() => {
        setRefetch((s) => s + 1);
      }, 1000);
    } catch (error) {
      console.error("Error uploading image to S3:", error);
    }
  };

  const [addProject, { error }] = useMutation(ADD_PROJECT, {
    update(cache, { data: { addProject } }) {
      try {
      } catch (e) {
        console.error(e);
      }
    },
  });

  // Handles Project information
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const file = document.getElementById("imageInput").files[0];

      if (!file) {
        // Handle the case where no image is selected (optional)
        console.error("No image selected");
        return;
      }

      // Check if title and description are not empty
      if (!projectTitle || !projectDescription) {
        console.error("Title and description cannot be empty");
        return;
      }

      if (file) {
        // If a file is selected, upload it
        setUploading(true);
        await handleUpload(file);
        setUploading(false);
      }
      console.log("projectImage", projectImage);
      const {
        data
      } = await addProject({
        variables: {
          projectTitle,
          projectDescription,
          projectImage, // Use responseData.key,
          projectAuthor: Auth.getProfile().data.username,
        },
      });
      setProjectTitle("");
      setProjectDescription("");
      setProjectImage("");
      window.location.assign("/profile");
      console.log("success");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "projectTitle" && value.length <= 280) {
      setProjectTitle(value);
    }
    if (name === "projectDescription" && value.length <= 2000) {
      setProjectDescription(value);
    }
  };

  return (
    <FormContainer>
      <div className="top-container">
        <h1>What do you want to create?</h1>
        {Auth.loggedIn() ? (
          <>
            <form
              className="flex-row justify-center justify-space-between-md align-center box"
              onSubmit={handleFormSubmit}
            >
              <Input id="imageInput" type="file" hidden />
              <UploadButton>
                <Button
                  className="submitButton"
                  as="label"
                  htmlFor="imageInput"
                  colorScheme="blue"
                  color="white"
                  variant="outline"
                  mb={4}
                  cursor="pointer"
                  isLoading={uploading}
                >
                  Upload Image
                </Button>
              </UploadButton>
              {/* {error && <ErrorText>{error}</ErrorText>}
              {uploadError && <ErrorText>{uploadError}</ErrorText>} */}
              {/* <ErrorText error={error && error.message} /> */}
              <ErrorText error={uploadError && uploadError.message} />

              <div className=" col-lg-9 textarea-div">
                <textarea
                  className="first-textarea"
                  name="projectTitle"
                  placeholder="Project Title..."
                  value={projectTitle}
                  style={{ lineHeight: "1.5", resize: "vertical" }}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="col-12 col-lg-9 textarea-div">
                <textarea
                  name="projectDescription"
                  placeholder="Project Description..."
                  value={projectDescription}
                  className="form-input w-100"
                  style={{ lineHeight: "1.5", resize: "vertical" }}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-12 col-lg-3 button-container">
                <button
                  className="btn btn-primary btn-block py-3"
                  type="submit"
                >
                  Add Project
                </button>
              </div>
              {error && (
                <div className="col-12 my-3 bg-danger text-white p-3 error-message">
                  {error.message}
                </div>
              )}
            </form>
          </>
        ) : (
          <p className="error-message">
            You need to be logged in to create a project. Please{" "}
            <Link className="error-login" to="/">
              login
            </Link>
            .
          </p>
        )}
      </div>
    </FormContainer>
  );
};

export default ProjectForm;
