import React, { useState, useContext } from 'react';
import Modal from 'shared/components/Modal';
import TaskDetails from 'shared/components/TaskDetails';
import PopupMenu, { Popup, usePopup } from 'shared/components/PopupMenu';
import MemberManager from 'shared/components/MemberManager';
import { useRouteMatch, useHistory } from 'react-router';
import { useFindTaskQuery, useAssignTaskMutation, useUnassignTaskMutation } from 'shared/generated/graphql';
import UserIDContext from 'App/context';
import MiniProfile from 'shared/components/MiniProfile';

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
  const { showPopup } = usePopup();
  const history = useHistory();
  const match = useRouteMatch();
  const [currentMemberTask, setCurrentMemberTask] = useState('');
  const [memberPopupData, setMemberPopupData] = useState(initialMemberPopupState);
  const { loading, data, refetch } = useFindTaskQuery({ variables: { taskID } });
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
  const taskMembers = data.findTask.assigned.map(assigned => {
    return {
      userID: assigned.id,
      displayName: `${assigned.firstName} ${assigned.lastName}`,
      profileIcon: {
        url: null,
        initials: assigned.profileIcon.initials ?? null,
        bgColor: assigned.profileIcon.bgColor ?? null,
      },
    };
  });
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
              task={{
                ...data.findTask,
                taskID: data.findTask.id,
                taskGroup: { taskGroupID: data.findTask.taskGroup.id },
                members: taskMembers,
                description: data.findTask.description ?? '',
                labels: [],
              }}
              onTaskNameChange={onTaskNameChange}
              onTaskDescriptionChange={onTaskDescriptionChange}
              onDeleteTask={onDeleteTask}
              onCloseModal={() => history.push(projectURL)}
              onMemberProfile={($targetRef, memberID) => {
                showPopup(
                  $targetRef,
                  <Popup title={null} onClose={() => {}} tab={0}>
                    <MiniProfile
                      profileIcon={taskMembers[0].profileIcon}
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
                console.log(`task: ${task.taskID}`);
                showPopup(
                  $targetRef,
                  <Popup title="Members" tab={0} onClose={() => {}}>
                    <MemberManager
                      availableMembers={availableMembers}
                      activeMembers={taskMembers}
                      onMemberChange={(member, isActive) => {
                        console.log(`is active ${member.userID} - ${isActive}`);
                        if (isActive) {
                          assignTask({ variables: { taskID: data.findTask.id, userID: userID ?? '' } });
                        } else {
                          unassignTask({ variables: { taskID: data.findTask.id, userID: userID ?? '' } });
                        }
                        console.log(member, isActive);
                      }}
                    />
                  </Popup>,
                );
              }}
              onOpenAddLabelPopup={onOpenAddLabelPopup}
            />
          );
        }}
      />
    </>
  );
};

export default Details;
