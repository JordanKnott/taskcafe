import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea/lib';

export const MemberManagerWrapper = styled.div``;

export const MemberManagerSearchWrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const MemberManagerSearch = styled(TextareaAutosize)`
  margin: 4px 0 12px;
  width: 100%;
  background-color: #ebecf0;
  border: none;
  box-shadow: inset 0 0 0 2px #dfe1e6;
  line-height: 20px;
  padding: 8px 12px;
  font-size: 14px;
  color: #172b4d;
`;

export const BoardMembersLabel = styled.h4`
  color: #5e6c84;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 16px;
  text-transform: uppercase;
`;

export const BoardMembersList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const BoardMembersListItem = styled.li``;

export const BoardMemberListItemContent = styled.div`
  background-color: rgba(9, 30, 66, 0.04);
  padding-right: 28px;
  border-radius: 3px;
  display: flex;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  align-items: center;
  position: relative;
  text-overflow: ellipsis;
  text-decoration: none;
  white-space: nowrap;
  padding: 4px;
  margin-bottom: 2px;
  color: #172b4d;
`;

export const ProfileIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  background: rgb(115, 103, 240);
  cursor: pointer;
  margin-right: 6px;
`;

export const MemberName = styled.span`
  font-size: 14px;
`;

export const ActiveIconWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 11px;
`;
