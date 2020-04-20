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
  display: block;
  height: 50px;
  overflow: hidden;
  position: relative;
  width: 50px;
  z-index: 1;
`;

export const ProfileInfo = styled.div`
  margin: 0 0 0 64px;
  word-wrap: break-word;
`;

export const InfoTitle = styled.h3`
  margin: 0 40px 0 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  color: #172b4d;
`;

export const InfoUsername = styled.p`
  color: #5e6c84;
  font-size: 14px;
  line-height: 20px;
`;

export const InfoBio = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: #5e6c84;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  padding: 0;
`;
