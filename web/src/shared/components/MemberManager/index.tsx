import React, { useState } from 'react';

import {
  MemberName,
  ProfileIcon,
  MemberManagerWrapper,
  MemberManagerSearchWrapper,
  MemberManagerSearch,
  BoardMembersLabel,
  BoardMembersList,
  BoardMembersListItem,
  BoardMemberListItemContent,
  ActiveIconWrapper,
} from './Styles';
import { Checkmark } from 'shared/icons';

type MemberManagerProps = {
  availableMembers: Array<TaskUser>;
  activeMembers: Array<TaskUser>;
  onMemberChange: (member: TaskUser, isActive: boolean) => void;
};
const MemberManager: React.FC<MemberManagerProps> = ({
  availableMembers,
  activeMembers: initialActiveMembers,
  onMemberChange,
}) => {
  const [activeMembers, setActiveMembers] = useState(initialActiveMembers);
  const [currentSearch, setCurrentSearch] = useState('');
  return (
    <MemberManagerWrapper>
      <MemberManagerSearchWrapper>
        <MemberManagerSearch
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setCurrentSearch(e.currentTarget.value);
          }}
        />
      </MemberManagerSearchWrapper>
      <BoardMembersLabel>Board Members</BoardMembersLabel>
      <BoardMembersList>
        {availableMembers
          .filter(
            member =>
              currentSearch === '' ||
              `${member.firstName} ${member.lastName}`.toLowerCase().startsWith(currentSearch.toLowerCase()),
          )
          .map(member => {
            return (
              <BoardMembersListItem key={member.id}>
                <BoardMemberListItemContent
                  onClick={() => {
                    const isActive = activeMembers.findIndex(m => m.id === member.id) !== -1;
                    if (isActive) {
                      setActiveMembers(activeMembers.filter(m => m.id !== member.id));
                    } else {
                      setActiveMembers([...activeMembers, member]);
                    }
                    onMemberChange(member, !isActive);
                  }}
                >
                  <ProfileIcon>JK</ProfileIcon>
                  <MemberName>{`${member.firstName} ${member.lastName}`}</MemberName>
                  {activeMembers.findIndex(m => m.id === member.id) !== -1 && (
                    <ActiveIconWrapper>
                      <Checkmark size={16} color="#42526e" />
                    </ActiveIconWrapper>
                  )}
                </BoardMemberListItemContent>
              </BoardMembersListItem>
            );
          })}
      </BoardMembersList>
    </MemberManagerWrapper>
  );
};
export default MemberManager;
