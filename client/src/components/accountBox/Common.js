import styled from "styled-components";
import { motion } from "framer-motion";

import { createGlobalStyle } from "styled-components";
import SatoshiVariable from "../style/fonts/Satoshi-Variable.woff2";
import SatoshiVariableItalic from "../style/fonts/Satoshi-VariableItalic.woff2";
import SatoshiLight from "../style/fonts/Satoshi-Light.woff2";
import SatoshiBold from "../style/fonts/Satoshi-Bold.woff2";
import SatoshiRegular from "../style/fonts/Satoshi-Regular.woff2";
import Background from "../../assets/room.gif";

export default createGlobalStyle`

@font-face {
  font-family: 'Satoshi-Variable';
  src: url(${SatoshiVariable}) format('woff2'),
       url('fonts/Satoshi-Variable.woff') format('woff'),
       url('fonts/Satoshi-Variable.ttf') format('truetype');
       font-weight: 300 900;
       font-display: swap;
       font-style: normal;
}


@font-face {
  font-family: 'Satoshi-VariableItalic';
  src: url(${SatoshiVariableItalic}) format('woff2'),
       url('fonts/Satoshi-VariableItalic.woff') format('woff'),
       url('fonts/Satoshi-VariableItalic.ttf') format('truetype');
       font-weight: 300 900;
       font-display: swap;
       font-style: italic;
}


@font-face {
  font-family: 'Satoshi-Light';
  src: url(${SatoshiLight}) format('woff2'),
       url('fonts/Satoshi-Light.woff') format('woff'),
       url('fonts/Satoshi-Light.ttf') format('truetype');
       font-weight: 300;
       font-display: swap;
       font-style: normal;
}


@font-face {
  font-family: 'Satoshi-LightItalic';
  src: url('fonts/Satoshi-LightItalic.woff2') format('woff2'),
       url('fonts/Satoshi-LightItalic.woff') format('woff'),
       url('fonts/Satoshi-LightItalic.ttf') format('truetype');
       font-weight: 300;
       font-display: swap;
       font-style: italic;
}


@font-face {
  font-family: 'Satoshi-Regular';
  src: url(${SatoshiRegular}) format('woff2'),
       url('fonts/Satoshi-Regular.woff') format('woff'),
       url('fonts/Satoshi-Regular.ttf') format('truetype');
       font-weight: 400;
       font-display: swap;
       font-style: normal;
}


@font-face {
  font-family: 'Satoshi-Italic';
  src: url('fonts/Satoshi-Italic.woff2') format('woff2'),
       url('fonts/Satoshi-Italic.woff') format('woff'),
       url('fonts/Satoshi-Italic.ttf') format('truetype');
       font-weight: 400;
       font-display: swap;
       font-style: italic;
}


@font-face {
  font-family: 'Satoshi-Medium';
  src: url('fonts/Satoshi-Medium.woff2') format('woff2'),
       url('fonts/Satoshi-Medium.woff') format('woff'),
       url('fonts/Satoshi-Medium.ttf') format('truetype');
       font-weight: 500;
       font-display: swap;
       font-style: normal;
}


@font-face {
  font-family: 'Satoshi-MediumItalic';
  src: url('fonts/Satoshi-MediumItalic.woff2') format('woff2'),
       url('fonts/Satoshi-MediumItalic.woff') format('woff'),
       url('fonts/Satoshi-MediumItalic.ttf') format('truetype');
       font-weight: 500;
       font-display: swap;
       font-style: italic;
}


@font-face {
  font-family: 'Satoshi-Bold';
  src: url(${SatoshiBold}) format('woff2'),
       url('fonts/Satoshi-Bold.woff') format('woff'),
       url('fonts/Satoshi-Bold.ttf') format('truetype');
       font-weight: 700;
       font-display: swap;
       font-style: normal;
}


@font-face {
  font-family: 'Satoshi-BoldItalic';
  src: url('fonts/Satoshi-BoldItalic.woff2') format('woff2'),
       url('fonts/Satoshi-BoldItalic.woff') format('woff'),
       url('fonts/Satoshi-BoldItalic.ttf') format('truetype');
       font-weight: 700;
       font-display: swap;
       font-style: italic;
}


@font-face {
  font-family: 'Satoshi-Black';
  src: url('fonts/Satoshi-Black.woff2') format('woff2'),
       url('fonts/Satoshi-Black.woff') format('woff'),
       url('fonts/Satoshi-Black.ttf') format('truetype');
       font-weight: 900;
       font-display: swap;
       font-style: normal;
}


@font-face {
  font-family: 'Satoshi-BlackItalic';
  src: url('fonts/Satoshi-BlackItalic.woff2') format('woff2'),
       url('fonts/Satoshi-BlackItalic.woff') format('woff'),
       url('fonts/Satoshi-BlackItalic.ttf') format('truetype');
       font-weight: 900;
       font-display: swap;
       font-style: italic;
}
`;

export const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 600px) {
    padding: 0rem 2rem;
  }
`;

export const BoxContainer = styled.div`
  box-sizing: border-box;
  display: inline-flex;
  padding: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
  margin: 2rem 0rem;
  background-blend-mode: soft-light;
  backdrop-filter: blur(20px);
  @media (max-width: 600px) {
    justify-content: center;
    margin: 1rem;
    width: 85vw;
  }
`;

export const LoginContainer = styled.form`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-end;
  justify-content: flex-start;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
  @media (max-width: 600px) {
    justify-content: center;
  }
`;

export const FormContainer = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: flex-end;
  justify-content: flex-start;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
  width: 65%;
`;

export const HeaderContainer = styled.div`
  box-sizing: border-box;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
`;

export const MutedLink = styled.a`
  font-size: 11px;
  color: #4dc4d2;
  font: 300 14px "Satoshi-Light", sans-serif;
  text-decoration: none;
`;

export const BoldLink = styled.a`
  font-size: 11px;
  color: #ffc442;
  font: 300 14px "Satoshi-Light", sans-serif;
  text-decoration: none;
  margin: 0 4px;
`;

export const Input = styled.input`
  transition: all, 200ms ease-in-out;
  &:focus,
  active {
    outline: none;
  }
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.5);
  width: 15rem;
  background: transparent;
  padding: 20px 24px 20px 24px;
  border: none;
  text-align: left;
  font: 300 18px "Satoshi-Light", sans-serif;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  outline: none;
  @media (max-width: 600px) {
    justify-content: center;
    font: 300 14px "Satoshi-Light", sans-serif;
    padding: 12px 12px 12px 12px;
    // border-radius: 12px;
  }
`;

export const InputContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  border: white;
  // background: transparent;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
  @media (max-width: 600px) {
    justify-content: center;
    border-radius: 12px;
  }
`;

export const PasswordContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 24px 20px 24px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
`;

export const ButtonContainer = styled.div`
  border-radius: 9999px;
  border-style: solid;
  border-color: #ffffff;
  border-width: 1px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  align-self: stretch;
  flex-shrink: 0;
  position: relative;
`;

export const SubmitButton = styled.button`
  border: none;
  padding: 12px 24px 12px 24px;
  font: 400 22px "Satoshi-Regular", sans-serif;
  background: none;
  color: #ffffff;
  text-align: left;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100;
  @media (max-width: 600px) {
    justify-content: center;
    font: 300 14px "Satoshi-Light", sans-serif;
    padding: 10px 24px 10px 24px;
  }
`;

export const ExploreContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 120px;
  align-items: flex-start;
  justify-content: flex-start;
  // width: 818px;
  width: 65%;
  margin-bottom: 4rem;
  position: relative;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const ExplorerCard = styled.div`
  box-sizing: border-box;
  background: #141414;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 0px;
  // align-items: center;
  justify-content: center;
  align-self: stretch;
  flex-shrink: 0;
  // height: 600px;
  position: relative;
  overflow: hidden;
  width: 100%;
`;

export const ExploreCardAuthor = styled.div`
  box-sizing: border-box;
  padding: 15px 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  flex-shrink: 0;
  position: absolute;
  z-index: 99;
  top: 10px;
`;
export const ProjectAuthor = styled.h4`
  color: #ffffff;
  text-align: left;
  font: 300 20px 'Satoshi-Bold', sans-serif;
  position: relative;
  width: 130px;
  margin-bottom: 1rem;
  text-decoration: none:
`;
export const PostTime = styled.div`
  color: #989898;
  text-align: left;
  margin:2rem;
  position: relative;
`;

export const CardTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 1rem;
`;
export const ProjectTitle = styled.h3`
  color: #ffffff;
  text-align: left;
  font: 300 24px "Satoshi-Bold", sans-serif;
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-left: 40px;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CardImage = styled.img`
  box-sizing: border-box;
  background: linear-gradient(
    180deg,
    rgba(20, 20, 20, 0) 0%,
    rgba(20, 20, 20, 1) 100%
  );
  display: flex;
  flex-direction: row;
  gap: 0px;
  align-items: flex-end;
  justify-content: flex-start;
  align-self: stretch;
  flex: 1;
  position: relative;
  width: 100%;
`;

export const SideNav = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  font: 300 20px "Satoshi-Regular", sans-serif;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    // width: 100vw;
  }
`;

export const NavLinks = styled.div`
  display: flex;
  margin: 1rem;
  flex-direction: column;
  position: absolute;
  @media (max-width: 768px) {
    background: rgb(11, 11, 12);

    width: 100vw;
    flex-direction: row;
    z-index: 100;
    justify-content: center;
    bottom: 0;
    margin-bottom: 0;
  }
  @media (max-width: 600px) {
    background: rgb(11, 11, 12);

    width: 100vw;
    flex-direction: row;
    z-index: 100;
    justify-content: center;
    bottom: 0;
    margin-bottom: 0;
  }
`;

export const NavIcon = styled.img`
  box-sizing: border-box;
  flex-shrink: 0;
  position: relative;
  overflow: visible;
`;

export const LinkStyle = {
  margin: "1rem",
  textDecoration: "none",
  display: "flex",
  flexDirection: "row",
  gap: "20px",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  position: "relative",
};

export const NavLinkA = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;
export const Container = styled.div`
  margin: 2rem 8rem;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  @media (max-width: 600px) {
    margin: 2rem;
    flex-direction: column;
    justify-content: space-between;
    z-index: 99;
    align-items: center;
  }
`;

// export const TopContainer = styled.div`
//   // width: 100%;
//   // height: 250px;
//   // display: flex;
//   // flex-direction: column;
//   // justify-content: flex-end;
//   // padding: 0 1.8em;
//   // padding-bottom: 5em;
//   // margin-bottom: 4rem;
// `;
// export const BackDrop = styled(motion.div)`
//   // width: 100%;
//   // height: 250px;
//   // position: absolute;
//   // display: flex;
//   // flex-direction: column;
//   // border-radius: 50%;
//   // transform: rotate(60deg);
//   // top: -0px;
//   // left: -70px;
//   // background:#FFC442;
//   // background: linear-gradient( 58deg,
//   //     rgba(241, 196, 15, 1) 0%, ) 20%,
//   //     rgba(243, 172, 18, 1) 100%
//   //     );
// `;

export const HeaderText = styled.h2`
  color: #ffffff;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  font: 300 40px "Satoshi-Regular", sans-serif;
  justify-content: flex-start;
  @media (max-width: 600px) {
    font-size: 29px;
  }
`;
export const SmallText = styled.h5`
  color: #ffffff;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  font: 300 16px "Satoshi-Regular", sans-serif;
  justify-content: flex-start;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;
export const InnerContainer = styled.div`
  // display: flex;
  // flex-direction: column;
  // padding-right: 0 1.8em;
  // align-items: center;
  // margin: 12px;
`;

// PROFILE
export const ProfileContainer = styled.div`
  width: 65%;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const ImageContainer = styled.div`
  // align-items: center;
  // display: flex;

  // justify-content:space-between;
`;

// ****** profile grid styling ******

export const ProfileGrid = styled.div`
  // padding: 0.5rem 5.5rem;
  justify-content: flex-end;
  @media (max-width: 600px) {
    padding: 0rem 0rem;
  }
`;

export const ImageGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: 600px) {
    width: 100%;
  }
  // flex-direction: row-reverse;
`;

export const ProjectImageCard = styled.img`
  // box-sizing: border-box;
  background: linear-gradient(
    180deg,
    rgba(20, 20, 20, 0) 0%,
    rgba(20, 20, 20, 1) 100%
  );
  // gap: 2px;
  // flex: 1;
  margin-left: 2rem;
  // position: relative;
  width: 30rem;
  // height: 200px;
`;
export const ProfileImageContainer = styled.div`
  width: 24.5rem; /* Adjust the width as needed */
  border-radius: 0.5rem;
  height: 25rem; /* Adjust the height as needed */
  margin: 1rem; /* Add margin between image cards if desired */
  overflow: hidden; /* Hide overflow content */
  display: flex;
  align-items: center;
  @media (max-width: 576px) {
    align-items: center;
    width: 12.25rem;
    height: 12rem; 
  }
  @media (max-width: 768px) {
    width: 15.25rem;
    height: 15rem; 
  }
  @media (max-width: 992px) {
    width: 16.25rem;
    height: 16rem; 
  }
`;

export const ImageCard = styled.img`
  // box-sizing: border-box;
  background: linear-gradient(
    180deg,
    rgba(20, 20, 20, 0) 0%,
    rgba(20, 20, 20, 1) 100%
  );
  // gap: 2px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  align-self: center;
`;

// ****** profile grid styling ******

export const UploadButton = styled.button`
  color: white;
`;

export const SinglePostContainer = styled.div`
  .single-post-container {
    border-radius: 5px;
    padding: 4rem;
    margin: 4rem;
    display: flex;
    flex-direction: column;
  }

  h2 {
    margin-left: 1rem;
    font-size: 1.5rem;
    font-family: montserrat;
    font-weight: bold;
    color: var(--color-yellow);
  }

  h3 {
    margin-left: 2rem;
    font-size: 1rem;
    font-weight: bold;
    color: var(--color-light-blue);
    font-style: italic;
    font-family: montserrat;
  }

  p {
    font-size: 2rem;
    color: var(--color-yellow);
  }

  .blockquote-container {
    flex: 1; /* set to 1 to fill remaining space */
    border: 1px solid var(--color-yellow);
    border-radius: 5px;
    padding: 1rem;
    margin: 1rem;
    background-color: var(--color-dark-blue);
    overflow: auto;
  }

  blockquote {
    font-size: 1rem;
    font-family: montserrat;
    color: var(--color-yellow);
    border: none;
    padding: 0.5rem;
    overflow: auto;
    max-height: 100%;
    white-space: pre-wrap;
    padding: 1rem;
  }

  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: montserrat;
    width: 200px;
    color: var(--color-dark-blue);
    font-size: 1.4rem;
    font-weight: bold;
    padding: 10px;
    padding-top: 7px;
    transition: 0.5s;
    cursor: pointer;
    border-radius: 0.5rem;
    border: none;
    background: var(--color-yellow);
    margin-top: 20px;
    margin-bottom: 25px;
    box-shadow: 0px 7px 0px 0px #cf920d;
  }

  button:hover {
    box-shadow: none;
    transform: translateY(5px);
    transition: all 0.1s linear;
  }

  button:focus {
    outline: none;
  }
  .link-button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    text-decoration: none;
    font-family: "Courier Prime", monospace;
  }
`;

// export const FormContainer = styled.div``
