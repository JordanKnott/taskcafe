import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { DoubleChevronUp, Crown } from 'shared/icons';

export const AdminIcon = styled(DoubleChevronUp)`
  bottom: 0;
  right: 1px;
  position: absolute;
  fill: #c377e0;
`;

export const OwnerIcon = styled(Crown)`
  bottom: 0;
  right: 1px;
  position: absolute;
  fill: #c8b928;
`;

const TaskDetailAssignee = styled.div`
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  position: relative;
`;

export const Wrapper = styled.div<{
  size: number | string;
  bgColor: string | null;
  backgroundURL: string | null;
  hasClick: boolean;
}>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.backgroundURL ? props.theme.colors.text.primary : 'rgb(0,0,0)')};
  background: ${props => (props.backgroundURL ? `url(${props.backgroundURL})` : props.bgColor)};
  background-position: center;
  background-size: contain;
  font-size: 14px;
  font-weight: 400;
  ${props =>
    props.hasClick &&
    css`
      &:hover {
        opacity: 0.8;
      }
    `}
`;

type TaskAssigneeProps = {
  size: number | string;
  showRoleIcons?: boolean;
  member: TaskUser;
  invited?: boolean;
  onMemberProfile?: ($targetRef: React.RefObject<HTMLElement>, memberID: string) => void;
  className?: string;
};

const TaskAssignee: React.FC<TaskAssigneeProps> = ({
  showRoleIcons,
  member,
  invited,
  onMemberProfile,
  size,
  className,
}) => {
  const $memberRef = useRef<HTMLDivElement>(null);
  let profileIcon: ProfileIcon = {
    url: null,
    bgColor: null,
    initials: null,
  };
  if (member.profileIcon) {
    profileIcon = member.profileIcon;
  }
  return (
    <TaskDetailAssignee
      className={className}
      ref={$memberRef}
      onClick={e => {
        e.stopPropagation();
        if (onMemberProfile) {
          onMemberProfile($memberRef, member.id);
        }
      }}
      key={member.id}
    >
      <Wrapper
        hasClick={typeof onMemberProfile !== undefined}
        backgroundURL={profileIcon.url ?? null}
        bgColor={profileIcon.bgColor ?? null}
        size={size}
      >
        {(!profileIcon.url && profileIcon.initials) ?? ''}
      </Wrapper>
      {showRoleIcons && member.role && member.role.code === 'admin' && <AdminIcon width={10} height={10} />}
      {showRoleIcons && member.role && member.role.code === 'owner' && <OwnerIcon width={10} height={10} />}
    </TaskDetailAssignee>
  );
};

export default TaskAssignee;
