import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { ADD_USER} from "../../utils/mutations";

import AuthService from "../../utils/auth";
import axios from "axios";


import { AccountContext } from "../../components/accountBox/AccountContext";

import {
  BoldLink,
  BoxContainer,
  LoginContainer,
  FormContainer,
  InputContainer,
  Input,
  MutedLink,
  ButtonContainer,
  SubmitButton,
} from "../accountBox/Common";

const baseURL = process.env.REACT_APP_API_URL || "ec2-54-153-127-238.us-west-1.compute.amazonaws.com";

console.log(baseURL)
export function SignupForm() {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [addUser] = useMutation(ADD_USER);
  // const [addFolder] = useMutation(ADD_FOLDER);

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
      
      // const userId = data.addUser.user._id; // Assuming your response has the user's ID
      const userId = data.addUser.user.username
      console.log("User ID:", userId);


      // creates s3 folder for user
      const response = await axios.post(`${baseURL}/create-s3-folder`, {
        userId,
        headers: {
          "x-user-id": userId,
        },
        // folderName: folderName,
      });
      console.log("S3 Folder Creation Response:", response);

      if (response.status === 200) {

        AuthService.login(data.addUser.token);
        console.log("UserToken:", data.addUser.token);
      } else {
        console.error("Failed to create folder:", response.data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  //
  const { switchToSignin } = useContext(AccountContext);

  return (
    <BoxContainer>
      <LoginContainer id="signup-container" onSubmit={handleFormSubmit}>
        <InputContainer>
          <Input
            id="signup-input1"
            type="text"
            placeholder="Username"
            name="username"
            value={formState.username}
            onChange={handleChange}
          />
        </InputContainer>
        <InputContainer>
          <Input
            id="signup-input2"
            type="email"
            placeholder="Email"
            name="email"
            value={formState.email}
            onChange={handleChange}
          />
        </InputContainer>
        <InputContainer>
          <Input
            id="signup-input3"
            type="password"
            placeholder="Password"
            name="password"
            value={formState.password}
            onChange={handleChange}
          />
        </InputContainer>
        <ButtonContainer>
          <SubmitButton id="signup-button" type="submit">
            Sign Up
          </SubmitButton>
        </ButtonContainer>
        <MutedLink id="muted-link" href="#">
          Already have an account?
          <BoldLink id="bold" href="#" onClick={switchToSignin}>
            Sign In{" "}
          </BoldLink>
        </MutedLink>
      </LoginContainer>
    </BoxContainer>
  );
}
