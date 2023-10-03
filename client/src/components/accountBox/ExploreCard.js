import { QUERY_PROJECTS } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { ExploreContainer, ExplorerCard, ExploreCardAuthor, ProjectAuthor, PostTime, CardTitle, ProjectTitle, CardImage} from "./Common.js";
import { Link } from "react-router-dom";
import Airforce from "../../assets/airforceanime.jpg";

function ExploreCard(props) {
  const { loading, data } = useQuery(QUERY_PROJECTS);
  const projects = data?.projects || [];

  return (
    <ExploreContainer>
      {projects.map((projects) => (
        <ExplorerCard key={projects._id}>
          <CardImage src={Airforce} />
          <ExploreCardAuthor>
            <ProjectAuthor>@{projects.projectAuthor}</ProjectAuthor>
          </ExploreCardAuthor>
          <CardTitle>
            <ProjectTitle>
              <Link to={`/projects/${projects._id}`}>
                {projects.projectTitle}
              </Link>
            <PostTime>{projects.createdAt}</PostTime>
            </ProjectTitle>
          </CardTitle>
        </ExplorerCard>
      ))}
    </ExploreContainer>
  );
}

export default ExploreCard;
