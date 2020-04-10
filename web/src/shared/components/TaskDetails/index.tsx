import React, { useState, useRef, useEffect } from 'react';
import { Bin, Cross } from 'shared/icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';

import {
  TaskActions,
  TaskAction,
  TaskMeta,
  TaskHeader,
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
} from './Styles';

type TaskContentProps = {
  onEditContent: () => void;
  description: string;
};

const TaskContent: React.FC<TaskContentProps> = ({ description, onEditContent }) => {
  return description === '' ? (
    <TaskDetailsAddDetailsButton onClick={onEditContent}>Add a more detailed description</TaskDetailsAddDetailsButton>
  ) : (
    <TaskDetailsMarkdown onClick={onEditContent}>{description}</TaskDetailsMarkdown>
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
        <ConfirmSave>Save</ConfirmSave>
        <CancelEdit onClick={onCancel}>
          <Cross size={16} />
        </CancelEdit>
      </TaskDetailsControls>
    </TaskDetailsEditorWrapper>
  );
};

type TaskDetailsProps = {
  task: Task;
  onTaskDescriptionChange: (task: Task, newDescription: string) => void;
};

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onTaskDescriptionChange }) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const handleClick = () => {
    setEditorOpen(!editorOpen);
  };
  return (
    <>
      <TaskHeader>
        <TaskMeta />
        <TaskActions>
          <TaskAction>
            <Bin size={20} />
          </TaskAction>
          <TaskAction>
            <Cross size={20} />
          </TaskAction>
        </TaskActions>
      </TaskHeader>
      <TaskDetailsWrapper>
        <TaskDetailsContent>
          <TaskDetailsTitleWrapper>
            <TaskDetailsTitle value="Hello darkness my old friend" />
          </TaskDetailsTitleWrapper>
          <TaskDetailsLabel>Description</TaskDetailsLabel>
          {editorOpen ? (
            <DetailsEditor
              description={task.description ?? ''}
              onTaskDescriptionChange={newDescription => {
                setEditorOpen(false);
                onTaskDescriptionChange(task, newDescription);
              }}
              onCancel={() => {
                setEditorOpen(false);
              }}
            />
          ) : (
            <TaskContent description={task.description ?? ''} onEditContent={handleClick} />
          )}
        </TaskDetailsContent>
        <TaskDetailsSidebar />
      </TaskDetailsWrapper>
    </>
  );
};

export default TaskDetails;
