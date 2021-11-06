import React, { useState, useRef } from 'react';
import { useCurrentUser } from 'App/context';
import {
  Plus,
  User,
  Trash,
  Paperclip,
  Clone,
  Share,
  Tags,
  Checkmark,
  CheckSquareOutline,
  At,
  Smile,
  Eye,
} from 'shared/icons';
import { toArray } from 'react-emoji-render';
import DOMPurify from 'dompurify';
import TaskAssignee from 'shared/components/TaskAssignee';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import { usePopup } from 'shared/components/PopupMenu';
import CommentCreator from 'shared/components/TaskDetails/CommentCreator';
import { AngleDown } from 'shared/icons/AngleDown';
import Editor from 'rich-markdown-editor';
import dark from 'shared/utils/editorTheme';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Picker, Emoji } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';
import Task from 'shared/icons/Task';
import {
  ActivityItemHeader,
  ActivityItemTimestamp,
  ActivityItem,
  ActivityItemCommentAction,
  ActivityItemCommentActions,
  TaskDetailLabel,
  CommentContainer,
  ActivityItemCommentContainer,
  MetaDetailContent,
  TaskDetailsAddLabelIcon,
  ActionButton,
  AssignUserIcon,
  AssignUserLabel,
  AssignUsersButton,
  AssignedUsersSection,
  ViewRawButton,
  DueDateTitle,
  Container,
  LeftSidebar,
  ContentContainer,
  LeftSidebarContent,
  LeftSidebarSection,
  SidebarTitle,
  SidebarButton,
  SidebarButtonText,
  MarkCompleteButton,
  HeaderContainer,
  HeaderLeft,
  HeaderInnerContainer,
  TaskDetailsTitleWrapper,
  TaskDetailsTitle,
  ExtraActionsSection,
  HeaderRight,
  HeaderActionIcon,
  EditorContainer,
  InnerContentContainer,
  DescriptionContainer,
  Labels,
  ChecklistSection,
  MemberList,
  TaskMember,
  TabBarSection,
  TabBarItem,
  ActivitySection,
  TaskDetailsEditor,
  ActivityItemHeaderUser,
  ActivityItemHeaderTitle,
  ActivityItemHeaderTitleName,
  ActivityItemComment,
  TabBarButton,
  WatchedCheckmark,
} from './Styles';
import Checklist, { ChecklistItem, ChecklistItems } from '../Checklist';
import onDragEnd from './onDragEnd';
import plugin from './remark';
import ActivityMessage from './ActivityMessage';

const parseEmojis = (value: string) => {
  const emojisArray = toArray(value);

  // toArray outputs React elements for emojis and strings for other
  const newValue = emojisArray.reduce((previous: any, current: any) => {
    if (typeof current === 'string') {
      return previous + current;
    }
    return previous + current.props.children;
  }, '');

  return newValue;
};

type StreamCommentProps = {
  comment?: TaskComment | null;
  onUpdateComment: (message: string) => void;
  onExtraActions: (commentID: string, $target: React.RefObject<HTMLElement>) => void;
  onCancelCommentEdit: () => void;
  editable: boolean;
};
const StreamComment: React.FC<StreamCommentProps> = ({
  comment,
  onExtraActions,
  editable,
  onUpdateComment,
  onCancelCommentEdit,
}) => {
  const $actions = useRef<HTMLDivElement>(null);
  if (comment) {
    return (
      <ActivityItem>
        <ActivityItemHeaderUser size={32} member={comment.createdBy} />
        <ActivityItemHeader editable={editable}>
          <ActivityItemHeaderTitle>
            <ActivityItemHeaderTitleName>{comment.createdBy.fullName}</ActivityItemHeaderTitleName>
            <ActivityItemTimestamp margin={8}>
              {dayjs(comment.createdAt).format('MMM D [at] h:mm A')}
              {comment.updatedAt && ' (edited)'}
            </ActivityItemTimestamp>
          </ActivityItemHeaderTitle>
          <ActivityItemCommentContainer>
            <ActivityItemComment editable={editable}>
              {editable ? (
                <CommentCreator
                  message={comment.message}
                  autoFocus
                  onCancelEdit={onCancelCommentEdit}
                  onCreateComment={onUpdateComment}
                />
              ) : (
                <ReactMarkdown skipHtml plugins={[plugin]}>
                  {DOMPurify.sanitize(comment.message, { FORBID_TAGS: ['style', 'img'] })}
                </ReactMarkdown>
              )}
            </ActivityItemComment>
            <ActivityItemCommentActions>
              <ActivityItemCommentAction
                ref={$actions}
                onClick={() => {
                  onExtraActions(comment.id, $actions);
                }}
              >
                <AngleDown width={18} height={18} />
              </ActivityItemCommentAction>
            </ActivityItemCommentActions>
          </ActivityItemCommentContainer>
        </ActivityItemHeader>
      </ActivityItem>
    );
  }
  return null;
};

type StreamActivityProps = {
  activity?: TaskActivity | null;
};
const StreamActivity: React.FC<StreamActivityProps> = ({ activity }) => {
  if (activity) {
    return (
      <ActivityItem>
        <ActivityItemHeaderUser
          size={32}
          member={{
            id: activity.causedBy.id,
            fullName: activity.causedBy.fullName,
            profileIcon: activity.causedBy.profileIcon
              ? activity.causedBy.profileIcon
              : {
                  url: null,
                  initials: activity.causedBy.fullName.charAt(0),
                  bgColor: '#fff',
                },
          }}
        />
        <ActivityItemHeader>
          <ActivityItemHeaderTitle>
            <ActivityItemHeaderTitleName>{activity.causedBy.fullName}</ActivityItemHeaderTitleName>
            <ActivityMessage type={activity.type} data={activity.data} />
          </ActivityItemHeaderTitle>
          <ActivityItemTimestamp margin={0}>
            {dayjs(activity.createdAt).format('MMM D [at] h:mm A')}
          </ActivityItemTimestamp>
        </ActivityItemHeader>
      </ActivityItem>
    );
  }
  return null;
};

const ChecklistContainer = styled.div``;

type TaskLabelProps = {
  label: TaskLabel;
  onClick: ($target: React.RefObject<HTMLElement>) => void;
};

const TaskLabelItem: React.FC<TaskLabelProps> = ({ label, onClick }) => {
  const $label = useRef<HTMLDivElement>(null);
  return (
    <TaskDetailLabel
      onClick={() => {
        onClick($label);
      }}
      ref={$label}
      color={label.projectLabel.labelColor.colorHex}
    >
      {label.projectLabel.name}
    </TaskDetailLabel>
  );
};

type DetailsEditorProps = {
  description: string;
  onTaskDescriptionChange: (newDescription: string) => void;
  onCancel: () => void;
};

type TaskDetailsProps = {
  task: Task;
  me?: TaskUser | null;
  onTaskNameChange: (task: Task, newName: string) => void;
  onTaskDescriptionChange: (task: Task, newDescription: string) => void;
  onDeleteTask: (task: Task) => void;
  onAddItem: (checklistID: string, name: string, position: number) => void;
  onDeleteItem: (checklistID: string, itemID: string) => void;
  onChangeItemName: (itemID: string, itemName: string) => void;
  onToggleTaskComplete: (task: Task) => void;
  onToggleChecklistItem: (itemID: string, complete: boolean) => void;
  onOpenAddMemberPopup: (task: Task, $targetRef: React.RefObject<HTMLElement>) => void;
  onOpenAddLabelPopup: (task: Task, $targetRef: React.RefObject<HTMLElement>) => void;
  onToggleTaskWatch: (task: Task, watched: boolean) => void;
  onOpenDueDatePopop: (task: Task, $targetRef: React.RefObject<HTMLElement>) => void;
  onOpenAddChecklistPopup: (task: Task, $targetRef: React.RefObject<HTMLElement>) => void;
  onCreateComment: (task: Task, message: string) => void;
  onCommentShowActions: (commentID: string, $targetRef: React.RefObject<HTMLElement>) => void;
  onMemberProfile: ($targetRef: React.RefObject<HTMLElement>, memberID: string) => void;
  onCancelCommentEdit: () => void;
  onUpdateComment: (commentID: string, message: string) => void;
  onChangeChecklistName: (checklistID: string, name: string) => void;
  editableComment?: string | null;
  onDeleteChecklist: ($target: React.RefObject<HTMLElement>, checklistID: string) => void;
  onCloseModal: () => void;
  onChecklistDrop: (checklist: TaskChecklist) => void;
  onChecklistItemDrop: (prevChecklistID: string, checklistID: string, checklistItem: TaskChecklistItem) => void;
};

const TaskDetails: React.FC<TaskDetailsProps> = ({
  me,
  onCancelCommentEdit,
  task,
  editableComment = null,
  onDeleteChecklist,
  onToggleTaskWatch,
  onTaskNameChange,
  onCommentShowActions,
  onOpenAddChecklistPopup,
  onChangeChecklistName,
  onCreateComment,
  onChecklistDrop,
  onChecklistItemDrop,
  onToggleTaskComplete,
  onTaskDescriptionChange,
  onChangeItemName,
  onDeleteItem,
  onDeleteTask,
  onCloseModal,
  onUpdateComment,
  onOpenAddMemberPopup,
  onOpenAddLabelPopup,
  onOpenDueDatePopop,
  onAddItem,
  onToggleChecklistItem,
  onMemberProfile,
}) => {
  const { user } = useCurrentUser();
  const [taskName, setTaskName] = useState(task.name);
  const [editTaskDescription, setEditTaskDescription] = useState(() => {
    if (task.description) {
      if (task.description.trim() === '' || task.description.trim() === '\\') {
        return true;
      }
      return false;
    }
    return true;
  });
  const [saveTimeout, setSaveTimeout] = useState<any>(null);
  const [showRaw, setShowRaw] = useState(false);
  const taskDescriptionRef = useRef(task.description ?? '');
  const $noMemberBtn = useRef<HTMLDivElement>(null);
  const $addMemberBtn = useRef<HTMLDivElement>(null);
  const $dueDateBtn = useRef<HTMLDivElement>(null);
  const $detailsTitle = useRef<HTMLTextAreaElement>(null);

  const activityStream: Array<{ id: string; data: { time: string; type: 'comment' | 'activity' } }> = [];

  if (task.activity) {
    task.activity.forEach((activity) => {
      activityStream.push({
        id: activity.id,
        data: {
          time: activity.createdAt,
          type: 'activity',
        },
      });
    });
  }

  if (task.comments) {
    task.comments.forEach((comment) => {
      activityStream.push({
        id: comment.id,
        data: {
          time: comment.createdAt,
          type: 'comment',
        },
      });
    });
  }
  activityStream.sort((a, b) => (dayjs(a.data.time).isAfter(dayjs(b.data.time)) ? 1 : -1));

  const saveDescription = () => {
    onTaskDescriptionChange(task, taskDescriptionRef.current);
  };
  return (
    <Container>
      <LeftSidebar>
        <LeftSidebarContent>
          <LeftSidebarSection>
            <SidebarTitle>TASK GROUP</SidebarTitle>
            <SidebarButton>
              <SidebarButtonText>{task.taskGroup.name}</SidebarButtonText>
            </SidebarButton>
            <DueDateTitle>DUE DATE</DueDateTitle>
            <SidebarButton
              ref={$dueDateBtn}
              onClick={() => {
                if (user) {
                  onOpenDueDatePopop(task, $dueDateBtn);
                }
              }}
            >
              {task.dueDate.at ? (
                <SidebarButtonText>
                  {dayjs(task.dueDate.at).format(task.hasTime ? 'MMM D [at] h:mm A' : 'MMMM D')}
                </SidebarButtonText>
              ) : (
                <SidebarButtonText>No due date</SidebarButtonText>
              )}
            </SidebarButton>
          </LeftSidebarSection>
          <AssignedUsersSection>
            <DueDateTitle>MEMBERS</DueDateTitle>
            {task.assigned && task.assigned.length !== 0 ? (
              <MemberList>
                {task.assigned.map((m) => (
                  <TaskMember
                    key={m.id}
                    member={m}
                    size={32}
                    onMemberProfile={($target) => {
                      if (user) {
                        onMemberProfile($target, m.id);
                      }
                    }}
                  />
                ))}
                <AssignUserIcon
                  ref={$addMemberBtn}
                  onClick={() => {
                    if (user) {
                      onOpenAddMemberPopup(task, $addMemberBtn);
                    }
                  }}
                >
                  <Plus width={16} height={16} />
                </AssignUserIcon>
              </MemberList>
            ) : (
              <AssignUsersButton
                ref={$noMemberBtn}
                onClick={() => {
                  if (user) {
                    onOpenAddMemberPopup(task, $noMemberBtn);
                  }
                }}
              >
                <AssignUserIcon>
                  <User width={16} height={16} />
                </AssignUserIcon>
                <AssignUserLabel>No members</AssignUserLabel>
              </AssignUsersButton>
            )}
          </AssignedUsersSection>
          {user && (
            <ExtraActionsSection>
              <DueDateTitle>ACTIONS</DueDateTitle>
              <ActionButton
                onClick={($target) => {
                  onOpenAddLabelPopup(task, $target);
                }}
                icon={<Tags width={12} height={12} />}
              >
                Labels
              </ActionButton>
              <ActionButton
                onClick={($target) => {
                  onOpenAddChecklistPopup(task, $target);
                }}
                icon={<CheckSquareOutline width={12} height={12} />}
              >
                Checklist
              </ActionButton>
              <ActionButton>Cover</ActionButton>
              <ActionButton
                onClick={() => {
                  onToggleTaskWatch(task, !task.watched);
                }}
                icon={<Eye width={12} height={12} />}
              >
                Watch {task.watched && <WatchedCheckmark width={18} height={18} />}
              </ActionButton>
            </ExtraActionsSection>
          )}
        </LeftSidebarContent>
      </LeftSidebar>
      <ContentContainer>
        <HeaderContainer>
          <HeaderInnerContainer>
            <HeaderLeft>
              <MarkCompleteButton
                disabled={user === null}
                invert={task.complete ?? false}
                onClick={() => {
                  if (user) {
                    onToggleTaskComplete(task);
                  }
                }}
              >
                <Checkmark width={8} height={8} />
                <span>{task.complete ? 'Completed' : 'Mark complete'}</span>
              </MarkCompleteButton>
            </HeaderLeft>
            {user && (
              <HeaderRight>
                <HeaderActionIcon>
                  <Paperclip width={16} height={16} />
                </HeaderActionIcon>
                <HeaderActionIcon>
                  <Clone width={16} height={16} />
                </HeaderActionIcon>
                <HeaderActionIcon>
                  <Share width={16} height={16} />
                </HeaderActionIcon>
                <HeaderActionIcon onClick={() => onDeleteTask(task)}>
                  <Trash width={16} height={16} />
                </HeaderActionIcon>
              </HeaderRight>
            )}
          </HeaderInnerContainer>
          <TaskDetailsTitleWrapper>
            <TaskDetailsTitle
              value={taskName}
              ref={$detailsTitle}
              disabled={user === null}
              onKeyDown={(e) => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  if ($detailsTitle && $detailsTitle.current) {
                    $detailsTitle.current.blur();
                  }
                }
              }}
              onChange={(e) => {
                setTaskName(e.currentTarget.value);
              }}
              onBlur={() => {
                if (taskName !== task.name) {
                  onTaskNameChange(task, taskName);
                }
              }}
            />
          </TaskDetailsTitleWrapper>
          <Labels>
            {task.labels.length !== 0 && (
              <MetaDetailContent>
                {task.labels.map((label) => {
                  return (
                    <TaskLabelItem
                      key={label.projectLabel.id}
                      label={label}
                      onClick={($target) => {
                        onOpenAddLabelPopup(task, $target);
                      }}
                    />
                  );
                })}
                <TaskDetailsAddLabelIcon>
                  <Plus width={12} height={12} />
                </TaskDetailsAddLabelIcon>
              </MetaDetailContent>
            )}
          </Labels>
        </HeaderContainer>
        <InnerContentContainer>
          <DescriptionContainer>
            {showRaw ? (
              <TaskDetailsEditor value={taskDescriptionRef.current} />
            ) : (
              <EditorContainer
                onClick={(e) => {
                  if (!editTaskDescription) {
                    setEditTaskDescription(true);
                  }
                }}
              >
                <Editor
                  defaultValue={task.description ?? ''}
                  readOnly={user === null || !editTaskDescription}
                  theme={dark}
                  autoFocus
                  onChange={(value) => {
                    setSaveTimeout(() => {
                      clearTimeout(saveTimeout);
                      return setTimeout(saveDescription, 2000);
                    });
                    const text = value();
                    taskDescriptionRef.current = text;
                  }}
                />
              </EditorContainer>
            )}

            <ViewRawButton onClick={() => setShowRaw(!showRaw)}>{showRaw ? 'Show editor' : 'Show raw'}</ViewRawButton>
          </DescriptionContainer>
          <ChecklistSection>
            <DragDropContext onDragEnd={(result) => onDragEnd(result, task, onChecklistDrop, onChecklistItemDrop)}>
              <Droppable direction="vertical" type="checklist" droppableId="root">
                {(dropProvided) => (
                  <ChecklistContainer {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                    {task.checklists &&
                      task.checklists
                        .slice()
                        .sort((a, b) => a.position - b.position)
                        .map((checklist, idx) => (
                          <Draggable key={checklist.id} draggableId={checklist.id} index={idx}>
                            {(provided) => (
                              <Checklist
                                ref={provided.innerRef}
                                wrapperProps={provided.draggableProps}
                                handleProps={provided.dragHandleProps}
                                key={checklist.id}
                                name={checklist.name}
                                checklistID={checklist.id}
                                items={checklist.items}
                                onDeleteChecklist={onDeleteChecklist}
                                onChangeName={(newName) => onChangeChecklistName(checklist.id, newName)}
                                onToggleItem={onToggleChecklistItem}
                                onDeleteItem={onDeleteItem}
                                onAddItem={(n) => {
                                  if (task.checklists) {
                                    let position = 65535;
                                    const [lastItem] = checklist.items
                                      .sort((a, b) => a.position - b.position)
                                      .slice(-1);
                                    if (lastItem) {
                                      position = lastItem.position * 2 + 1;
                                    }
                                    onAddItem(checklist.id, n, position);
                                  }
                                }}
                                onChangeItemName={onChangeItemName}
                              >
                                <Droppable direction="vertical" type="checklistItem" droppableId={checklist.id}>
                                  {(checklistDrop) => (
                                    <>
                                      <ChecklistItems ref={checklistDrop.innerRef} {...checklistDrop.droppableProps}>
                                        {checklist.items
                                          .slice()
                                          .sort((a, b) => a.position - b.position)
                                          .map((item, itemIdx) => (
                                            <Draggable key={item.id} draggableId={item.id} index={itemIdx}>
                                              {(itemDrop) => (
                                                <ChecklistItem
                                                  key={item.id}
                                                  itemID={item.id}
                                                  checklistID={item.taskChecklistID}
                                                  ref={itemDrop.innerRef}
                                                  wrapperProps={itemDrop.draggableProps}
                                                  handleProps={itemDrop.dragHandleProps}
                                                  name={item.name}
                                                  complete={item.complete}
                                                  onDeleteItem={onDeleteItem}
                                                  onChangeName={onChangeItemName}
                                                  onToggleItem={(itemID, complete) => {
                                                    onToggleChecklistItem(item.id, complete);
                                                  }}
                                                />
                                              )}
                                            </Draggable>
                                          ))}
                                      </ChecklistItems>
                                      {checklistDrop.placeholder}
                                    </>
                                  )}
                                </Droppable>
                              </Checklist>
                            )}
                          </Draggable>
                        ))}
                    {dropProvided.placeholder}
                  </ChecklistContainer>
                )}
              </Droppable>
            </DragDropContext>
          </ChecklistSection>
          <TabBarSection>
            <TabBarItem>Activity</TabBarItem>
          </TabBarSection>
          <ActivitySection>
            {activityStream.map((stream) =>
              stream.data.type === 'comment' ? (
                <StreamComment
                  key={stream.id}
                  onExtraActions={onCommentShowActions}
                  onCancelCommentEdit={onCancelCommentEdit}
                  onUpdateComment={(message) => onUpdateComment(stream.id, message)}
                  editable={stream.id === editableComment}
                  comment={task.comments && task.comments.find((comment) => comment.id === stream.id)}
                />
              ) : (
                <StreamActivity
                  key={stream.id}
                  activity={task.activity && task.activity.find((activity) => activity.id === stream.id)}
                />
              ),
            )}
          </ActivitySection>
        </InnerContentContainer>
        {me && (
          <CommentContainer>
            <CommentCreator
              me={me}
              onCreateComment={(message) => onCreateComment(task, message)}
              onMemberProfile={onMemberProfile}
            />
          </CommentContainer>
        )}
      </ContentContainer>
    </Container>
  );
};

export default TaskDetails;
