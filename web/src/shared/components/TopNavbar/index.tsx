import React, { useRef, useState, useEffect } from 'react';
import { Star, Ellipsis, Bell, Cog, AngleDown } from 'shared/icons';

import {
  NotificationContainer,
  ProjectNameTextarea,
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

type ProjectHeadingProps = {
  projectName: string;
  onSaveProjectName?: (projectName: string) => void;
  onOpenSettings: ($target: React.RefObject<HTMLElement>) => void;
};

const ProjectHeading: React.FC<ProjectHeadingProps> = ({
  projectName: initialProjectName,
  onSaveProjectName,
  onOpenSettings,
}) => {
  const [isEditProjectName, setEditProjectName] = useState(false);
  const [projectName, setProjectName] = useState(initialProjectName);
  const $projectName = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isEditProjectName && $projectName && $projectName.current) {
      $projectName.current.focus();
      $projectName.current.select();
    }
  }, [isEditProjectName]);
  useEffect(() => {
    setProjectName(initialProjectName);
  }, [initialProjectName]);

  const onProjectNameChange = (event: React.FormEvent<HTMLTextAreaElement>): void => {
    setProjectName(event.currentTarget.value);
  };
  const onProjectNameBlur = () => {
    if (onSaveProjectName) {
      onSaveProjectName(projectName);
    }
    setEditProjectName(false);
  };
  const onProjectNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if ($projectName && $projectName.current) {
        $projectName.current.blur();
      }
    }
  };

  const $settings = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Separator>»</Separator>
      {isEditProjectName ? (
        <ProjectNameTextarea
          ref={$projectName}
          onChange={onProjectNameChange}
          onKeyDown={onProjectNameKeyDown}
          onBlur={onProjectNameBlur}
          spellCheck={false}
          value={projectName}
        />
      ) : (
        <ProjectName
          onClick={() => {
            setEditProjectName(true);
          }}
        >
          {projectName}
        </ProjectName>
      )}
      <ProjectSettingsButton
        onClick={() => {
          onOpenSettings($settings);
        }}
        ref={$settings}
      >
        <AngleDown color="#c2c6dc" />
      </ProjectSettingsButton>
      <ProjectSettingsButton>
        <Star width={16} height={16} color="#c2c6dc" />
      </ProjectSettingsButton>
    </>
  );
};

type NavBarProps = {
  projectName: string | null;
  onProfileClick: (bottom: number, right: number) => void;
  onSaveProjectName?: (projectName: string) => void;
  onNotificationClick: () => void;
  bgColor: string;
  onOpenSettings: ($target: React.RefObject<HTMLElement>) => void;
  firstName: string;
  lastName: string;
  initials: string;
  projectMembers?: Array<TaskUser> | null;
};

const NavBar: React.FC<NavBarProps> = ({
  projectName,
  onSaveProjectName,
  onProfileClick,
  onNotificationClick,
  firstName,
  lastName,
  initials,
  bgColor,
  projectMembers,
  onOpenSettings,
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
            {projectName && (
              <ProjectHeading
                onOpenSettings={onOpenSettings}
                projectName={projectName}
                onSaveProjectName={onSaveProjectName}
              />
            )}
          </ProjectMeta>
          {projectName && (
            <ProjectTabs>
              <ProjectTab active>Board</ProjectTab>
              <ProjectTab>Calender</ProjectTab>
              <ProjectTab>Timeline</ProjectTab>
              <ProjectTab>Wiki</ProjectTab>
            </ProjectTabs>
          )}
        </ProjectActions>
        <GlobalActions>
          {projectMembers && (
            <ProjectMembers>
              {projectMembers.map(member => (
                <TaskAssignee key={member.id} size={28} member={member} onMemberProfile={onMemberProfile} />
              ))}
              <InviteButton>Invite</InviteButton>
            </ProjectMembers>
          )}
          <NotificationContainer onClick={onNotificationClick}>
            <Bell color="#c2c6dc" size={20} />
          </NotificationContainer>
          <ProfileContainer>
            <ProfileNameWrapper>
              <ProfileNamePrimary>{`${firstName} ${lastName}`}</ProfileNamePrimary>
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
