// import React, { useState, useEffect } from "react";
// import { Box, Button, Input, Text } from "@chakra-ui/react";
// import { UploadButton } from "./Common";
// import { Link } from "react-router-dom";
// import { useMutation } from "@apollo/client";
// import { ADD_PROJECT } from "../../utils/mutations";
// import imgMutation from "../../utils/imgMutation";
// import { FormContainer } from "./Common";
// import Auth from "../../utils/auth";

// const validFileTypes = ["image/jpg", "image/jpeg", "image/png"];
// const URL = "/images";

// const ErrorText = ({ error }) => {
//   if (error) {
//     return (
//       <Text fontSize="lg" color="red.300">
//         {error}
//       </Text>
//     );
//   }
//   return null; // Return null when there is no error
// };

// const ProjectForm = () => {
//   const [imgError, setImgError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [projectImage, setProjectImage] = useState(""); // Keep track of the projectImage
//   const userId = Auth.getProfile().data.username;

//   const {
//     mutate: uploadImage,
//     error: uploadError,
//     responseData: imageResponse,
//   } = imgMutation({ url: URL }, userId);

//   const handleUpload = async (file) => {
//     if (!validFileTypes.includes(file.type)) {
//       setImgError("File must be in JPG/PNG format");
//       return;
//     }

//     const form = new FormData();
//     form.append("image", file);

//     try {
//       await uploadImage(form);
//     } catch (error) {
//       console.error("Error uploading image to S3:", error);
//     }
//   };

//   useEffect(() => {
//     if (imageResponse && imageResponse.key) {
//       setProjectImage(imageResponse.key);
//     }
//   }, [imageResponse]);

//   const [addProject, { error }] = useMutation(ADD_PROJECT);

//   const [projectTitle, setProjectTitle] = useState("");
//   const [projectDescription, setProjectDescription] = useState("");

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const file = document.getElementById("imageInput").files[0];

//       if (!file) {
//         // Handle the case where no image is selected (optional)
//         console.error("No image selected");
//         return;
//       }

//       // Check if title and description are not empty
//       if (!projectTitle || !projectDescription) {
//         console.error("Title and description cannot be empty");
//         return;
//       }

//       // If projectImage is not set, try to upload the image
//       if (!projectImage) {
//         // If a file is selected, upload it
//         setUploading(true);

//         await handleUpload(file);

//         // Handle the response to get the image key
//         if (imageResponse && imageResponse.key) {
//           setProjectImage(imageResponse.key);
//         }

//         setUploading(false);
//       }

//       // Add the project with the projectImage
//       const { data } = await addProject({
//         variables: {
//           projectTitle,
//           projectDescription,
//           projectImage,
//           projectAuthor: Auth.getProfile().data.username,
//         },
//       });

//       setProjectTitle("");
//       setProjectDescription("");
//       setProjectImage("");

//       // Redirect to the profile page
//       window.location.assign("/profile");
//     } catch (err) {
//       console.error(err);
//       setUploading(false); // Make sure to set uploading to false in case of errors
//     }
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     if (name === "projectTitle" && value.length <= 280) {
//       setProjectTitle(value);
//     }
//     if (name === "projectDescription" && value.length <= 2000) {
//       setProjectDescription(value);
//     }
//   };

//   return (
//     <FormContainer>
//       <div className="top-container">
//         <h1>What do you want to create?</h1>
//         {Auth.loggedIn() ? (
//           <>
//             <form
//               className="flex-row justify-center justify-space-between-md align-center box"
//               onSubmit={handleFormSubmit}
//             >
//               <UploadButton>
//                 <Button
//                   className="submitButton"
//                   as="label"
//                   htmlFor="imageInput"
//                   colorScheme="blue"
//                   color="white"
//                   variant="outline"
//                   mb={4}
//                   cursor="pointer"
//                   isLoading={uploading}
//                 >
//                   Upload Image
//                 </Button>
//                 <Input id="imageInput" type="file" hidden />
//               </UploadButton>
//               <ErrorText error={uploadError && uploadError.message} />

//               <div className=" col-lg-9 textarea-div">
//                 <textarea
//                   className="first-textarea"
//                   name="projectTitle"
//                   placeholder="Project Title..."
//                   value={projectTitle}
//                   style={{ lineHeight: "1.5", resize: "vertical" }}
//                   onChange={handleChange}
//                 ></textarea>
//               </div>
//               <div className="col-12 col-lg-9 textarea-div">
//                 <textarea
//                   name="projectDescription"
//                   placeholder="Project Description..."
//                   value={projectDescription}
//                   className="form-input w-100"
//                   style={{ lineHeight: "1.5", resize: "vertical" }}
//                   onChange={handleChange}
//                 ></textarea>
//               </div>

//               <div className="col-12 col-lg-3 button-container">
//                 <button
//                   className="btn btn-primary btn-block py-3"
//                   type="submit"
//                   disabled={uploading}
//                 >
//                   Add Project
//                 </button>
//               </div>
//               {error && (
//                 <div className="col-12 my-3 bg-danger text-white p-3 error-message">
//                   {error.message}
//                 </div>
//               )}
//             </form>
//           </>
//         ) : (
//           <p className="error-message">
//             You need to be logged in to create a project. Please{" "}
//             <Link className="error-login" to="/">
//               login
//             </Link>
//             .
//           </p>
//         )}
//       </div>
//     </FormContainer>
//   );
// };

// export default ProjectForm;
import React, { useState, useEffect } from "react";
import { Box, Button, Input, Text } from "@chakra-ui/react";
import { UploadButton } from "./Common";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT } from "../../utils/mutations";
import imgMutation from "../../utils/imgMutation";
import { FormContainer } from "./Common";
import Auth from "../../utils/auth";

const validFileTypes = ["image/jpg", "image/jpeg", "image/png"];
const URL = "/images";

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
  const [imgError, setImgError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [projectImage, setProjectImage] = useState(""); // Keep track of the projectImage

  const userId = Auth.getProfile().data.username;

  const {
    mutate: uploadImage,
    error: uploadError,
    responseData: imageResponse,
  } = imgMutation({ url: URL }, userId);

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

  console.log(imageResponse);

  const [addProject, { error }] = useMutation(ADD_PROJECT);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  useEffect(() => {
    if (imageResponse && imageResponse.key) {
      setProjectImage(imageResponse.key);
    }
  }, [imageResponse]);

  console.log("projectimage", projectImage);

  const addProjectLink = async (link) => {
    try {
      await addProject({
        variables: {
          projectTitle,
          projectDescription,
          projectImage: link,
          projectAuthor: Auth.getProfile().data.username,
        },
      });

      console.log("projectimage2", projectImage);
      setProjectTitle("");
      setProjectDescription("");
      setProjectImage("");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (projectImage) {
    addProjectLink(imageResponse.key);
  }

  const uploadProject = async (file) => {
    try {
      if (!projectImage) {
        setUploading(true);
        await handleUpload(file);

        // Now, after the image upload, you can safely add the project.
      }

      console.log("projectimage 3", projectImage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const file = document.getElementById("imageInput").files[0];

      if (!file) {
        console.error("No image selected");
        return;
      }

      if (!projectTitle || !projectDescription) {
        console.error("Title and description cannot be empty");
        return;
      }

      await uploadProject(file);
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
                <Input id="imageInput" type="file" hidden />
              </UploadButton>
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
                  disabled={uploading}
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
