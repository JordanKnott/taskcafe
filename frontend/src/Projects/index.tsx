import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import GlobalTopNavbar from 'App/TopNavbar';
import Empty from 'shared/undraw/Empty';
import {
  useCreateTeamMutation,
  useGetProjectsQuery,
  useCreateProjectMutation,
  GetProjectsDocument,
  GetProjectsQuery,
  MeQuery,
  MeDocument,
} from 'shared/generated/graphql';

import { Link } from 'react-router-dom';
import NewProject from 'shared/components/NewProject';
import { PermissionLevel, PermissionObjectType, useCurrentUser } from 'App/context';
import Button from 'shared/components/Button';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import { useForm } from 'react-hook-form';
import Input from 'shared/components/Input';
import updateApolloCache from 'shared/utils/cache';
import produce from 'immer';
import NOOP from 'shared/utils/noop';

const EmptyStateContent = styled.div`
  display: flex;
  justy-content: center;
  align-items: center;
  flex-direction: column;
`;

const EmptyStateTitle = styled.h3`
  color: #fff;
  font-size: 18px;
`;

const EmptyStatePrompt = styled.span`
  color: rgba(${props => props.theme.colors.text.primary});
  font-size: 16px;
  margin-top: 8px;
`;

const EmptyState = styled(Empty)`
  display: block;
  margin: 0 auto;
`;

const CreateTeamButton = styled(Button)`
  width: 100%;
`;

type CreateTeamData = { teamName: string };

type CreateTeamFormProps = {
  onCreateTeam: (teamName: string) => void;
};

const CreateTeamFormContainer = styled.form``;

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({ onCreateTeam }) => {
  const { register, handleSubmit } = useForm<CreateTeamData>();
  const createTeam = (data: CreateTeamData) => {
    onCreateTeam(data.teamName);
  };
  return (
    <CreateTeamFormContainer onSubmit={handleSubmit(createTeam)}>
      <Input
        width="100%"
        label="Team name"
        id="teamName"
        name="teamName"
        variant="alternate"
        ref={register({ required: 'Team name is required' })}
      />
      <CreateTeamButton type="submit">Create</CreateTeamButton>
    </CreateTeamFormContainer>
  );
};

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
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
`;

const ProjectSectionTitleWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  height: 32px;
  margin-bottom: 24px;
  padding: 8px 0;
  position: relative;
  margin-top: 16px;
`;

const SectionActions = styled.div`
  display: flex;
  align-items: center;
`;

const SectionAction = styled(Button)`
  padding: 6px 12px;
`;

const SectionActionLink = styled(Link)`
  margin-right: 8px;
`;

const ProjectSectionTitle = styled.h3`
  font-size: 16px;
  color: rgba(${props => props.theme.colors.text.primary});
`;

const ProjectsContainer = styled.div`
  margin: 40px 16px 0;
  width: 100%;
  max-width: 825px;
  min-width: 288px;
`;

const ProjectGrid = styled.div`
  max-width: 780px;
  display: grid;
  grid-template-columns: 240px 240px 240px;
  gap: 20px 10px;
`;

const AddTeamButton = styled(Button)`
  padding: 6px 12px;
  position: absolute;
  top: 6px;
  right: 12px;
`;

const CreateFirstTeam = styled(Button)`
  margin-top: 8px;
`;

type ShowNewProject = {
  open: boolean;
  initialTeamID: null | string;
};

const Projects = () => {
  const { showPopup, hidePopup } = usePopup();
  const { loading, data } = useGetProjectsQuery({ fetchPolicy: 'network-only' });
  useEffect(() => {
    document.title = 'Taskcafé';
  }, []);
  const [createProject] = useCreateProjectMutation({
    update: (client, newProject) => {
      updateApolloCache<GetProjectsQuery>(client, GetProjectsDocument, cache =>
        produce(cache, draftCache => {
          draftCache.projects.push({ ...newProject.data.createProject });
        }),
      );
    },
  });

  const [showNewProject, setShowNewProject] = useState<ShowNewProject>({ open: false, initialTeamID: null });
  const { user } = useCurrentUser();
  const [createTeam] = useCreateTeamMutation({
    update: (client, createData) => {
      updateApolloCache<GetProjectsQuery>(client, GetProjectsDocument, cache =>
        produce(cache, draftCache => {
          draftCache.teams.push({ ...createData.data.createTeam });
        }),
      );
    },
  });
  if (loading) {
    return <GlobalTopNavbar onSaveProjectName={NOOP} projectID={null} name={null} />;
  }

  const colors = ['#e362e3', '#7a6ff0', '#37c5ab', '#aa62e3', '#e8384f'];
  if (data && user) {
    const { projects, teams, organizations } = data;
    const organizationID = organizations[0].id ?? null;
    const projectTeams = teams
      .sort((a, b) => {
        const textA = a.name.toUpperCase();
        const textB = b.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0; // eslint-disable-line no-nested-ternary
      })
      .map(team => {
        return {
          id: team.id,
          name: team.name,
          projects: projects
            .filter(project => project.team.id === team.id)
            .sort((a, b) => {
              const textA = a.name.toUpperCase();
              const textB = b.name.toUpperCase();
              return textA < textB ? -1 : textA > textB ? 1 : 0; // eslint-disable-line no-nested-ternary
            }),
        };
      });
    return (
      <>
        <GlobalTopNavbar onSaveProjectName={NOOP} projectID={null} name={null} />
        <Wrapper>
          <ProjectsContainer>
            {user.roles.org === 'admin' && (
              <AddTeamButton
                variant="outline"
                onClick={$target => {
                  showPopup(
                    $target,
                    <Popup
                      title="Create team"
                      tab={0}
                      onClose={() => {
                        hidePopup();
                      }}
                    >
                      <CreateTeamForm
                        onCreateTeam={teamName => {
                          if (organizationID) {
                            createTeam({ variables: { name: teamName, organizationID } });
                            hidePopup();
                          }
                        }}
                      />
                    </Popup>,
                  );
                }}
              >
                Add Team
              </AddTeamButton>
            )}
            {projectTeams.length === 0 && (
              <EmptyStateContent>
                <EmptyState width={425} height={425} />
                <EmptyStateTitle>No teams exist</EmptyStateTitle>
                <EmptyStatePrompt>Create a new team to get started</EmptyStatePrompt>
                <CreateFirstTeam
                  variant="outline"
                  onClick={$target => {
                    showPopup(
                      $target,
                      <Popup
                        title="Create team"
                        tab={0}
                        onClose={() => {
                          hidePopup();
                        }}
                      >
                        <CreateTeamForm
                          onCreateTeam={teamName => {
                            if (organizationID) {
                              createTeam({ variables: { name: teamName, organizationID } });
                              hidePopup();
                            }
                          }}
                        />
                      </Popup>,
                    );
                  }}
                >
                  Create new team
                </CreateFirstTeam>
              </EmptyStateContent>
            )}
            {projectTeams.map(team => {
              return (
                <div key={team.id}>
                  <ProjectSectionTitleWrapper>
                    <ProjectSectionTitle>{team.name}</ProjectSectionTitle>
                    {user.isAdmin(PermissionLevel.TEAM, PermissionObjectType.TEAM, team.id) && (
                      <SectionActions>
                        <SectionActionLink to={`/teams/${team.id}`}>
                          <SectionAction variant="outline">Projects</SectionAction>
                        </SectionActionLink>
                        <SectionActionLink to={`/teams/${team.id}/members`}>
                          <SectionAction variant="outline">Members</SectionAction>
                        </SectionActionLink>
                        <SectionActionLink to={`/teams/${team.id}/settings`}>
                          <SectionAction variant="outline">Settings</SectionAction>
                        </SectionActionLink>
                      </SectionActions>
                    )}
                  </ProjectSectionTitleWrapper>
                  <ProjectList>
                    {team.projects.map((project, idx) => (
                      <ProjectListItem key={project.id}>
                        <ProjectTile color={colors[idx % 5]} to={`/projects/${project.id}`}>
                          <ProjectTileFade />
                          <ProjectTileDetails>
                            <ProjectTileName>{project.name}</ProjectTileName>
                          </ProjectTileDetails>
                        </ProjectTile>
                      </ProjectListItem>
                    ))}
                    {user.isAdmin(PermissionLevel.TEAM, PermissionObjectType.TEAM, team.id) && (
                      <ProjectListItem>
                        <ProjectAddTile
                          onClick={() => {
                            setShowNewProject({ open: true, initialTeamID: team.id });
                          }}
                        >
                          <ProjectTileFade />
                          <ProjectAddTileDetails>
                            <ProjectTileName centered>Create new project</ProjectTileName>
                          </ProjectAddTileDetails>
                        </ProjectAddTile>
                      </ProjectListItem>
                    )}
                  </ProjectList>
                </div>
              );
            })}
            {showNewProject.open && (
              <NewProject
                initialTeamID={showNewProject.initialTeamID}
                onCreateProject={(name, teamID) => {
                  if (user) {
                    createProject({ variables: { teamID, name, userID: user.id } });
                    setShowNewProject({ open: false, initialTeamID: null });
                  }
                }}
                onClose={() => {
                  setShowNewProject({ open: false, initialTeamID: null });
                }}
                teams={teams}
              />
            )}
          </ProjectsContainer>
        </Wrapper>
      </>
    );
  }
  return <div>Error!</div>;
};

export default Projects;
