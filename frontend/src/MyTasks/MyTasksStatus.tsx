import React, { useState } from 'react';
import styled from 'styled-components';
import { Checkmark } from 'shared/icons';
import { TaskStatusFilter, TaskStatus, TaskSince } from 'shared/components/Lists';
import { MyTasksStatus } from 'shared/generated/graphql';
import { Popup } from 'shared/components/PopupMenu';

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
    background: ${props => props.theme.colors.primary};
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
    background: ${props => props.theme.colors.primary};
  }
`;
const ActionExtraMenuSeparator = styled.li`
  color: ${props => props.theme.colors.text.primary};
  font-size: 12px;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
`;

const ActiveIcon = styled(Checkmark)`
  position: absolute;
`;

type MyTasksStatusProps = {
  status: MyTasksStatus;
  onChangeStatus: (status: MyTasksStatus) => void;
};

const MyTasksStatusPopup: React.FC<MyTasksStatusProps> = ({ status: initialStatus, onChangeStatus }) => {
  const [status, setStatus] = useState(initialStatus);
  const handleStatusChange = (f: MyTasksStatus) => {
    setStatus(f);
    onChangeStatus(f);
  };
  return (
    <Popup tab={0} title={null}>
      <ActionsList>
        <ActionItem onClick={() => handleStatusChange(MyTasksStatus.Incomplete)}>
          {status === MyTasksStatus.Incomplete && <ActiveIcon width={12} height={12} />}
          <ActionTitle>Incomplete Tasks</ActionTitle>
        </ActionItem>
        <ActionItem>
          {status !== MyTasksStatus.Incomplete && status !== MyTasksStatus.All && <ActiveIcon width={12} height={12} />}
          <ActionTitle>Compelete Tasks</ActionTitle>
          <ActionExtraMenuContainer>
            <ActionExtraMenu>
              <ActionExtraMenuItem onClick={() => handleStatusChange(MyTasksStatus.CompleteAll)}>
                {status === MyTasksStatus.CompleteAll && <ActiveIcon width={12} height={12} />}
                <ActionTitle>All completed tasks</ActionTitle>
              </ActionExtraMenuItem>
              <ActionExtraMenuSeparator>Marked complete since</ActionExtraMenuSeparator>
              <ActionExtraMenuItem onClick={() => handleStatusChange(MyTasksStatus.CompleteToday)}>
                {status === MyTasksStatus.CompleteToday && <ActiveIcon width={12} height={12} />}
                <ActionTitle>Today</ActionTitle>
              </ActionExtraMenuItem>
              <ActionExtraMenuItem onClick={() => handleStatusChange(MyTasksStatus.CompleteYesterday)}>
                {status === MyTasksStatus.CompleteYesterday && <ActiveIcon width={12} height={12} />}

                <ActionTitle>Yesterday</ActionTitle>
              </ActionExtraMenuItem>
              <ActionExtraMenuItem onClick={() => handleStatusChange(MyTasksStatus.CompleteOneWeek)}>
                {status === MyTasksStatus.CompleteOneWeek && <ActiveIcon width={12} height={12} />}
                <ActionTitle>1 week</ActionTitle>
              </ActionExtraMenuItem>
              <ActionExtraMenuItem onClick={() => handleStatusChange(MyTasksStatus.CompleteTwoWeek)}>
                {status === MyTasksStatus.CompleteTwoWeek && <ActiveIcon width={12} height={12} />}
                <ActionTitle>2 weeks</ActionTitle>
              </ActionExtraMenuItem>
              <ActionExtraMenuItem onClick={() => handleStatusChange(MyTasksStatus.CompleteThreeWeek)}>
                {status === MyTasksStatus.CompleteThreeWeek && <ActiveIcon width={12} height={12} />}
                <ActionTitle>3 weeks</ActionTitle>
              </ActionExtraMenuItem>
            </ActionExtraMenu>
          </ActionExtraMenuContainer>
        </ActionItem>
        <ActionItem onClick={() => handleStatusChange(MyTasksStatus.All)}>
          {status === MyTasksStatus.All && <ActiveIcon width={12} height={12} />}
          <ActionTitle>All Tasks</ActionTitle>
        </ActionItem>
      </ActionsList>
    </Popup>
  );
};

export default MyTasksStatusPopup;
