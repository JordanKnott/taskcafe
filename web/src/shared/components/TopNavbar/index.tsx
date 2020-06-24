import React, { useRef, useState, useEffect } from 'react';
import { Home, Star, Bell, AngleDown, BarChart, CheckCircle } from 'shared/icons';
import styled from 'styled-components';
import ProfileIcon from 'shared/components/ProfileIcon';
import TaskAssignee from 'shared/components/TaskAssignee';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import MiniProfile from 'shared/components/MiniProfile';
import {
  CitadelLogo,
  CitadelTitle,
  ProjectFinder,
  LogoContainer,
  NavSeparator,
  IconContainer,
  ProjectNameTextarea,
  InviteButton,
  GlobalActions,
  ProjectActions,
  ProjectMeta,
  ProjectName,
  ProjectTabs,
  ProjectTab,
  NavbarWrapper,
  NavbarHeader,
  ProjectSettingsButton,
  ProfileContainer,
  ProfileNameWrapper,
  ProfileNamePrimary,
  ProfileNameSecondary,
  ProjectMembers,
} from './Styles';
import { Link } from 'react-router-dom';

const HomeDashboard = styled(Home)``;

type ProjectHeadingProps = {
  onFavorite?: () => void;
  name: string;
  onSaveProjectName?: (projectName: string) => void;
  onOpenSettings: ($target: React.RefObject<HTMLElement>) => void;
};

const ProjectHeading: React.FC<ProjectHeadingProps> = ({
  onFavorite,
  name: initialProjectName,
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
      {onFavorite && (
        <ProjectSettingsButton onClick={() => onFavorite()}>
          <Star width={16} height={16} color="#c2c6dc" />
        </ProjectSettingsButton>
      )}
    </>
  );
};

type MenuType = {
  [key: number]: string;
};
type MenuTypes = {
  [key: string]: Array<string>;
};

export const MENU_TYPES: MenuTypes = {
  PROJECT_MENU: ['Board', 'Timeline', 'Calender'],
  TEAM_MENU: ['Projects', 'Members', 'Settings'],
};

type NavBarProps = {
  menuType?: Array<string> | null;
  name: string | null;
  currentTab?: number;
  onOpenProjectFinder: ($target: React.RefObject<HTMLElement>) => void;
  onFavorite?: () => void;
  onProfileClick: ($target: React.RefObject<HTMLElement>) => void;
  onTabClick?: (tab: number) => void;
  onSaveName?: (name: string) => void;
  onNotificationClick: () => void;
  onDashboardClick: () => void;
  user: TaskUser | null;
  onOpenSettings: ($target: React.RefObject<HTMLElement>) => void;
  projectMembers?: Array<TaskUser> | null;
};

const NavBar: React.FC<NavBarProps> = ({
  menuType,
  currentTab,
  onOpenProjectFinder,
  onFavorite,
  onTabClick,
  name,
  onSaveName,
  onProfileClick,
  onNotificationClick,
  onDashboardClick,
  user,
  projectMembers,
  onOpenSettings,
}) => {
  const handleProfileClick = ($target: React.RefObject<HTMLElement>) => {
    if ($target && $target.current) {
      onProfileClick($target);
    }
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
            {name && (
              <ProjectHeading
                onFavorite={onFavorite}
                onOpenSettings={onOpenSettings}
                name={name}
                onSaveProjectName={onSaveName}
              />
            )}
          </ProjectMeta>
          {name && (
            <ProjectTabs>
              {menuType &&
                menuType.map((name, idx) => {
                  console.log(`${name} : ${idx} === ${currentTab}`);
                  return (
                    <ProjectTab key={idx} active={currentTab === idx}>
                      {name}
                    </ProjectTab>
                  );
                })}
            </ProjectTabs>
          )}
        </ProjectActions>
        <LogoContainer to="/">
          <CitadelLogo width={24} height={24} />
          <CitadelTitle>Citadel</CitadelTitle>
        </LogoContainer>
        <GlobalActions>
          {projectMembers && (
            <>
              <ProjectMembers>
                {projectMembers.map(member => (
                  <TaskAssignee key={member.id} size={28} member={member} onMemberProfile={onMemberProfile} />
                ))}
                <InviteButton variant="outline">Invite</InviteButton>
              </ProjectMembers>
              <NavSeparator />
            </>
          )}
          <ProjectFinder onClick={onOpenProjectFinder} variant="gradient">
            Projects
          </ProjectFinder>
          <IconContainer onClick={onDashboardClick}>
            <HomeDashboard width={20} height={20} />
          </IconContainer>
          <IconContainer disabled>
            <CheckCircle width={20} height={20} />
          </IconContainer>
          <IconContainer onClick={onNotificationClick}>
            <Bell color="#c2c6dc" size={20} />
          </IconContainer>
          <IconContainer disabled>
            <BarChart width={20} height={20} />
          </IconContainer>

          {user && (
            <IconContainer>
              <ProfileIcon user={user} size={30} onProfileClick={handleProfileClick} />
            </IconContainer>
          )}
        </GlobalActions>
      </NavbarHeader>
    </NavbarWrapper>
  );
};

export default NavBar;
