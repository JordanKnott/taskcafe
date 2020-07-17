// LOC830
import React, { useState, useRef, useEffect, useContext } from 'react';
import updateApolloCache from 'shared/utils/cache';
import GlobalTopNavbar, { ProjectPopup } from 'App/TopNavbar';
import styled from 'styled-components/macro';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import LabelManagerEditor from './LabelManagerEditor';
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
  useSetProjectOwnerMutation,
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
import UserIDContext from 'App/context';
import Input from 'shared/components/Input';
import Member from 'shared/components/Member';
import Board from './Board';
import Details from './Details';
import EmptyBoard from 'shared/components/EmptyBoard';

const CARD_LABEL_VARIANT_STORAGE_KEY = 'card_label_variant';

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

const UserManagementPopup: React.FC<UserManagementPopupProps> = ({ users, projectMembers, onAddProjectMember }) => {
  return (
    <Popup tab={0} title="Invite a user">
      <SearchInput width="100%" variant="alternate" placeholder="Email address or name" name="search" />
      <MemberList>
        {users
          .filter(u => u.id !== projectMembers.find(p => p.id === u.id)?.id)
          .map(user => (
            <UserMember
              key={user.id}
              onCardMemberClick={() => onAddProjectMember(user.id)}
              showName
              member={user}
              taskID=""
            />
          ))}
      </MemberList>
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
  const [toggleTaskLabel] = useToggleTaskLabelMutation({
    onCompleted: newTaskLabel => {
      taskLabelsRef.current = newTaskLabel.toggleTaskLabel.task.labels;
      console.log(taskLabelsRef.current);
    },
  });

  const [value, setValue] = useStateWithLocalStorage(CARD_LABEL_VARIANT_STORAGE_KEY);
  const [updateProjectMemberRole] = useUpdateProjectMemberRoleMutation();

  const [deleteTask] = useDeleteTaskMutation();

  const [updateTaskName] = useUpdateTaskNameMutation();

  const { loading, data } = useFindProjectQuery({
    variables: { projectId: projectID },
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
        { projectId: projectID },
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
        { projectId: projectID },
      );
    },
  });
  const [setProjectOwner] = useSetProjectOwnerMutation();
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
        { projectId: projectID },
      );
    },
  });

  const { userID } = useContext(UserIDContext);
  const location = useLocation();

  const { showPopup, hidePopup } = usePopup();
  const $labelsRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<Array<ProjectLabel>>([]);
  const taskLabelsRef = useRef<Array<TaskLabel>>([]);
  useEffect(() => {
    if (data) {
      document.title = `${data.findProject.name} | Citadel`;
    }
  }, [data]);
  if (loading) {
    return (
      <>
        <GlobalTopNavbar onSaveProjectName={projectName => {}} name="" projectID={null} />
        <Board loading />
      </>
    );
  }
  if (data) {
    console.log(data.findProject);

    labelsRef.current = data.findProject.labels;

    return (
      <>
        <GlobalTopNavbar
          onChangeRole={(userID, roleCode) => {
            updateProjectMemberRole({ variables: { userID, roleCode, projectID } });
          }}
          onChangeProjectOwner={uid => {
            setProjectOwner({ variables: { ownerID: uid, projectID } });
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
              refreshCache={() => {}}
              availableMembers={data.findProject.members}
              projectURL={`${match.url}/board`}
              taskID={routeProps.match.params.taskID}
              onTaskNameChange={(updatedTask, newName) => {
                updateTaskName({ variables: { taskID: updatedTask.id, name: newName } });
              }}
              onTaskDescriptionChange={(updatedTask, newDescription) => {
                updateTaskDescription({ variables: { taskID: updatedTask.id, description: newDescription } });
              }}
              onDeleteTask={deletedTask => {
                deleteTask({ variables: { taskID: deletedTask.id } });
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
