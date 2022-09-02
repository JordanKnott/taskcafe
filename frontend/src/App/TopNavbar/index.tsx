import React, { useState } from 'react';
import TopNavbar, { MenuItem } from 'shared/components/TopNavbar';
import LoggedOutNavbar from 'shared/components/TopNavbar/LoggedOut';
import { ProfileMenu } from 'shared/components/DropdownMenu';
import polling from 'shared/utils/polling';
import { useHistory, useRouteMatch } from 'react-router';
import { useCurrentUser } from 'App/context';
import {
  RoleCode,
  useTopNavbarQuery,
  useNotificationAddedSubscription,
  useHasUnreadNotificationsQuery,
} from 'shared/generated/graphql';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import MiniProfile from 'shared/components/MiniProfile';
import cache from 'App/cache';
import NotificationPopup, { NotificationItem } from 'shared/components/NotifcationPopup';
import theme from 'App/ThemeStyles';
import ProjectFinder from './ProjectFinder';

// TODO: Move to context based navbar?

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

const LoggedInNavbar: React.FC<GlobalTopNavbarProps> = ({
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
  const [notifications, setNotifications] = useState<Array<{ id: string; notification: { actionType: string } }>>([]);
  const { data } = useTopNavbarQuery({
    onCompleted: (d) => {
      setNotifications((n) => [...n, ...d.notifications]);
    },
  });
  const { data: nData, loading } = useNotificationAddedSubscription({
    onSubscriptionData: (d) => {
      setNotifications((n) => {
        if (d.subscriptionData.data) {
          return [...n, d.subscriptionData.data.notificationAdded];
        }
        return n;
      });
    },
  });
  const { showPopup, hidePopup } = usePopup();
  const { setUser } = useCurrentUser();
  const { data: unreadData, refetch: refetchHasUnread } = useHasUnreadNotificationsQuery({
    pollInterval: polling.UNREAD_NOTIFICATIONS,
  });
  const history = useHistory();
  const onLogout = () => {
    fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).then(async (x) => {
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
          showAdminConsole // TODO: add permision check
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

  // TODO: rewrite popup to contain subscription and notification fetch
  const onNotificationClick = ($target: React.RefObject<HTMLElement>) => {
    showPopup($target, <NotificationPopup onToggleRead={() => refetchHasUnread()} />, {
      width: 605,
      borders: false,
      diamondColor: theme.colors.primary,
    });
  };

  // TODO: readd permision check
  // const userIsTeamOrProjectAdmin = user.isAdmin(PermissionLevel.TEAM, PermissionObjectType.TEAM, teamID);
  const userIsTeamOrProjectAdmin = true;
  const onInvitedMemberProfile = ($targetRef: React.RefObject<HTMLElement>, email: string) => {
    const member = projectInvitedMembers ? projectInvitedMembers.find((u) => u.email === email) : null;
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
    const member = projectMembers ? projectMembers.find((u) => u.id === memberID) : null;
    const warning =
      'You can’t leave because you are the only admin. To make another user an admin, click their avatar, select “Change permissions…”, and select “Admin”.';
    if (member) {
      showPopup(
        $targetRef,
        <MiniProfile
          warning={member.role && member.role.code === 'owner' ? warning : null}
          canChangeRole={userIsTeamOrProjectAdmin}
          onChangeRole={(roleCode) => {
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

  const user = data ? data.me?.user : null;

  return (
    <>
      <TopNavbar
        hasUnread={unreadData ? unreadData.hasUnreadNotifications.unread : false}
        name={name}
        menuType={menuType}
        onOpenProjectFinder={($target) => {
          showPopup(
            $target,
            <Popup tab={0} title={null}>
              <ProjectFinder />
            </Popup>,
          );
        }}
        currentTab={currentTab}
        user={user ?? null}
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
  const { user } = useCurrentUser();
  const match = useRouteMatch();
  if (user) {
    return (
      <LoggedInNavbar
        currentTab={currentTab}
        projectID={null}
        onSetTab={onSetTab}
        menuType={menuType}
        teamID={teamID}
        onChangeRole={onChangeRole}
        onChangeProjectOwner={onChangeProjectOwner}
        name={name}
        popupContent={popupContent}
        projectMembers={projectMembers}
        projectInvitedMembers={projectInvitedMembers}
        onInviteUser={onInviteUser}
        onSaveProjectName={onSaveProjectName}
        onRemoveInvitedFromBoard={onRemoveInvitedFromBoard}
        onRemoveFromBoard={onRemoveFromBoard}
      />
    );
  }
  return <LoggedOutNavbar match={match.url} name={name} menuType={menuType} />;
};

export default GlobalTopNavbar;
