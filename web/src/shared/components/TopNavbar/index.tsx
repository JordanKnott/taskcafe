import React, { useRef } from 'react';
import { Star, Bell, Cog, AngleDown } from 'shared/icons';

import {
  NotificationContainer,
  GlobalActions,
  ProjectActions,
  ProjectSwitcher,
  Separator,
  ProjectMeta,
  ProjectName,
  ProjectTabs,
  ProjectTab,
  NavbarWrapper,
  NavbarHeader,
  Breadcrumbs,
  BreadcrumpSeparator,
  ProjectSettingsButton,
  ProfileIcon,
  ProfileContainer,
  ProfileNameWrapper,
  ProfileNamePrimary,
  ProfileNameSecondary,
} from './Styles';

type NavBarProps = {
  projectName: string;
  onProfileClick: (bottom: number, right: number) => void;
  onNotificationClick: () => void;
  bgColor: string;
  firstName: string;
  lastName: string;
  initials: string;
};
const NavBar: React.FC<NavBarProps> = ({
  projectName,
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
            <ProjectSwitcher>Projects</ProjectSwitcher>
            <Separator>»</Separator>
            <ProjectName>{projectName}</ProjectName>
            <ProjectSettingsButton>
              <AngleDown color="#c2c6dc" />
            </ProjectSettingsButton>
            <Star filled color="#c2c6dc" />
          </ProjectMeta>
          <ProjectTabs>
            <ProjectTab active>Board</ProjectTab>
            <ProjectTab>Calender</ProjectTab>
            <ProjectTab>Timeline</ProjectTab>
            <ProjectTab>Wiki</ProjectTab>
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
