import { Box, Image, Text, VStack, Flex, Center } from "@chakra-ui/react";
import ProfileCard from "./ProfileCard";
import { Link } from "react-router-dom";
import AuthService from "../../utils/auth";
import {
  ImageContainer,
  ProfileContainer,
  ImageGrid,
  ProfileGrid,
  LinkStyle,
  NavLinkA
} from "./Common";
import { QUERY_USER } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { ProjectAuthor } from "./Common";
import Auth from "../../utils/auth.js";

const Profile = (props) => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };
  const { loading, data: userData } = useQuery(QUERY_USER, {
    variables: { username: AuthService.getUsername() },
  });
  const user = userData?.user.username || "";
  return (
    <ProfileContainer>
      <VStack p={7} m="auto" width="fit-content" borderRadius={6} bg="gray.700">
        <Image
          borderRadius="full"
          boxSize="80px"
          src="https://bit.ly/kent-c-dodds"
          alt="Profile"
        />
        <Link style={LinkStyle} onClick={logout} to="/">
          <NavLinkA>Logout</NavLinkA>
        </Link>
        <Text>
          <ProjectAuthor>@{user}</ProjectAuthor>
        </Text>
        <Text fontSize="lg" color="gray.400"></Text>
      </VStack>
      <ProfileGrid>
        <ProfileCard />
      </ProfileGrid>
    </ProfileContainer>
  );
};
export default Profile;
