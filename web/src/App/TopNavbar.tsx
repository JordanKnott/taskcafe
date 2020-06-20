import React, { useState, useContext } from 'react';
import TopNavbar from 'shared/components/TopNavbar';
import DropdownMenu, { ProfileMenu } from 'shared/components/DropdownMenu';
import ProjectSettings, { DeleteProject } from 'shared/components/ProjectSettings';
import { useHistory } from 'react-router';
import UserIDContext from 'App/context';
import { useMeQuery, useDeleteProjectMutation, GetProjectsDocument } from 'shared/generated/graphql';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import produce from 'immer';

type GlobalTopNavbarProps = {
  projectID: string | null;
  name: string | null;
  projectMembers?: null | Array<TaskUser>;
  onSaveProjectName?: (projectName: string) => void;
};
const GlobalTopNavbar: React.FC<GlobalTopNavbarProps> = ({ projectID, name, projectMembers, onSaveProjectName }) => {
  const { loading, data } = useMeQuery();
  const { showPopup, hidePopup, setTab } = usePopup();
  const history = useHistory();
  const { userID, setUserID } = useContext(UserIDContext);
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
          onProfile={() => {
            history.push('/profile');
            hidePopup();
          }}
        />
      </Popup>,
      185,
    );
  };

  const onOpenSettings = ($target: React.RefObject<HTMLElement>) => {
    showPopup(
      $target,
      <>
        <Popup title={null} tab={0}>
          <ProjectSettings
            onDeleteProject={() => {
              setTab(1, 325);
            }}
          />
        </Popup>
        <Popup title={`Delete the "${name}" project?`} tab={1}>
          <DeleteProject
            name={name ?? ''}
            onDeleteProject={() => {
              if (projectID) {
                deleteProject({ variables: { projectID } });
                hidePopup();
                history.push('/projects');
              }
            }}
          />
        </Popup>
      </>,
      185,
    );
  };

  if (!userID) {
    return null;
  }
  return (
    <>
      <TopNavbar
        projectName={name}
        user={data ? data.me : null}
        onNotificationClick={() => {}}
        projectMembers={projectMembers}
        onProfileClick={onProfileClick}
        onSaveProjectName={onSaveProjectName}
        onOpenSettings={onOpenSettings}
      />
    </>
  );
};

export default GlobalTopNavbar;
