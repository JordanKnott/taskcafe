import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TaskAssignee from 'shared/components/TaskAssignee';
import { faPencilAlt, faList } from '@fortawesome/free-solid-svg-icons';
import { faClock, faCheckSquare, faEye } from '@fortawesome/free-regular-svg-icons';
import {
  EditorTextarea,
  EditorContent,
  CompleteIcon,
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
  ListCardLabelText,
  ListCardOperation,
  CardTitle,
  CardMembers,
} from './Styles';

type DueDate = {
  isPastDue: boolean;
  formattedDate: string;
};

type Checklist = {
  complete: number;
  total: number;
};

type Props = {
  title: string;
  taskID: string;
  taskGroupID: string;
  complete?: boolean;
  onContextMenu?: ($target: React.RefObject<HTMLElement>, taskID: string, taskGroupID: string) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  description?: null | string;
  dueDate?: DueDate;
  checklists?: Checklist | null;
  labels?: Array<ProjectLabel>;
  watched?: boolean;
  wrapperProps?: any;
  members?: Array<TaskUser> | null;
  onCardLabelClick?: () => void;
  onCardMemberClick?: OnCardMemberClick;
  editable?: boolean;
  setToggleLabels?: (toggle: false) => void;
  onEditCard?: (taskGroupID: string, taskID: string, cardName: string) => void;
  onCardTitleChange?: (name: string) => void;
  labelVariant?: CardLabelVariant;
  toggleLabels?: boolean;
  toggleDirection?: 'shrink' | 'expand';
};

const Card = React.forwardRef(
  (
    {
      wrapperProps,
      onContextMenu,
      taskID,
      taskGroupID,
      complete,
      toggleLabels = false,
      toggleDirection = 'shrink',
      setToggleLabels,
      onClick,
      labels,
      title,
      dueDate,
      description,
      checklists,
      watched,
      members,
      labelVariant,
      onCardMemberClick,
      editable,
      onCardLabelClick,
      onEditCard,
      onCardTitleChange,
    }: Props,
    $cardRef: any,
  ) => {
    const [currentCardTitle, setCardTitle] = useState(title);
    const $editorRef: any = useRef();

    useEffect(() => {
      setCardTitle(title);
    }, [title]);

    useEffect(() => {
      if ($editorRef && $editorRef.current) {
        $editorRef.current.focus();
        $editorRef.current.select();
      }
    }, []);

    const handleKeyDown = (e: any) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (onEditCard) {
          onEditCard(taskGroupID, taskID, currentCardTitle);
        }
      }
    };
    const [isActive, setActive] = useState(false);
    const $innerCardRef: any = useRef(null);
    const onOpenComposer = () => {
      if (onContextMenu) {
        onContextMenu($innerCardRef, taskID, taskGroupID);
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
        onClick={e => {
          if (onClick) {
            onClick(e);
          }
        }}
        onContextMenu={onTaskContext}
        isActive={isActive}
        editable={editable}
        {...wrapperProps}
      >
        <ListCardInnerContainer ref={$innerCardRef}>
          {isActive && (
            <ListCardOperation
              onClick={e => {
                e.stopPropagation();
                if (onContextMenu) {
                  onContextMenu($innerCardRef, taskID, taskGroupID);
                }
              }}
            >
              <FontAwesomeIcon onClick={onOperationClick} color="#c2c6dc" size="xs" icon={faPencilAlt} />
            </ListCardOperation>
          )}
          <ListCardDetails complete={complete ?? false}>
            <ListCardLabels
              toggleLabels={toggleLabels}
              toggleDirection={toggleDirection}
              onClick={e => {
                e.stopPropagation();
                if (onCardLabelClick) {
                  onCardLabelClick();
                }
              }}
            >
              {labels &&
                labels.map(label => (
                  <ListCardLabel
                    onAnimationEnd={() => {
                      if (setToggleLabels) {
                        setToggleLabels(false);
                      }
                    }}
                    variant={labelVariant ?? 'large'}
                    color={label.labelColor.colorHex}
                    key={label.id}
                  >
                    <ListCardLabelText>{label.name}</ListCardLabelText>
                  </ListCardLabel>
                ))}
            </ListCardLabels>
            {editable ? (
              <EditorContent>
                {complete && <CompleteIcon width={16} height={16} />}
                <EditorTextarea
                  onChange={e => {
                    setCardTitle(e.currentTarget.value);
                    if (onCardTitleChange) {
                      onCardTitleChange(e.currentTarget.value);
                    }
                  }}
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  onKeyDown={handleKeyDown}
                  value={currentCardTitle}
                  ref={$editorRef}
                />
              </EditorContent>
            ) : (
              <CardTitle>
                {complete && <CompleteIcon width={16} height={16} />}
                {title}
              </CardTitle>
            )}
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
                  <TaskAssignee
                    key={member.id}
                    size={28}
                    member={member}
                    onMemberProfile={$target => {
                      if (onCardMemberClick) {
                        onCardMemberClick($target, taskID, member.id);
                      }
                    }}
                  />
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
