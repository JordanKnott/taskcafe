import React, { useRef, useState, useEffect } from 'react';
import Cross from 'shared/icons/Cross';
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

type Props = {
  task: Task;
  onCloseEditor: () => void;
  onEditCard: (taskGroupID: string, taskID: string, cardName: string) => void;
  onOpenLabelsPopup: ($targetRef: React.RefObject<HTMLElement>, task: Task) => void;
  onArchiveCard: (taskGroupID: string, taskID: string) => void;
  top: number;
  left: number;
};

const QuickCardEditor = ({ task, onCloseEditor, onOpenLabelsPopup, onArchiveCard, onEditCard, top, left }: Props) => {
  const [currentCardTitle, setCardTitle] = useState(task.name);
  const $editorRef: any = useRef();
  const $labelsRef: any = useRef();
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
          </EditorDetails>
        </Editor>
        <SaveButton onClick={e => onEditCard(task.taskGroup.id, task.id, currentCardTitle)}>Save</SaveButton>
        <EditorButtons>
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
