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
} from 'shared/generated/graphql';
import UserIDContext from 'App/context';
import MiniProfile from 'shared/components/MiniProfile';
import DueDateManager from 'shared/components/DueDateManager';

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
              onCloseModal={() => history.push(projectURL)}
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
                      onDueDateChange={(t, newDueDate) => {
                        console.log(`${newDueDate}`);
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
