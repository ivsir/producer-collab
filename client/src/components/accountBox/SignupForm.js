// import { useState, useContext } from "react";
// import { Link } from "react-router-dom";
// import { useMutation } from "@apollo/client";
// import { ADD_USER } from "../../utils/mutations";
// import AuthService from "../../utils/auth";
// import axios from "axios";
// import { AccountContext } from "../../components/accountBox/AccountContext";
// import InputField from "../elements/InputField";

// const baseURL =
//   process.env.REACT_APP_API_URL || "https://hhixki9fn4.execute-api.us-west-1.amazonaws.com/dev";
//   // process.env.REACT_APP_API_URL || "http://localhost:3001";
//   // process.env.REACT_APP_API_URL || "http://localhost:4001/dev";

// export function SignupForm() {
//   const [formState, setFormState] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });

//   const [addUser] = useMutation(ADD_USER);

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormState({
//       ...formState,
//       [name]: value,
//     });
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const { data } = await addUser({
//         variables: { ...formState },
//       });

//       const userId = data.addUser.user.username;

//       const response = await axios.post(`${baseURL}/create-s3-folder`, {
//         userId,
//         headers: {
//           "x-user-id": userId,
//         },
//       });
//       if (response.status === 200) {
//         AuthService.login(data.addUser.token);
//       } else {
//         console.error("Failed to create folder:", response.data.error);
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const { switchToSignin } = useContext(AccountContext);

//   return (
//     <div>
//       <form className="flex flex-row w-full justify-between" id="signup-container" onSubmit={handleFormSubmit}>
//         <div className="flex flex-col justify-end items-start mb-1">
//             Already have an account?{" "}
//             <div className="flex flex-row gap-2 text-gray-500 text-sm">
//               <Link className="hover:text-white" id="bold" to="#" onClick={switchToSignin}>
//                 Sign In
//               </Link>
//               |
//               <Link className="hover:text-white" id="bold" to="#">
//                 Forgot my password
//               </Link>
//             </div>
//         </div>
//         <div className="flex flex-col">
//           <InputField
//             id="signup-input1"
//             type="text"
//             placeholder="Username"
//             label="Please enter your username"
//             name="username"
//             value={formState.username}
//             onChange={handleChange}
//           />
//           <InputField
//             id="signup-input2"
//             type="email"
//             placeholder="Email"
//             label="Please enter your emaiil"
//             name="email"
//             value={formState.email}
//             onChange={handleChange}
//           />
//           <InputField
//             id="signup-input3"
//             type="password"
//             variant="password"
//             label="Please enter your password"
//             placeholder="Password"
//             name="password"
//             value={formState.password}
//             onChange={handleChange}
//           />
//           <button id="signup-button" type="submit" className="bg-blue-600 w-full py-2 rounded-lg">
//             Sign Up
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";
import { QUERY_USERS } from "../../utils/queries";
import AuthService from "../../utils/auth";
import axios from "axios";
import { AccountContext } from "../../components/accountBox/AccountContext";
import InputField from "../elements/InputField";

const baseURL = "http://localhost:4001/dev";
  // const baseURL = process.env.REACT_APP_API_URL || "https://hhixki9fn4.execute-api.us-west-1.amazonaws.com/dev";
  // process.env.REACT_APP_API_URL || "http://localhost:3001";
  

export function SignupForm() {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [addUser, {error}] = useMutation(ADD_USER);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      const userId = data.addUser.user.username;
      console.log("User ID:", userId);

      const response = await axios.post(`${baseURL}/create-s3-folder`, {
        userId,
        headers: {
          "x-user-id": userId,
        },
      });
      console.log("S3 Folder Creation Response:", response);

      if (response.status === 200) {
        AuthService.login(data.addUser.token);
        console.log("User Token:", data.addUser.token);
      } else {
        console.error("Failed to create folder:", response.data.error);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const { switchToSignin } = useContext(AccountContext);

  return (
    <div>
      <form className="flex flex-row w-full justify-between" id="signup-container" onSubmit={handleFormSubmit}>
        <div className="flex flex-col justify-end items-start mb-1">
            Already have an account?{" "}
            <div className="flex flex-row gap-2 text-gray-500 text-sm">
              <Link className="hover:text-white" id="bold" to="#" onClick={switchToSignin}>
                Sign In
              </Link>
              |
              <Link className="hover:text-white" id="bold" to="#">
                Forgot my password
              </Link>
            </div>
        </div>
        <div className="flex flex-col">
          <InputField
            id="signup-input1"
            type="text"
            placeholder="Username"
            label="Please enter your username"
            name="username"
            value={formState.username}
            onChange={handleChange}
          />
          <InputField
            id="signup-input2"
            type="email"
            placeholder="Email"
            label="Please enter your emaiil"
            name="email"
            value={formState.email}
            onChange={handleChange}
          />
          <InputField
            id="signup-input3"
            type="password"
            variant="password"
            label="Please enter your password"
            placeholder="Password"
            name="password"
            value={formState.password}
            onChange={handleChange}
          />
          <button id="signup-button" type="submit" className="bg-blue-600 w-full py-2 rounded-lg">
            Sign Up
          </button>
        </div>
      </form>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}
