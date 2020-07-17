import React, { useState, useContext } from 'react';
import Input from 'shared/components/Input';
import updateApolloCache from 'shared/utils/cache';
import produce from 'immer';
import Button from 'shared/components/Button';
import UserIDContext from 'App/context';
import Select from 'shared/components/Select';
import {
  useGetTeamQuery,
  RoleCode,
  useCreateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  GetTeamQuery,
  GetTeamDocument,
} from 'shared/generated/graphql';
import { UserPlus, Checkmark } from 'shared/icons';
import styled, { css } from 'styled-components/macro';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import TaskAssignee from 'shared/components/TaskAssignee';
import Member from 'shared/components/Member';
import ControlledInput from 'shared/components/ControlledInput';

const MemberListWrapper = styled.div`
  flex: 1 1;
`;

const SearchInput = styled(ControlledInput)`
  margin: 0 12px;
`;

const UserMember = styled(Member)`
  padding: 4px 0;
  cursor: pointer;
  &:hover {
    background: rgba(${props => props.theme.colors.bg.primary}, 0.4);
  }
  border-radius: 6px;
`;

const TeamMemberList = styled.div`
  margin: 8px 12px;
`;

type UserManagementPopupProps = {
  users: Array<User>;
  teamMembers: Array<TaskUser>;
  onAddTeamMember: (userID: string) => void;
};

const UserManagementPopup: React.FC<UserManagementPopupProps> = ({ users, teamMembers, onAddTeamMember }) => {
  return (
    <Popup tab={0} title="Invite a user">
      <SearchInput width="100%" variant="alternate" placeholder="Email address or name" name="search" />
      <TeamMemberList>
        {users
          .filter(u => u.id !== teamMembers.find(p => p.id === u.id)?.id)
          .map(user => (
            <UserMember
              key={user.id}
              onCardMemberClick={() => onAddTeamMember(user.id)}
              showName
              member={user}
              taskID=""
            />
          ))}
      </TeamMemberList>
    </Popup>
  );
};

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
  currentUserID: string;
  subject: TaskUser;
  members: Array<TaskUser>;
  warning?: string | null;
  canChangeRole: boolean;
  onChangeRole: (roleCode: RoleCode) => void;
  onRemoveFromTeam?: (newOwnerID: string | null) => void;
  onChangeTeamOwner?: (userID: string) => void;
};

const TeamRoleManagerPopup: React.FC<TeamRoleManagerPopupProps> = ({
  members,
  warning,
  subject,
  currentUserID,
  canChangeRole,
  onRemoveFromTeam,
  onChangeTeamOwner,
  onChangeRole,
}) => {
  const { hidePopup, setTab } = usePopup();
  const [orphanedProjectOwner, setOrphanedProjectOwner] = useState<{ label: string; value: string } | null>(null);
  return (
    <>
      <Popup title={null} tab={0}>
        <MiniProfileActions>
          <MiniProfileActionWrapper>
            {onChangeTeamOwner && (
              <MiniProfileActionItem
                onClick={() => {
                  setTab(3);
                }}
              >
                Set as team owner...
              </MiniProfileActionItem>
            )}
            {subject.role && (
              <MiniProfileActionItem
                onClick={() => {
                  setTab(1);
                }}
              >
                Change permissions...
                <CurrentPermission>{`(${subject.role.name})`}</CurrentPermission>
              </MiniProfileActionItem>
            )}
            {onRemoveFromTeam && (
              <MiniProfileActionItem
                onClick={() => {
                  setTab(2);
                }}
              >
                {currentUserID === subject.id ? 'Leave team...' : 'Remove from team...'}
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
              .filter(p => (subject.role && subject.role.code === 'owner') || p.code !== 'owner')
              .map(perm => (
                <MiniProfileActionItem
                  disabled={subject.role && perm.code !== subject.role.code && !canChangeRole}
                  key={perm.code}
                  onClick={() => {
                    if (onChangeRole && subject.role && perm.code !== subject.role.code) {
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
                    {subject.role && perm.code === subject.role.code && <RoleCheckmark width={12} height={12} />}
                  </RoleName>
                  <RoleDescription>{perm.description}</RoleDescription>
                </MiniProfileActionItem>
              ))}
          </MiniProfileActionWrapper>
          {subject.role && subject.role.code === 'owner' && (
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
            The member will be removed from all team project tasks. They will receive a notification.
          </DeleteDescription>
          {subject.owned && subject.owned.projects.length !== 0 && (
            <>
              <DeleteDescription>
                {`The member is the owner of ${subject.owned.projects.length} project${
                  subject.owned.projects.length > 1 ? 's' : ''
                }. You can give the projects a new owner but it is not needed`}
              </DeleteDescription>
              <Select
                label="New projects owner"
                value={orphanedProjectOwner}
                onChange={value => setOrphanedProjectOwner(value)}
                options={members.filter(m => m.id !== subject.id).map(m => ({ label: m.fullName, value: m.id }))}
              />
            </>
          )}
          <RemoveMemberButton
            color="danger"
            onClick={() => {
              if (onRemoveFromTeam) {
                onRemoveFromTeam(orphanedProjectOwner ? orphanedProjectOwner.value : null);
              }
            }}
          >
            Remove Member
          </RemoveMemberButton>
        </Content>
      </Popup>
      <Popup title="Set as Team Owner?" onClose={() => hidePopup()} tab={3}>
        <Content>
          <DeleteDescription>
            This will change the project owner from you to this subject. They will be able to view and edit cards,
            remove members, and change all settings for the project. They will also be able to delete the project.
          </DeleteDescription>
          <RemoveMemberButton
            color="warning"
            onClick={() => {
              if (onChangeTeamOwner) {
                onChangeTeamOwner(subject.id);
              }
            }}
          >
            Set as Project Owner
          </RemoveMemberButton>
        </Content>
      </Popup>
    </>
  );
};

const MemberItemOptions = styled.div``;

const MemberItemOption = styled(Button)`
  padding: 7px 9px;
  margin: 4px 0 2px 8px;
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

const InviteMemberButton = styled(Button)`
  padding: 6px 12px;
`;
const FilterTab = styled.div`
  max-width: 240px;
  flex: 0 0 240px;
  margin: 0;
  padding-right: 32px;
`;

const FilterTabItems = styled.ul``;
const FilterTabItem = styled.li`
  cursor: pointer;
  border-radius: 3px;
  display: block;
  font-weight: 700;
  text-decoration: none;
  padding: 6px 8px;
  color: rgba(${props => props.theme.colors.text.primary});
  &:hover {
    border-radius: 6px;
    background: rgba(${props => props.theme.colors.primary});
    color: rgba(${props => props.theme.colors.text.secondary});
  }
`;

const FilterTabTitle = styled.h2`
  color: #5e6c84;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 16px;
  margin-top: 16px;
  text-transform: uppercase;
  padding: 8px;
  margin: 0;
`;

const MemberContainer = styled.div`
  margin-top: 45px;
  display: flex;
  width: 100%;
`;

type MembersProps = {
  teamID: string;
};

const Members: React.FC<MembersProps> = ({ teamID }) => {
  const { showPopup, hidePopup } = usePopup();
  const { loading, data } = useGetTeamQuery({ variables: { teamID } });
  const { userID } = useContext(UserIDContext);
  const warning =
    'You can’t leave because you are the only admin. To make another user an admin, click their avatar, select “Change permissions…”, and select “Admin”.';
  const [createTeamMember] = useCreateTeamMemberMutation({
    update: (client, response) => {
      updateApolloCache<GetTeamQuery>(
        client,
        GetTeamDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findTeam.members.push({ ...response.data.createTeamMember.teamMember });
          }),
        { teamID },
      );
    },
  });
  const [deleteTeamMember] = useDeleteTeamMemberMutation({
    update: (client, response) => {
      updateApolloCache<GetTeamQuery>(
        client,
        GetTeamDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findTeam.members = cache.findTeam.members.filter(
              member => member.id !== response.data.deleteTeamMember.userID,
            );
          }),
        { teamID },
      );
    },
  });
  if (loading) {
    return <span>loading</span>;
  }

  if (data) {
    return (
      <MemberContainer>
        <FilterTab>
          <FilterTabTitle>MEMBERS OF TEAM PROJECTS</FilterTabTitle>
          <FilterTabItems>
            <FilterTabItem>{`Team Members (${data.findTeam.members.length})`}</FilterTabItem>
            <FilterTabItem>Observers</FilterTabItem>
          </FilterTabItems>
        </FilterTab>
        <MemberListWrapper>
          <MemberListHeader>
            <ListTitle>{`Team Members (${data.findTeam.members.length})`}</ListTitle>
            <ListDesc>
              Team members can view and join all Team Visible boards and create new boards in the team.
            </ListDesc>
            <ListActions>
              <FilterSearch width="250px" variant="alternate" placeholder="Filter by name" />
              <InviteMemberButton
                onClick={$target => {
                  showPopup(
                    $target,
                    <UserManagementPopup
                      users={data.users}
                      teamMembers={data.findTeam.members}
                      onAddTeamMember={userID => {
                        createTeamMember({ variables: { userID, teamID } });
                      }}
                    />,
                  );
                }}
              >
                <InviteIcon width={16} height={16} />
                Invite Team Members
              </InviteMemberButton>
            </ListActions>
          </MemberListHeader>
          <MemberList>
            {data.findTeam.members.map(member => (
              <MemberListItem>
                <MemberProfile showRoleIcons size={32} onMemberProfile={() => {}} member={member} />
                <MemberListItemDetails>
                  <MemberItemName>{member.fullName}</MemberItemName>
                  <MemberItemUsername>{`@${member.username}`}</MemberItemUsername>
                </MemberListItemDetails>
                <MemberItemOptions>
                  <MemberItemOption variant="flat">On 2 projects</MemberItemOption>
                  <MemberItemOption
                    variant="outline"
                    onClick={$target => {
                      showPopup(
                        $target,
                        <TeamRoleManagerPopup
                          currentUserID={userID ?? ''}
                          subject={member}
                          members={data.findTeam.members}
                          warning={member.role && member.role.code === 'owner' ? warning : null}
                          onChangeTeamOwner={
                            member.role && member.role.code !== 'owner' ? (userID: string) => {} : undefined
                          }
                          canChangeRole={member.role && member.role.code !== 'owner'}
                          onChangeRole={roleCode => {}}
                          onRemoveFromTeam={
                            member.role && member.role.code === 'owner'
                              ? undefined
                              : newOwnerID => {
                                  deleteTeamMember({ variables: { teamID, newOwnerID, userID: member.id } });
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
      </MemberContainer>
    );
  }

  return <div>error</div>;
};

export default Members;
