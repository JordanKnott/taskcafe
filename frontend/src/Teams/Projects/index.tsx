import React from 'react';
import styled, { css } from 'styled-components/macro';
import {
  useGetTeamQuery,
  useDeleteTeamMutation,
  GetProjectsDocument,
  GetProjectsQuery,
} from 'shared/generated/graphql';
import { Link } from 'react-router-dom';
import Input from 'shared/components/Input';
import theme from 'App/ThemeStyles';
import polling from 'shared/utils/polling';

const FilterSearch = styled(Input)`
  margin: 0;
`;

const ProjectsContainer = styled.div`
  margin-top: 45px;
  display: flex;
  width: 100%;
`;

const FilterTab = styled.div`
  max-width: 240px;
  flex: 0 0 240px;
  margin: 0;
  padding-right: 32px;
`;

const FilterTabItems = styled.ul``;
const FilterTabItem = styled.li`
  cursor: pointer;
  border-radius: 3px;
  display: block;
  font-weight: 700;
  text-decoration: none;
  padding: 6px 8px;
  color: ${props => props.theme.colors.text.primary};
  &:hover {
    border-radius: 6px;
    background: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const FilterTabTitle = styled.h2`
  color: #5e6c84;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 16px;
  margin-top: 16px;
  text-transform: uppercase;
  padding: 8px;
  margin: 0;
`;

const ProjectAddTile = styled.div`
  background-color: ${props => props.theme.colors.bg.primary};
  background-size: cover;
  background-position: 50%;
  color: #fff;
  line-height: 20px;
  padding: 8px;
  position: relative;
  text-decoration: none;

  border-radius: 3px;
  display: block;
`;

const ProjectTile = styled(Link)<{ color: string }>`
  background-color: ${props => props.color};
  background-size: cover;
  background-position: 50%;
  color: #fff;
  line-height: 20px;
  padding: 8px;
  position: relative;
  text-decoration: none;

  border-radius: 3px;
  display: block;
`;

const ProjectTileFade = styled.div`
  background-color: rgba(0, 0, 0, 0.15);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

const ProjectListItem = styled.li`
  width: 23.5%;
  padding: 0;
  margin: 0 2% 2% 0;

  box-sizing: border-box;
  position: relative;
  cursor: pointer;

  &:hover ${ProjectTileFade} {
    background-color: rgba(0, 0, 0, 0.25);
  }
`;

const ProjectList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;

  & ${ProjectListItem}:nth-of-type(4n) {
    margin-right: 0;
  }
`;

const ProjectTileDetails = styled.div`
  display: flex;
  height: 80px;
  position: relative;
  flex-direction: column;
  justify-content: space-between;
`;

const ProjectAddTileDetails = styled.div`
  display: flex;
  height: 80px;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProjectTileName = styled.div<{ centered?: boolean }>`
  flex: 0 0 auto;
  font-size: 16px;
  font-weight: 700;
  display: inline-block;
  overflow: hidden;
  max-height: 40px;
  width: 100%;
  word-wrap: break-word;
  ${props => props.centered && 'text-align: center;'}
`;
const ProjectListWrapper = styled.div`
  flex: 1 1;
`;

const colors = theme.colors.multiColors;

type TeamProjectsProps = {
  teamID: string;
};

const TeamProjects: React.FC<TeamProjectsProps> = ({ teamID }) => {
  const { loading, data } = useGetTeamQuery({
    variables: { teamID },
    fetchPolicy: 'cache-and-network',
    pollInterval: polling.TEAM_PROJECTS,
  });
  if (data) {
    return (
      <ProjectsContainer>
        <FilterTab>
          <FilterSearch placeholder="Search for projects..." width="100%" variant="alternate" />
          <FilterTabTitle>SORT</FilterTabTitle>
          <FilterTabItems>
            <FilterTabItem>Most Recently Active</FilterTabItem>
            <FilterTabItem>Number of Members</FilterTabItem>
            <FilterTabItem>Number of Stars</FilterTabItem>
            <FilterTabItem>Alphabetical</FilterTabItem>
          </FilterTabItems>
        </FilterTab>
        <ProjectListWrapper>
          <ProjectList>
            {data.projects.map((project, idx) => (
              <ProjectListItem key={project.id}>
                <ProjectTile color={colors[idx % 5]} to={`/projects/${project.id}`}>
                  <ProjectTileFade />
                  <ProjectTileDetails>
                    <ProjectTileName>{project.name}</ProjectTileName>
                  </ProjectTileDetails>
                </ProjectTile>
              </ProjectListItem>
            ))}
          </ProjectList>
        </ProjectListWrapper>
      </ProjectsContainer>
    );
  }
  return <span>loading</span>;
};

export default TeamProjects;
