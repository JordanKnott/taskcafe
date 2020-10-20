import React, { useRef, useState, useEffect } from 'react';
import { Home, Star, Bell, AngleDown, BarChart, CheckCircle, ListUnordered } from 'shared/icons';
import styled from 'styled-components';
import ProfileIcon from 'shared/components/ProfileIcon';
import { usePopup } from 'shared/components/PopupMenu';
import { RoleCode } from 'shared/generated/graphql';
import NOOP from 'shared/utils/noop';
import { useHistory } from 'react-router';
import {
  TaskcafeLogo,
  TaskcafeTitle,
  ProjectFinder,
  LogoContainer,
  NavSeparator,
  IconContainerWrapper,
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
  ProjectMember,
  ProjectMembers,
} from './Styles';

type IconContainerProps = {
  disabled?: boolean;
  onClick?: ($target: React.RefObject<HTMLElement>) => void;
};

const IconContainer: React.FC<IconContainerProps> = ({ onClick, disabled = false, children }) => {
  const $container = useRef<HTMLDivElement>(null);
  return (
    <IconContainerWrapper
      ref={$container}
      disabled={disabled}
      onClick={() => {
        if (onClick) {
          onClick($container);
        }
      }}
    >
      {children}
    </IconContainerWrapper>
  );
};

const HomeDashboard = styled(Home)``;

type ProjectHeadingProps = {
  onFavorite?: () => void;
  name: string;
  canEditProjectName: boolean;
  onSaveProjectName?: (projectName: string) => void;
  onOpenSettings: ($target: React.RefObject<HTMLElement>) => void;
};

const ProjectHeading: React.FC<ProjectHeadingProps> = ({
  onFavorite,
  name: initialProjectName,
  onSaveProjectName,
  canEditProjectName,
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
            if (canEditProjectName) {
              setEditProjectName(true);
            }
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

export type MenuItem = {
  name: string;
  link: string;
};
type MenuTypes = {
  [key: string]: Array<string>;
};

export const MENU_TYPES: MenuTypes = {
  PROJECT_MENU: ['Board', 'Timeline', 'Calender'],
  TEAM_MENU: ['Projects', 'Members', 'Settings'],
};

type NavBarProps = {
  menuType?: Array<MenuItem> | null;
  name: string | null;
  currentTab?: number;
  onSetTab?: (tab: number) => void;
  onOpenProjectFinder: ($target: React.RefObject<HTMLElement>) => void;
  onChangeProjectOwner?: (userID: string) => void;
  onChangeRole?: (userID: string, roleCode: RoleCode) => void;
  onFavorite?: () => void;
  onProfileClick: ($target: React.RefObject<HTMLElement>) => void;
  onSaveName?: (name: string) => void;
  onNotificationClick: ($target: React.RefObject<HTMLElement>) => void;
  canEditProjectName?: boolean;
  canInviteUser?: boolean;
  onInviteUser?: ($target: React.RefObject<HTMLElement>) => void;
  onDashboardClick: () => void;
  user: TaskUser | null;
  onOpenSettings: ($target: React.RefObject<HTMLElement>) => void;
  projectMembers?: Array<TaskUser> | null;
  projectInvitedMembers?: Array<InvitedUser> | null;

  onRemoveFromBoard?: (userID: string) => void;
  onMemberProfile?: ($targetRef: React.RefObject<HTMLElement>, memberID: string) => void;
  onInvitedMemberProfile?: ($targetRef: React.RefObject<HTMLElement>, email: string) => void;
};

const NavBar: React.FC<NavBarProps> = ({
  menuType,
  canInviteUser = false,
  onInviteUser,
  onChangeProjectOwner,
  currentTab,
  onMemberProfile,
  onInvitedMemberProfile,
  canEditProjectName = false,
  onOpenProjectFinder,
  onFavorite,
  onSetTab,
  projectInvitedMembers,
  onChangeRole,
  name,
  onRemoveFromBoard,
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
  const history = useHistory();
  const { showPopup } = usePopup();
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
                canEditProjectName={canEditProjectName}
                onSaveProjectName={onSaveName}
              />
            )}
          </ProjectMeta>
          {name && (
            <ProjectTabs>
              {menuType &&
                menuType.map((menu, idx) => {
                  return (
                    <ProjectTab
                      key={menu.name}
                      to={menu.link}
                      exact
                      onClick={() => {
                        // TODO
                      }}
                    >
                      {menu.name}
                    </ProjectTab>
                  );
                })}
            </ProjectTabs>
          )}
        </ProjectActions>
        <LogoContainer to="/">
          <TaskcafeLogo width={32} height={32} />
          <TaskcafeTitle>Taskcafé</TaskcafeTitle>
        </LogoContainer>
        <GlobalActions>
          {projectMembers && projectInvitedMembers && onMemberProfile && onInvitedMemberProfile && (
            <>
              <ProjectMembers>
                {projectMembers.map((member, idx) => (
                  <ProjectMember
                    showRoleIcons
                    zIndex={projectMembers.length - idx + projectInvitedMembers.length}
                    key={member.id}
                    size={28}
                    member={member}
                    onMemberProfile={onMemberProfile}
                  />
                ))}
                {projectInvitedMembers.map((member, idx) => (
                  <ProjectMember
                    showRoleIcons
                    zIndex={projectInvitedMembers.length - idx}
                    key={member.email}
                    size={28}
                    invited
                    member={{
                      id: member.email,
                      fullName: member.email,
                      profileIcon: {
                        url: null,
                        initials: member.email.charAt(0),
                        bgColor: '#fff',
                      },
                    }}
                    onMemberProfile={onInvitedMemberProfile}
                  />
                ))}
                {canInviteUser && (
                  <InviteButton
                    onClick={$target => {
                      if (onInviteUser) {
                        onInviteUser($target);
                      }
                    }}
                    variant="outline"
                  >
                    Invite
                  </InviteButton>
                )}
              </ProjectMembers>
              <NavSeparator />
            </>
          )}
          <ProjectFinder onClick={onOpenProjectFinder} variant="gradient">
            Projects
          </ProjectFinder>
          <IconContainer onClick={() => onDashboardClick()}>
            <HomeDashboard width={20} height={20} />
          </IconContainer>
          <IconContainer disabled onClick={NOOP}>
            <CheckCircle width={20} height={20} />
          </IconContainer>
          <IconContainer disabled onClick={NOOP}>
            <ListUnordered width={20} height={20} />
          </IconContainer>
          <IconContainer disabled onClick={onNotificationClick}>
            <Bell color="#c2c6dc" size={20} />
          </IconContainer>
          <IconContainer disabled onClick={NOOP}>
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
