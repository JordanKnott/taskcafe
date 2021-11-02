import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Eye, List } from 'shared/icons';
import {
  EditorTextarea,
  CardMember,
  EditorContent,
  ChecklistIcon,
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
  ListCardLabelsWrapper,
  ListCardOperation,
  CardTitle,
  CardMembers,
  CardTitleText,
  CommentsIcon,
  CommentsBadge,
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
  position?: string | number;
  onContextMenu?: ($target: React.RefObject<HTMLElement>, taskID: string, taskGroupID: string) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  description?: null | string;
  dueDate?: DueDate;
  checklists?: Checklist | null;
  labels?: Array<ProjectLabel>;
  comments?: { unread: boolean; total: number } | null;
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
  isPublic?: boolean;
  toggleDirection?: 'shrink' | 'expand';
};

const Card = React.forwardRef(
  (
    {
      isPublic = false,
      wrapperProps,
      onContextMenu,
      taskID,
      taskGroupID,
      complete,
      toggleLabels = false,
      comments,
      toggleDirection = 'shrink',
      setToggleLabels,
      onClick,
      labels,
      title,
      dueDate,
      description,
      checklists,
      position,
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
      if (!isPublic) {
        e.preventDefault();
        e.stopPropagation();
        onOpenComposer();
      }
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
        onClick={(e) => {
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
          {!isPublic && isActive && !editable && (
            <ListCardOperation
              onClick={(e) => {
                e.stopPropagation();
                if (onContextMenu) {
                  onContextMenu($innerCardRef, taskID, taskGroupID);
                }
              }}
            >
              <Pencil width={8} height={8} />
            </ListCardOperation>
          )}
          <ListCardDetails complete={complete ?? false}>
            {labels && labels.length !== 0 && (
              <ListCardLabelsWrapper>
                <ListCardLabels
                  toggleLabels={toggleLabels}
                  toggleDirection={toggleDirection}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onCardLabelClick) {
                      onCardLabelClick();
                    }
                  }}
                >
                  {labels
                    .slice()
                    .sort((a, b) => a.labelColor.position - b.labelColor.position)
                    .map((label) => (
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
              </ListCardLabelsWrapper>
            )}
            {editable ? (
              <EditorContent>
                {complete && <CompleteIcon width={16} height={16} />}
                <EditorTextarea
                  onChange={(e) => {
                    setCardTitle(e.currentTarget.value);
                    if (onCardTitleChange) {
                      onCardTitleChange(e.currentTarget.value);
                    }
                  }}
                  onClick={(e) => {
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
                <CardTitleText>{`${title}${position ? ` - ${position}` : ''}`}</CardTitleText>
              </CardTitle>
            )}
            <ListCardBadges>
              {watched && (
                <ListCardBadge>
                  <Eye width={12} height={12} />
                </ListCardBadge>
              )}
              {dueDate && (
                <DueDateCardBadge isPastDue={dueDate.isPastDue}>
                  <ClockIcon color={dueDate.isPastDue ? '#fff' : '#6b778c'} width={8} height={8} />
                  <ListCardBadgeText>{dueDate.formattedDate}</ListCardBadgeText>
                </DueDateCardBadge>
              )}
              {description && (
                <DescriptionBadge>
                  <List width={8} height={8} />
                </DescriptionBadge>
              )}
              {comments && (
                <CommentsBadge>
                  <CommentsIcon color={comments.unread ? 'success' : 'normal'} width={8} height={8} />
                  <ListCardBadgeText color={comments.unread ? 'success' : 'normal'}>{comments.total}</ListCardBadgeText>
                </CommentsBadge>
              )}
              {checklists && (
                <ListCardBadge>
                  <ChecklistIcon
                    color={checklists.complete === checklists.total ? 'success' : 'normal'}
                    width={8}
                    height={8}
                  />
                  <ListCardBadgeText color={checklists.complete === checklists.total ? 'success' : 'normal'}>
                    {`${checklists.complete}/${checklists.total}`}
                  </ListCardBadgeText>
                </ListCardBadge>
              )}
            </ListCardBadges>
            <CardMembers>
              {members &&
                members.map((member, idx) => (
                  <CardMember
                    key={member.id}
                    size={28}
                    zIndex={members.length - idx}
                    member={member}
                    onMemberProfile={($target) => {
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
