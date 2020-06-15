import React, { useRef } from 'react';
import styled from 'styled-components';

const CardMember = styled.div<{ bgColor: string; ref: any }>`
  height: 28px;
  width: 28px;
  float: right;
  margin: 0 0 4px 4px;

  background-color: ${props => props.bgColor};
  color: #fff;
  border-radius: 25em;
  cursor: pointer;
  display: block;
  overflow: visible;
  position: relative;
  text-decoration: none;
  z-index: 0;
`;

const CardMemberInitials = styled.div`
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
`;

type MemberProps = {
  onCardMemberClick?: OnCardMemberClick;
  taskID: string;
  member: TaskUser;
};

const Member: React.FC<MemberProps> = ({ onCardMemberClick, taskID, member }) => {
  const $targetRef = useRef<HTMLDivElement>();
  return (
    <CardMember
      ref={$targetRef}
      onClick={e => {
        if (onCardMemberClick) {
          e.stopPropagation();
          onCardMemberClick($targetRef, taskID, member.id);
        }
      }}
      key={member.id}
      bgColor={member.profileIcon.bgColor ?? '#7367F0'}
    >
      <CardMemberInitials>{member.profileIcon.initials}</CardMemberInitials>
    </CardMember>
  );
};

export default Member;
