import React from 'react';
import styled from 'styled-components';
import TimeAgo from 'react-timeago';

import { Popup } from 'shared/components/PopupMenu';

const ItemWrapper = styled.div`
  cursor: pointer;
  border-bottom: 1px solid #414561;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  justify-content: space-between;
  display: flex;

  &:hover {
    background: #10163a;
  }
`;
const ItemWrapperContent = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ItemIconContainer = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const ItemTextContainer = styled.div`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const ItemTextTitle = styled.span`
  font-weight: 500;
  display: block;
  color: ${props => props.theme.colors.primary};
  font-size: 14px;
`;
const ItemTextDesc = styled.span`
  font-size: 12px;
`;

const ItemTimeAgo = styled.span`
  margin-top: 0.25rem;
  white-space: nowrap;
  font-size: 11px;
`;

type NotificationItemProps = {
  title: string;
  description: string;
  createdAt: string;
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ title, description, createdAt }) => {
  return (
    <ItemWrapper>
      <ItemWrapperContent>
        <ItemIconContainer />
        <ItemTextContainer>
          <ItemTextTitle>{title}</ItemTextTitle>
          <ItemTextDesc>{description}</ItemTextDesc>
        </ItemTextContainer>
      </ItemWrapperContent>
      <TimeAgo date={createdAt} component={ItemTimeAgo} />
    </ItemWrapper>
  );
};

const NotificationHeader = styled.div`
  padding: 0.75rem;
  text-align: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: ${props => props.theme.colors.primary};
`;

const NotificationHeaderTitle = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.text.secondary};
`;

const NotificationFooter = styled.div`
  cursor: pointer;
  padding: 0.5rem;
  text-align: center;
  color: ${props => props.theme.colors.primary};
  &:hover {
    background: ${props => props.theme.colors.bg.primary};
  }
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const NotificationPopup: React.FC = ({ children }) => {
  return (
    <Popup title={null} tab={0} borders={false} padding={false}>
      <NotificationHeader>
        <NotificationHeaderTitle>Notifications</NotificationHeaderTitle>
      </NotificationHeader>
      <ul>{children}</ul>
      <NotificationFooter>View All</NotificationFooter>
    </Popup>
  );
};

export default NotificationPopup;
