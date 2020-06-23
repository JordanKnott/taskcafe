import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components/macro';
import { MENU_TYPES } from 'shared/components/TopNavbar';
import GlobalTopNavbar from 'App/TopNavbar';
import updateApolloCache from 'shared/utils/cache';
import {
  useGetTeamQuery,
  useDeleteTeamMutation,
  GetProjectsDocument,
  GetProjectsQuery,
} from 'shared/generated/graphql';
import { useParams, useHistory } from 'react-router';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import { History } from 'history';
import produce from 'immer';
import { TeamSettings, DeleteConfirm, DELETE_INFO } from 'shared/components/ProjectSettings';
import { Link } from 'react-router-dom';

const ProjectAddTile = styled.div`
  background-color: rgba(${props => props.theme.colors.bg.primary}, 0.4);
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`;

type TeamPopupProps = {
  history: History<History.PoorMansUnknown>;
  name: string;
  teamID: string;
};

export const TeamPopup: React.FC<TeamPopupProps> = ({ history, name, teamID }) => {
  const { hidePopup, setTab } = usePopup();
  const [deleteTeam] = useDeleteTeamMutation({
    update: (client, deleteData) => {
      updateApolloCache<GetProjectsQuery>(client, GetProjectsDocument, cache =>
        produce(cache, draftCache => {
          draftCache.teams = cache.teams.filter((team: any) => team.id !== deleteData.data.deleteTeam.team.id);
          draftCache.projects = cache.projects.filter(
            (project: any) => project.team.id !== deleteData.data.deleteTeam.team.id,
          );
        }),
      );
    },
  });
  return (
    <>
      <Popup title={null} tab={0}>
        <TeamSettings
          onDeleteTeam={() => {
            setTab(1, 340);
          }}
        />
      </Popup>
      <Popup title={`Delete the "${name}" team?`} tab={1} onClose={() => hidePopup()}>
        <DeleteConfirm
          description={DELETE_INFO.DELETE_TEAMS.description}
          deletedItems={DELETE_INFO.DELETE_TEAMS.deletedItems}
          onConfirmDelete={() => {
            if (teamID) {
              deleteTeam({ variables: { teamID } });
              hidePopup();
              history.push('/projects');
            }
          }}
        />
      </Popup>
    </>
  );
};

const ProjectsContainer = styled.div`
  margin: 40px 16px 0;
  width: 100%;
  max-width: 825px;
  min-width: 288px;
`;

type TeamsRouteProps = {
  teamID: string;
};

const colors = ['#e362e3', '#7a6ff0', '#37c5ab', '#aa62e3', '#e8384f'];
const Projects = () => {
  const { teamID } = useParams<TeamsRouteProps>();
  const history = useHistory();
  const { loading, data } = useGetTeamQuery({ variables: { teamID } });
  useEffect(() => {
    document.title = 'Citadel | Teams';
  }, []);
  if (loading) {
    return (
      <>
        <span>loading</span>
      </>
    );
  }

  if (data) {
    return (
      <>
        <GlobalTopNavbar
          menuType={MENU_TYPES.TEAM_MENU}
          initialTab={0}
          popupContent={<TeamPopup history={history} name={data.findTeam.name} teamID={teamID} />}
          onSaveProjectName={() => {}}
          projectID={null}
          name={data.findTeam.name}
        />
        <Wrapper>
          <ProjectsContainer>
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
          </ProjectsContainer>
        </Wrapper>
      </>
    );
  }
  return <div>Error!</div>;
};

export default Projects;
