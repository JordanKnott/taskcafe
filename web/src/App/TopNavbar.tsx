import React, { useState, useContext, useEffect } from 'react';
import TopNavbar from 'shared/components/TopNavbar';
import styled from 'styled-components/macro';
import DropdownMenu, { ProfileMenu } from 'shared/components/DropdownMenu';
import ProjectSettings, { DeleteConfirm, DELETE_INFO } from 'shared/components/ProjectSettings';
import { useHistory } from 'react-router';
import UserIDContext from 'App/context';
import {
  useMeQuery,
  useDeleteProjectMutation,
  useGetProjectsQuery,
  GetProjectsDocument,
} from 'shared/generated/graphql';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import { History } from 'history';
import produce from 'immer';
import { Link } from 'react-router-dom';

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TeamTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
`;

const TeamProjects = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  margin-bottom: 4px;
`;

const TeamProjectLink = styled(Link)`
  display: flex;
  font-weight: 700;
  height: 36px;
  overflow: hidden;
  padding: 0;
  position: relative;
  text-decoration: none;
  user-select: none;
`;

const TeamProjectBackground = styled.div<{ color: string }>`
  background-image: url(null);
  background-color: ${props => props.color};

  background-size: cover;
  background-position: 50%;
  position: absolute;
  width: 100%;
  height: 36px;
  opacity: 1;
  border-radius: 3px;
  &:before {
    background: rgba(${props => props.theme.colors.bg.secondary});
    bottom: 0;
    content: '';
    left: 0;
    opacity: 0.88;
    position: absolute;
    right: 0;
    top: 0;
  }
`;

const TeamProjectAvatar = styled.div<{ color: string }>`
  background-image: url(null);
  background-color: ${props => props.color};

  display: inline-block;
  flex: 0 0 auto;
  background-size: cover;
  border-radius: 3px 0 0 3px;
  height: 36px;
  width: 36px;
  position: relative;
  opacity: 0.7;
`;

const TeamProjectContent = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  width: 100%;
  padding: 9px 0 9px 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TeamProjectTitle = styled.div`
  font-weight: 700;
  display: block;
  padding-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TeamProjectContainer = styled.div`
  box-sizing: border-box;
  border-radius: 3px;
  position: relative;
  margin: 0 4px 4px 0;
  min-width: 0;
  &:hover ${TeamProjectTitle} {
    color: rgba(${props => props.theme.colors.text.secondary});
  }
  &:hover ${TeamProjectAvatar} {
    opacity: 1;
  }
  &:hover ${TeamProjectBackground}:before {
    opacity: 0.78;
  }
`;

const colors = ['#e362e3', '#7a6ff0', '#37c5ab', '#aa62e3', '#e8384f'];

const ProjectFinder = () => {
  const { loading, data } = useGetProjectsQuery();
  if (loading) {
    return <span>loading</span>;
  }
  if (data) {
    const { projects, teams, organizations } = data;
    const projectTeams = teams.map(team => {
      return {
        id: team.id,
        name: team.name,
        projects: projects.filter(project => project.team.id === team.id),
      };
    });
    return (
      <>
        {projectTeams.map(team => (
          <TeamContainer>
            <TeamTitle>{team.name}</TeamTitle>
            <TeamProjects>
              {team.projects.map((project, idx) => (
                <TeamProjectContainer>
                  <TeamProjectLink to={`/projects/${project.id}`}>
                    <TeamProjectBackground color={colors[idx % 5]} />
                    <TeamProjectAvatar color={colors[idx % 5]} />
                    <TeamProjectContent>
                      <TeamProjectTitle>{project.name}</TeamProjectTitle>
                    </TeamProjectContent>
                  </TeamProjectLink>
                </TeamProjectContainer>
              ))}
            </TeamProjects>
          </TeamContainer>
        ))}
      </>
    );
  }
  return <span>error</span>;
};
type ProjectPopupProps = {
  history: History<History.PoorMansUnknown>;
  name: string;
  projectID: string;
};

export const ProjectPopup: React.FC<ProjectPopupProps> = ({ history, name, projectID }) => {
  const { hidePopup, setTab } = usePopup();
  const [deleteProject] = useDeleteProjectMutation({
    update: (client, deleteData) => {
      const cacheData: any = client.readQuery({
        query: GetProjectsDocument,
      });

      console.log(cacheData);
      console.log(deleteData);

      const newData = produce(cacheData, (draftState: any) => {
        draftState.projects = draftState.projects.filter(
          (project: any) => project.id !== deleteData.data.deleteProject.project.id,
        );
      });

      client.writeQuery({
        query: GetProjectsDocument,
        data: {
          ...newData,
        },
      });
    },
  });
  return (
    <>
      <Popup title={null} tab={0}>
        <ProjectSettings
          onDeleteProject={() => {
            setTab(1);
          }}
        />
      </Popup>
      <Popup title={`Delete the "${name}" project?`} tab={1}>
        <DeleteConfirm
          description={DELETE_INFO.DELETE_PROJECTS.description}
          deletedItems={DELETE_INFO.DELETE_PROJECTS.deletedItems}
          onConfirmDelete={() => {
            if (projectID) {
              deleteProject({ variables: { projectID } });
              hidePopup();
              history.push('/projects');
            }
          }}
        />
      </Popup>
    </>
  );
};

type GlobalTopNavbarProps = {
  nameOnly?: boolean;
  projectID: string | null;
  name: string | null;
  initialTab?: number;
  popupContent?: JSX.Element;
  menuType?: Array<string>;
  projectMembers?: null | Array<TaskUser>;
  onSaveProjectName?: (projectName: string) => void;
};

const GlobalTopNavbar: React.FC<GlobalTopNavbarProps> = ({
  initialTab,
  menuType,
  projectID,
  name,
  popupContent,
  projectMembers,
  onSaveProjectName,
  nameOnly,
}) => {
  console.log(popupContent);
  const { loading, data } = useMeQuery();
  const { showPopup, hidePopup, setTab } = usePopup();
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(initialTab);
  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);
  const { userID, setUserID } = useContext(UserIDContext);
  const onLogout = () => {
    fetch('http://localhost:3333/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(async x => {
      const { status } = x;
      if (status === 200) {
        history.replace('/login');
        setUserID(null);
        hidePopup();
      }
    });
  };
  const onProfileClick = ($target: React.RefObject<HTMLElement>) => {
    showPopup(
      $target,
      <Popup title={null} tab={0}>
        <ProfileMenu
          onLogout={onLogout}
          onAdminConsole={() => {
            history.push('/admin');
            hidePopup();
          }}
          onProfile={() => {
            history.push('/profile');
            hidePopup();
          }}
        />
      </Popup>,
      195,
    );
  };

  const onOpenSettings = ($target: React.RefObject<HTMLElement>) => {
    console.log('maybe firing popup');
    if (popupContent) {
      console.log('showing popup');
      showPopup($target, popupContent, 185);
    }
  };

  if (!userID) {
    return null;
  }
  return (
    <>
      <TopNavbar
        name={name}
        menuType={menuType}
        onOpenProjectFinder={$target => {
          showPopup(
            $target,
            <Popup tab={0} title={null}>
              <ProjectFinder />
            </Popup>,
          );
        }}
        currentTab={currentTab}
        user={data ? data.me : null}
        onNotificationClick={() => {}}
        onDashboardClick={() => {
          history.push('/');
        }}
        projectMembers={projectMembers}
        onProfileClick={onProfileClick}
        onSaveName={onSaveProjectName}
        onOpenSettings={onOpenSettings}
      />
    </>
  );
};

export default GlobalTopNavbar;
