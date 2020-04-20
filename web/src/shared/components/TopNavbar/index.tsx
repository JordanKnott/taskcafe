import React, { useRef } from 'react';
import { Bell } from 'shared/icons';

import {
  NotificationContainer,
  GlobalActions,
  ProjectActions,
  ProjectMeta,
  ProjectName,
  ProjectTabs,
  ProjectTab,
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
  bgColor: string;
  firstName: string;
  lastName: string;
  initials: string;
};
const NavBar: React.FC<NavBarProps> = ({
  onProfileClick,
  onNotificationClick,
  firstName,
  lastName,
  initials,
  bgColor,
}) => {
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
          <ProjectMeta>
            <ProjectName>Production Team</ProjectName>
          </ProjectMeta>
          <ProjectTabs>
            <ProjectTab>Board</ProjectTab>
          </ProjectTabs>
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
            <ProfileIcon ref={$profileRef} onClick={handleProfileClick} bgColor={bgColor}>
              {initials}
            </ProfileIcon>
          </ProfileContainer>
        </GlobalActions>
      </NavbarHeader>
    </NavbarWrapper>
  );
};

export default NavBar;
