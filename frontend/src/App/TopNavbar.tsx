import React from 'react';
import TopNavbar, { MenuItem } from 'shared/components/TopNavbar';
import { ProfileMenu } from 'shared/components/DropdownMenu';
import ProjectSettings, { DeleteConfirm, DELETE_INFO } from 'shared/components/ProjectSettings';
import { useHistory } from 'react-router';
import { useCurrentUser } from 'App/context';
import { RoleCode, useTopNavbarQuery, useDeleteProjectMutation, GetProjectsDocument } from 'shared/generated/graphql';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import produce from 'immer';
import MiniProfile from 'shared/components/MiniProfile';
import cache from 'App/cache';
import NotificationPopup, { NotificationItem } from 'shared/components/NotifcationPopup';
import theme from './ThemeStyles';
import ProjectFinder from './ProjectFinder';

type ProjectPopupProps = {
  history: any;
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

      const newData = produce(cacheData, (draftState: any) => {
        draftState.projects = draftState.projects.filter(
          (project: any) => project.id !== deleteData.data?.deleteProject.project.id,
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
            setTab(1, { width: 300 });
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
  teamID?: string | null;
  onChangeProjectOwner?: (userID: string) => void;
  name: string | null;
  currentTab?: number;
  popupContent?: JSX.Element;
  menuType?: Array<MenuItem>;
  onChangeRole?: (userID: string, roleCode: RoleCode) => void;
  projectMembers?: null | Array<TaskUser>;
  projectInvitedMembers?: null | Array<InvitedUser>;
  onSaveProjectName?: (projectName: string) => void;
  onInviteUser?: ($target: React.RefObject<HTMLElement>) => void;
  onSetTab?: (tab: number) => void;
  onRemoveFromBoard?: (userID: string) => void;
  onRemoveInvitedFromBoard?: (email: string) => void;
};

const GlobalTopNavbar: React.FC<GlobalTopNavbarProps> = ({
  currentTab,
  onSetTab,
  menuType,
  teamID,
  onChangeProjectOwner,
  onChangeRole,
  name,
  popupContent,
  projectMembers,
  projectInvitedMembers,
  onInviteUser,
  onSaveProjectName,
  onRemoveInvitedFromBoard,
  onRemoveFromBoard,
}) => {
  const { user, setUser } = useCurrentUser();
  const { loading, data } = useTopNavbarQuery({
    // TODO: maybe remove?
    onCompleted: response => {},
  });
  const { showPopup, hidePopup } = usePopup();
  const history = useHistory();
  const onLogout = () => {
    fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(async x => {
      const { status } = x;
      if (status === 200) {
        cache.reset();
        history.replace('/login');
        setUser(null);
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
          showAdminConsole={true} // TODO: add permision check
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
      { width: 195 },
    );
  };

  const onOpenSettings = ($target: React.RefObject<HTMLElement>) => {
    if (popupContent) {
      showPopup($target, popupContent, { width: 185 });
    }
  };

  const onNotificationClick = ($target: React.RefObject<HTMLElement>) => {
    if (data) {
      showPopup(
        $target,
        <NotificationPopup>
          {data.notifications.map(notification => (
            <NotificationItem
              title={notification.entity.name}
              description={`${notification.actor.name} added you as a meber to the task "${notification.entity.name}"`}
              createdAt={notification.createdAt}
            />
          ))}
        </NotificationPopup>,
        { width: 415, borders: false, diamondColor: theme.colors.primary },
      );
    }
  };

  if (!user) {
    return null;
  }
  // TODO: readd permision check
  // const userIsTeamOrProjectAdmin = user.isAdmin(PermissionLevel.TEAM, PermissionObjectType.TEAM, teamID);
  const userIsTeamOrProjectAdmin = true;
  const onInvitedMemberProfile = ($targetRef: React.RefObject<HTMLElement>, email: string) => {
    const member = projectInvitedMembers ? projectInvitedMembers.find(u => u.email === email) : null;
    if (member) {
      showPopup(
        $targetRef,
        <MiniProfile
          onRemoveFromBoard={() => {
            if (onRemoveInvitedFromBoard) {
              onRemoveInvitedFromBoard(member.email);
            }
          }}
          invited
          user={{
            id: member.email,
            fullName: member.email,
            bio: 'Invited',
            profileIcon: {
              bgColor: '#000',
              url: null,
              initials: member.email.charAt(0),
            },
          }}
          bio=""
        />,
      );
    }
  };

  const onMemberProfile = ($targetRef: React.RefObject<HTMLElement>, memberID: string) => {
    const member = projectMembers ? projectMembers.find(u => u.id === memberID) : null;
    const warning =
      'You can’t leave because you are the only admin. To make another user an admin, click their avatar, select “Change permissions…”, and select “Admin”.';
    if (member) {
      showPopup(
        $targetRef,
        <MiniProfile
          warning={member.role && member.role.code === 'owner' ? warning : null}
          canChangeRole={userIsTeamOrProjectAdmin}
          onChangeRole={roleCode => {
            if (onChangeRole) {
              onChangeRole(member.id, roleCode);
            }
          }}
          onRemoveFromBoard={
            member.role && member.role.code === 'owner'
              ? undefined
              : () => {
                  if (onRemoveFromBoard) {
                    onRemoveFromBoard(member.id);
                  }
                }
          }
          user={member}
          bio=""
        />,
      );
    }
  };

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
        user={data ? data.me.user : null}
        canEditProjectName={userIsTeamOrProjectAdmin}
        canInviteUser={userIsTeamOrProjectAdmin}
        onMemberProfile={onMemberProfile}
        onInvitedMemberProfile={onInvitedMemberProfile}
        onInviteUser={onInviteUser}
        onChangeRole={onChangeRole}
        onChangeProjectOwner={onChangeProjectOwner}
        onNotificationClick={onNotificationClick}
        onSetTab={onSetTab}
        onRemoveFromBoard={onRemoveFromBoard}
        onDashboardClick={() => {
          history.push('/');
        }}
        onMyTasksClick={() => {
          history.push('/tasks');
        }}
        projectMembers={projectMembers}
        projectInvitedMembers={projectInvitedMembers}
        onProfileClick={onProfileClick}
        onSaveName={onSaveProjectName}
        onOpenSettings={onOpenSettings}
      />
    </>
  );
};

export default GlobalTopNavbar;
