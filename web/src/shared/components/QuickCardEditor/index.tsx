import React, { useRef, useState, useEffect } from 'react';
import Cross from 'shared/icons/Cross';
import styled from 'styled-components';
import Member from 'shared/components/Member';
import {
  Wrapper,
  Container,
  Editor,
  EditorDetails,
  EditorTextarea,
  EditorButtons,
  SaveButton,
  EditorButton,
  CloseButton,
  ListCardLabels,
  ListCardLabel,
} from './Styles';

export const CardMembers = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;

type Props = {
  task: Task;
  onCloseEditor: () => void;
  onEditCard: (taskGroupID: string, taskID: string, cardName: string) => void;
  onOpenLabelsPopup: ($targetRef: React.RefObject<HTMLElement>, task: Task) => void;
  onOpenMembersPopup: ($targetRef: React.RefObject<HTMLElement>, task: Task) => void;
  onArchiveCard: (taskGroupID: string, taskID: string) => void;
  onCardMemberClick?: OnCardMemberClick;
  top: number;
  left: number;
};

const QuickCardEditor = ({
  task,
  onCloseEditor,
  onOpenLabelsPopup,
  onOpenMembersPopup,
  onCardMemberClick,
  onArchiveCard,
  onEditCard,
  top,
  left,
}: Props) => {
  const [currentCardTitle, setCardTitle] = useState(task.name);
  const $editorRef: any = useRef();
  const $labelsRef: any = useRef();
  const $membersRef: any = useRef();
  useEffect(() => {
    $editorRef.current.focus();
    $editorRef.current.select();
  }, []);

  const handleCloseEditor = (e: any) => {
    e.stopPropagation();
    onCloseEditor();
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEditCard(task.taskGroup.id, task.id, currentCardTitle);
      onCloseEditor();
    }
  };

  return (
    <Wrapper onClick={handleCloseEditor} open>
      <CloseButton onClick={handleCloseEditor}>
        <Cross size={16} color="#000" />
      </CloseButton>
      <Container left={left} top={top}>
        <Editor>
          <ListCardLabels>
            {task.labels &&
              task.labels.map(label => (
                <ListCardLabel color={label.projectLabel.labelColor.colorHex} key={label.id}>
                  {label.projectLabel.name}
                </ListCardLabel>
              ))}
          </ListCardLabels>
          <EditorDetails>
            <EditorTextarea
              onChange={e => setCardTitle(e.currentTarget.value)}
              onClick={e => {
                e.stopPropagation();
              }}
              onKeyDown={handleKeyDown}
              value={currentCardTitle}
              ref={$editorRef}
            />
            <CardMembers>
              {task.assigned &&
                task.assigned.map(member => (
                  <Member key={member.id} taskID={task.id} member={member} onCardMemberClick={onCardMemberClick} />
                ))}
            </CardMembers>
          </EditorDetails>
        </Editor>
        <SaveButton onClick={e => onEditCard(task.taskGroup.id, task.id, currentCardTitle)}>Save</SaveButton>
        <EditorButtons>
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
