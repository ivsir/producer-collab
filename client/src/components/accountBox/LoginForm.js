import { useState } from "react";
import { useContext } from "react";
import { AccountContext } from "../../components/accountBox/AccountContext";
import {
  ImageContainer,
  BoldLink,
  BoxContainer,
  LoginContainer,
  InputContainer,
  Input,
  MutedLink,
  ButtonContainer,
  SubmitButton,
} from "../accountBox/Common";

import AuthService from "../../utils/auth";

import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../utils/mutations";

export function LoginForm(props) {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [login, { error, data }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    console.log(formState);
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      AuthService.login(data.login.token);
      console.log(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: "",
      password: "",
    });
  };

  const { switchToSignup } = useContext(AccountContext);

  return (
    // <ImageContainer>
    <BoxContainer>
      <LoginContainer id="login-container" onSubmit={handleFormSubmit}>
        <InputContainer>
          <Input
            id="login-input1"
            type="email"
            placeholder="Email"
            name="email"
            value={formState.email}
            onChange={handleChange}
          />
        </InputContainer>
        <InputContainer>
          <Input
            id="login-input2"
            type="password"
            placeholder="Password"
            name="password"
            value={formState.password}
            onChange={handleChange}
          />
        </InputContainer>
        <ButtonContainer>
          <SubmitButton id="login-button" type="submit">
            Login{" "}
          </SubmitButton>
        </ButtonContainer>
        <MutedLink id=" muted-link" href="#">
          <BoldLink id="bold" href="#" onClick={switchToSignup}>
            Create an Account
          </BoldLink>
        </MutedLink>
      </LoginContainer>
    </BoxContainer>
    // </ImageContainer>
  );
}
