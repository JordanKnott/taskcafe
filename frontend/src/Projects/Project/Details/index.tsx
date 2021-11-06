import React, { useState } from 'react';
import Modal from 'shared/components/Modal';
import TaskDetails from 'shared/components/TaskDetails';
import TaskDetailsLoading from 'shared/components/TaskDetails/Loading';
import { Popup, usePopup } from 'shared/components/PopupMenu';
import MemberManager from 'shared/components/MemberManager';
import { useRouteMatch, useHistory, useParams } from 'react-router';
import {
  useDeleteTaskChecklistMutation,
  useToggleTaskWatchMutation,
  useUpdateTaskChecklistNameMutation,
  useUpdateTaskChecklistItemLocationMutation,
  useCreateTaskChecklistMutation,
  useFindTaskQuery,
  DueDateNotificationDuration,
  useUpdateTaskDueDateMutation,
  useSetTaskCompleteMutation,
  useAssignTaskMutation,
  useUnassignTaskMutation,
  useSetTaskChecklistItemCompleteMutation,
  useUpdateTaskChecklistLocationMutation,
  useDeleteTaskChecklistItemMutation,
  useUpdateTaskChecklistItemNameMutation,
  useCreateTaskChecklistItemMutation,
  FindTaskDocument,
  FindTaskQuery,
  useCreateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useUpdateTaskCommentMutation,
} from 'shared/generated/graphql';
import { useCurrentUser } from 'App/context';
import MiniProfile from 'shared/components/MiniProfile';
import DueDateManager from 'shared/components/DueDateManager';
import produce from 'immer';
import styled from 'styled-components';
import Button from 'shared/components/Button';
import Input from 'shared/components/Input';
import { useForm } from 'react-hook-form';
import updateApolloCache from 'shared/utils/cache';
import NOOP from 'shared/utils/noop';
import polling from 'shared/utils/polling';

export const ActionsList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const ActionItem = styled.li`
  position: relative;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  &:hover {
    background: ${(props) => props.theme.colors.primary};
  }
`;

export const ActionTitle = styled.span`
  margin-left: 20px;
`;

const WarningLabel = styled.p`
  font-size: 14px;
  margin: 8px 12px;
`;
const DeleteConfirm = styled(Button)`
  width: 100%;
  padding: 8px 12px;
  margin-bottom: 6px;
`;

type TaskCommentActionsProps = {
  onDeleteComment: () => void;
  onEditComment: () => void;
};
const TaskCommentActions: React.FC<TaskCommentActionsProps> = ({ onDeleteComment, onEditComment }) => {
  const { setTab } = usePopup();
  return (
    <>
      <Popup tab={0} title={null}>
        <ActionsList>
          <ActionItem>
            <ActionTitle>Pin to top</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => onEditComment()}>
            <ActionTitle>Edit comment</ActionTitle>
          </ActionItem>
          <ActionItem onClick={() => setTab(1)}>
            <ActionTitle>Delete comment</ActionTitle>
          </ActionItem>
        </ActionsList>
      </Popup>
      <Popup tab={1} title="Delete comment?">
        <WarningLabel>Deleting a comment can not be undone.</WarningLabel>
        <DeleteConfirm onClick={() => onDeleteComment()} color="danger">
          Delete comment
        </DeleteConfirm>
      </Popup>
    </>
  );
};

const calculateChecklistBadge = (checklists: Array<TaskChecklist>) => {
  const total = checklists.reduce((prev: any, next: any) => {
    return (
      prev +
      next.items.reduce((innerPrev: any, _item: any) => {
        return innerPrev + 1;
      }, 0)
    );
  }, 0);
  const complete = checklists.reduce(
    (prev: any, next: any) =>
      prev +
      next.items.reduce((innerPrev: any, item: any) => {
        return innerPrev + (item.complete ? 1 : 0);
      }, 0),
    0,
  );
  return { total, complete };
};

const DeleteChecklistButton = styled(Button)`
  width: 100%;
  padding: 6px 12px;
  margin-top: 8px;
`;
type CreateChecklistData = {
  name: string;
};
const CreateChecklistForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const CreateChecklistButton = styled(Button)`
  margin-top: 8px;
  padding: 6px 12px;
  width: 100%;
`;

const CreateChecklistInput = styled(Input)`
  margin-bottom: 8px;
`;

type CreateChecklistPopupProps = {
  onCreateChecklist: (data: CreateChecklistData) => void;
};

const CreateChecklistPopup: React.FC<CreateChecklistPopupProps> = ({ onCreateChecklist }) => {
  const { register, handleSubmit } = useForm<CreateChecklistData>();
  const createUser = (data: CreateChecklistData) => {
    onCreateChecklist(data);
  };
  return (
    <CreateChecklistForm onSubmit={handleSubmit(createUser)}>
      <CreateChecklistInput
        floatingLabel
        autoFocus
        autoSelect
        defaultValue="Checklist"
        width="100%"
        label="Name"
        variant="alternate"
        {...register('name', { required: 'Checklist name is required' })}
      />
      <CreateChecklistButton type="submit">Create</CreateChecklistButton>
    </CreateChecklistForm>
  );
};

type DetailsProps = {
  projectURL: string;
  onTaskNameChange: (task: Task, newName: string) => void;
  onTaskDescriptionChange: (task: Task, newDescription: string) => void;
  onDeleteTask: (task: Task) => void;
  onOpenAddLabelPopup: (task: Task, $targetRef: React.RefObject<HTMLElement>) => void;
  availableMembers: Array<TaskUser>;
  refreshCache: () => void;
};

const initialMemberPopupState = { taskID: '', isOpen: false, top: 0, left: 0 };

const Details: React.FC<DetailsProps> = ({
  projectURL,
  onTaskNameChange,
  onTaskDescriptionChange,
  onDeleteTask,
  onOpenAddLabelPopup,
  availableMembers,
  refreshCache,
}) => {
  const { user } = useCurrentUser();
  const { taskID } = useParams<{ taskID: string }>();
  const { showPopup, hidePopup } = usePopup();
  const history = useHistory();
  const [deleteTaskComment] = useDeleteTaskCommentMutation({
    update: (client, response) => {
      updateApolloCache<FindTaskQuery>(
        client,
        FindTaskDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            if (response.data) {
              draftCache.findTask.comments = cache.findTask.comments.filter(
                (c) => c.id !== response.data?.deleteTaskComment.commentID,
              );
            }
          }),
        { taskID },
      );
    },
  });
  const [toggleTaskWatch] = useToggleTaskWatchMutation();
  const [createTaskComment] = useCreateTaskCommentMutation({
    update: (client, response) => {
      updateApolloCache<FindTaskQuery>(
        client,
        FindTaskDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            if (response.data) {
              draftCache.findTask.comments.push({
                ...response.data.createTaskComment.comment,
              });
            }
          }),
        { taskID },
      );
    },
  });
  const [updateTaskChecklistLocation] = useUpdateTaskChecklistLocationMutation();
  const [updateTaskChecklistItemLocation] = useUpdateTaskChecklistItemLocationMutation({
    update: (client, response) => {
      updateApolloCache<FindTaskQuery>(
        client,
        FindTaskDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            if (response.data) {
              const { prevChecklistID, taskChecklistID, checklistItem } = response.data.updateTaskChecklistItemLocation;
              if (taskChecklistID !== prevChecklistID) {
                const oldIdx = cache.findTask.checklists.findIndex((c) => c.id === prevChecklistID);
                const newIdx = cache.findTask.checklists.findIndex((c) => c.id === taskChecklistID);
                if (oldIdx > -1 && newIdx > -1) {
                  const item = cache.findTask.checklists[oldIdx].items.find((i) => i.id === checklistItem.id);
                  if (item) {
                    draftCache.findTask.checklists[oldIdx].items = cache.findTask.checklists[oldIdx].items.filter(
                      (i) => i.id !== checklistItem.id,
                    );
                    draftCache.findTask.checklists[newIdx].items.push({
                      ...item,
                      position: checklistItem.position,
                      taskChecklistID,
                    });
                  }
                }
              }
            }
          }),
        { taskID },
      );
    },
  });
  const [setTaskChecklistItemComplete] = useSetTaskChecklistItemCompleteMutation({
    update: (client) => {
      updateApolloCache<FindTaskQuery>(
        client,
        FindTaskDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            const { complete, total } = calculateChecklistBadge(draftCache.findTask.checklists);
            draftCache.findTask.badges.checklist = {
              __typename: 'ChecklistBadge',
              complete,
              total,
            };
          }),
        { taskID },
      );
    },
  });
  const [deleteTaskChecklist] = useDeleteTaskChecklistMutation({
    update: (client, deleteData) => {
      updateApolloCache<FindTaskQuery>(
        client,
        FindTaskDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            const { checklists } = cache.findTask;
            draftCache.findTask.checklists = checklists.filter(
              (c) => c.id !== deleteData.data?.deleteTaskChecklist.taskChecklist.id,
            );
            const { complete, total } = calculateChecklistBadge(draftCache.findTask.checklists);
            draftCache.findTask.badges.checklist = {
              __typename: 'ChecklistBadge',
              complete,
              total,
            };
            if (complete === 0 && total === 0) {
              draftCache.findTask.badges.checklist = null;
            }
          }),
        { taskID },
      );
    },
  });
  const [updateTaskChecklistItemName] = useUpdateTaskChecklistItemNameMutation();
  const [createTaskChecklist] = useCreateTaskChecklistMutation({
    update: (client, createData) => {
      updateApolloCache<FindTaskQuery>(
        client,
        FindTaskDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            if (createData.data) {
              const item = createData.data.createTaskChecklist;
              draftCache.findTask.checklists.push({ ...item });
            }
          }),
        { taskID },
      );
    },
  });
  const [updateTaskChecklistName] = useUpdateTaskChecklistNameMutation();
  const [deleteTaskChecklistItem] = useDeleteTaskChecklistItemMutation({
    update: (client, deleteData) => {
      updateApolloCache<FindTaskQuery>(
        client,
        FindTaskDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            if (deleteData.data) {
              const item = deleteData.data.deleteTaskChecklistItem.taskChecklistItem;
              const targetIdx = cache.findTask.checklists.findIndex((c) => c.id === item.taskChecklistID);
              if (targetIdx > -1) {
                draftCache.findTask.checklists[targetIdx].items = cache.findTask.checklists[targetIdx].items.filter(
                  (c) => item.id !== c.id,
                );
              }
              const { complete, total } = calculateChecklistBadge(draftCache.findTask.checklists);
              draftCache.findTask.badges.checklist = {
                __typename: 'ChecklistBadge',
                complete,
                total,
              };
            }
          }),
        { taskID },
      );
    },
  });
  const [createTaskChecklistItem] = useCreateTaskChecklistItemMutation({
    update: (client, newTaskItem) => {
      updateApolloCache<FindTaskQuery>(
        client,
        FindTaskDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            if (newTaskItem.data) {
              const item = newTaskItem.data.createTaskChecklistItem;
              const { checklists } = cache.findTask;
              const idx = checklists.findIndex((c) => c.id === item.taskChecklistID);
              if (idx !== -1) {
                draftCache.findTask.checklists[idx].items.push({ ...item });
                const { complete, total } = calculateChecklistBadge(draftCache.findTask.checklists);
                draftCache.findTask.badges.checklist = {
                  __typename: 'ChecklistBadge',
                  complete,
                  total,
                };
              }
            }
          }),
        { taskID },
      );
    },
  });
  const { loading, data, refetch } = useFindTaskQuery({
    variables: { taskID },
    pollInterval: polling.TASK_DETAILS,
    fetchPolicy: 'cache-and-network',
  });
  const [setTaskComplete] = useSetTaskCompleteMutation();
  const [updateTaskDueDate] = useUpdateTaskDueDateMutation({
    onCompleted: () => {
      refetch();
      refreshCache();
    },
  });
  const [assignTask] = useAssignTaskMutation({
    onCompleted: () => {
      refetch();
      refreshCache();
    },
  });
  const [unassignTask] = useUnassignTaskMutation({
    onCompleted: () => {
      refetch();
      refreshCache();
    },
  });
  const [updateTaskComment] = useUpdateTaskCommentMutation();
  const [editableComment, setEditableComment] = useState<null | string>(null);
  const isLoading = true;
  return (
    <>
      <Modal
        width={1070}
        onClose={() => {
          history.push(projectURL);
          hidePopup();
        }}
        renderContent={() => {
          return data ? (
            <TaskDetails
              onCancelCommentEdit={() => setEditableComment(null)}
              onUpdateComment={(commentID, message) => {
                updateTaskComment({ variables: { commentID, message } });
              }}
              editableComment={editableComment}
              me={data.me ? data.me.user : null}
              onCommentShowActions={(commentID, $targetRef) => {
                showPopup(
                  $targetRef,
                  <TaskCommentActions
                    onDeleteComment={() => {
                      deleteTaskComment({ variables: { commentID } });
                      hidePopup();
                    }}
                    onEditComment={() => {
                      setEditableComment(commentID);
                      hidePopup();
                    }}
                  />,
                );
              }}
              task={data.findTask}
              onToggleTaskWatch={(task, watched) => {
                toggleTaskWatch({
                  variables: { taskID: task.id },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    toggleTaskWatch: {
                      id: task.id,
                      __typename: 'Task',
                      watched,
                    },
                  },
                });
              }}
              onCreateComment={(task, message) => {
                createTaskComment({ variables: { taskID: task.id, message } });
              }}
              onChecklistDrop={(checklist) => {
                updateTaskChecklistLocation({
                  variables: { taskChecklistID: checklist.id, position: checklist.position },

                  optimisticResponse: {
                    __typename: 'Mutation',
                    updateTaskChecklistLocation: {
                      __typename: 'UpdateTaskChecklistLocationPayload',
                      checklist: {
                        __typename: 'TaskChecklist',
                        position: checklist.position,
                        id: checklist.id,
                      },
                    },
                  },
                });
              }}
              onChecklistItemDrop={(prevChecklistID, taskChecklistID, checklistItem) => {
                updateTaskChecklistItemLocation({
                  variables: {
                    taskChecklistID,
                    taskChecklistItemID: checklistItem.id,
                    position: checklistItem.position,
                  },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    updateTaskChecklistItemLocation: {
                      __typename: 'UpdateTaskChecklistItemLocationPayload',
                      prevChecklistID,
                      taskChecklistID,
                      checklistItem: {
                        __typename: 'TaskChecklistItem',
                        position: checklistItem.position,
                        id: checklistItem.id,
                        taskChecklistID,
                      },
                    },
                  },
                });
              }}
              onTaskNameChange={onTaskNameChange}
              onTaskDescriptionChange={onTaskDescriptionChange}
              onToggleTaskComplete={(task) => {
                setTaskComplete({ variables: { taskID: task.id, complete: !task.complete } });
              }}
              onDeleteTask={onDeleteTask}
              onChangeItemName={(itemID, itemName) => {
                updateTaskChecklistItemName({ variables: { taskChecklistItemID: itemID, name: itemName } });
              }}
              onCloseModal={() => history.push(projectURL)}
              onChangeChecklistName={(checklistID, newName) => {
                updateTaskChecklistName({ variables: { taskChecklistID: checklistID, name: newName } });
              }}
              onDeleteItem={(checklistID, itemID) => {
                deleteTaskChecklistItem({
                  variables: { taskChecklistItemID: itemID },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    deleteTaskChecklistItem: {
                      __typename: 'DeleteTaskChecklistItemPayload',
                      ok: true,
                      taskChecklistItem: {
                        __typename: 'TaskChecklistItem',
                        id: itemID,
                        taskChecklistID: checklistID,
                      },
                    },
                  },
                });
              }}
              onToggleChecklistItem={(itemID, complete) => {
                setTaskChecklistItemComplete({
                  variables: { taskChecklistItemID: itemID, complete },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    setTaskChecklistItemComplete: {
                      __typename: 'TaskChecklistItem',
                      id: itemID,
                      complete,
                    },
                  },
                });
              }}
              onAddItem={(taskChecklistID, name, position) => {
                createTaskChecklistItem({ variables: { taskChecklistID, name, position } });
              }}
              onMemberProfile={($targetRef, memberID) => {
                const member = data.findTask.assigned.find((m) => m.id === memberID);
                if (member) {
                  showPopup(
                    $targetRef,
                    <Popup title={null} onClose={NOOP} tab={0}>
                      <MiniProfile
                        user={member}
                        bio="None"
                        onRemoveFromTask={() => {
                          if (user) {
                            unassignTask({ variables: { taskID: data.findTask.id, userID: member.id ?? '' } });
                            hidePopup();
                          }
                        }}
                      />
                    </Popup>,
                  );
                }
              }}
              onOpenAddMemberPopup={(_task, $targetRef) => {
                showPopup(
                  $targetRef,
                  <Popup title="Members" tab={0} onClose={NOOP}>
                    <MemberManager
                      availableMembers={availableMembers}
                      activeMembers={data.findTask.assigned}
                      onMemberChange={(member, isActive) => {
                        if (user) {
                          if (isActive) {
                            assignTask({ variables: { taskID: data.findTask.id, userID: member.id } });
                          } else {
                            unassignTask({ variables: { taskID: data.findTask.id, userID: member.id } });
                          }
                        }
                      }}
                    />
                  </Popup>,
                );
              }}
              onOpenAddLabelPopup={onOpenAddLabelPopup}
              onOpenAddChecklistPopup={(_task, $target) => {
                showPopup(
                  $target,
                  <Popup
                    title="Add checklist"
                    tab={0}
                    onClose={() => {
                      hidePopup();
                    }}
                  >
                    <CreateChecklistPopup
                      onCreateChecklist={(checklistData) => {
                        let position = 65535;
                        if (data.findTask.checklists) {
                          const [lastChecklist] = data.findTask.checklists.slice(-1);
                          if (lastChecklist) {
                            position = lastChecklist.position * 2 + 1;
                          }
                        }
                        createTaskChecklist({
                          variables: {
                            taskID: data.findTask.id,
                            name: checklistData.name,
                            position,
                          },
                        });
                        hidePopup();
                      }}
                    />
                  </Popup>,
                );
              }}
              onDeleteChecklist={($target, checklistID) => {
                showPopup(
                  $target,
                  <Popup tab={0} title="Delete checklist?" onClose={() => hidePopup()}>
                    <p>Deleting a checklist is permanent and there is no way to get it back.</p>
                    <DeleteChecklistButton
                      color="danger"
                      onClick={() => {
                        deleteTaskChecklist({ variables: { taskChecklistID: checklistID } });
                        hidePopup();
                      }}
                    >
                      Delete Checklist
                    </DeleteChecklistButton>
                  </Popup>,
                );
              }}
              onOpenDueDatePopop={(task, $targetRef) => {
                showPopup(
                  $targetRef,
                  <Popup
                    title="Change Due Date"
                    tab={0}
                    onClose={() => {
                      hidePopup();
                    }}
                  >
                    <DueDateManager
                      task={task}
                      onRemoveDueDate={(t) => {
                        updateTaskDueDate({
                          variables: {
                            taskID: t.id,
                            dueDate: null,
                            hasTime: false,
                            deleteNotifications: t.dueDate.notifications
                              ? t.dueDate.notifications.map((n) => ({ id: n.id }))
                              : [],
                            updateNotifications: [],
                            createNotifications: [],
                          },
                        });
                        hidePopup();
                      }}
                      onDueDateChange={(t, newDueDate, hasTime, notifications) => {
                        const updatedNotifications = notifications.current
                          .filter((c) => c.externalId !== null)
                          .map((c) => {
                            let duration = DueDateNotificationDuration.Minute;
                            switch (c.duration.value) {
                              case 'hour':
                                duration = DueDateNotificationDuration.Hour;
                                break;
                              case 'day':
                                duration = DueDateNotificationDuration.Day;
                                break;
                              case 'week':
                                duration = DueDateNotificationDuration.Week;
                                break;
                              default:
                                break;
                            }
                            return {
                              id: c.externalId ?? '',
                              period: c.period,
                              duration,
                            };
                          });
                        const newNotifications = notifications.current
                          .filter((c) => c.externalId === null)
                          .map((c) => {
                            let duration = DueDateNotificationDuration.Minute;
                            switch (c.duration.value) {
                              case 'hour':
                                duration = DueDateNotificationDuration.Hour;
                                break;
                              case 'day':
                                duration = DueDateNotificationDuration.Day;
                                break;
                              case 'week':
                                duration = DueDateNotificationDuration.Week;
                                break;
                              default:
                                break;
                            }
                            return {
                              taskID: task.id,
                              period: c.period,
                              duration,
                            };
                          });
                        // const updatedNotifications = notifications.filter(c => c.externalId === null);
                        updateTaskDueDate({
                          variables: {
                            taskID: t.id,
                            dueDate: newDueDate,
                            hasTime,
                            createNotifications: newNotifications,
                            updateNotifications: updatedNotifications,
                            deleteNotifications: notifications.removed.map((n) => ({ id: n })),
                          },
                        });
                        hidePopup();
                      }}
                      onCancel={NOOP}
                    />
                  </Popup>,
                  { showDiamond: false, targetPadding: '0' },
                );
              }}
            />
          ) : (
            <TaskDetailsLoading />
          );
        }}
      />
    </>
  );
};

export default Details;
