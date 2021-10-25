import React, { useState } from 'react';
import styled from 'styled-components';
import { Checkmark } from 'shared/icons';
import { TaskStatusFilter, TaskStatus, TaskSince } from 'shared/components/Lists';

export const ActionsList = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const ActionExtraMenuContainer = styled.div`
  visibility: hidden;
  position: absolute;
  left: 100%;
  top: -4px;
  padding-left: 2px;
  width: 100%;
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
  &:hover ${ActionExtraMenuContainer} {
    visibility: visible;
  }
`;

export const ActionTitle = styled.span`
  margin-left: 20px;
`;

export const ActionExtraMenu = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;

  padding: 5px;
  padding-top: 8px;
  border-radius: 5px;
  box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.1);

  color: #c2c6dc;
  background: #262c49;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-color: #414561;
`;

export const ActionExtraMenuItem = styled.li`
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
const ActionExtraMenuSeparator = styled.li`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 12px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
`;

const ActiveIcon = styled(Checkmark)`
  position: absolute;
`;

type ControlStatusProps = {
  filter: TaskStatusFilter;
  onChangeTaskStatusFilter: (filter: TaskStatusFilter) => void;
};

const ControlStatus: React.FC<ControlStatusProps> = ({ filter, onChangeTaskStatusFilter }) => {
  const [currentFilter, setFilter] = useState(filter);
  const handleFilterChange = (f: TaskStatusFilter) => {
    setFilter(f);
    onChangeTaskStatusFilter(f);
  };
  const handleCompleteClick = (s: TaskSince) => {
    handleFilterChange({ status: TaskStatus.COMPLETE, since: s });
  };
  return (
    <ActionsList>
      <ActionItem onClick={() => handleFilterChange({ status: TaskStatus.INCOMPLETE, since: TaskSince.ALL })}>
        {currentFilter.status === TaskStatus.INCOMPLETE && <ActiveIcon width={12} height={12} />}
        <ActionTitle>Incomplete Tasks</ActionTitle>
      </ActionItem>
      <ActionItem>
        {currentFilter.status === TaskStatus.COMPLETE && <ActiveIcon width={12} height={12} />}
        <ActionTitle>Compelete Tasks</ActionTitle>
        <ActionExtraMenuContainer>
          <ActionExtraMenu>
            <ActionExtraMenuItem onClick={() => handleCompleteClick(TaskSince.ALL)}>
              {currentFilter.since === TaskSince.ALL && <ActiveIcon width={12} height={12} />}
              <ActionTitle>All completed tasks</ActionTitle>
            </ActionExtraMenuItem>
            <ActionExtraMenuSeparator>Marked complete since</ActionExtraMenuSeparator>
            <ActionExtraMenuItem onClick={() => handleCompleteClick(TaskSince.TODAY)}>
              {currentFilter.since === TaskSince.TODAY && <ActiveIcon width={12} height={12} />}
              <ActionTitle>Today</ActionTitle>
            </ActionExtraMenuItem>
            <ActionExtraMenuItem onClick={() => handleCompleteClick(TaskSince.YESTERDAY)}>
              {currentFilter.since === TaskSince.YESTERDAY && <ActiveIcon width={12} height={12} />}
              <ActionTitle>Yesterday</ActionTitle>
            </ActionExtraMenuItem>
            <ActionExtraMenuItem onClick={() => handleCompleteClick(TaskSince.ONE_WEEK)}>
              {currentFilter.since === TaskSince.ONE_WEEK && <ActiveIcon width={12} height={12} />}
              <ActionTitle>1 week</ActionTitle>
            </ActionExtraMenuItem>
            <ActionExtraMenuItem onClick={() => handleCompleteClick(TaskSince.TWO_WEEKS)}>
              {currentFilter.since === TaskSince.TWO_WEEKS && <ActiveIcon width={12} height={12} />}
              <ActionTitle>2 weeks</ActionTitle>
            </ActionExtraMenuItem>
            <ActionExtraMenuItem onClick={() => handleCompleteClick(TaskSince.THREE_WEEKS)}>
              {currentFilter.since === TaskSince.THREE_WEEKS && <ActiveIcon width={12} height={12} />}
              <ActionTitle>3 weeks</ActionTitle>
            </ActionExtraMenuItem>
          </ActionExtraMenu>
        </ActionExtraMenuContainer>
      </ActionItem>
      <ActionItem onClick={() => handleFilterChange({ status: TaskStatus.ALL, since: TaskSince.ALL })}>
        {currentFilter.status === TaskStatus.ALL && <ActiveIcon width={12} height={12} />}
        <ActionTitle>All Tasks</ActionTitle>
      </ActionItem>
    </ActionsList>
  );
};

export default ControlStatus;
