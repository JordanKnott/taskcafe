import React, { useState, useRef, useEffect } from 'react';
import { Bin, Cross, Plus } from 'shared/icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import ReactMarkdown from 'react-markdown';
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
import Checklist from '../Checklist';

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
  onDeleteItem: (itemID: string) => void;
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
};

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onDeleteChecklist,
  onTaskNameChange,
  onOpenAddChecklistPopup,
  onChangeChecklistName,
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
    onOpenAddChecklistPopup(task, $target)
  }
  const $dueDateLabel = useRef<HTMLDivElement>(null);
  const $addLabelRef = useRef<HTMLDivElement>(null);

  const onAddLabel = ($target: React.RefObject<HTMLElement>) => {
    onOpenAddLabelPopup(task, $target);
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
            {task.checklists &&
              task.checklists
                .slice()
                .sort((a, b) => a.position - b.position)
                .map(checklist => (
                  <Checklist
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
                        const [lastItem] = checklist.items.sort((a, b) => a.position - b.position).slice(-1);
                        if (lastItem) {
                          position = lastItem.position * 2 + 1;
                        }
                        onAddItem(checklist.id, n, position);
                      }
                    }}
                    onChangeItemName={onChangeItemName}
                  />
                ))}
          </TaskDetailsSection>
        </TaskDetailsContent>
        <TaskDetailsSidebar>
          <ActionButtons>
            <ActionButtonsTitle>ADD TO CARD</ActionButtonsTitle>
            <ActionButton onClick={() => onToggleTaskComplete(task)}>
              {task.complete ? 'Mark Incomplete' : 'Mark Complete'}
            </ActionButton>
            <ActionButton onClick={$target => onAddMember($target)}>Members</ActionButton>
            <ActionButton onClick={$target => onAddLabel($target)}>Labels</ActionButton>
            <ActionButton onClick={$target => onAddChecklist($target)}>Checklist</ActionButton>
            <ActionButton onClick={$target => onOpenDueDatePopop(task, $target)}>Due Date</ActionButton>
            <ActionButton>Attachment</ActionButton>
            <ActionButton>Cover</ActionButton>
          </ActionButtons>
        </TaskDetailsSidebar>
      </TaskDetailsWrapper>
    </>
  );
};

export default TaskDetails;
