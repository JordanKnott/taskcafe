import React from 'react';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import { NameEditor } from 'shared/components/AddList';
import NOOP from 'shared/utils/noop';
import styled from 'styled-components';
import { TaskSorting, TaskSortingDirection, TaskSortingType } from 'shared/utils/sorting';
import { InnerContent, ListActionsWrapper, ListActionItemWrapper, ListActionItem, ListSeparator } from './Styles';

const CopyWrapper = styled.div`
  margin: 0 12px;
`;

type Props = {
  taskGroupID: string;
  onDuplicateTaskGroup: (newTaskGroupName: string) => void;
  onDeleteTaskGroupTasks: () => void;
  onArchiveTaskGroup: (taskGroupID: string) => void;
  onSortTaskGroup: (taskSorting: TaskSorting) => void;
};

const LabelManager: React.FC<Props> = ({
  taskGroupID,
  onDeleteTaskGroupTasks,
  onDuplicateTaskGroup,
  onArchiveTaskGroup,
  onSortTaskGroup,
}) => {
  const { setTab } = usePopup();
  return (
    <>
      <Popup tab={0} title={null}>
        <InnerContent>
          <ListActionsWrapper>
            <ListActionItemWrapper onClick={() => setTab(1)}>
              <ListActionItem>Duplicate</ListActionItem>
            </ListActionItemWrapper>
            <ListActionItemWrapper onClick={() => setTab(2)}>
              <ListActionItem>Sort</ListActionItem>
            </ListActionItemWrapper>
          </ListActionsWrapper>
          <ListSeparator />
          <ListActionsWrapper>
            <ListActionItemWrapper onClick={() => onDeleteTaskGroupTasks()}>
              <ListActionItem>Delete All Tasks</ListActionItem>
            </ListActionItemWrapper>
          </ListActionsWrapper>
          <ListSeparator />
          <ListActionsWrapper>
            <ListActionItemWrapper onClick={() => onArchiveTaskGroup(taskGroupID)}>
              <ListActionItem>Delete</ListActionItem>
            </ListActionItemWrapper>
          </ListActionsWrapper>
        </InnerContent>
      </Popup>
      <Popup tab={1} title="Copy list" onClose={NOOP}>
        <CopyWrapper>
          <NameEditor
            onCancel={NOOP}
            onSave={listName => {
              onDuplicateTaskGroup(listName);
            }}
            buttonLabel="Duplicate"
          />
        </CopyWrapper>
      </Popup>
      <Popup tab={2} title="Sort list" onClose={NOOP}>
        <InnerContent>
          <ListActionsWrapper>
            <ListActionItemWrapper
              onClick={() => onSortTaskGroup({ type: TaskSortingType.TASK_TITLE, direction: TaskSortingDirection.ASC })}
            >
              <ListActionItem>Task title</ListActionItem>
            </ListActionItemWrapper>
            <ListActionItemWrapper
              onClick={() => onSortTaskGroup({ type: TaskSortingType.TASK_TITLE, direction: TaskSortingDirection.ASC })}
            >
              <ListActionItem>Due date</ListActionItem>
            </ListActionItemWrapper>
            <ListActionItemWrapper
              onClick={() => onSortTaskGroup({ type: TaskSortingType.COMPLETE, direction: TaskSortingDirection.ASC })}
            >
              <ListActionItem>Complete</ListActionItem>
            </ListActionItemWrapper>
            <ListActionItemWrapper
              onClick={() => onSortTaskGroup({ type: TaskSortingType.LABELS, direction: TaskSortingDirection.ASC })}
            >
              <ListActionItem>Labels</ListActionItem>
            </ListActionItemWrapper>
            <ListActionItemWrapper
              onClick={() => onSortTaskGroup({ type: TaskSortingType.MEMBERS, direction: TaskSortingDirection.ASC })}
            >
              <ListActionItem>Members</ListActionItem>
            </ListActionItemWrapper>
          </ListActionsWrapper>
        </InnerContent>
      </Popup>
    </>
  );
};
export default LabelManager;
