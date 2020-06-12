import React, { useState, useContext } from 'react';
import TopNavbar from 'shared/components/TopNavbar';
import DropdownMenu, { ProfileMenu } from 'shared/components/DropdownMenu';
import ProjectSettings from 'shared/components/ProjectSettings';
import { useHistory } from 'react-router';
import UserIDContext from 'App/context';
import { useMeQuery } from 'shared/generated/graphql';
import { usePopup, Popup } from 'shared/components/PopupMenu';

type GlobalTopNavbarProps = {
  name: string | null;
  projectMembers?: null | Array<TaskUser>;
  onSaveProjectName?: (projectName: string) => void;
};
const GlobalTopNavbar: React.FC<GlobalTopNavbarProps> = ({ name, projectMembers, onSaveProjectName }) => {
  const { loading, data } = useMeQuery();
  const { showPopup, hidePopup } = usePopup();
  const history = useHistory();
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
      <Popup title={null} tab={0}>
        <ProjectSettings />
      </Popup>,
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
