import React, { useRef } from 'react';
import styled from 'styled-components';

const TaskDetailAssignee = styled.div`
  &:hover {
    opacity: 0.8;
  }
  margin-right: 4px;
`;

const ProfileIcon = styled.div<{ size: string | number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 400;
  background: rgb(115, 103, 240);
  font-size: 14px;
  cursor: pointer;
`;

type TaskAssigneeProps = {
  size: number | string;
  member: TaskUser;
  onMemberProfile: ($targetRef: React.RefObject<HTMLElement>, memberID: string) => void;
};

const TaskAssignee: React.FC<TaskAssigneeProps> = ({ member, onMemberProfile, size }) => {
  const $memberRef = useRef<HTMLDivElement>(null);
  return (
    <TaskDetailAssignee ref={$memberRef} onClick={() => onMemberProfile($memberRef, member.userID)} key={member.userID}>
      <ProfileIcon size={size}>{member.profileIcon.initials ?? ''}</ProfileIcon>
    </TaskDetailAssignee>
  );
};

export default TaskAssignee;
