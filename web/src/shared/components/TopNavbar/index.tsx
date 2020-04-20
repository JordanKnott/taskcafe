import React, { useRef } from 'react';
import { Bell } from 'shared/icons';

import {
  NotificationContainer,
  GlobalActions,
  ProjectActions,
  NavbarWrapper,
  NavbarHeader,
  Breadcrumbs,
  BreadcrumpSeparator,
  ProfileIcon,
  ProfileContainer,
  ProfileNameWrapper,
  ProfileNamePrimary,
  ProfileNameSecondary,
} from './Styles';

type NavBarProps = {
  onProfileClick: (bottom: number, right: number) => void;
  onNotificationClick: () => void;
  firstName: string;
  lastName: string;
  initials: string;
};
const NavBar: React.FC<NavBarProps> = ({ onProfileClick, onNotificationClick, firstName, lastName, initials }) => {
  const $profileRef: any = useRef(null);
  const handleProfileClick = () => {
    console.log('click');
    const boundingRect = $profileRef.current.getBoundingClientRect();
    onProfileClick(boundingRect.bottom, boundingRect.right);
  };
  return (
    <NavbarWrapper>
      <NavbarHeader>
        <ProjectActions>
          <Breadcrumbs>
            Projects
            <BreadcrumpSeparator>/</BreadcrumpSeparator>
            project name
            <BreadcrumpSeparator>/</BreadcrumpSeparator>
            Board
          </Breadcrumbs>
        </ProjectActions>
        <GlobalActions>
          <NotificationContainer onClick={onNotificationClick}>
            <Bell color="#c2c6dc" size={20} />
          </NotificationContainer>
          <ProfileContainer>
            <ProfileNameWrapper>
              <ProfileNamePrimary>
                {firstName} {lastName}
              </ProfileNamePrimary>
              <ProfileNameSecondary>Manager</ProfileNameSecondary>
            </ProfileNameWrapper>
            <ProfileIcon ref={$profileRef} onClick={handleProfileClick}>
              {initials}
            </ProfileIcon>
          </ProfileContainer>
        </GlobalActions>
      </NavbarHeader>
    </NavbarWrapper>
  );
};

export default NavBar;
