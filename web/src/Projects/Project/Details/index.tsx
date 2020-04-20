import React, { useState, useContext } from 'react';
import Modal from 'shared/components/Modal';
import TaskDetails from 'shared/components/TaskDetails';
import PopupMenu from 'shared/components/PopupMenu';
import MemberManager from 'shared/components/MemberManager';
import { useRouteMatch, useHistory } from 'react-router';
import { useFindTaskQuery, useAssignTaskMutation } from 'shared/generated/graphql';
import UserIDContext from 'App/context';

type DetailsProps = {
  taskID: string;
  projectURL: string;
  onTaskNameChange: (task: Task, newName: string) => void;
  onTaskDescriptionChange: (task: Task, newDescription: string) => void;
  onDeleteTask: (task: Task) => void;
  onOpenAddLabelPopup: (task: Task, bounds: ElementBounds) => void;
  availableMembers: Array<TaskUser>;
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
}) => {
  const { userID } = useContext(UserIDContext);
  const history = useHistory();
  const match = useRouteMatch();
  const [memberPopupData, setMemberPopupData] = useState(initialMemberPopupState);
  const { loading, data } = useFindTaskQuery({ variables: { taskID } });
  const [assignTask] = useAssignTaskMutation();
  if (loading) {
    return <div>loading</div>;
  }
  if (!data) {
    return <div>loading</div>;
  }
  const taskMembers = data.findTask.assigned.map(assigned => {
    return {
      userID: assigned.userID,
      displayName: `${assigned.firstName} ${assigned.lastName}`,
      profileIcon: {
        url: null,
        initials: assigned.profileIcon.initials ?? null,
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
                members: taskMembers,
                description: data.findTask.description ?? '',
                labels: [],
              }}
              onTaskNameChange={onTaskNameChange}
              onTaskDescriptionChange={onTaskDescriptionChange}
              onDeleteTask={onDeleteTask}
              onCloseModal={() => history.push(projectURL)}
              onOpenAddMemberPopup={(task, bounds) => {
                console.log(task, bounds);
                setMemberPopupData({
                  isOpen: true,
                  taskID: task.taskID,
                  top: bounds.position.top + bounds.size.height + 10,
                  left: bounds.position.left,
                });
              }}
              onOpenAddLabelPopup={onOpenAddLabelPopup}
            />
          );
        }}
      />
      {memberPopupData.isOpen && (
        <PopupMenu
          title="Members"
          top={memberPopupData.top}
          onClose={() => setMemberPopupData(initialMemberPopupState)}
          left={memberPopupData.left}
        >
          <MemberManager
            availableMembers={availableMembers}
            activeMembers={[]}
            onMemberChange={(member, isActive) => {
              if (isActive) {
                assignTask({ variables: { taskID: data.findTask.taskID, userID: userID ?? '' } });
              }
              console.log(member, isActive);
            }}
          />
        </PopupMenu>
      )}
    </>
  );
};

export default Details;
