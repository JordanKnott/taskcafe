import React, { useRef } from 'react';
import styled from 'styled-components';
import TaskAssignee from 'shared/components/TaskAssignee';
import { Checkmark } from 'shared/icons';

const CardCheckmark = styled(Checkmark)`
  position: absolute;
  top: 0;
  right: 0;
  margin: 11px;
`;

type MemberProps = {
  onCardMemberClick?: OnCardMemberClick;
  taskID?: string;
  member: TaskUser;
  showName?: boolean;
  className?: string;
  showCheckmark?: boolean;
};

const CardMemberWrapper = styled.div<{ ref: any }>`
  display: flex;
  align-items: center;
`;

const CardMemberName = styled.span`
  font-size: 16px;
  padding-left: 8px;
`;

const Member: React.FC<MemberProps> = ({
  onCardMemberClick,
  taskID,
  member,
  showName,
  showCheckmark = false,
  className,
}) => {
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
      <TaskAssignee
        onMemberProfile={() => {
          //
        }}
        size={28}
        member={member}
      />
      {showName && <CardMemberName>{member.fullName}</CardMemberName>}
      {showCheckmark && <CardCheckmark width={12} height={12} />}
    </CardMemberWrapper>
  );
};

export default Member;
