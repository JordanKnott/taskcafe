import styled from 'styled-components';

export const Profile = styled.div`
  margin: 8px 0;
  min-height: 56px;
  position: relative;
`;

export const ProfileIcon = styled.div<{ bgColor: string }>`
  float: left;
  margin: 2px;
  background-color: ${props => props.bgColor};
  border-radius: 25em;
  font-size: 16px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  overflow: hidden;
  position: relative;
  width: 50px;
  z-index: 1;
`;

export const ProfileInfo = styled.div`
  color: #c2c6dc;
  margin: 0 0 0 64px;
  word-wrap: break-word;
`;

export const InfoTitle = styled.h3`
  margin: 0 40px 0 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: #c2c6dc;
`;

export const InfoUsername = styled.p`
  color: #c2c6dc;
  font-size: 14px;
  line-height: 20px;
`;

export const InfoBio = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: #c2c6dc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  padding: 0;
`;

export const MiniProfileActions = styled.ul`
  list-style-type: none;
`;

export const MiniProfileActionWrapper = styled.li``;

export const MiniProfileActionItem = styled.span`
  color: #c2c6dc;
  cursor: pointer;
  display: block;
  font-weight: 400;
  padding: 6px 12px;
  position: relative;
  text-decoration: none;
  &:hover {
    background: rgb(115, 103, 240);
  }
`;
