import React, { useState, useContext } from 'react';
import Modal from 'shared/components/Modal';
import TaskDetails from 'shared/components/TaskDetails';
import PopupMenu, { Popup, usePopup } from 'shared/components/PopupMenu';
import MemberManager from 'shared/components/MemberManager';
import { useRouteMatch, useHistory } from 'react-router';
import {
  useDeleteTaskChecklistMutation,
  useUpdateTaskChecklistNameMutation,
  useCreateTaskChecklistMutation,
  useFindTaskQuery,
  useUpdateTaskDueDateMutation,
  useSetTaskCompleteMutation,
  useAssignTaskMutation,
  useUnassignTaskMutation,
  useSetTaskChecklistItemCompleteMutation,
  useDeleteTaskChecklistItemMutation,
  useUpdateTaskChecklistItemNameMutation,
  useCreateTaskChecklistItemMutation,
  FindTaskDocument,
  FindTaskQuery,
} from 'shared/generated/graphql';
import UserIDContext from 'App/context';
import MiniProfile from 'shared/components/MiniProfile';
import DueDateManager from 'shared/components/DueDateManager';
import produce from 'immer';
import styled from 'styled-components';
import Button from 'shared/components/Button';
import Input from 'shared/components/Input';
import { useForm } from 'react-hook-form';
import updateApolloCache from 'shared/utils/cache';

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

const InputError = styled.span`
  color: rgba(${props => props.theme.colors.danger});
  font-size: 12px;
`;
type CreateChecklistPopupProps = {
  onCreateChecklist: (data: CreateChecklistData) => void;
};
const CreateChecklistPopup: React.FC<CreateChecklistPopupProps> = ({ onCreateChecklist }) => {
  const { register, handleSubmit, errors } = useForm<CreateChecklistData>();
  const createUser = (data: CreateChecklistData) => {
    onCreateChecklist(data);
  };
  console.log(errors);
  return (
    <CreateChecklistForm onSubmit={handleSubmit(createUser)}>
      <CreateChecklistInput
        floatingLabel
        width="100%"
        label="Name"
        id="name"
        name="name"
        variant="alternate"
        ref={register({ required: 'Checklist name is required' })}
      />
      <CreateChecklistButton type="submit">Create</CreateChecklistButton>
    </CreateChecklistForm>
  );
};

type DetailsProps = {
  taskID: string;
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
  taskID,
  onTaskNameChange,
  onTaskDescriptionChange,
  onDeleteTask,
  onOpenAddLabelPopup,
  availableMembers,
  refreshCache,
}) => {
  const { userID } = useContext(UserIDContext);
  const { showPopup, hidePopup } = usePopup();
  const history = useHistory();
  const match = useRouteMatch();
  const [currentMemberTask, setCurrentMemberTask] = useState('');
  const [memberPopupData, setMemberPopupData] = useState(initialMemberPopupState);
  const [setTaskChecklistItemComplete] = useSetTaskChecklistItemCompleteMutation({
    update: client => {
      updateApolloCache<FindTaskQuery>(
        client,
        FindTaskDocument,
        cache =>
          produce(cache, draftCache => {
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
        cache =>
          produce(cache, draftCache => {
            const { checklists } = cache.findTask;
            const item = deleteData.deleteTaskChecklist;
            draftCache.findTask.checklists = checklists.filter(c => c.id !== item.taskChecklist.id);
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
        cache =>
          produce(cache, draftCache => {
            const item = createData.data.createTaskChecklist;
            draftCache.findTask.checklists.push({ ...item });
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
        cache =>
          produce(cache, draftCache => {
            const item = deleteData.data.deleteTaskChecklistItem.taskChecklistItem;
            draftCache.findTask.checklists = cache.findTask.checklists.filter(c => item.id !== c.id);
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
  const [createTaskChecklistItem] = useCreateTaskChecklistItemMutation({
    update: (client, newTaskItem) => {
      updateApolloCache<FindTaskQuery>(
        client,
        FindTaskDocument,
        cache =>
          produce(cache, draftCache => {
            const item = newTaskItem.data.createTaskChecklistItem;
            const { checklists } = cache.findTask;
            const idx = checklists.findIndex(c => c.id === item.taskChecklistID);
            if (idx !== -1) {
              draftCache.findTask.checklists[idx].items.push({ ...item });
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
  const { loading, data, refetch } = useFindTaskQuery({ variables: { taskID } });
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
  if (loading) {
    return <div>loading</div>;
  }
  if (!data) {
    return <div>loading</div>;
  }
  console.log(data.findTask);
  return (
    <>
      <Modal
        width={768}
        onClose={() => {
          history.push(projectURL);
        }}
        renderContent={() => {
          return (
            <TaskDetails
              task={data.findTask}
              onTaskNameChange={onTaskNameChange}
              onTaskDescriptionChange={onTaskDescriptionChange}
              onToggleTaskComplete={task => {
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
              onDeleteItem={itemID => {
                deleteTaskChecklistItem({ variables: { taskChecklistItemID: itemID } });
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
                const member = data.findTask.assigned.find(m => m.id === memberID);
                const profileIcon = member ? member.profileIcon : null;
                showPopup(
                  $targetRef,
                  <Popup title={null} onClose={() => {}} tab={0}>
                    <MiniProfile
                      profileIcon={profileIcon}
                      displayName="Jordan Knott"
                      username="@jordanthedev"
                      bio="None"
                      onRemoveFromTask={() => {
                        unassignTask({ variables: { taskID: data.findTask.id, userID: userID ?? '' } });
                      }}
                    />
                  </Popup>,
                );
              }}
              onOpenAddMemberPopup={(task, $targetRef) => {
                showPopup(
                  $targetRef,
                  <Popup title="Members" tab={0} onClose={() => {}}>
                    <MemberManager
                      availableMembers={availableMembers}
                      activeMembers={data.findTask.assigned}
                      onMemberChange={(member, isActive) => {
                        if (isActive) {
                          assignTask({ variables: { taskID: data.findTask.id, userID: userID ?? '' } });
                        } else {
                          unassignTask({ variables: { taskID: data.findTask.id, userID: userID ?? '' } });
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
                    title={'Add checklist'}
                    tab={0}
                    onClose={() => {
                      hidePopup();
                    }}
                  >
                    <CreateChecklistPopup
                      onCreateChecklist={checklistData => {
                        let position = 65535;
                        console.log(data.findTask.checklists);
                        if (data.findTask.checklists) {
                          const [lastChecklist] = data.findTask.checklists.slice(-1);
                          console.log(`lastCheclist ${lastChecklist}`);
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
                    title={'Change Due Date'}
                    tab={0}
                    onClose={() => {
                      hidePopup();
                    }}
                  >
                    <DueDateManager
                      task={task}
                      onRemoveDueDate={t => {
                        updateTaskDueDate({ variables: { taskID: t.id, dueDate: null } });
                        hidePopup();
                      }}
                      onDueDateChange={(t, newDueDate) => {
                        updateTaskDueDate({ variables: { taskID: t.id, dueDate: newDueDate } });
                        hidePopup();
                      }}
                      onCancel={() => {}}
                    />
                  </Popup>,
                );
              }}
            />
          );
        }}
      />
    </>
  );
};

export default Details;
