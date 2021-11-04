// LOC830
import React, { useRef, useEffect } from 'react';
import updateApolloCache from 'shared/utils/cache';
import GlobalTopNavbar from 'App/TopNavbar';
import ProjectPopup from 'App/TopNavbar/ProjectPopup';
import { usePopup } from 'shared/components/PopupMenu';
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
  useDeleteTaskMutation,
  useUpdateTaskDescriptionMutation,
  FindProjectDocument,
  FindProjectQuery,
} from 'shared/generated/graphql';
import produce from 'immer';
import NOOP from 'shared/utils/noop';
import useStateWithLocalStorage from 'shared/hooks/useStateWithLocalStorage';
import localStorage from 'shared/utils/localStorage';
import polling from 'shared/utils/polling';
import Board, { BoardLoading } from './Board';
import Details from './Details';
import LabelManagerEditor from './LabelManagerEditor';
import UserManagementPopup from './UserManagementPopup';

type TaskRouteProps = {
  taskID: string;
};

interface ProjectParams {
  projectID: string;
}

const Project = () => {
  const { projectID } = useParams<ProjectParams>();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();

  const { showPopup, hidePopup } = usePopup();
  const labelsRef = useRef<Array<ProjectLabel>>([]);
  const [value, setValue] = useStateWithLocalStorage(localStorage.CARD_LABEL_VARIANT_STORAGE_KEY);
  const taskLabelsRef = useRef<Array<TaskLabel>>([]);

  const [updateTaskDescription] = useUpdateTaskDescriptionMutation();
  const [updateProjectMemberRole] = useUpdateProjectMemberRoleMutation();
  const [updateTaskName] = useUpdateTaskNameMutation();
  const { data, error } = useFindProjectQuery({
    variables: { projectID },
    pollInterval: polling.PROJECT,
  });
  const [toggleTaskLabel] = useToggleTaskLabelMutation({
    onCompleted: (newTaskLabel) => {
      taskLabelsRef.current = newTaskLabel.toggleTaskLabel.task.labels;
    },
  });
  const [deleteTask] = useDeleteTaskMutation({
    update: (client, resp) =>
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            if (resp.data) {
              const taskGroupIdx = draftCache.findProject.taskGroups.findIndex(
                (tg) => tg.tasks.findIndex((t) => t.id === resp.data?.deleteTask.taskID) !== -1,
              );

              if (taskGroupIdx !== -1) {
                draftCache.findProject.taskGroups[taskGroupIdx].tasks = cache.findProject.taskGroups[
                  taskGroupIdx
                ].tasks.filter((t) => t.id !== resp.data?.deleteTask.taskID);
              }
            }
          }),
        { projectID: data ? data.findProject.id : '' },
      ),
  });

  const [updateProjectName] = useUpdateProjectNameMutation({
    update: (client, newName) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            draftCache.findProject.name = newName.data?.updateProjectName.name ?? '';
          }),
        { projectID: data ? data.findProject.id : '' },
      );
    },
  });

  const [inviteProjectMembers] = useInviteProjectMembersMutation({
    update: (client, response) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        (cache) =>
          produce(cache, (draftCache) => {
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
        { projectID: data ? data.findProject.id : '' },
      );
    },
  });
  const [deleteInvitedProjectMember] = useDeleteInvitedProjectMemberMutation({
    update: (client, response) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            draftCache.findProject.invitedMembers = cache.findProject.invitedMembers.filter(
              (m) => m.email !== response.data?.deleteInvitedProjectMember.invitedMember.email ?? '',
            );
          }),
        { projectID: data ? data.findProject.id : '' },
      );
    },
  });
  const [deleteProjectMember] = useDeleteProjectMemberMutation({
    update: (client, response) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            draftCache.findProject.members = cache.findProject.members.filter(
              (m) => m.id !== response.data?.deleteProjectMember.member.id,
            );
          }),
        { projectID: data ? data.findProject.id : '' },
      );
    },
  });

  useEffect(() => {
    if (data) {
      document.title = `${data.findProject.name} | Taskcafé`;
    }
  }, [data]);

  if (data) {
    labelsRef.current = data.findProject.labels;

    return (
      <>
        <GlobalTopNavbar
          onChangeRole={(userID, roleCode) => {
            updateProjectMemberRole({ variables: { userID, roleCode, projectID: data ? data.findProject.id : '' } });
          }}
          onChangeProjectOwner={() => {
            hidePopup();
          }}
          onRemoveFromBoard={(userID) => {
            deleteProjectMember({ variables: { userID, projectID: data ? data.findProject.id : '' } });
            hidePopup();
          }}
          onRemoveInvitedFromBoard={(email) => {
            deleteInvitedProjectMember({ variables: { projectID: data ? data.findProject.id : '', email } });
            hidePopup();
          }}
          onSaveProjectName={(projectName) => {
            updateProjectName({ variables: { projectID: data ? data.findProject.id : '', name: projectName } });
          }}
          onInviteUser={($target) => {
            showPopup(
              $target,
              <UserManagementPopup
                projectID={data ? data.findProject.id : ''}
                onInviteProjectMembers={(members) => {
                  inviteProjectMembers({ variables: { projectID: data ? data.findProject.id : '', members } });
                  hidePopup();
                }}
                users={data.users}
                projectMembers={data.findProject.members}
              />,
            );
          }}
          popupContent={
            <ProjectPopup // eslint-disable-line
              history={history}
              publicOn={data.findProject.publicOn}
              name={data.findProject.name}
              projectID={projectID}
            />
          }
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
          render={() => {
            return (
              <Details
                refreshCache={NOOP}
                availableMembers={data.findProject.members}
                projectURL={`${match.url}/board`}
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
                onDeleteTask={(deletedTask) => {
                  deleteTask({ variables: { taskID: deletedTask.id } });
                  history.push(`${match.url}/board`);
                }}
                onOpenAddLabelPopup={(task, $targetRef) => {
                  taskLabelsRef.current = task.labels;
                  showPopup(
                    $targetRef,
                    <LabelManagerEditor
                      onLabelToggle={(labelID) => {
                        toggleTaskLabel({ variables: { taskID: task.id, projectLabelID: labelID } });
                      }}
                      taskID={task.id}
                      labelColors={data.labelColors}
                      taskLabels={taskLabelsRef}
                      projectID={projectID}
                    />,
                  );
                }}
              />
            );
          }}
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
