import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT } from "../../utils/mutations";
import imgMutation from "../../utils/imgMutation";
import audioMutation from "../../utils/audioMutation";
import Auth from "../../utils/auth";

const validFileTypes = ["image/jpg", "image/jpeg", "image/png"];
const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];
// const URL = "/upload-image";
// const audioURL = "/upload-audio";
const URL = "/images"
const audioURL = "/audiofiles"

const ErrorText = ({ error }) => {
  if (error) {
    return (
      <Text fontSize="lg" color="red.300">
        {error}
      </Text>
    );
  }
  return null;
};

const ProjectForm = () => {
  const [imgError, setImgError] = useState("");
  const [audioError, setAudioError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [projectImage, setProjectImage] = useState(""); // Keep track of the projectImage
  const [projectAudio, setProjectAudio] = useState(""); // Keep track of the projectImage
  const [uploadCompleted, setUploadCompleted] = useState(false); // Track image upload completion
  const userId = Auth.getProfile().data.username;
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null); // New state variable to track the selected file
  const [selectedAudio, setSelectedAudio] = useState(null); // New state variable to track the selected file

  const { mutate: uploadImage, error: uploadError, responseData: imageResponse } = imgMutation({ url: URL }, userId);
  const { mutate: uploadAudio, error: uploadAudioError, responseData: audioResponse } = audioMutation({ url: audioURL }, userId);

  const [addProject, { error }] = useMutation(ADD_PROJECT);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  useEffect(() => {
    if (imageResponse && imageResponse.key && audioResponse && audioResponse.key && !uploadCompleted) {
      setProjectImage(imageResponse.key);
      setProjectAudio(audioResponse.key);
      setUploadCompleted(true);
    }
  }, [imageResponse, audioResponse, uploadCompleted]);

  useEffect(() => {
    if (uploadCompleted) {
      addProjectLink();
    }
  }, [uploadCompleted]);

  const handleUploadImage = () => {
    fileInputRef.current.click(); // Trigger the click event on the file input element
  };

  const handleUploadAudio = () => {
    audioInputRef.current.click(); // Trigger the click event on the file input element
  };

  const addProjectLink = async () => {
    try {
      await addProject({
        variables: {
          projectTitle,
          projectDescription,
          projectImage,
          projectAudio,
          projectAuthor: userId,
        },
      });

      setProjectTitle("");
      setProjectDescription("");
      setProjectImage("");
      setProjectAudio("");
      window.location.assign("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !selectedAudio) {
      console.error("Both image and audio files must be selected");
      return;
    }

    if (!projectTitle || !projectDescription) {
      console.error("Title and description cannot be empty");
      return;
    }

    try {
      setImgError(""); // Clear any previous error messages
      setAudioError("");
      fileInputRef.current.value = "";
      audioInputRef.current.value = "";

      await uploadProject(selectedFile, selectedAudio);
    } catch (err) {
      console.error(err);
    }
  };

  const uploadProject = async (file, audioFile) => {
    try {
      setUploading(true);
      await handleUpload(file);
      await handleAudioUpload(audioFile);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (file) => {
    if (!validFileTypes.includes(file.type)) {
      setImgError("File must be in JPG/PNG format");
      return;
    }

    const form = new FormData();
    form.append("image", file);

    try {
      await uploadImage(form);
    } catch (error) {
      console.error("Error uploading image to S3:", error);
    }
  };

  const handleAudioUpload = async (file) => {
    if (!validAudioTypes.includes(file.type)) {
      setAudioError("File must be in MP3/WAV format");
      return;
    }

    const form = new FormData();
    form.append("audio", file);

    try {
      await uploadAudio(form);
    } catch (error) {
      console.error("Error uploading audio to S3:", error);
    }
  };

  const handleFileChange = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAudioChange = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files[0];
    if (file) {
      setSelectedAudio(file);
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
    <div>
      <div className="top-container">
        <h1>What do you want to create?</h1>
        {Auth.loggedIn() ? (
          <form className="flex-row justify-center justify-space-between-md align-center box" onSubmit={handleFormSubmit}>
            <button>
              <Button
                className="submitButton"
                as="label"
                colorScheme="blue"
                color="white"
                variant="outline"
                mb={4}
                cursor="pointer"
                isLoading={uploading}
                onClick={handleUploadImage}
                type="button"
              >
                Upload Image
              </Button>
              <Input
                id="imageInput"
                type="file"
                ref={fileInputRef}
                hidden
                onChange={handleFileChange}
              />
            </button>
            <ErrorText error={uploadError && uploadError.message} />
            <button>
              <Button
                className="submitButton"
                as="label"
                colorScheme="blue"
                color="white"
                variant="outline"
                mb={4}
                cursor="pointer"
                isLoading={uploading}
                onClick={handleUploadAudio}
                type="button"
              >
                Upload Audio
              </Button>
              <Input
                id="audioInput"
                type="file"
                ref={audioInputRef}
                hidden
                onChange={handleAudioChange}
              />
            </button>
            <ErrorText error={uploadAudioError && uploadAudioError.message} />
            <div className="col-lg-9 textarea-div">
              <textarea
                className="first-textarea text-black"
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
                className="form-input w-100 text-black"
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-12 col-lg-3 button-container">
              <button className="btn btn-primary btn-block py-3" type="submit" disabled={uploading}>
                Add Project
              </button>
            </div>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3 error-message">
                {error.message}
              </div>
            )}
          </form>
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
    </div>
  );
};

export default ProjectForm;
