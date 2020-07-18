import React, { useState, useRef, useEffect } from 'react';
import { Bin, Cross, Plus } from 'shared/icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import ReactMarkdown from 'react-markdown';

import {
  isPositionChanged,
  getSortedDraggables,
  getNewDraggablePosition,
  getAfterDropDraggableList,
} from 'shared/utils/draggables';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskAssignee from 'shared/components/TaskAssignee';
import moment from 'moment';

import {
  NoDueDateLabel,
  TaskDueDateButton,
  UnassignedLabel,
  TaskGroupLabel,
  TaskGroupLabelName,
  TaskDetailsSection,
  TaskActions,
  TaskDetailsAddLabel,
  TaskDetailsAddLabelIcon,
  TaskAction,
  TaskMeta,
  ActionButtons,
  ActionButton,
  ActionButtonsTitle,
  TaskHeader,
  ProfileIcon,
  TaskDetailsContent,
  TaskDetailsWrapper,
  TaskDetailsSidebar,
  TaskDetailsTitleWrapper,
  TaskDetailsTitle,
  TaskDetailsLabel,
  TaskDetailsAddDetailsButton,
  TaskDetailsEditor,
  TaskDetailsEditorWrapper,
  TaskDetailsMarkdown,
  TaskDetailsControls,
  ConfirmSave,
  CancelEdit,
  TaskDetailSectionTitle,
  TaskDetailLabel,
  TaskDetailLabels,
  TaskDetailAssignee,
  TaskDetailAssignees,
  TaskDetailsAddMemberIcon,
  MetaDetails,
  MetaDetail,
  MetaDetailTitle,
  MetaDetailContent,
} from './Styles';
import Checklist, { ChecklistItem, ChecklistItems } from '../Checklist';
import styled from 'styled-components';

const ChecklistContainer = styled.div``;

type TaskContentProps = {
  onEditContent: () => void;
  description: string;
};

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

const TaskContent: React.FC<TaskContentProps> = ({ description, onEditContent }) => {
  return description === '' ? (
    <TaskDetailsAddDetailsButton onClick={onEditContent}>Add a more detailed description</TaskDetailsAddDetailsButton>
  ) : (
    <TaskDetailsMarkdown onClick={onEditContent}>
      <ReactMarkdown source={description} />
    </TaskDetailsMarkdown>
  );
};

type DetailsEditorProps = {
  description: string;
  onTaskDescriptionChange: (newDescription: string) => void;
  onCancel: () => void;
};

const DetailsEditor: React.FC<DetailsEditorProps> = ({
  description: initialDescription,
  onTaskDescriptionChange,
  onCancel,
}) => {
  const [description, setDescription] = useState(initialDescription);
  const $editorWrapperRef = useRef<HTMLDivElement>(null);
  const $editorRef = useRef<HTMLTextAreaElement>(null);
  const handleOutsideClick = () => {
    onTaskDescriptionChange(description);
  };
  useEffect(() => {
    if ($editorRef && $editorRef.current) {
      $editorRef.current.focus();
      $editorRef.current.select();
    }
  }, []);

  useOnOutsideClick($editorWrapperRef, true, handleOutsideClick, null);
  return (
    <TaskDetailsEditorWrapper ref={$editorWrapperRef}>
      <TaskDetailsEditor
        ref={$editorRef}
        value={description}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.currentTarget.value)}
      />
      <TaskDetailsControls>
        <ConfirmSave variant="relief" onClick={handleOutsideClick}>
          Save
        </ConfirmSave>
        <CancelEdit onClick={onCancel}>
          <Plus size={16} color="#c2c6dc" />
        </CancelEdit>
      </TaskDetailsControls>
    </TaskDetailsEditorWrapper>
  );
};

type TaskDetailsProps = {
  task: Task;
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
  const [editorOpen, setEditorOpen] = useState(false);
  const [description, setDescription] = useState(task.description ?? '');
  const [taskName, setTaskName] = useState(task.name);
  const handleClick = () => {
    setEditorOpen(!editorOpen);
  };
  const handleDeleteTask = () => {
    onDeleteTask(task);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onTaskNameChange(task, taskName);
    }
  };
  const $unassignedRef = useRef<HTMLDivElement>(null);
  const $addMemberRef = useRef<HTMLDivElement>(null);
  const onUnassignedClick = () => {
    onOpenAddMemberPopup(task, $unassignedRef);
  };
  const onAddMember = ($target: React.RefObject<HTMLElement>) => {
    onOpenAddMemberPopup(task, $target);
  };
  const onAddChecklist = ($target: React.RefObject<HTMLElement>) => {
    onOpenAddChecklistPopup(task, $target);
  };
  const $dueDateLabel = useRef<HTMLDivElement>(null);
  const $addLabelRef = useRef<HTMLDivElement>(null);

  const onAddLabel = ($target: React.RefObject<HTMLElement>) => {
    onOpenAddLabelPopup(task, $target);
  };

  const onDragEnd = ({ draggableId, source, destination, type }: DropResult) => {
    if (typeof destination === 'undefined') return;
    if (!isPositionChanged(source, destination)) return;

    const isChecklist = type === 'checklist';
    const isSameChecklist = destination.droppableId === source.droppableId;
    let droppedDraggable: DraggableElement | null = null;
    let beforeDropDraggables: Array<DraggableElement> | null = null;

    if (!task.checklists) return;
    if (isChecklist) {
      const droppedGroup = task.checklists.find(taskGroup => taskGroup.id === draggableId);
      if (droppedGroup) {
        droppedDraggable = {
          id: draggableId,
          position: droppedGroup.position,
        };
        beforeDropDraggables = getSortedDraggables(
          task.checklists.map(checklist => {
            return { id: checklist.id, position: checklist.position };
          }),
        );
        if (droppedDraggable === null || beforeDropDraggables === null) {
          throw new Error('before drop draggables is null');
        }
        const afterDropDraggables = getAfterDropDraggableList(
          beforeDropDraggables,
          droppedDraggable,
          isChecklist,
          isSameChecklist,
          destination,
        );
        const newPosition = getNewDraggablePosition(afterDropDraggables, destination.index);
        console.log(droppedGroup);
        console.log(`positiion: ${newPosition}`);
        onChecklistDrop({ ...droppedGroup, position: newPosition });
      } else {
        throw { error: 'task group can not be found' };
      }
    } else {
      const targetChecklist = task.checklists.findIndex(
        checklist => checklist.items.findIndex(item => item.id === draggableId) !== -1,
      );
      const droppedChecklistItem = task.checklists[targetChecklist].items.find(item => item.id === draggableId);

      if (droppedChecklistItem) {
        droppedDraggable = {
          id: draggableId,
          position: droppedChecklistItem.position,
        };
        beforeDropDraggables = getSortedDraggables(
          task.checklists[targetChecklist].items.map(item => {
            return { id: item.id, position: item.position };
          }),
        );
        if (droppedDraggable === null || beforeDropDraggables === null) {
          throw new Error('before drop draggables is null');
        }
        const afterDropDraggables = getAfterDropDraggableList(
          beforeDropDraggables,
          droppedDraggable,
          isChecklist,
          isSameChecklist,
          destination,
        );
        const newPosition = getNewDraggablePosition(afterDropDraggables, destination.index);
        const newItem = {
          ...droppedChecklistItem,
          position: newPosition,
        };
        onChecklistItemDrop(droppedChecklistItem.taskChecklistID, destination.droppableId, newItem);
        console.log(newItem);
      }
    }
  };

  return (
    <>
      <TaskActions>
        <TaskAction onClick={handleDeleteTask}>
          <Bin size={20} color="#c2c6dc" />
        </TaskAction>
        <TaskAction onClick={onCloseModal}>
          <Cross width={16} height={16} />
        </TaskAction>
      </TaskActions>
      <TaskHeader>
        <TaskDetailsTitleWrapper>
          <TaskDetailsTitle
            value={taskName}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTaskName(e.currentTarget.value)}
            onKeyDown={onKeyDown}
          />
        </TaskDetailsTitleWrapper>
        <TaskMeta>
          {task.taskGroup.name && (
            <TaskGroupLabel>
              in list <TaskGroupLabelName>{task.taskGroup.name}</TaskGroupLabelName>
            </TaskGroupLabel>
          )}
        </TaskMeta>
      </TaskHeader>
      <TaskDetailsWrapper>
        <TaskDetailsContent>
          <MetaDetails>
            {task.assigned && task.assigned.length !== 0 && (
              <MetaDetail>
                <MetaDetailTitle>MEMBERS</MetaDetailTitle>
                <MetaDetailContent>
                  {task.assigned &&
                    task.assigned.map(member => (
                      <TaskAssignee key={member.id} size={32} member={member} onMemberProfile={onMemberProfile} />
                    ))}
                  <TaskDetailsAddMemberIcon ref={$addMemberRef} onClick={() => onAddMember($addMemberRef)}>
                    <Plus size={16} color="#c2c6dc" />
                  </TaskDetailsAddMemberIcon>
                </MetaDetailContent>
              </MetaDetail>
            )}
            {task.labels.length !== 0 && (
              <MetaDetail>
                <MetaDetailTitle>LABELS</MetaDetailTitle>
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
                  <TaskDetailsAddLabelIcon ref={$addLabelRef} onClick={() => onAddLabel($addLabelRef)}>
                    <Plus size={16} color="#c2c6dc" />
                  </TaskDetailsAddLabelIcon>
                </MetaDetailContent>
              </MetaDetail>
            )}
            {task.dueDate && (
              <MetaDetail>
                <MetaDetailTitle>DUE DATE</MetaDetailTitle>
                <MetaDetailContent>
                  <TaskDueDateButton>{moment(task.dueDate).format('MMM D [at] h:mm A')}</TaskDueDateButton>
                </MetaDetailContent>
              </MetaDetail>
            )}
          </MetaDetails>

          <TaskDetailsSection>
            <TaskDetailsLabel>Description</TaskDetailsLabel>
            {editorOpen ? (
              <DetailsEditor
                description={description}
                onTaskDescriptionChange={newDescription => {
                  setEditorOpen(false);
                  setDescription(newDescription);
                  onTaskDescriptionChange(task, newDescription);
                }}
                onCancel={() => {
                  setEditorOpen(false);
                }}
              />
            ) : (
              <TaskContent description={description} onEditContent={handleClick} />
            )}
            <DragDropContext onDragEnd={onDragEnd}>
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
                                                  onToggleItem={(itemID, complete) =>
                                                    onToggleChecklistItem(item.id, complete)
                                                  }
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
          </TaskDetailsSection>
        </TaskDetailsContent>
        <TaskDetailsSidebar>
          <ActionButtons>
            <ActionButtonsTitle>ADD TO CARD</ActionButtonsTitle>
            <ActionButton justifyTextContent="flex-start" onClick={() => onToggleTaskComplete(task)}>
              {task.complete ? 'Mark Incomplete' : 'Mark Complete'}
            </ActionButton>
            <ActionButton justifyTextContent="flex-start" onClick={$target => onAddMember($target)}>
              Members
            </ActionButton>
            <ActionButton justifyTextContent="flex-start" onClick={$target => onAddLabel($target)}>
              Labels
            </ActionButton>
            <ActionButton justifyTextContent="flex-start" onClick={$target => onAddChecklist($target)}>
              Checklist
            </ActionButton>
            <ActionButton justifyTextContent="flex-start" onClick={$target => onOpenDueDatePopop(task, $target)}>
              Due Date
            </ActionButton>
            <ActionButton justifyTextContent="flex-start">Attachment</ActionButton>
            <ActionButton justifyTextContent="flex-start">Cover</ActionButton>
          </ActionButtons>
        </TaskDetailsSidebar>
      </TaskDetailsWrapper>
    </>
  );
};

export default TaskDetails;
