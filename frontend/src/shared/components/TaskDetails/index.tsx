import React, { useState, useRef } from 'react';
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
} from 'shared/icons';
import Editor from 'rich-markdown-editor';
import dark from 'shared/utils/editorTheme';
import styled from 'styled-components';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dayjs from 'dayjs';

import Task from 'shared/icons/Task';
import {
  TaskDetailLabel,
  CommentContainer,
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
  CommentTextArea,
  CommentEditorContainer,
  CommentEditorActions,
  CommentEditorActionIcon,
  CommentEditorSaveButton,
  CommentProfile,
  CommentInnerWrapper,
  ActivitySection,
  TaskDetailsEditor,
} from './Styles';
import Checklist, { ChecklistItem, ChecklistItems } from '../Checklist';
import onDragEnd from './onDragEnd';

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
  onOpenDueDatePopop: (task: Task, $targetRef: React.RefObject<HTMLElement>) => void;
  onOpenAddChecklistPopup: (task: Task, $targetRef: React.RefObject<HTMLElement>) => void;
  onMemberProfile: ($targetRef: React.RefObject<HTMLElement>, memberID: string) => void;
  onChangeChecklistName: (checklistID: string, name: string) => void;
  onDeleteChecklist: ($target: React.RefObject<HTMLElement>, checklistID: string) => void;
  onCloseModal: () => void;
  onChecklistDrop: (checklist: TaskChecklist) => void;
  onChecklistItemDrop: (prevChecklistID: string, checklistID: string, checklistItem: TaskChecklistItem) => void;
};

const TaskDetails: React.FC<TaskDetailsProps> = ({
  me,
  task,
  onDeleteChecklist,
  onTaskNameChange,
  onOpenAddChecklistPopup,
  onChangeChecklistName,
  onChecklistDrop,
  onChecklistItemDrop,
  onToggleTaskComplete,
  onTaskDescriptionChange,
  onChangeItemName,
  onDeleteItem,
  onDeleteTask,
  onCloseModal,
  onOpenAddMemberPopup,
  onOpenAddLabelPopup,
  onOpenDueDatePopop,
  onAddItem,
  onToggleChecklistItem,
  onMemberProfile,
}) => {
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
  const [showCommentActions, setShowCommentActions] = useState(false);
  const taskDescriptionRef = useRef(task.description ?? '');
  const $noMemberBtn = useRef<HTMLDivElement>(null);
  const $addMemberBtn = useRef<HTMLDivElement>(null);
  const $dueDateBtn = useRef<HTMLDivElement>(null);

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
                onOpenDueDatePopop(task, $dueDateBtn);
              }}
            >
              {task.dueDate ? (
                <SidebarButtonText>{dayjs(task.dueDate).format('MMM D [at] h:mm A')}</SidebarButtonText>
              ) : (
                <SidebarButtonText>No due date</SidebarButtonText>
              )}
            </SidebarButton>
          </LeftSidebarSection>
          <AssignedUsersSection>
            <DueDateTitle>MEMBERS</DueDateTitle>
            {task.assigned && task.assigned.length !== 0 ? (
              <MemberList>
                {task.assigned.map(m => (
                  <TaskMember
                    key={m.id}
                    member={m}
                    size={32}
                    onMemberProfile={$target => {
                      onMemberProfile($target, m.id);
                    }}
                  />
                ))}
                <AssignUserIcon
                  ref={$addMemberBtn}
                  onClick={() => {
                    onOpenAddMemberPopup(task, $addMemberBtn);
                  }}
                >
                  <Plus width={16} height={16} />
                </AssignUserIcon>
              </MemberList>
            ) : (
              <AssignUsersButton
                ref={$noMemberBtn}
                onClick={() => {
                  onOpenAddMemberPopup(task, $noMemberBtn);
                }}
              >
                <AssignUserIcon>
                  <User width={16} height={16} />
                </AssignUserIcon>
                <AssignUserLabel>No members</AssignUserLabel>
              </AssignUsersButton>
            )}
          </AssignedUsersSection>
          <ExtraActionsSection>
            <DueDateTitle>ACTIONS</DueDateTitle>
            <ActionButton
              onClick={$target => {
                onOpenAddLabelPopup(task, $target);
              }}
              icon={<Tags width={12} height={12} />}
            >
              Labels
            </ActionButton>
            <ActionButton
              onClick={$target => {
                onOpenAddChecklistPopup(task, $target);
              }}
              icon={<CheckSquareOutline width={12} height={12} />}
            >
              Checklist
            </ActionButton>
            <ActionButton>Cover</ActionButton>
          </ExtraActionsSection>
        </LeftSidebarContent>
      </LeftSidebar>
      <ContentContainer>
        <HeaderContainer>
          <HeaderInnerContainer>
            <HeaderLeft>
              <MarkCompleteButton
                invert={task.complete ?? false}
                onClick={() => {
                  onToggleTaskComplete(task);
                }}
              >
                <Checkmark width={8} height={8} />
                <span>{task.complete ? 'Completed' : 'Mark complete'}</span>
              </MarkCompleteButton>
            </HeaderLeft>
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
          </HeaderInnerContainer>
          <TaskDetailsTitleWrapper>
            <TaskDetailsTitle
              value={taskName}
              onChange={e => {
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
                {task.labels.map(label => {
                  return (
                    <TaskLabelItem
                      key={label.projectLabel.id}
                      label={label}
                      onClick={$target => {
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
                onClick={e => {
                  if (!editTaskDescription) {
                    setEditTaskDescription(true);
                  }
                }}
              >
                <Editor
                  defaultValue={task.description ?? ''}
                  theme={dark}
                  readOnly={!editTaskDescription}
                  autoFocus
                  onChange={value => {
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
            <DragDropContext onDragEnd={result => onDragEnd(result, task, onChecklistDrop, onChecklistItemDrop)}>
              <Droppable direction="vertical" type="checklist" droppableId="root">
                {dropProvided => (
                  <ChecklistContainer {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                    {task.checklists &&
                      task.checklists
                        .slice()
                        .sort((a, b) => a.position - b.position)
                        .map((checklist, idx) => (
                          <Draggable key={checklist.id} draggableId={checklist.id} index={idx}>
                            {provided => (
                              <Checklist
                                ref={provided.innerRef}
                                wrapperProps={provided.draggableProps}
                                handleProps={provided.dragHandleProps}
                                key={checklist.id}
                                name={checklist.name}
                                checklistID={checklist.id}
                                items={checklist.items}
                                onDeleteChecklist={onDeleteChecklist}
                                onChangeName={newName => onChangeChecklistName(checklist.id, newName)}
                                onToggleItem={onToggleChecklistItem}
                                onDeleteItem={onDeleteItem}
                                onAddItem={n => {
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
                                  {checklistDrop => (
                                    <>
                                      <ChecklistItems ref={checklistDrop.innerRef} {...checklistDrop.droppableProps}>
                                        {checklist.items
                                          .slice()
                                          .sort((a, b) => a.position - b.position)
                                          .map((item, itemIdx) => (
                                            <Draggable key={item.id} draggableId={item.id} index={itemIdx}>
                                              {itemDrop => (
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
          <ActivitySection />
        </InnerContentContainer>
        <CommentContainer>
          {me && (
            <CommentInnerWrapper>
              <CommentProfile
                member={me}
                size={32}
                onMemberProfile={$target => {
                  onMemberProfile($target, me.id);
                }}
              />
              <CommentEditorContainer>
                <CommentTextArea
                  disabled
                  placeholder="Write a comment..."
                  onFocus={() => {
                    setShowCommentActions(true);
                  }}
                  onBlur={() => {
                    setShowCommentActions(false);
                  }}
                />
                <CommentEditorActions visible={showCommentActions}>
                  <CommentEditorActionIcon>
                    <Paperclip width={12} height={12} />
                  </CommentEditorActionIcon>
                  <CommentEditorActionIcon>
                    <At width={12} height={12} />
                  </CommentEditorActionIcon>
                  <CommentEditorActionIcon>
                    <Smile width={12} height={12} />
                  </CommentEditorActionIcon>
                  <CommentEditorActionIcon>
                    <Task width={12} height={12} />
                  </CommentEditorActionIcon>
                  <CommentEditorSaveButton>Save</CommentEditorSaveButton>
                </CommentEditorActions>
              </CommentEditorContainer>
            </CommentInnerWrapper>
          )}
        </CommentContainer>
      </ContentContainer>
    </Container>
  );
};

export default TaskDetails;
