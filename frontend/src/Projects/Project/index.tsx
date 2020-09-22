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
  useCreateProjectMemberMutation,
  useDeleteProjectMemberMutation,
  useToggleTaskLabelMutation,
  useUpdateProjectNameMutation,
  useFindProjectQuery,
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
import { Lock } from 'shared/icons';
import Button from 'shared/components/Button';
import { useApolloClient } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Board, { BoardLoading } from './Board';
import Details from './Details';
import LabelManagerEditor from './LabelManagerEditor';

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
    background: rgba(${props => props.theme.colors.bg.primary}, 0.4);
  }
  border-radius: 6px;
`;

const MemberList = styled.div`
  margin: 8px 0;
`;

type UserManagementPopupProps = {
  users: Array<User>;
  projectMembers: Array<TaskUser>;
  onAddProjectMember: (userID: string) => void;
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

const fetchMembers = async (client: any, options: MemberFilterOptions, input: string, cb: any) => {
  if (input && input.trim().length < 3) {
    return [];
  }
  const res = await client.query({
    query: gql`
    query {
      searchMembers(input: {SearchFilter:"${input}"}) {
        id
        similarity
        username
        fullName
        confirmed
        joined
      }
    }
    `,
  });

  let results: any = [];
  if (res.data && res.data.searchMembers) {
    results = [...res.data.searchMembers.map((m: any) => ({ label: m.fullName, value: m.id }))];
  }

  if (RFC2822_EMAIL.test(input)) {
    results = [...results, { label: input, value: input }];
  }

  return results;
};

const UserManagementPopup: React.FC<UserManagementPopupProps> = ({ users, projectMembers, onAddProjectMember }) => {
  const client = useApolloClient();
  return (
    <Popup tab={0} title="Invite a user">
      <AsyncSelect isMulti cacheOptions defaultOption loadOptions={(i, cb) => fetchMembers(client, {}, i, cb)} />
      <ShareActions>
        <VisibiltyButton>
          <VisibiltyPrivateIcon width={12} height={12} />
          <VisibiltyButtonText>Private</VisibiltyButtonText>
        </VisibiltyButton>
      </ShareActions>
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
            const taskGroupIdx = draftCache.findProject.taskGroups.findIndex(
              tg => tg.tasks.findIndex(t => t.id === resp.data.deleteTask.taskID) !== -1,
            );

            if (taskGroupIdx !== -1) {
              draftCache.findProject.taskGroups[taskGroupIdx].tasks = cache.findProject.taskGroups[
                taskGroupIdx
              ].tasks.filter(t => t.id !== resp.data.deleteTask.taskID);
            }
          }),
        { projectID },
      ),
  });

  const [updateTaskName] = useUpdateTaskNameMutation();

  const { loading, data, error } = useFindProjectQuery({
    variables: { projectID },
  });

  const [updateProjectName] = useUpdateProjectNameMutation({
    update: (client, newName) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findProject.name = newName.data.updateProjectName.name;
          }),
        { projectID },
      );
    },
  });

  const [createProjectMember] = useCreateProjectMemberMutation({
    update: (client, response) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findProject.members.push({ ...response.data.createProjectMember.member });
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
              m => m.id !== response.data.deleteProjectMember.member.id,
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
  if (loading) {
    return (
      <>
        <GlobalTopNavbar onSaveProjectName={NOOP} name="" projectID={null} />
        <BoardLoading />
      </>
    );
  }
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
          onSaveProjectName={projectName => {
            updateProjectName({ variables: { projectID, name: projectName } });
          }}
          onInviteUser={$target => {
            showPopup(
              $target,
              <UserManagementPopup
                onAddProjectMember={userID => {
                  createProjectMember({ variables: { userID, projectID } });
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
  return <div>Error</div>;
};

export default Project;
