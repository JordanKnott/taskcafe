import React, {useState, useRef} from 'react';
import {UserPlus, Checkmark} from 'shared/icons';
import styled, {css} from 'styled-components';
import TaskAssignee from 'shared/components/TaskAssignee';
import {User, Plus, Lock, Pencil, Trash} from 'shared/icons';
import {usePopup, Popup} from 'shared/components/PopupMenu';
import {RoleCode, useUpdateUserRoleMutation} from 'shared/generated/graphql';
import {AgGridReact} from 'ag-grid-react';
import Input from 'shared/components/Input';
import Member from 'shared/components/Member';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
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

  {code: 'member', name: 'Member', description: 'Can view, create, and edit team projects, but not change settings.'},
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

export const MiniProfileActionItem = styled.span<{disabled?: boolean}>`
  color: #c2c6dc;
  display: block;
  font-weight: 400;
  padding: 6px 12px;
  position: relative;
  text-decoration: none;

  ${props =>
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
  color: rgba(${props => props.theme.colors.text.secondary}, 0.4);
`;

export const Separator = styled.div`
  height: 1px;
  border-top: 1px solid #414561;
  margin: 0.25rem !important;
`;

export const WarningText = styled.span`
  display: flex;
  color: rgba(${props => props.theme.colors.text.primary}, 0.4);
  padding: 6px;
`;

export const DeleteDescription = styled.div`
  font-size: 14px;
  color: rgba(${props => props.theme.colors.text.primary});
`;

export const RemoveMemberButton = styled(Button)`
  margin-top: 16px;
  padding: 6px 12px;
  width: 100%;
`;
type TeamRoleManagerPopupProps = {
  user: TaskUser;
  warning?: string | null;
  canChangeRole: boolean;
  onChangeRole: (roleCode: RoleCode) => void;
  onRemoveFromTeam?: () => void;
};

const TeamRoleManagerPopup: React.FC<TeamRoleManagerPopupProps> = ({
  warning,
  user,
  canChangeRole,
  onRemoveFromTeam,
  onChangeRole,
}) => {
  const {hidePopup, setTab} = usePopup();
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
            <MiniProfileActionItem onClick={() => {}}>Reset password...</MiniProfileActionItem>
            <MiniProfileActionItem onClick={() => {}}>Lock user...</MiniProfileActionItem>
            <MiniProfileActionItem onClick={() => {}}>Remove from organzation...</MiniProfileActionItem>
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
      <Popup title="Remove from Team?" onClose={() => hidePopup()} tab={2}>
        <Content>
          <DeleteDescription>
            The member will be removed from all cards on this project. They will receive a notification.
          </DeleteDescription>
          <RemoveMemberButton
            color="danger"
            onClick={() => {
              if (onRemoveFromTeam) {
                onRemoveFromTeam();
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

const InviteMemberButton = styled(Button)`
  padding: 7px 12px;
`;

const MemberItemOptions = styled.div``;

const MemberItemOption = styled(Button)`
  padding: 7px 9px;
  margin: 4px 0 4px 8px;
  float: left;
  min-width: 95px;
`;

const MemberList = styled.div`
  border-top: 1px solid rgba(${props => props.theme.colors.border});
`;

const MemberListItem = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  border-bottom: 1px solid rgba(${props => props.theme.colors.border});
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
  color: rgba(${props => props.theme.colors.text.secondary});
`;

const MemberItemUsername = styled.p`
  color: rgba(${props => props.theme.colors.text.primary});
`;

const MemberListHeader = styled.div`
  display: flex;
  flex-direction: column;
`;
const ListTitle = styled.h3`
  font-size: 18px;
  color: rgba(${props => props.theme.colors.text.secondary});
  margin-bottom: 12px;
`;
const ListDesc = styled.span`
  font-size: 16px;
  color: rgba(${props => props.theme.colors.text.primary});
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

const ActionButton: React.FC<ActionButtonProps> = ({onClick, children}) => {
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
      <ActionButton onClick={() => {}}>
        <LockUserIcon width={16} height={16} />
      </ActionButton>
      <ActionButton onClick={$target => params.onDeleteUser($target, params.value)}>
        <DeleteUserIcon width={16} height={16} />
      </ActionButton>
    </>
  );
};

type ListTableProps = {
  users: Array<User>;
  onDeleteUser: ($target: React.RefObject<HTMLElement>, userID: string) => void;
};

const ListTable: React.FC<ListTableProps> = ({users, onDeleteUser}) => {
  const data = {
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    columnDefs: [
      {
        minWidth: 55,
        width: 55,
        headerCheckboxSelection: true,
        checkboxSelection: true,
      },
      {minWidth: 210, headerName: 'Username', editable: true, field: 'username'},
      {minWidth: 225, headerName: 'Email', field: 'email'},
      {minWidth: 200, headerName: 'Name', editable: true, field: 'fullName'},
      {minWidth: 200, headerName: 'Role', editable: true, field: 'roleName'},
      {
        minWidth: 200,
        headerName: 'Actions',
        field: 'id',
        cellRenderer: 'actionButtons',
        cellRendererParams: {
          onDeleteUser: (target: any, userID: any) => {
            onDeleteUser(target, userID);
          },
        },
      },
    ],
    frameworkComponents: {
      actionButtons: ActionButtons,
    },
  };
  return (
    <Root>
      <div className="ag-theme-material" style={{height: '296px', width: '100%'}}>
        <AgGridReact
          rowSelection="multiple"
          defaultColDef={data.defaultColDef}
          columnDefs={data.columnDefs}
          rowData={users.map(u => ({...u, roleName: u.role.name}))}
          frameworkComponents={data.frameworkComponents}
          onFirstDataRendered={params => {
            params.api.sizeColumnsToFit();
          }}
          onGridSizeChanged={params => {
            params.api.sizeColumnsToFit();
          }}
        />
      </div>
    </Root>
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
const TabNavItemButton = styled.button<{active: boolean}>`
  cursor: pointer;
  display: flex;
  align-items: center;

  padding-top: 10px !important;
  padding-bottom: 10px !important;
  padding-left: 12px !important;
  padding-right: 8px !important;
  width: 100%;
  position: relative;

  color: ${props => (props.active ? 'rgba(115, 103, 240)' : '#c2c6dc')};
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

const TabNavLine = styled.span<{top: number}>`
  left: auto;
  right: 0;
  width: 2px;
  height: 48px;
  transform: scaleX(1);
  top: ${props => props.top}px;

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

const items = [{name: 'Members'}, {name: 'Settings'}];

type NavItemProps = {
  active: boolean;
  name: string;
  tab: number;
  onClick: (tab: number, top: number) => void;
};
const NavItem: React.FC<NavItemProps> = ({active, name, tab, onClick}) => {
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
  onDeleteUser: ($target: React.RefObject<HTMLElement>, userID: string) => void;
  onInviteUser: ($target: React.RefObject<HTMLElement>) => void;
  users: Array<User>;
};

const Admin: React.FC<AdminProps> = ({initialTab, onAddUser, onDeleteUser, onInviteUser, users}) => {
  const warning =
    'You can’t leave because you are the only admin. To make another user an admin, click their avatar, select “Change permissions…”, and select “Admin”.';
  const [currentTop, setTop] = useState(initialTab * 48);
  const [currentTab, setTab] = useState(initialTab);
  const {showPopup, hidePopup} = usePopup();
  const $tabNav = useRef<HTMLDivElement>(null);

  const [updateUserRole] = useUpdateUserRoleMutation()
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
              <ListTitle>{`Users (${users.length})`}</ListTitle>
              <ListDesc>
                Team members can view and join all Team Visible boards and create new boards in the team.
              </ListDesc>
              <ListActions>
                <FilterSearch width="250px" variant="alternate" placeholder="Filter by name" />
                <InviteMemberButton
                  onClick={$target => {
                    onAddUser($target);
                  }}
                >
                  <InviteIcon width={16} height={16} />
                  New Member
                </InviteMemberButton>
              </ListActions>
            </MemberListHeader>
            <MemberList>
              {users.map(member => (
                <MemberListItem>
                  <MemberProfile showRoleIcons size={32} onMemberProfile={() => {}} member={member} />
                  <MemberListItemDetails>
                    <MemberItemName>{member.fullName}</MemberItemName>
                    <MemberItemUsername>{`@${member.username}`}</MemberItemUsername>
                  </MemberListItemDetails>
                  <MemberItemOptions>
                    <MemberItemOption variant="flat">On 6 projects</MemberItemOption>
                    <MemberItemOption
                      variant="outline"
                      onClick={$target => {
                        showPopup(
                          $target,
                          <TeamRoleManagerPopup
                            user={member}
                            warning={member.role && member.role.code === 'owner' ? warning : null}
                            canChangeRole={member.role && member.role.code !== 'owner'}
                            onChangeRole={roleCode => {
                              updateUserRole({variables: {userID: member.id, roleCode}})
                            }}
                            onRemoveFromTeam={
                              member.role && member.role.code === 'owner'
                                ? undefined
                                : () => {
                                  hidePopup();
                                }
                            }
                          />,
                        );
                      }}
                    >
                      Manage
                    </MemberItemOption>
                  </MemberItemOptions>
                </MemberListItem>
              ))}
            </MemberList>
          </MemberListWrapper>
        </TabContent>
      </TabContentWrapper>
    </Container>
  );
};

export default Admin;
