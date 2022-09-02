import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import TimeAgo from 'react-timeago';
import { Link } from 'react-router-dom';
import { mixin } from 'shared/utils/styles';
import {
  useNotificationMarkAllReadMutation,
  useNotificationsQuery,
  NotificationFilter,
  ActionType,
  useNotificationAddedSubscription,
  useNotificationToggleReadMutation,
} from 'shared/generated/graphql';
import dayjs from 'dayjs';

import { Popup, usePopup } from 'shared/components/PopupMenu';
import { Bell, CheckCircleOutline, Circle, Ellipsis, UserCircle } from 'shared/icons';
import produce from 'immer';
import { useLocalStorage } from 'shared/hooks/useStateWithLocalStorage';
import localStorage from 'shared/utils/localStorage';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';

function getFilterMessage(filter: NotificationFilter) {
  switch (filter) {
    case NotificationFilter.Unread:
      return 'no unread';
    case NotificationFilter.Assigned:
      return 'no assigned';
    case NotificationFilter.Mentioned:
      return 'no mentioned';
    default:
      return 'no';
  }
}

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
  color: ${(props) => props.theme.colors.primary};
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
  padding: 20px 28px;
  text-align: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: ${(props) => props.theme.colors.primary};
`;

const NotificationHeaderTitle = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text.secondary};
`;

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  height: 448px;
`;

const EmptyMessageLabel = styled.span`
  margin-bottom: 80px;
`;
const Notifications = styled.div`
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-color: #414561;
  height: 448px;
  overflow-y: scroll;
  user-select: none;
`;
const NotificationFooter = styled.div`
  cursor: pointer;
  padding: 0.5rem;
  text-align: center;
  color: ${(props) => props.theme.colors.primary};
  &:hover {
    background: ${(props) => props.theme.colors.bg.primary};
  }
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;

  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  border-color: #414561;
`;

const NotificationTabs = styled.div`
  align-items: flex-end;
  align-self: stretch;
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-start;
  max-width: 100%;
  padding-top: 4px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-color: #414561;
`;

const NotificationTab = styled.div<{ active: boolean }>`
  font-size: 80%;
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 15px;
  cursor: pointer;
  display: flex;
  user-select: none;

  justify-content: center;
  line-height: normal;
  min-width: 1px;
  transition-duration: 0.2s;
  transition-property: box-shadow, color;
  white-space: nowrap;
  flex: 0 1 auto;
  padding: 12px 16px;

  &:first-child {
    margin-left: 12px;
  }

  &:hover {
    box-shadow: inset 0 -2px ${(props) => props.theme.colors.text.secondary};
    color: ${(props) => props.theme.colors.text.secondary};
  }
  &:not(:last-child) {
    margin-right: 12px;
  }

  ${(props) =>
    props.active &&
    css`
      box-shadow: inset 0 -2px ${props.theme.colors.secondary};
      color: ${props.theme.colors.secondary};
      &:hover {
        box-shadow: inset 0 -2px ${props.theme.colors.secondary};
        color: ${props.theme.colors.secondary};
      }
    `}
`;

const NotificationLink = styled(Link)`
  display: flex;
  text-decoration: none;
  padding: 16px 8px;
  width: 100%;
`;

const NotificationControls = styled.div`
  width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  visibility: hidden;
  padding: 4px;
`;

const NotificationButtons = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;
  margin-top: auto;
  margin-bottom: 6px;
`;

const NotificationButton = styled.div`
  padding: 4px 15px;
  cursor: pointer;
  &:hover svg {
    fill: rgb(216, 93, 216);
    stroke: rgb(216, 93, 216);
  }
`;

const NotificationWrapper = styled.li<{ read: boolean }>`
  min-height: 80px;
  display: flex;
  font-size: 14px;
  transition: background-color 0.1s ease-in-out;
  margin: 2px 8px;
  border-radius: 8px;
  justify-content: space-between;
  position: relative;
  &:hover {
    background: ${(props) => mixin.rgba(props.theme.colors.primary, 0.5)};
  }
  &:hover ${NotificationLink} {
    color: #fff;
  }
  &:hover ${NotificationControls} {
    visibility: visible;
  }
  ${(props) =>
    !props.read &&
    css`
      background: ${(props) => mixin.rgba(props.theme.colors.primary, 0.5)};
      &:hover {
        background: ${(props) => mixin.rgba(props.theme.colors.primary, 0.6)};
      }
    `}
`;

const NotificationContentFooter = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text.primary};
`;

const NotificationCausedBy = styled.div`
  height: 48px;
  width: 48px;
  min-height: 48px;
  min-width: 48px;
`;
const NotificationCausedByInitials = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  text: #fff;
  font-size: 18px;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  height: 100%;
  width: 100%;
  border: none;
  background: #7367f0;
`;

const NotificationCausedByImage = styled.img`
  position: relative;
  display: flex;
  border-radius: 50%;
  flex-shrink: 0;
  height: 100%;
  width: 100%;
  border: none;
  background: #7367f0;
`;

const NotificationContent = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  margin-left: 16px;
`;

const NotificationContentHeader = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: #fff;

  svg {
    margin-left: 8px;
    fill: rgb(216, 93, 216);
    stroke: rgb(216, 93, 216);
  }
`;

const NotificationBody = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  svg {
    fill: rgb(216, 93, 216);
    stroke: rgb(216, 93, 216);
  }
`;

const NotificationPrefix = styled.span`
  color: rgb(216, 93, 216);
  margin: 0 4px;
`;

const NotificationSeparator = styled.span`
  margin: 0 6px;
`;

type NotificationProps = {
  causedBy?: { fullname: string; username: string; id: string } | null;
  createdAt: string;
  read: boolean;
  data: Array<{ key: string; value: string }>;
  actionType: ActionType;
  onToggleRead: () => void;
};

const Notification: React.FC<NotificationProps> = ({ causedBy, createdAt, data, actionType, read, onToggleRead }) => {
  const prefix: any = [];
  const { hidePopup } = usePopup();
  const dataMap = new Map<string, string>();
  data.forEach((d) => dataMap.set(d.key, d.value));
  let link = '#';
  switch (actionType) {
    case ActionType.TaskAssigned:
      prefix.push(<UserCircle key="profile" width={14} height={16} />);
      prefix.push(
        <NotificationPrefix key="prefix">
          <span style={{ fontWeight: 'bold' }}>{causedBy ? causedBy.fullname : 'Removed user'}</span>
        </NotificationPrefix>,
      );
      prefix.push(<span key="content">assigned you to the task &quote;{dataMap.get('TaskName')}&quote;</span>);
      link = `/p/${dataMap.get('ProjectID')}/board/c/${dataMap.get('TaskID')}`;
      break;
    case ActionType.DueDateReminder:
      prefix.push(<Bell key="profile" width={14} height={16} />);
      prefix.push(<NotificationPrefix key="prefix">{dataMap.get('TaskName')}</NotificationPrefix>);
      const now = dayjs();
      if (dayjs(dataMap.get('DueDate')).isBefore(dayjs())) {
        prefix.push(
          <span key="content">is due {dayjs.duration(now.diff(dayjs(dataMap.get('DueAt')))).humanize(true)}</span>,
        );
      } else {
        prefix.push(
          <span key="content">
            has passed the due date {dayjs.duration(dayjs(dataMap.get('DueAt')).diff(now)).humanize(true)}
          </span>,
        );
      }
      link = `/p/${dataMap.get('ProjectID')}/board/c/${dataMap.get('TaskID')}`;
      break;

    default:
      throw new Error('unknown action type');
  }

  return (
    <NotificationWrapper read={read}>
      <NotificationLink to={link} onClick={hidePopup}>
        <NotificationCausedBy>
          <NotificationCausedByInitials>
            {causedBy
              ? causedBy.fullname
                  .split(' ')
                  .map((n) => n[0])
                  .join('.')
              : 'RU'}
          </NotificationCausedByInitials>
        </NotificationCausedBy>
        <NotificationContent>
          <NotificationBody>{prefix}</NotificationBody>
          <NotificationContentFooter>
            <span>{dayjs.duration(dayjs(createdAt).diff(dayjs())).humanize(true)}</span>
            <NotificationSeparator>•</NotificationSeparator>
            <span>{dataMap.get('ProjectName')}</span>
          </NotificationContentFooter>
        </NotificationContent>
      </NotificationLink>
      <NotificationControls>
        <NotificationButtons>
          <NotificationButton onClick={() => onToggleRead()}>
            {read ? <Circle width={18} height={18} /> : <CheckCircleOutline width={18} height={18} />}
          </NotificationButton>
        </NotificationButtons>
      </NotificationControls>
    </NotificationWrapper>
  );
};

const PopupContent = styled.div`
  display: flex;
  flex-direction: column;

  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 10px;
  border-color: #414561;
`;

const tabs = [
  { label: 'All', key: NotificationFilter.All },
  { label: 'Unread', key: NotificationFilter.Unread },
  { label: 'I was mentioned', key: NotificationFilter.Mentioned },
  { label: 'Assigned to me', key: NotificationFilter.Assigned },
];

type NotificationEntry = {
  id: string;
  read: boolean;
  readAt?: string | undefined | null;
  notification: {
    id: string;
    data: Array<{ key: string; value: string }>;
    actionType: ActionType;
    causedBy?: { id: string; username: string; fullname: string } | undefined | null;
    createdAt: string;
  };
};
type NotificationPopupProps = {
  onToggleRead: () => void;
};

const NotificationHeaderMenu = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
`;

const NotificationHeaderMenuIcon = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  svg {
    fill: #fff;
    stroke: #fff;
  }
`;

const NotificationHeaderMenuContent = styled.div<{ show: boolean }>`
  min-width: 130px;
  position: absolute;
  top: 16px;
  background: #fff;
  border-radius: 6px;
  height: 50px;
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-color: #414561;
  background: #262c49;
  padding: 6px;
  display: flex;
  flex-direction: column;
`;

const NotificationHeaderMenuButton = styled.div`
  position: relative;
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  &:hover {
    background: ${(props) => props.theme.colors.primary};
  }
`;
const NotificationPopup: React.FC<NotificationPopupProps> = ({ onToggleRead }) => {
  const [filter, setFilter] = useLocalStorage<NotificationFilter>(
    localStorage.NOTIFICATIONS_FILTER,
    NotificationFilter.Unread,
  );
  const [data, setData] = useState<{ nodes: Array<NotificationEntry>; hasNextPage: boolean; cursor: string }>({
    nodes: [],
    hasNextPage: false,
    cursor: '',
  });
  const [toggleRead] = useNotificationToggleReadMutation({
    onCompleted: (data) => {
      setData((prev) => {
        return produce(prev, (draft) => {
          const idx = draft.nodes.findIndex((n) => n.id === data.notificationToggleRead.id);
          if (idx !== -1) {
            draft.nodes[idx].read = data.notificationToggleRead.read;
            draft.nodes[idx].readAt = data.notificationToggleRead.readAt;
          }
        });
      });
      onToggleRead();
    },
  });
  const { fetchMore } = useNotificationsQuery({
    variables: { limit: 8, filter },
    fetchPolicy: 'network-only',
    onCompleted: (d) => {
      setData((prev) => ({
        hasNextPage: d.notified.pageInfo.hasNextPage,
        cursor: d.notified.pageInfo.endCursor ?? '',
        nodes: [...prev.nodes, ...d.notified.notified],
      }));
    },
  });
  useNotificationAddedSubscription({
    onSubscriptionData: (d) => {
      setData((n) => {
        if (d.subscriptionData.data) {
          return {
            ...n,
            nodes: [d.subscriptionData.data.notificationAdded, ...n.nodes],
          };
        }
        return n;
      });
    },
  });
  const [toggleAllRead] = useNotificationMarkAllReadMutation();

  const [showHeaderMenu, setShowHeaderMenu] = useState(false);

  const $menuContent = useRef<HTMLDivElement>(null);
  useOnOutsideClick($menuContent, true, () => setShowHeaderMenu(false), null);
  return (
    <Popup title={null} tab={0} borders={false} padding={false}>
      <PopupContent>
        <NotificationHeader>
          <NotificationHeaderTitle>Notifications</NotificationHeaderTitle>
          <NotificationHeaderMenu>
            <NotificationHeaderMenuIcon onClick={() => setShowHeaderMenu(true)}>
              <Ellipsis size={18} color="#fff" vertical={false} />
              <NotificationHeaderMenuContent ref={$menuContent} show={showHeaderMenu}>
                <NotificationHeaderMenuButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHeaderMenu(() => false);
                    toggleAllRead().then(() => {
                      setData((prev) =>
                        produce(prev, (draftData) => {
                          draftData.nodes = draftData.nodes.map((node) => ({ ...node, read: true }));
                        }),
                      );
                      onToggleRead();
                    });
                  }}
                >
                  Mark all as read
                </NotificationHeaderMenuButton>
              </NotificationHeaderMenuContent>
            </NotificationHeaderMenuIcon>
          </NotificationHeaderMenu>
        </NotificationHeader>
        <NotificationTabs>
          {tabs.map((tab) => (
            <NotificationTab
              key={tab.key}
              onClick={() => {
                if (filter !== tab.key) {
                  setData({ cursor: '', hasNextPage: false, nodes: [] });
                  setFilter(tab.key);
                }
              }}
              active={tab.key === filter}
            >
              {tab.label}
            </NotificationTab>
          ))}
        </NotificationTabs>
        {data.nodes.length !== 0 ? (
          <Notifications
            onScroll={({ currentTarget }) => {
              if (Math.ceil(currentTarget.scrollTop + currentTarget.clientHeight) >= currentTarget.scrollHeight) {
                if (data.hasNextPage) {
                  console.log(`fetching more = ${data.cursor} - ${data.hasNextPage}`);
                  fetchMore({
                    variables: {
                      limit: 8,
                      filter,
                      cursor: data.cursor,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev;
                      setData((d) => ({
                        cursor: fetchMoreResult.notified.pageInfo.endCursor ?? '',
                        hasNextPage: fetchMoreResult.notified.pageInfo.hasNextPage,
                        nodes: [...d.nodes, ...fetchMoreResult.notified.notified],
                      }));
                      return {
                        ...prev,
                        notified: {
                          ...prev.notified,
                          pageInfo: {
                            ...fetchMoreResult.notified.pageInfo,
                          },
                          notified: [...prev.notified.notified, ...fetchMoreResult.notified.notified],
                        },
                      };
                    },
                  });
                }
              }
            }}
          >
            {data.nodes.map((n) => (
              <Notification
                key={n.id}
                read={n.read}
                actionType={n.notification.actionType}
                data={n.notification.data}
                createdAt={n.notification.createdAt}
                causedBy={n.notification.causedBy}
                onToggleRead={() =>
                  toggleRead({
                    variables: { notifiedID: n.id },
                    optimisticResponse: {
                      __typename: 'Mutation',
                      notificationToggleRead: {
                        __typename: 'Notified',
                        id: n.id,
                        read: !n.read,
                        readAt: new Date().toUTCString(),
                      },
                    },
                  }).then(() => {
                    onToggleRead();
                  })
                }
              />
            ))}
          </Notifications>
        ) : (
          <EmptyMessage>
            <EmptyMessageLabel>You have {getFilterMessage(filter)} notifications</EmptyMessageLabel>
          </EmptyMessage>
        )}
      </PopupContent>
    </Popup>
  );
};

export default NotificationPopup;
