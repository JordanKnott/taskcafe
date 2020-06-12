import React, { useRef } from 'react';
import styled from 'styled-components';

const TaskDetailAssignee = styled.div`
  &:hover {
    opacity: 0.8;
  }
  margin-right: 4px;
`;

export const Wrapper = styled.div<{ size: number | string; bgColor: string | null; backgroundURL: string | null }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  background: ${props => (props.backgroundURL ? `url(${props.backgroundURL})` : props.bgColor)};
  background-position: center;
  background-size: contain;
`;

type TaskAssigneeProps = {
  size: number | string;
  member: TaskUser;
  onMemberProfile: ($targetRef: React.RefObject<HTMLElement>, memberID: string) => void;
};

const TaskAssignee: React.FC<TaskAssigneeProps> = ({ member, onMemberProfile, size }) => {
  const $memberRef = useRef<HTMLDivElement>(null);
  return (
    <TaskDetailAssignee
      ref={$memberRef}
      onClick={e => {
        e.stopPropagation();
        onMemberProfile($memberRef, member.id);
      }}
      key={member.id}
    >
      <Wrapper backgroundURL={member.profileIcon.url ?? null} bgColor={member.profileIcon.bgColor ?? null} size={size}>
        {(!member.profileIcon.url && member.profileIcon.initials) ?? ''}
      </Wrapper>
    </TaskDetailAssignee>
  );
};

export default TaskAssignee;
