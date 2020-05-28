import React, { useRef } from 'react';
import { Star, Bell, Cog, AngleDown } from 'shared/icons';

import {
  NotificationContainer,
  InviteButton,
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
  ProjectMembers,
} from './Styles';
import TaskAssignee from 'shared/components/TaskAssignee';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import MiniProfile from 'shared/components/MiniProfile';

type NavBarProps = {
  projectName: string;
  onProfileClick: (bottom: number, right: number) => void;
  onNotificationClick: () => void;
  bgColor: string;
  firstName: string;
  lastName: string;
  initials: string;
  projectMembers?: Array<TaskUser> | null;
};
const NavBar: React.FC<NavBarProps> = ({
  projectName,
  onProfileClick,
  onNotificationClick,
  firstName,
  lastName,
  initials,
  bgColor,
  projectMembers,
}) => {
  const $profileRef: any = useRef(null);
  const handleProfileClick = () => {
    const boundingRect = $profileRef.current.getBoundingClientRect();
    onProfileClick(boundingRect.bottom, boundingRect.right);
  };
  const { showPopup } = usePopup();
  const onMemberProfile = ($targetRef: React.RefObject<HTMLElement>, memberID: string) => {
    showPopup(
      $targetRef,
      <Popup title={null} onClose={() => {}} tab={0}>
        <MiniProfile
          profileIcon={projectMembers ? projectMembers[0].profileIcon : { url: null, initials: 'JK', bgColor: '#000' }}
          displayName="Jordan Knott"
          username="@jordanthedev"
          bio="None"
          onRemoveFromTask={() => {}}
        />
      </Popup>,
    );
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
            <ProjectSettingsButton>
              <Star width={16} height={16} color="#c2c6dc" />
            </ProjectSettingsButton>
          </ProjectMeta>
          <ProjectTabs>
            <ProjectTab active>Board</ProjectTab>
            <ProjectTab>Calender</ProjectTab>
            <ProjectTab>Timeline</ProjectTab>
            <ProjectTab>Wiki</ProjectTab>
          </ProjectTabs>
        </ProjectActions>
        <GlobalActions>
          {projectMembers && (
            <ProjectMembers>
              {projectMembers.map(member => (
                <TaskAssignee key={member.userID} size={28} member={member} onMemberProfile={onMemberProfile} />
              ))}
              <InviteButton>Invite</InviteButton>
            </ProjectMembers>
          )}
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
