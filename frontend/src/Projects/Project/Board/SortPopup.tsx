import React, { useState } from 'react';
import styled from 'styled-components';
import { TaskSorting, TaskSortingType, TaskSortingDirection } from 'shared/utils/sorting';
import { mixin } from 'shared/utils/styles';

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
    background: ${props => props.theme.colors.primary};
  }
`;

export const ActionTitle = styled.span`
  margin-left: 20px;
`;

const ActionItemSeparator = styled.li`
  color: ${props => mixin.rgba(props.theme.colors.text.primary, 0.4)};
  font-size: 12px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 0.75rem;
  padding-bottom: 0.25rem;
`;

type SortPopupProps = {
  sorting: TaskSorting;
  onChangeTaskSorting: (taskSorting: TaskSorting) => void;
};

const SortPopup: React.FC<SortPopupProps> = ({ sorting, onChangeTaskSorting }) => {
  const [currentSorting, setSorting] = useState(sorting);
  const handleSetSorting = (s: TaskSorting) => {
    setSorting(s);
    onChangeTaskSorting(s);
  };
  return (
    <ActionsList>
      <ActionItem onClick={() => handleSetSorting({ type: TaskSortingType.NONE, direction: TaskSortingDirection.ASC })}>
        <ActionTitle>None</ActionTitle>
      </ActionItem>
      <ActionItem
        onClick={() => handleSetSorting({ type: TaskSortingType.DUE_DATE, direction: TaskSortingDirection.ASC })}
      >
        <ActionTitle>Due date</ActionTitle>
      </ActionItem>
      <ActionItem
        onClick={() => handleSetSorting({ type: TaskSortingType.MEMBERS, direction: TaskSortingDirection.ASC })}
      >
        <ActionTitle>Members</ActionTitle>
      </ActionItem>
      <ActionItem
        onClick={() => handleSetSorting({ type: TaskSortingType.LABELS, direction: TaskSortingDirection.ASC })}
      >
        <ActionTitle>Labels</ActionTitle>
      </ActionItem>
      <ActionItem
        onClick={() => handleSetSorting({ type: TaskSortingType.TASK_TITLE, direction: TaskSortingDirection.ASC })}
      >
        <ActionTitle>Task title</ActionTitle>
      </ActionItem>
      <ActionItem
        onClick={() => handleSetSorting({ type: TaskSortingType.COMPLETE, direction: TaskSortingDirection.ASC })}
      >
        <ActionTitle>Complete</ActionTitle>
      </ActionItem>
    </ActionsList>
  );
};

export default SortPopup;
