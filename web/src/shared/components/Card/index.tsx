import React, { useState, useRef } from 'react';
import { DraggableProvidedDraggableProps } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faList } from '@fortawesome/free-solid-svg-icons';
import { faClock, faCheckSquare, faEye } from '@fortawesome/free-regular-svg-icons';
import {
  DescriptionBadge,
  DueDateCardBadge,
  ListCardBadges,
  ListCardBadge,
  ListCardBadgeText,
  ListCardContainer,
  ListCardInnerContainer,
  ListCardDetails,
  ClockIcon,
  ListCardLabels,
  ListCardLabel,
  ListCardOperation,
  CardTitle,
  CardMembers,
  CardMember,
  CardMemberInitials,
} from './Styles';

type DueDate = {
  isPastDue: boolean;
  formattedDate: string;
};

type Checklist = {
  complete: number;
  total: number;
};

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

type Props = {
  title: string;
  description: string;
  taskID: string;
  taskGroupID: string;
  onContextMenu: (e: ContextMenuEvent) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  dueDate?: DueDate;
  checklists?: Checklist;
  watched?: boolean;
  labels?: Array<ProjectLabel>;
  wrapperProps?: any;
  members?: Array<TaskUser> | null;
  onCardMemberClick?: OnCardMemberClick;
};

const Card = React.forwardRef(
  (
    {
      wrapperProps,
      onContextMenu,
      taskID,
      taskGroupID,
      onClick,
      labels,
      title,
      dueDate,
      description,
      checklists,
      watched,
      members,
      onCardMemberClick,
    }: Props,
    $cardRef: any,
  ) => {
    const [isActive, setActive] = useState(false);
    const $innerCardRef: any = useRef(null);
    const onOpenComposer = () => {
      if (typeof $innerCardRef.current !== 'undefined') {
        const pos = $innerCardRef.current.getBoundingClientRect();
        onContextMenu({
          top: pos.top,
          left: pos.left,
          taskGroupID,
          taskID,
        });
      }
    };
    const onTaskContext = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onOpenComposer();
    };
    const onOperationClick = (e: React.MouseEvent<HTMLOrSVGElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onOpenComposer();
    };
    return (
      <ListCardContainer
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        ref={$cardRef}
        onClick={onClick}
        onContextMenu={onTaskContext}
        isActive={isActive}
        {...wrapperProps}
      >
        <ListCardInnerContainer ref={$innerCardRef}>
          {isActive && (
            <ListCardOperation>
              <FontAwesomeIcon onClick={onOperationClick} color="#c2c6dc" size="xs" icon={faPencilAlt} />
            </ListCardOperation>
          )}
          <ListCardDetails>
            <ListCardLabels>
              {labels &&
                labels.map(label => (
                  <ListCardLabel color={label.labelColor.colorHex} key={label.id}>
                    {label.name}
                  </ListCardLabel>
                ))}
            </ListCardLabels>
            <CardTitle>{title}</CardTitle>
            <ListCardBadges>
              {watched && (
                <ListCardBadge>
                  <FontAwesomeIcon color="#6b778c" icon={faEye} size="xs" />
                </ListCardBadge>
              )}
              {dueDate && (
                <DueDateCardBadge isPastDue={dueDate.isPastDue}>
                  <ClockIcon color={dueDate.isPastDue ? '#fff' : '#6b778c'} icon={faClock} size="xs" />
                  <ListCardBadgeText>{dueDate.formattedDate}</ListCardBadgeText>
                </DueDateCardBadge>
              )}
              {description && (
                <DescriptionBadge>
                  <FontAwesomeIcon color="#6b778c" icon={faList} size="xs" />
                </DescriptionBadge>
              )}
              {checklists && (
                <ListCardBadge>
                  <FontAwesomeIcon color="#6b778c" icon={faCheckSquare} size="xs" />
                  <ListCardBadgeText>{`${checklists.complete}/${checklists.total}`}</ListCardBadgeText>
                </ListCardBadge>
              )}
            </ListCardBadges>
            <CardMembers>
              {members &&
                members.map(member => (
                  <Member key={member.id} taskID={taskID} member={member} onCardMemberClick={onCardMemberClick} />
                ))}
            </CardMembers>
          </ListCardDetails>
        </ListCardInnerContainer>
      </ListCardContainer>
    );
  },
);

Card.displayName = 'Card';

export default Card;
