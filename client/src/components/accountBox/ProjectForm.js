import React, { useState, useEffect, useRef } from "react";
// import { Button, Input, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT } from "../../utils/mutations";
import imgMutation from "../../utils/imgMutation";
import audioMutation from "../../utils/audioMutation";
import Auth from "../../utils/auth";
import UploadIcon from "../../assets/images/Upload.png";
import InputField from "../elements/InputField";



const validFileTypes = ["image/jpg", "image/jpeg", "image/png"];
const validAudioTypes = ["audio/mpeg", "audio/wav", "audio/ogg"];

// const URL = "/images";
// const audioURL = "/audiofiles";

const URL = "/upload-image"
const audioURL = "/upload-audio"


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

const ErrorText = ({ error }) => {
  if (error) {
    return (
      <h2 fontSize="lg" color="red.300">
        {error}
      </h2>
    );
  }
  return null;
};

const ProjectForm = () => {
  const [imgError, setImgError] = useState("");
  const [audioError, setAudioError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [projectImage, setProjectImage] = useState("");
  const [projectAudio, setProjectAudio] = useState("");
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const userId = Auth.getProfile().data.username;
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);

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
    fileInputRef.current.click();
  };

  const handleUploadAudio = () => {
    audioInputRef.current.click();
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
      setImgError("");
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
    if (file.size > MAX_FILE_SIZE) {
      setImgError("File size exceeds 10 MB");
      return;
    }

    if (!validFileTypes.includes(file.type)) {
      setImgError("File must be in JPG/PNG format");
      return;
    }

    const form = new FormData();
    form.append("image", file);

    try {
      await uploadImage(form);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleAudioUpload = async (file) => {
    if (file.size > MAX_FILE_SIZE) {
      setAudioError("File size exceeds 10 MB");
      return;
    }

    if (!validAudioTypes.includes(file.type)) {
      setAudioError("File must be in MP3/WAV format");
      return;
    }

    const form = new FormData();
    form.append("audio", file);

    try {
      await uploadAudio(form);
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedAudio(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDropImage = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDropAudio = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
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

  const [showAsterisk, setShowAsterisk] = useState(true);

  return (
    <div className="inlin-flex flex-col w-full max-w-[45rem] h-auto bg-primary border border-primary rounded-2xl p-8 my-12">
        <h1 className="text-3xl font-semibold mb-1">Upload Track</h1>
        <h2 className="text-white text-opacity-50 text-sm mb-16">Enter your track details below to upload</h2>
        {Auth.loggedIn() ? (
          <form className="flex flex-col h-auto" onSubmit={handleFormSubmit}>
            <div className="flex flex-row gap-4 mb-16 justify-between w-full">
              
              <div className="flex flex-col w-full">
                <h2 className="text-sm mb-2">
                Covert Art <span className="text-white opacity-50">(.png, .jpg)</span>
                </h2>
                <div
                  onDrop={handleDropImage}
                  onDragOver={handleDragOver}
                  className="flex flex-col justify-center items-center border-dashed border-2 border-secondary rounded-2xl overflow-hidden">
                  <div className="flex justify-end border-b w-full h-full border-secondary bg-secondary">
                    <svg width="100%" height="100%" viewBox="0 0 280 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_745_2745)">
                      <path d="M146.624 75.1166L114.596 130.523C112.283 134.523 115.205 139.5 119.865 139.5H183.921C188.582 139.5 191.504 134.523 189.191 130.523L157.163 75.1166C154.833 71.0857 148.954 71.0857 146.624 75.1166Z" fill="rgba(255,255,255,0.2)"/>
                      <path d="M110.329 104.141L90.9323 134.82C88.4057 138.816 91.312 144 96.0793 144H134.873C139.64 144 142.547 138.816 140.02 134.82L120.623 104.141C118.246 100.381 112.706 100.381 110.329 104.141Z" fill="#A3A3A3"/>
                      <path d="M127.615 66C127.615 72.6274 122.18 78 115.476 78C108.772 78 103.337 72.6274 103.337 66C103.337 59.3726 108.772 54 115.476 54C122.18 54 127.615 59.3726 127.615 66Z" fill="rgba(255,255,255,0.8)"/>
                      </g>
                      <defs>
                      <clipPath id="clip0_745_2745">
                      <rect width="280" height="128" fill="white"/>
                      </clipPath>
                      </defs>
                    </svg>
                  </div>

                  <button
                    className="flex flex-col justify-center items-center gap-4 p-8 opacity-50 hover:opacity-100 transition-all ease-out 120ms"
                    isLoading={uploading}
                    onClick={handleUploadImage}
                    type="button"

                    >
                    Upload Image or Drag & Drop
                    <img width={32} src={UploadIcon}/>
                    <div className="flex flex-row justify-center items-center gap-2 text-sm">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.33325 9.99998H8.66659V11.3333H7.33325V9.99998ZM7.33325 4.66665H8.66659V8.66665H7.33325V4.66665ZM7.99325 1.33331C4.31325 1.33331 1.33325 4.31998 1.33325 7.99998C1.33325 11.68 4.31325 14.6666 7.99325 14.6666C11.6799 14.6666 14.6666 11.68 14.6666 7.99998C14.6666 4.31998 11.6799 1.33331 7.99325 1.33331ZM7.99992 13.3333C5.05325 13.3333 2.66659 10.9466 2.66659 7.99998C2.66659 5.05331 5.05325 2.66665 7.99992 2.66665C10.9466 2.66665 13.3333 5.05331 13.3333 7.99998C13.3333 10.9466 10.9466 13.3333 7.99992 13.3333Z" fill="currentColor"/>
                      </svg>
                      Max file size: 50 MB
                    </div>
                  </button>
                  <input id="imageInput" type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
                  {selectedFile && <h2 className="bg-tertiary px-4 py-2 rounded-lg text-white text-xs mb-6">{selectedFile.name} ✅</h2>}
                </div>
                <ErrorText error={uploadError && uploadError.message} />
              </div>
              
              <div className="flex flex-col w-full">
                <h2 className="text-sm mb-2">
                Audio File <span className="text-white opacity-50">(.mp3, .wav)</span>
                </h2>
              <div
                onDrop={handleDropAudio}
                onDragOver={handleDragOver}
                className="flex flex-col justify-center items-center border-dashed border-2 border-secondary rounded-2xl overflow-hidden">
                
                <div className="flex justify-end border-b w-full h-full border-secondary bg-secondary">
                  <svg width="100%" height="100%" viewBox="0 0 280 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_750_2748)">
                    <rect x="75.1965" y="89.3712" width="14.9345" height="70.7424" rx="7.46725" fill="#464647"/>
                    <rect x="98.1311" y="54" width="14.9345" height="141.485" rx="7.46725" fill="#464647"/>
                    <rect x="121.065" y="77.5808" width="14.9345" height="94.3232" rx="7.46725" fill="#D4D4D8"/>
                    <rect x="144" y="89.3712" width="14.9345" height="70.7424" rx="7.46725" fill="#8C8C8C"/>
                    <rect x="166.935" y="93.3013" width="14.9345" height="62.8821" rx="7.46725" fill="#8C8C8C"/>
                    <rect x="189.869" y="82.2969" width="14.9345" height="84.8908" rx="7.46725" fill="#8C8C8C"/>
                    </g>
                  </svg>
                </div>

                <button
                  className="flex flex-col justify-center items-center gap-4 p-8 opacity-50 hover:opacity-100 transition-all ease-out 120ms"
                  isLoading={uploading}
                  onClick={handleUploadAudio}
                  type="button"
                  >
                  Upload Audio or Drag & Drop
                  <img width={32} src={UploadIcon}/>
                  <div className="flex flex-row justify-center items-center gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.33325 9.99998H8.66659V11.3333H7.33325V9.99998ZM7.33325 4.66665H8.66659V8.66665H7.33325V4.66665ZM7.99325 1.33331C4.31325 1.33331 1.33325 4.31998 1.33325 7.99998C1.33325 11.68 4.31325 14.6666 7.99325 14.6666C11.6799 14.6666 14.6666 11.68 14.6666 7.99998C14.6666 4.31998 11.6799 1.33331 7.99325 1.33331ZM7.99992 13.3333C5.05325 13.3333 2.66659 10.9466 2.66659 7.99998C2.66659 5.05331 5.05325 2.66665 7.99992 2.66665C10.9466 2.66665 13.3333 5.05331 13.3333 7.99998C13.3333 10.9466 10.9466 13.3333 7.99992 13.3333Z" fill="currentColor"/>
                    </svg>
                    Max file size: 50 MB
                  </div>
                </button>
                <input id="audioInput" type="file" ref={audioInputRef} hidden onChange={handleAudioChange} />
                {selectedAudio && <h2 className="bg-tertiary px-4 py-2 rounded-lg text-white text-xs mb-6">{selectedAudio.name} ✅</h2>}
              </div>
              <ErrorText error={uploadAudioError && uploadAudioError.message} />
            
              
              </div>
            </div>
            
            {/* Title and Description Input */}
            <div className="flex flex-col">
              <InputField
                name="projectTitle"
                placeholder="Title"
                value={projectTitle}
                style={{ lineHeight: "1.5", resize: "vertical" }}
                onChange={handleChange}
              />

              {/* Text Area (Make into component later) */}
              <div className="relative">
                <textarea
                  name="projectDescription"
                  placeholder="Project Description..."
                  value={projectDescription}
                  className="bg-secondary border border-secondary placeholder:opacity-50 text-white p-4 w-full rounded-xl resize-y mb-4"                onChange={handleChange}
                  onFocus={() => setShowAsterisk(false)}
                  onBlur={() => setShowAsterisk(true)}
                >
                </textarea>
                {showAsterisk && (
                  <span className="absolute right-3 top-5 transform -translate-y-1/2 text-red-500">*</span>
                )}
              </div>

            </div>
            
            <button className="bg-blue-600 w-full py-2 rounded-lg disabled:bg-secondary" type="submit" disabled={uploading}>
              Upload Track
            </button>
            {error && (
              <div className="col-12 my-3 bg-danger text-white p-3 error-message">
                {error.message}
              </div>
            )}
          </form>
        ) : (
          <p>
            You need to be logged in to share your projects. Please <Link to="/login">login</Link> or{" "}
            <Link to="/signup">signup</Link>.
          </p>
        )}
    </div>
  );
};

export default ProjectForm;
