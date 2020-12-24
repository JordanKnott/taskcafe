// LOC830
import React, { useState, useRef, useEffect, useContext } from 'react';
import updateApolloCache from 'shared/utils/cache';
import GlobalTopNavbar, { ProjectPopup } from 'App/TopNavbar';
import styled from 'styled-components/macro';
import AsyncSelect from 'react-select/async';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import {
  useParams,
  Route,
  useRouteMatch,
  useHistory,
  RouteComponentProps,
  useLocation,
  Redirect,
} from 'react-router-dom';
import {
  useUpdateProjectMemberRoleMutation,
  useInviteProjectMembersMutation,
  useDeleteProjectMemberMutation,
  useToggleTaskLabelMutation,
  useUpdateProjectNameMutation,
  useFindProjectQuery,
  useDeleteInvitedProjectMemberMutation,
  useUpdateTaskNameMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskLocationMutation,
  useUpdateTaskGroupLocationMutation,
  useCreateTaskGroupMutation,
  useUpdateTaskDescriptionMutation,
  FindProjectDocument,
  FindProjectQuery,
} from 'shared/generated/graphql';
import produce from 'immer';
import UserContext, { useCurrentUser } from 'App/context';
import Input from 'shared/components/Input';
import Member from 'shared/components/Member';
import EmptyBoard from 'shared/components/EmptyBoard';
import NOOP from 'shared/utils/noop';
import { Lock, Cross } from 'shared/icons';
import Button from 'shared/components/Button';
import { useApolloClient } from '@apollo/react-hooks';
import TaskAssignee from 'shared/components/TaskAssignee';
import gql from 'graphql-tag';
import { colourStyles } from 'shared/components/Select';
import Board, { BoardLoading } from './Board';
import Details from './Details';
import LabelManagerEditor from './LabelManagerEditor';
import { mixin } from '../../shared/utils/styles';

const CARD_LABEL_VARIANT_STORAGE_KEY = 'card_label_variant';

const RFC2822_EMAIL = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const useStateWithLocalStorage = (localStorageKey: string): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const [value, setValue] = React.useState<string>(localStorage.getItem(localStorageKey) || '');

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value]);

  return [value, setValue];
};

const SearchInput = styled(Input)`
  margin: 0;
`;

const UserMember = styled(Member)`
  padding: 4px 0;
  cursor: pointer;
  &:hover {
    background: ${props => mixin.rgba(props.theme.colors.bg.primary, 0.4)};
  }
  border-radius: 6px;
`;

const MemberList = styled.div`
  margin: 8px 0;
`;

type InviteUserData = {
  email?: string;
  suerID?: string;
};
type UserManagementPopupProps = {
  projectID: string;
  users: Array<User>;
  projectMembers: Array<TaskUser>;
  onInviteProjectMembers: (data: Array<InviteUserData>) => void;
};

const VisibiltyPrivateIcon = styled(Lock)`
  padding-right: 4px;
`;

const VisibiltyButtonText = styled.span`
  color: rgba(${props => props.theme.colors.text.primary});
`;

const ShareActions = styled.div`
  border-top: 1px solid #414561;
  margin-top: 8px;
  padding-top: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const VisibiltyButton = styled.button`
  cursor: pointer;
  margin: 2px 4px;
  padding: 2px 4px;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid transparent;
  &:hover ${VisibiltyButtonText} {
    color: rgba(${props => props.theme.colors.text.secondary});
  }
  &:hover ${VisibiltyPrivateIcon} {
    fill: rgba(${props => props.theme.colors.text.secondary});
    stroke: rgba(${props => props.theme.colors.text.secondary});
  }
  &:hover {
    border-bottom: 1px solid rgba(${props => props.theme.colors.primary});
  }
`;

type MemberFilterOptions = {
  projectID?: null | string;
  teamID?: null | string;
  organization?: boolean;
};

const fetchMembers = async (client: any, projectID: string, options: MemberFilterOptions, input: string, cb: any) => {
  if (input && input.trim().length < 3) {
    return [];
  }
  const res = await client.query({
    query: gql`
    query {
      searchMembers(input: {searchFilter:"${input}", projectID:"${projectID}"}) {
        id
        similarity
        status
        user {
          id
          fullName
          email
          profileIcon {
            url
            initials
            bgColor
          }
        }
      }
    }
    `,
  });

  let results: any = [];
  const emails: Array<string> = [];
  if (res.data && res.data.searchMembers) {
    results = [
      ...res.data.searchMembers.map((m: any) => {
        if (m.status === 'INVITED') {
          return {
            label: m.id,
            value: {
              id: m.id,
              type: 2,
              profileIcon: {
                bgColor: '#ccc',
                initials: m.id.charAt(0),
              },
            },
          };
        }

        emails.push(m.user.email);
        return {
          label: m.user.fullName,
          value: { id: m.user.id, type: 0, profileIcon: m.user.profileIcon },
        };
      }),
    ];
  }

  if (RFC2822_EMAIL.test(input) && !emails.find(e => e === input)) {
    results = [
      ...results,
      {
        label: input,
        value: {
          id: input,
          type: 1,
          profileIcon: {
            bgColor: '#ccc',
            initials: input.charAt(0),
          },
        },
      },
    ];
  }

  return results;
};

type UserOptionProps = {
  innerProps: any;
  isDisabled: boolean;
  isFocused: boolean;
  label: string;
  data: any;
  getValue: any;
};

const OptionWrapper = styled.div<{ isFocused: boolean }>`
  cursor: pointer;
  padding: 4px 8px;
  ${props => props.isFocused && `background: rgba(${props.theme.colors.primary});`}
  display: flex;
  align-items: center;
`;
const OptionContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

const OptionLabel = styled.span<{ fontSize: number; quiet: boolean }>`
  display: flex;
  align-items: center;
  font-size: ${p => p.fontSize}px;
  color: rgba(${p => (p.quiet ? p.theme.colors.text.primary : p.theme.colors.text.primary)});
`;

const UserOption: React.FC<UserOptionProps> = ({ isDisabled, isFocused, innerProps, label, data }) => {
  return !isDisabled ? (
    <OptionWrapper {...innerProps} isFocused={isFocused}>
      <TaskAssignee
        size={32}
        member={{
          id: '',
          fullName: data.value.label,
          profileIcon: data.value.profileIcon,
        }}
      />
      <OptionContent>
        <OptionLabel fontSize={16} quiet={false}>
          {label}
        </OptionLabel>
        {data.value.type === 2 && (
          <OptionLabel fontSize={14} quiet>
            Joined
          </OptionLabel>
        )}
      </OptionContent>
    </OptionWrapper>
  ) : null;
};

const OptionValueWrapper = styled.div`
  background: rgba(${props => props.theme.colors.bg.primary});
  border-radius: 4px;
  margin: 2px;
  padding: 3px 6px 3px 4px;
  display: flex;
  align-items: center;
`;

const OptionValueLabel = styled.span`
  font-size: 12px;
  color: rgba(${props => props.theme.colors.text.secondary});
`;

const OptionValueRemove = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  margin-left: 4px;
`;
const OptionValue = ({ data, removeProps }: any) => {
  return (
    <OptionValueWrapper>
      <OptionValueLabel>{data.label}</OptionValueLabel>
      <OptionValueRemove {...removeProps}>
        <Cross width={14} height={14} />
      </OptionValueRemove>
    </OptionValueWrapper>
  );
};

const InviteButton = styled(Button)`
  margin-top: 12px;
  height: 32px;
  padding: 4px 12px;
  width: 100%;
  justify-content: center;
`;

const InviteContainer = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const UserManagementPopup: React.FC<UserManagementPopupProps> = ({
  projectID,
  users,
  projectMembers,
  onInviteProjectMembers,
}) => {
  const client = useApolloClient();
  const [invitedUsers, setInvitedUsers] = useState<Array<any> | null>(null);
  return (
    <Popup tab={0} title="Invite a user">
      <InviteContainer>
        <AsyncSelect
          getOptionValue={option => option.value.id}
          placeholder="Email address or username"
          noOptionsMessage={() => null}
          onChange={(e: any) => {
            setInvitedUsers(e);
          }}
          isMulti
          autoFocus
          cacheOptions
          styles={colourStyles}
          defaultOption
          components={{
            MultiValue: OptionValue,
            Option: UserOption,
            IndicatorSeparator: null,
            DropdownIndicator: null,
          }}
          loadOptions={(i, cb) => fetchMembers(client, projectID, {}, i, cb)}
        />
      </InviteContainer>
      <InviteButton
        onClick={() => {
          if (invitedUsers) {
            onInviteProjectMembers(
              invitedUsers.map(user => {
                if (user.value.type === 0) {
                  return {
                    userID: user.value.id,
                  };
                }
                return {
                  email: user.value.id,
                };
              }),
            );
          }
        }}
        disabled={invitedUsers === null}
        hoverVariant="none"
        fontSize="16px"
      >
        Send Invite
      </InviteButton>
    </Popup>
  );
};

type TaskRouteProps = {
  taskID: string;
};

interface QuickCardEditorState {
  isOpen: boolean;
  target: React.RefObject<HTMLElement> | null;
  taskID: string | null;
  taskGroupID: string | null;
}

interface ProjectParams {
  projectID: string;
}

const initialQuickCardEditorState: QuickCardEditorState = {
  taskID: null,
  taskGroupID: null,
  isOpen: false,
  target: null,
};

const Project = () => {
  const { projectID } = useParams<ProjectParams>();
  const history = useHistory();
  const match = useRouteMatch();

  const [updateTaskDescription] = useUpdateTaskDescriptionMutation();
  const taskLabelsRef = useRef<Array<TaskLabel>>([]);
  const [toggleTaskLabel] = useToggleTaskLabelMutation({
    onCompleted: newTaskLabel => {
      taskLabelsRef.current = newTaskLabel.toggleTaskLabel.task.labels;
    },
  });

  const [value, setValue] = useStateWithLocalStorage(CARD_LABEL_VARIANT_STORAGE_KEY);
  const [updateProjectMemberRole] = useUpdateProjectMemberRoleMutation();

  const [deleteTask] = useDeleteTaskMutation({
    update: (client, resp) =>
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            if (resp.data) {
              const taskGroupIdx = draftCache.findProject.taskGroups.findIndex(
                tg => tg.tasks.findIndex(t => t.id === resp.data?.deleteTask.taskID) !== -1,
              );

              if (taskGroupIdx !== -1) {
                draftCache.findProject.taskGroups[taskGroupIdx].tasks = cache.findProject.taskGroups[
                  taskGroupIdx
                ].tasks.filter(t => t.id !== resp.data?.deleteTask.taskID);
              }
            }
          }),
        { projectID },
      ),
  });

  const [updateTaskName] = useUpdateTaskNameMutation();

  const { loading, data, error } = useFindProjectQuery({
    variables: { projectID },
    pollInterval: 3000,
  });

  const [updateProjectName] = useUpdateProjectNameMutation({
    update: (client, newName) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findProject.name = newName.data?.updateProjectName.name ?? '';
          }),
        { projectID },
      );
    },
  });

  const [inviteProjectMembers] = useInviteProjectMembersMutation({
    update: (client, response) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            if (response.data) {
              draftCache.findProject.members = [
                ...cache.findProject.members,
                ...response.data.inviteProjectMembers.members,
              ];
              draftCache.findProject.invitedMembers = [
                ...cache.findProject.invitedMembers,
                ...response.data.inviteProjectMembers.invitedMembers,
              ];
            }
          }),
        { projectID },
      );
    },
  });
  const [deleteInvitedProjectMember] = useDeleteInvitedProjectMemberMutation({
    update: (client, response) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findProject.invitedMembers = cache.findProject.invitedMembers.filter(
              m => m.email !== response.data?.deleteInvitedProjectMember.invitedMember.email ?? '',
            );
          }),
        { projectID },
      );
    },
  });
  const [deleteProjectMember] = useDeleteProjectMemberMutation({
    update: (client, response) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findProject.members = cache.findProject.members.filter(
              m => m.id !== response.data?.deleteProjectMember.member.id,
            );
          }),
        { projectID },
      );
    },
  });

  const { user } = useCurrentUser();
  const location = useLocation();

  const { showPopup, hidePopup } = usePopup();
  const $labelsRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<Array<ProjectLabel>>([]);
  useEffect(() => {
    if (data) {
      document.title = `${data.findProject.name} | Taskcafé`;
    }
  }, [data]);
  if (error) {
    history.push('/projects');
  }
  if (data) {
    labelsRef.current = data.findProject.labels;

    return (
      <>
        <GlobalTopNavbar
          onChangeRole={(userID, roleCode) => {
            updateProjectMemberRole({ variables: { userID, roleCode, projectID } });
          }}
          onChangeProjectOwner={uid => {
            hidePopup();
          }}
          onRemoveFromBoard={userID => {
            deleteProjectMember({ variables: { userID, projectID } });
            hidePopup();
          }}
          onRemoveInvitedFromBoard={email => {
            deleteInvitedProjectMember({ variables: { projectID, email } });
            hidePopup();
          }}
          onSaveProjectName={projectName => {
            updateProjectName({ variables: { projectID, name: projectName } });
          }}
          onInviteUser={$target => {
            showPopup(
              $target,
              <UserManagementPopup
                projectID={projectID}
                onInviteProjectMembers={members => {
                  inviteProjectMembers({ variables: { projectID, members } });
                  hidePopup();
                }}
                users={data.users}
                projectMembers={data.findProject.members}
              />,
            );
          }}
          popupContent={<ProjectPopup history={history} name={data.findProject.name} projectID={projectID} />}
          menuType={[{ name: 'Board', link: location.pathname }]}
          currentTab={0}
          projectMembers={data.findProject.members}
          projectInvitedMembers={data.findProject.invitedMembers}
          projectID={projectID}
          teamID={data.findProject.team ? data.findProject.team.id : null}
          name={data.findProject.name}
        />
        <Route path={`${match.path}`} exact render={() => <Redirect to={`${match.url}/board`} />} />
        <Route
          path={`${match.path}/board`}
          render={() => (
            <Board
              cardLabelVariant={value === 'small' ? 'small' : 'large'}
              onCardLabelClick={() => {
                const variant = value === 'small' ? 'large' : 'small';
                setValue(() => variant);
              }}
              projectID={projectID}
            />
          )}
        />
        <Route
          path={`${match.path}/board/c/:taskID`}
          render={(routeProps: RouteComponentProps<TaskRouteProps>) => (
            <Details
              refreshCache={NOOP}
              availableMembers={data.findProject.members}
              projectURL={`${match.url}/board`}
              taskID={routeProps.match.params.taskID}
              onTaskNameChange={(updatedTask, newName) => {
                updateTaskName({ variables: { taskID: updatedTask.id, name: newName } });
              }}
              onTaskDescriptionChange={(updatedTask, newDescription) => {
                updateTaskDescription({
                  variables: { taskID: updatedTask.id, description: newDescription },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    updateTaskDescription: {
                      __typename: 'Task',
                      id: updatedTask.id,
                      description: newDescription,
                    },
                  },
                });
              }}
              onDeleteTask={deletedTask => {
                deleteTask({ variables: { taskID: deletedTask.id } });
                history.push(`${match.url}/board`);
              }}
              onOpenAddLabelPopup={(task, $targetRef) => {
                taskLabelsRef.current = task.labels;
                showPopup(
                  $targetRef,
                  <LabelManagerEditor
                    onLabelToggle={labelID => {
                      toggleTaskLabel({ variables: { taskID: task.id, projectLabelID: labelID } });
                    }}
                    labelColors={data.labelColors}
                    labels={labelsRef}
                    taskLabels={taskLabelsRef}
                    projectID={projectID}
                  />,
                );
              }}
            />
          )}
        />
      </>
    );
  }
  return (
    <>
      <GlobalTopNavbar onSaveProjectName={NOOP} name="" projectID={null} />
      <BoardLoading />
    </>
  );
};

export default Project;
