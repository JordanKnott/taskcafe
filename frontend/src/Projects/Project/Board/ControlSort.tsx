import React, { useState } from 'react';
import styled from 'styled-components';
import { TaskSorting, TaskSortingType, TaskSortingDirection } from 'shared/utils/sorting';
import { Checkmark } from 'shared/icons';

const ActiveIcon = styled(Checkmark)`
  position: absolute;
`;

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

type ControlSortProps = {
  sorting: TaskSorting;
  onChangeTaskSorting: (taskSorting: TaskSorting) => void;
};

const ControlSort: React.FC<ControlSortProps> = ({ sorting, onChangeTaskSorting }) => {
  const [currentSorting, setSorting] = useState(sorting);
  const handleSetSorting = (s: TaskSorting) => {
    setSorting(s);
    onChangeTaskSorting(s);
  };
  return (
    <ActionsList>
      <ActionItem onClick={() => handleSetSorting({ type: TaskSortingType.NONE, direction: TaskSortingDirection.ASC })}>
        {currentSorting.type === TaskSortingType.NONE && <ActiveIcon width={12} height={12} />}
        <ActionTitle>None</ActionTitle>
      </ActionItem>
      <ActionItem
        onClick={() => handleSetSorting({ type: TaskSortingType.DUE_DATE, direction: TaskSortingDirection.ASC })}
      >
        {currentSorting.type === TaskSortingType.DUE_DATE && <ActiveIcon width={12} height={12} />}
        <ActionTitle>Due date</ActionTitle>
      </ActionItem>
      <ActionItem
        onClick={() => handleSetSorting({ type: TaskSortingType.MEMBERS, direction: TaskSortingDirection.ASC })}
      >
        {currentSorting.type === TaskSortingType.MEMBERS && <ActiveIcon width={12} height={12} />}
        <ActionTitle>Members</ActionTitle>
      </ActionItem>
      <ActionItem
        onClick={() => handleSetSorting({ type: TaskSortingType.LABELS, direction: TaskSortingDirection.ASC })}
      >
        {currentSorting.type === TaskSortingType.LABELS && <ActiveIcon width={12} height={12} />}
        <ActionTitle>Labels</ActionTitle>
      </ActionItem>
      <ActionItem
        onClick={() => handleSetSorting({ type: TaskSortingType.TASK_TITLE, direction: TaskSortingDirection.ASC })}
      >
        {currentSorting.type === TaskSortingType.TASK_TITLE && <ActiveIcon width={12} height={12} />}
        <ActionTitle>Task title</ActionTitle>
      </ActionItem>
      <ActionItem
        onClick={() => handleSetSorting({ type: TaskSortingType.COMPLETE, direction: TaskSortingDirection.ASC })}
      >
        {currentSorting.type === TaskSortingType.COMPLETE && <ActiveIcon width={12} height={12} />}
        <ActionTitle>Complete</ActionTitle>
      </ActionItem>
    </ActionsList>
  );
};

export default ControlSort;
