import React, { useState, useContext } from 'react';
import Modal from 'shared/components/Modal';
import TaskDetails from 'shared/components/TaskDetails';
import PopupMenu, { Popup, usePopup } from 'shared/components/PopupMenu';
import MemberManager from 'shared/components/MemberManager';
import { useRouteMatch, useHistory } from 'react-router';
import {
  useFindTaskQuery,
  useUpdateTaskDueDateMutation,
  useAssignTaskMutation,
  useUnassignTaskMutation,
  useSetTaskChecklistItemCompleteMutation,
  useDeleteTaskChecklistItemMutation,
  useUpdateTaskChecklistItemNameMutation,
  useCreateTaskChecklistItemMutation,
  FindTaskDocument,
} from 'shared/generated/graphql';
import UserIDContext from 'App/context';
import MiniProfile from 'shared/components/MiniProfile';
import DueDateManager from 'shared/components/DueDateManager';
import produce from 'immer';

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
  const [setTaskChecklistItemComplete] = useSetTaskChecklistItemCompleteMutation();
  const [updateTaskChecklistItemName] = useUpdateTaskChecklistItemNameMutation();
  const [deleteTaskChecklistItem] = useDeleteTaskChecklistItemMutation({
    update: (client, deleteData) => {
      const cacheData: any = client.readQuery({
        query: FindTaskDocument,
        variables: { taskID },
      });
      console.log(deleteData);
      const newData = produce(cacheData.findTask, (draftState: any) => {
        const idx = draftState.checklists.findIndex(
          (checklist: TaskChecklist) =>
            checklist.id === deleteData.data.deleteTaskChecklistItem.taskChecklistItem.taskChecklistID,
        );
        console.log(`idx ${idx}`);
        if (idx !== -1) {
          draftState.checklists[idx].items = cacheData.findTask.checklists[idx].items.filter(
            (item: any) => item.id !== deleteData.data.deleteTaskChecklistItem.taskChecklistItem.id,
          );
        }
      });
      client.writeQuery({
        query: FindTaskDocument,
        variables: { taskID },
        data: {
          findTask: newData,
        },
      });
    },
  });
  const [createTaskChecklistItem] = useCreateTaskChecklistItemMutation({
    update: (client, newTaskItem) => {
      const cacheData: any = client.readQuery({
        query: FindTaskDocument,
        variables: { taskID },
      });
      console.log(cacheData);
      console.log(newTaskItem);
      const newData = produce(cacheData.findTask, (draftState: any) => {
        const idx = draftState.checklists.findIndex(
          (checklist: TaskChecklist) => checklist.id === newTaskItem.data.createTaskChecklistItem.taskChecklistID,
        );
        if (idx !== -1) {
          draftState.checklists[idx].items = [
            ...cacheData.findTask.checklists[idx].items,
            { ...newTaskItem.data.createTaskChecklistItem },
          ];
        }
      });
      client.writeQuery({
        query: FindTaskDocument,
        variables: { taskID },
        data: {
          findTask: newData,
        },
      });
    },
  });
  const { loading, data, refetch } = useFindTaskQuery({ variables: { taskID } });
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
        width={1040}
        onClose={() => {
          history.push(projectURL);
        }}
        renderContent={() => {
          return (
            <TaskDetails
              task={data.findTask}
              onTaskNameChange={onTaskNameChange}
              onTaskDescriptionChange={onTaskDescriptionChange}
              onDeleteTask={onDeleteTask}
              onChangeItemName={(itemID, itemName) => {
                updateTaskChecklistItemName({ variables: { taskChecklistItemID: itemID, name: itemName } });
              }}
              onCloseModal={() => history.push(projectURL)}
              onDeleteItem={itemID => {
                deleteTaskChecklistItem({ variables: { taskChecklistItemID: itemID } });
              }}
              onToggleChecklistItem={(itemID, complete) => {
                setTaskChecklistItemComplete({ variables: { taskChecklistItemID: itemID, complete } });
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
