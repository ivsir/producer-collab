import { Box, Image, Text, VStack } from "@chakra-ui/react";
import ProfileCard from "./ProfileCard";
import AuthService from "../../utils/auth";
import { ProfileContainer } from "./Common";
import { QUERY_PROJECTS, QUERY_USER, QUERY_ME} from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { ProjectAuthor } from "./Common";

const Profile = (props) => {
  // const { loading, data: userData } = useQuery(QUERY_USER, {
  //   variables: { username: AuthService.getUsername() },
  // });

  const { loading, data: userData } = useQuery(QUERY_ME, {
    variables: { username: AuthService.getUsername() },
  });

  const user = userData?.user.username || '';

  return (
    <ProfileContainer>
      <VStack p={7} m="auto" width="fit-content" borderRadius={6} bg="gray.700">
        <Image
          borderRadius="full"
          boxSize="80px"
          src="https://bit.ly/kent-c-dodds"
          alt="Profile"
        />
        <Text>
          <ProjectAuthor>@{user}</ProjectAuthor>
        </Text>
        <Text fontSize="lg" color="gray.400">
          Software Engineer
        </Text>
      </VStack>
      <ProfileCard />
    </ProfileContainer>
  );
};
export default Profile;
