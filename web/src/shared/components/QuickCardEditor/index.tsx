import React, { useRef, useState } from 'react';
import Cross from 'shared/icons/Cross';
import styled from 'styled-components';
import { Wrapper, Container, EditorButtons, SaveButton, EditorButton, CloseButton } from './Styles';
import Card from '../Card';

export const CardMembers = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;

type Props = {
  task: Task;
  onCloseEditor: () => void;
  onEditCard: (taskGroupID: string, taskID: string, cardName: string) => void;
  onToggleComplete: (task: Task) => void;
  onOpenLabelsPopup: ($targetRef: React.RefObject<HTMLElement>, task: Task) => void;
  onOpenMembersPopup: ($targetRef: React.RefObject<HTMLElement>, task: Task) => void;
  onOpenDueDatePopup: ($targetRef: React.RefObject<HTMLElement>, task: Task) => void;
  onArchiveCard: (taskGroupID: string, taskID: string) => void;
  onCardMemberClick?: OnCardMemberClick;
  top: number;
  left: number;
  width?: number;
};

const QuickCardEditor = ({
  task,
  onCloseEditor,
  onOpenLabelsPopup,
  onOpenMembersPopup,
  onOpenDueDatePopup,
  onToggleComplete,
  onCardMemberClick,
  onArchiveCard,
  onEditCard,
  width = 272,
  top,
  left,
}: Props) => {
  const [currentCardTitle, setCardTitle] = useState(task.name);
  const $labelsRef: any = useRef();
  const $dueDate: any = useRef();
  const $membersRef: any = useRef();

  const handleCloseEditor = (e: any) => {
    e.stopPropagation();
    onCloseEditor();
  };

  return (
    <Wrapper onClick={handleCloseEditor} open>
      <CloseButton onClick={handleCloseEditor}>
        <Cross width={16} height={16} />
      </CloseButton>
      <Container width={width} left={left} top={top}>
        <Card
          editable
          onCardMemberClick={onCardMemberClick}
          title={currentCardTitle}
          onEditCard={(taskGroupID, taskID, name) => {
            onEditCard(taskGroupID, taskID, name);
            onCloseEditor();
          }}
          complete={task.complete ?? false}
          members={task.assigned}
          taskID={task.id}
          taskGroupID={task.taskGroup.id}
          labels={task.labels.map(l => l.projectLabel)}
        />
        <SaveButton onClick={() => onEditCard(task.taskGroup.id, task.id, currentCardTitle)}>Save</SaveButton>
        <EditorButtons>
          <EditorButton
            onClick={e => {
              e.stopPropagation();
              onToggleComplete(task);
            }}
          >
            {task.complete ? 'Mark Incomplete' : 'Mark Complete'}
          </EditorButton>
          <EditorButton
            ref={$membersRef}
            onClick={e => {
              e.stopPropagation();
              onOpenMembersPopup($membersRef, task);
            }}
          >
            Edit Assigned
          </EditorButton>
          <EditorButton
            ref={$dueDate}
            onClick={e => {
              e.stopPropagation();
              onOpenDueDatePopup($labelsRef, task);
            }}
          >
            Edit Due Date
          </EditorButton>
          <EditorButton
            ref={$labelsRef}
            onClick={e => {
              e.stopPropagation();
              onOpenLabelsPopup($labelsRef, task);
            }}
          >
            Edit Labels
          </EditorButton>
          <EditorButton
            onClick={e => {
              e.stopPropagation();
              onArchiveCard(task.taskGroup.id, task.id);
              onCloseEditor();
            }}
          >
            Archive
          </EditorButton>
        </EditorButtons>
      </Container>
    </Wrapper>
  );
};

export default QuickCardEditor;
