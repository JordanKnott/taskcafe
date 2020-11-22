import React from 'react';
import { Popup, usePopup } from 'shared/components/PopupMenu';
import { RoleCode } from 'shared/generated/graphql';

import {
  RoleCheckmark,
  RoleName,
  RoleDescription,
  Profile,
  Content,
  DeleteDescription,
  RemoveMemberButton,
  WarningText,
  ProfileIcon,
  Separator,
  ProfileInfo,
  InfoTitle,
  InfoUsername,
  InfoBio,
  CurrentPermission,
  MiniProfileActions,
  MiniProfileActionWrapper,
  MiniProfileActionItem,
} from './Styles';

const permissions = [
  {
    code: 'owner',
    name: 'Owner',
    description:
      'Can view and edit cards, remove members, and change all settings for the project. Can delete the project.',
  },
  {
    code: 'admin',
    name: 'Admin',
    description: 'Can view and edit cards, remove members, and change all settings for the project.',
  },

  { code: 'member', name: 'Member', description: "Can view and edit cards. Can't change settings." },
  {
    code: 'observer',
    name: 'Observer',
    description: "Can view, comment, and vote on cards. Can't move or edit cards or change settings.",
  },
];

type MiniProfileProps = {
  bio: string;
  user: TaskUser;
  invited?: boolean;
  onRemoveFromTask?: () => void;
  onChangeRole?: (roleCode: RoleCode) => void;
  onRemoveFromBoard?: () => void;
  warning?: string | null;
  canChangeRole?: boolean;
};
const MiniProfile: React.FC<MiniProfileProps> = ({
  user,
  bio,
  invited,
  canChangeRole,
  onRemoveFromTask,
  onChangeRole,
  onRemoveFromBoard,
  warning,
}) => {
  const { hidePopup, setTab } = usePopup();
  return (
    <>
      <Popup title={null} onClose={() => hidePopup()} tab={0}>
        <Profile>
          {user.profileIcon && (
            <ProfileIcon bgUrl={user.profileIcon.url ?? null} bgColor={user.profileIcon.bgColor ?? ''}>
              {user.profileIcon.url === null && user.profileIcon.initials}
            </ProfileIcon>
          )}
          <ProfileInfo>
            <InfoTitle>{user.fullName}</InfoTitle>
            {invited ? <InfoUsername>Invited</InfoUsername> : <InfoUsername>{`@${user.username}`}</InfoUsername>}
            <InfoBio>{bio}</InfoBio>
          </ProfileInfo>
        </Profile>
        <MiniProfileActions>
          <MiniProfileActionWrapper>
            {onRemoveFromTask && (
              <MiniProfileActionItem
                onClick={() => {
                  onRemoveFromTask();
                }}
              >
                Remove from card
              </MiniProfileActionItem>
            )}
            {onChangeRole && user.role && (
              <MiniProfileActionItem
                onClick={() => {
                  setTab(1);
                }}
              >
                Change permissions...
                <CurrentPermission>{`(${user.role.name})`}</CurrentPermission>
              </MiniProfileActionItem>
            )}
            {onRemoveFromBoard && (
              <MiniProfileActionItem
                onClick={() => {
                  setTab(2);
                }}
              >
                Remove from board...
              </MiniProfileActionItem>
            )}
          </MiniProfileActionWrapper>
        </MiniProfileActions>
        {warning && (
          <>
            <Separator />
            <WarningText>{warning}</WarningText>
          </>
        )}
      </Popup>

      <Popup title="Change Permissions" onClose={() => hidePopup()} tab={1}>
        <MiniProfileActions>
          <MiniProfileActionWrapper>
            {permissions
              .filter(p => (user.role && user.role.code === 'owner') || p.code !== 'owner')
              .map(perm => (
                <MiniProfileActionItem
                  disabled={user.role && perm.code !== user.role.code && !canChangeRole}
                  key={perm.code}
                  onClick={() => {
                    if (onChangeRole && user.role && perm.code !== user.role.code) {
                      switch (perm.code) {
                        case 'owner':
                          onChangeRole(RoleCode.Owner);
                          break;
                        case 'admin':
                          onChangeRole(RoleCode.Admin);
                          break;
                        case 'member':
                          onChangeRole(RoleCode.Member);
                          break;
                        case 'observer':
                          onChangeRole(RoleCode.Observer);
                          break;
                        default:
                          break;
                      }
                      hidePopup();
                    }
                  }}
                >
                  <RoleName>
                    {perm.name}
                    {user.role && perm.code === user.role.code && <RoleCheckmark width={12} height={12} />}
                  </RoleName>
                  <RoleDescription>{perm.description}</RoleDescription>
                </MiniProfileActionItem>
              ))}
          </MiniProfileActionWrapper>
          {user.role && user.role.code === 'owner' && (
            <>
              <Separator />
              <WarningText>You can not change roles because there must be an owner.</WarningText>
            </>
          )}
        </MiniProfileActions>
      </Popup>
      <Popup title="Remove Member?" onClose={() => hidePopup()} tab={2}>
        <Content>
          <DeleteDescription>
            The member will be removed from all cards on this project. They will receive a notification.
          </DeleteDescription>
          <RemoveMemberButton
            color="danger"
            onClick={() => {
              if (onRemoveFromBoard) {
                onRemoveFromBoard();
              }
            }}
          >
            Remove Member
          </RemoveMemberButton>
        </Content>
      </Popup>
    </>
  );
};

export default MiniProfile;
