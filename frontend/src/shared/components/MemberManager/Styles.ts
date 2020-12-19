import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea/lib';
import { mixin } from 'shared/utils/styles';
import Member from '../Member';

export const MemberManagerWrapper = styled.div``;

export const MemberManagerSearchWrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const MemberManagerSearch = styled(TextareaAutosize)`
  margin: 4px 0 12px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  line-height: 20px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 400;

  background: ${props => props.theme.colors.bg.secondary};
  outline: none;
  color: ${props => props.theme.colors.text.primary};
  border-color: ${props => props.theme.colors.border};

  &:focus {
    box-shadow: ${props => props.theme.colors.primary} 0px 0px 0px 1px;
    background: ${props => mixin.darken(props.theme.colors.bg.secondary, 0.15)};
  }
`;

export const BoardMembersLabel = styled.h4`
  color: #c2c6dc;
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

export const BoardMemberListItemContent = styled(Member)`
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
  color: #c2c6dc;

  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.text.secondary};
  }
`;

export const ProfileIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c2c6dc;
  font-weight: 700;
  background: ${props => props.theme.colors.primary};
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
