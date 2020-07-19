import React, { useState, useRef } from 'react';
import { UserPlus, Checkmark } from 'shared/icons';
import styled, { css } from 'styled-components';
import TaskAssignee from 'shared/components/TaskAssignee';
import Select from 'shared/components/Select';
import { User, Plus, Lock, Pencil, Trash } from 'shared/icons';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import { RoleCode, useUpdateUserRoleMutation } from 'shared/generated/graphql';
import Input from 'shared/components/Input';
import Member from 'shared/components/Member';

import Button from 'shared/components/Button';

export const RoleCheckmark = styled(Checkmark)`
  padding-left: 4px;
`;

const permissions = [
  {
    code: 'owner',
    name: 'Owner',
    description:
      'Can view, create and edit team projects, and change settings for the team. Will have admin rights on all projects in this team. Can delete the team and all team projects.',
  },
  {
    code: 'admin',
    name: 'Admin',
    description:
      'Can view, create and edit team projects, and change settings for the team. Will have admin rights on all projects in this team.',
  },

  { code: 'member', name: 'Member', description: 'Can view, create, and edit team projects, but not change settings.' },
];

export const RoleName = styled.div`
  font-size: 14px;
  font-weight: 700;
`;
export const RoleDescription = styled.div`
  margin-top: 4px;
  font-size: 14px;
`;

export const MiniProfileActions = styled.ul`
  list-style-type: none;
`;

export const MiniProfileActionWrapper = styled.li``;

export const MiniProfileActionItem = styled.span<{ disabled?: boolean }>`
  color: #c2c6dc;
  display: block;
  font-weight: 400;
  padding: 6px 12px;
  position: relative;
  text-decoration: none;

  ${(props) =>
    props.disabled
      ? css`
          user-select: none;
          pointer-events: none;
          color: rgba(${props.theme.colors.text.primary}, 0.4);
        `
      : css`
          cursor: pointer;
          &:hover {
            background: rgb(115, 103, 240);
          }
        `}
`;
export const Content = styled.div`
  padding: 0 12px 12px;
`;

export const CurrentPermission = styled.span`
  margin-left: 4px;
  color: rgba(${(props) => props.theme.colors.text.secondary}, 0.4);
`;

export const Separator = styled.div`
  height: 1px;
  border-top: 1px solid #414561;
  margin: 0.25rem !important;
`;

export const WarningText = styled.span`
  display: flex;
  color: rgba(${(props) => props.theme.colors.text.primary}, 0.4);
  padding: 6px;
`;

export const DeleteDescription = styled.div`
  font-size: 14px;
  color: rgba(${(props) => props.theme.colors.text.primary});
`;

export const RemoveMemberButton = styled(Button)`
  margin-top: 16px;
  padding: 6px 12px;
  width: 100%;
`;
type TeamRoleManagerPopupProps = {
  user: User;
  users: Array<User>;
  warning?: string | null;
  canChangeRole: boolean;
  onChangeRole: (roleCode: RoleCode) => void;
  updateUserPassword?: (user: TaskUser, password: string) => void;
  onDeleteUser?: (userID: string, newOwnerID: string | null) => void;
};

const TeamRoleManagerPopup: React.FC<TeamRoleManagerPopupProps> = ({
  warning,
  user,
  users,
  canChangeRole,
  onDeleteUser,
  updateUserPassword,
  onChangeRole,
}) => {
  const { hidePopup, setTab } = usePopup();
  const [userPass, setUserPass] = useState({ pass: '', passConfirm: '' });
  const [deleteUser, setDeleteUser] = useState<{ label: string; value: string } | null>(null);
  const hasOwned = user.owned.projects.length !== 0 || user.owned.teams.length !== 0;
  return (
    <>
      <Popup title={null} tab={0}>
        <MiniProfileActions>
          <MiniProfileActionWrapper>
            {user.role && (
              <MiniProfileActionItem
                onClick={() => {
                  setTab(1);
                }}
              >
                Change permissions...
                <CurrentPermission>{`(${user.role.name})`}</CurrentPermission>
              </MiniProfileActionItem>
            )}
            <MiniProfileActionItem
              onClick={() => {
                setTab(3);
              }}
            >
              Reset password...
            </MiniProfileActionItem>
            <MiniProfileActionItem onClick={() => setTab(2)}>Remove from organzation...</MiniProfileActionItem>
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
              .filter((p) => (user.role && user.role.code === 'owner') || p.code !== 'owner')
              .map((perm) => (
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
              <WarningText>You can't change roles because there must be an owner.</WarningText>
            </>
          )}
        </MiniProfileActions>
      </Popup>
      <Popup title="Remove from Organization?" onClose={() => hidePopup()} tab={2}>
        <Content>
          <DeleteDescription>
            Removing this user from the organzation will remove them from assigned tasks, projects, and teams.
          </DeleteDescription>
          {hasOwned && (
            <>
              <DeleteDescription>{`The user is the owner of ${user.owned.projects.length} projects & ${user.owned.teams.length} teams.`}</DeleteDescription>
              <DeleteDescription>
                Choose a new user to take over ownership of this user's teams & projects.
              </DeleteDescription>
              <UserSelect
                onChange={(v) => setDeleteUser(v)}
                value={deleteUser}
                options={users.map((u) => ({ label: u.fullName, value: u.id }))}
              />
            </>
          )}
          <UserPassConfirmButton
            disabled={!(!hasOwned || (hasOwned && deleteUser))}
            onClick={() => {
              if (onDeleteUser) {
                console.log(`${!hasOwned} || (${hasOwned} && ${deleteUser})`);
                if (!hasOwned || (hasOwned && deleteUser)) {
                  onDeleteUser(user.id, deleteUser ? deleteUser.value : null);
                }
              }
            }}
            color="danger"
          >
            Delete user
          </UserPassConfirmButton>
        </Content>
      </Popup>
      <Popup title="Really remove from Team?" onClose={() => hidePopup()} tab={4}>
        <Content>
          <DeleteDescription>
            Removing this user from the organzation will remove them from assigned tasks, projects, and teams.
          </DeleteDescription>
          <DeleteDescription>{`The user is the owner of ${user.owned.projects.length} projects & ${user.owned.teams.length} teams.`}</DeleteDescription>
          <UserSelect
            onChange={() => {}}
            value={null}
            options={users.map((u) => ({ label: u.fullName, value: u.id }))}
          />
          <UserPassConfirmButton
            onClick={() => {
              // onDeleteUser();
            }}
            color="danger"
          >
            Delete user
          </UserPassConfirmButton>
        </Content>
      </Popup>
      <Popup title="Reset password?" onClose={() => hidePopup()} tab={3}>
        <Content>
          <DeleteDescription>
            You can either set the user's new password directly or send the user an email allowing them to reset their
            own password.
          </DeleteDescription>
          <UserPassBar>
            <UserPassButton onClick={() => setTab(4)} color="warning">
              Set password...
            </UserPassButton>
            <UserPassButton color="warning" variant="outline">
              Send reset link
            </UserPassButton>
          </UserPassBar>
        </Content>
      </Popup>
      <Popup title="Reset password" onClose={() => hidePopup()} tab={4}>
        <Content>
          <NewUserPassInput defaultValue={userPass.pass} width="100%" variant="alternate" placeholder="New password" />
          <NewUserPassInput
            defaultValue={userPass.passConfirm}
            width="100%"
            variant="alternate"
            placeholder="New password (confirm)"
          />
          <UserPassConfirmButton
            disabled={userPass.pass === '' || userPass.passConfirm === ''}
            onClick={() => {
              if (userPass.pass === userPass.passConfirm && updateUserPassword) {
                updateUserPassword(user, userPass.pass);
              }
            }}
            color="danger"
          >
            Set password
          </UserPassConfirmButton>
        </Content>
      </Popup>
    </>
  );
};
const UserSelect = styled(Select)`
  margin: 8px 0;
  padding: 8px 0;
`;

const NewUserPassInput = styled(Input)`
  margin: 8px 0;
`;
const InviteMemberButton = styled(Button)`
  padding: 7px 12px;
`;

const UserPassBar = styled.div`
  display: flex;
  padding-top: 8px;
`;
const UserPassConfirmButton = styled(Button)`
  width: 100%;
  padding: 7px 12px;
`;

const UserPassButton = styled(Button)`
  width: 50%;
  padding: 7px 12px;
  & ~ & {
    margin-left: 6px;
  }
`;

const MemberItemOptions = styled.div``;

const MemberItemOption = styled(Button)`
  padding: 7px 9px;
  margin: 4px 0 4px 8px;
  float: left;
  min-width: 95px;
`;

const MemberList = styled.div`
  border-top: 1px solid rgba(${(props) => props.theme.colors.border});
`;

const MemberListItem = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  border-bottom: 1px solid rgba(${(props) => props.theme.colors.border});
  min-height: 40px;
  padding: 12px 0 12px 40px;
  position: relative;
`;

const MemberListItemDetails = styled.div`
  float: left;
  flex: 1 0 auto;
  padding-left: 8px;
`;

const InviteIcon = styled(UserPlus)`
  padding-right: 4px;
`;

const MemberProfile = styled(TaskAssignee)`
  position: absolute;
  top: 16px;
  left: 0;
  margin: 0;
`;

const MemberItemName = styled.p`
  color: rgba(${(props) => props.theme.colors.text.secondary});
`;

const MemberItemUsername = styled.p`
  color: rgba(${(props) => props.theme.colors.text.primary});
`;

const MemberListHeader = styled.div`
  display: flex;
  flex-direction: column;
`;
const ListTitle = styled.h3`
  font-size: 18px;
  color: rgba(${(props) => props.theme.colors.text.secondary});
  margin-bottom: 12px;
`;
const ListDesc = styled.span`
  font-size: 16px;
  color: rgba(${(props) => props.theme.colors.text.primary});
`;
const FilterSearch = styled(Input)`
  margin: 0;
`;

const ListActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 18px;
`;

const MemberListWrapper = styled.div`
  flex: 1 1;
`;

const Root = styled.div`
  .ag-theme-material {
    --ag-foreground-color: #c2c6dc;
    --ag-secondary-foreground-color: #c2c6dc;
    --ag-background-color: transparent;
    --ag-header-background-color: transparent;
    --ag-header-foreground-color: #c2c6dc;
    --ag-border-color: #414561;

    --ag-row-hover-color: #262c49;
    --ag-header-cell-hover-background-color: #262c49;
    --ag-checkbox-unchecked-color: #c2c6dc;
    --ag-checkbox-indeterminate-color: rgba(115, 103, 240);
    --ag-selected-row-background-color: #262c49;
    --ag-material-primary-color: rgba(115, 103, 240);
    --ag-material-accent-color: rgba(115, 103, 240);
  }
  .ag-theme-material ::-webkit-scrollbar {
    width: 12px;
  }

  .ag-theme-material ::-webkit-scrollbar-track {
    background: #262c49;
    border-radius: 20px;
  }

  .ag-theme-material ::-webkit-scrollbar-thumb {
    background: #7367f0;
    border-radius: 20px;
  }
  .ag-header-cell-text {
    color: #fff;
    font-weight: 700;
  }
`;

const Header = styled.div`
  border-bottom: 1px solid #e2e2e2;
  flex-direction: row;
  box-sizing: border-box;
  display: flex;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  background: transparent;
  border-bottom-color: #414561;
  color: #fff;

  height: 112px;
  min-height: 112px;
`;

const EditUserIcon = styled(Pencil)``;

const LockUserIcon = styled(Lock)``;

const DeleteUserIcon = styled(Trash)``;

type ActionButtonProps = {
  onClick: ($target: React.RefObject<HTMLElement>) => void;
};

const ActionButtonWrapper = styled.div`
  margin-right: 8px;
  cursor: pointer;
  display: inline-flex;
`;

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children }) => {
  const $wrapper = useRef<HTMLDivElement>(null);
  return (
    <ActionButtonWrapper onClick={() => onClick($wrapper)} ref={$wrapper}>
      {children}
    </ActionButtonWrapper>
  );
};

const ActionButtons = (params: any) => {
  return (
    <>
      <ActionButton onClick={() => {}}>
        <EditUserIcon width={16} height={16} />
      </ActionButton>
      <ActionButton onClick={($target) => params.onDeleteUser($target, params.value)}>
        <DeleteUserIcon width={16} height={16} />
      </ActionButton>
    </>
  );
};

const Wrapper = styled.div`
  background: #eff2f7;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Container = styled.div`
  padding: 2.2rem;
  display: flex;
  width: 100%;
  max-width: 1400px;
  position: relative;
  margin: 0 auto;
`;

const TabNav = styled.div`
  float: left;
  width: 220px;
  height: 100%;
  display: block;
  position: relative;
`;

const TabNavContent = styled.ul`
  display: block;
  width: auto;
  border-bottom: 0 !important;
  border-right: 1px solid rgba(0, 0, 0, 0.05);
`;

const TabNavItem = styled.li`
  padding: 0.35rem 0.3rem;
  height: 48px;
  display: block;
  position: relative;
`;
const TabNavItemButton = styled.button<{ active: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;

  padding-top: 10px !important;
  padding-bottom: 10px !important;
  padding-left: 12px !important;
  padding-right: 8px !important;
  width: 100%;
  position: relative;

  color: ${(props) => (props.active ? 'rgba(115, 103, 240)' : '#c2c6dc')};
  &:hover {
    color: rgba(115, 103, 240);
  }
  &:hover svg {
    fill: rgba(115, 103, 240);
  }
`;

const TabNavItemSpan = styled.span`
  text-align: left;
  padding-left: 9px;
  font-size: 14px;
`;

const TabNavLine = styled.span<{ top: number }>`
  left: auto;
  right: 0;
  width: 2px;
  height: 48px;
  transform: scaleX(1);
  top: ${(props) => props.top}px;

  background: linear-gradient(30deg, rgba(115, 103, 240), rgba(115, 103, 240));
  box-shadow: 0 0 8px 0 rgba(115, 103, 240);
  display: block;
  position: absolute;
  transition: all 0.2s ease;
`;

const TabContentWrapper = styled.div`
  position: relative;
  display: block;
  overflow: hidden;
  width: 100%;
  margin-left: 1rem;
`;

const TabContent = styled.div`
  position: relative;
  width: 100%;
  display: block;
  padding: 0;
  padding: 1.5rem;
  background-color: #10163a;
  border-radius: 0.5rem;
`;

const items = [{ name: 'Members' }, { name: 'Settings' }];

type NavItemProps = {
  active: boolean;
  name: string;
  tab: number;
  onClick: (tab: number, top: number) => void;
};
const NavItem: React.FC<NavItemProps> = ({ active, name, tab, onClick }) => {
  const $item = useRef<HTMLLIElement>(null);
  return (
    <TabNavItem
      key={name}
      ref={$item}
      onClick={() => {
        if ($item && $item.current) {
          const pos = $item.current.getBoundingClientRect();
          onClick(tab, pos.top);
        }
      }}
    >
      <TabNavItemButton active={active}>
        <User size={14} color={active ? 'rgba(115, 103, 240)' : '#c2c6dc'} />
        <TabNavItemSpan>{name}</TabNavItemSpan>
      </TabNavItemButton>
    </TabNavItem>
  );
};

type AdminProps = {
  initialTab: number;
  onAddUser: ($target: React.RefObject<HTMLElement>) => void;
  onDeleteUser: (userID: string, newOwnerID: string | null) => void;
  onInviteUser: ($target: React.RefObject<HTMLElement>) => void;
  users: Array<User>;
  onUpdateUserPassword: (user: TaskUser, password: string) => void;
};

const Admin: React.FC<AdminProps> = ({
  initialTab,
  onAddUser,
  onUpdateUserPassword,
  onDeleteUser,
  onInviteUser,
  users,
}) => {
  const warning =
    'You can’t leave because you are the only admin. To make another user an admin, click their avatar, select “Change permissions…”, and select “Admin”.';
  const [currentTop, setTop] = useState(initialTab * 48);
  const [currentTab, setTab] = useState(initialTab);
  const { showPopup, hidePopup } = usePopup();
  const $tabNav = useRef<HTMLDivElement>(null);

  const [updateUserRole] = useUpdateUserRoleMutation();
  return (
    <Container>
      <TabNav ref={$tabNav}>
        <TabNavContent>
          {items.map((item, idx) => (
            <NavItem
              onClick={(tab, top) => {
                if ($tabNav && $tabNav.current) {
                  const pos = $tabNav.current.getBoundingClientRect();
                  setTab(tab);
                  setTop(top - pos.top);
                }
              }}
              name={item.name}
              tab={idx}
              active={idx === currentTab}
            />
          ))}
          <TabNavLine top={currentTop} />
        </TabNavContent>
      </TabNav>
      <TabContentWrapper>
        <TabContent>
          <MemberListWrapper>
            <MemberListHeader>
              <ListTitle>{`Members (${users.length})`}</ListTitle>
              <ListDesc>
                Organization admins can create / manage / delete all projects & teams. Members only have access to teams
                or projects they have been added to.
              </ListDesc>
              <ListActions>
                <FilterSearch width="250px" variant="alternate" placeholder="Filter by name" />
                <InviteMemberButton
                  onClick={($target) => {
                    onAddUser($target);
                  }}
                >
                  <InviteIcon width={16} height={16} />
                  New Member
                </InviteMemberButton>
              </ListActions>
            </MemberListHeader>
            <MemberList>
              {users.map((member) => {
                const projectTotal = member.owned.projects.length + member.member.projects.length;
                return (
                  <MemberListItem>
                    <MemberProfile showRoleIcons size={32} onMemberProfile={() => {}} member={member} />
                    <MemberListItemDetails>
                      <MemberItemName>{member.fullName}</MemberItemName>
                      <MemberItemUsername>{`@${member.username}`}</MemberItemUsername>
                    </MemberListItemDetails>
                    <MemberItemOptions>
                      <MemberItemOption variant="flat">{`On ${projectTotal} projects`}</MemberItemOption>
                      <MemberItemOption
                        variant="outline"
                        onClick={($target) => {
                          showPopup(
                            $target,
                            <TeamRoleManagerPopup
                              user={member}
                              users={users}
                              warning={member.role && member.role.code === 'owner' ? warning : null}
                              updateUserPassword={(user, password) => {
                                onUpdateUserPassword(user, password);
                              }}
                              canChangeRole={(member.role && member.role.code !== 'owner') ?? false}
                              onChangeRole={(roleCode) => {
                                updateUserRole({ variables: { userID: member.id, roleCode } });
                              }}
                              onDeleteUser={onDeleteUser}
                            />,
                          );
                        }}
                      >
                        Manage
                      </MemberItemOption>
                    </MemberItemOptions>
                  </MemberListItem>
                );
              })}
            </MemberList>
          </MemberListWrapper>
        </TabContent>
      </TabContentWrapper>
    </Container>
  );
};

export default Admin;
