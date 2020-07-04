import React, { useRef } from 'react';
import styled from 'styled-components';

const CardMember = styled.div<{ bgColor: string }>`
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
  taskID?: string;
  member: TaskUser;
  showName?: boolean;
  className?: string;
};

const CardMemberWrapper = styled.div<{ ref: any }>`
  display: flex;
  align-items: center;
`;

const CardMemberName = styled.span`
  font-size: 16px;
  padding-left: 8px;
`;

const Member: React.FC<MemberProps> = ({ onCardMemberClick, taskID, member, showName, className }) => {
  const $targetRef = useRef<HTMLDivElement>();
  return (
    <CardMemberWrapper
      key={member.id}
      ref={$targetRef}
      className={className}
      onClick={e => {
        if (onCardMemberClick) {
          e.stopPropagation();
          onCardMemberClick($targetRef, taskID ?? '', member.id);
        }
      }}
    >
      <CardMember bgColor={member.profileIcon.bgColor ?? '#7367F0'}>
        <CardMemberInitials>{member.profileIcon.initials}</CardMemberInitials>
      </CardMember>
      {showName && <CardMemberName>{member.fullName}</CardMemberName>}
    </CardMemberWrapper>
  );
};

export default Member;
