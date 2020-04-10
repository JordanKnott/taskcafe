import React, { useRef, useState, useEffect } from 'react';
import Cross from 'shared/icons/Cross';
import {
  Wrapper,
  Container,
  Editor,
  EditorDetails,
  EditorTextarea,
  SaveButton,
  EditorButtons,
  EditorButton,
  CloseButton,
  ListCardLabels,
  ListCardLabel,
} from './Styles';

type Props = {
  taskID: string;
  taskGroupID: string;
  cardTitle: string;
  onCloseEditor: () => void;
  onEditCard: (taskGroupID: string, taskID: string, cardName: string) => void;
  onOpenPopup: (popupType: number, top: number, left: number) => void;
  onArchiveCard: (taskGroupID: string, taskID: string) => void;
  labels?: Label[];
  isOpen: boolean;
  top: number;
  left: number;
};

const QuickCardEditor = ({
  taskGroupID,
  taskID,
  cardTitle,
  onCloseEditor,
  onOpenPopup,
  onArchiveCard,
  onEditCard,
  labels,
  isOpen,
  top,
  left,
}: Props) => {
  const [currentCardTitle, setCardTitle] = useState(cardTitle);
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
      onEditCard(taskGroupID, taskID, currentCardTitle);
      onCloseEditor();
    }
  };

  return (
    <Wrapper onClick={handleCloseEditor} open={isOpen}>
      <CloseButton onClick={handleCloseEditor}>
        <Cross size={16} color="#000" />
      </CloseButton>
      <Container left={left} top={top}>
        <Editor>
          <ListCardLabels>
            {labels &&
              labels.map(label => (
                <ListCardLabel color={label.color} key={label.name}>
                  {label.name}
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
        <SaveButton onClick={e => onEditCard(taskGroupID, taskID, currentCardTitle)}>Save</SaveButton>
        <EditorButtons>
          <EditorButton
            ref={$labelsRef}
            onClick={e => {
              e.stopPropagation();
              const pos = $labelsRef.current.getBoundingClientRect();
              onOpenPopup(1, pos.top + $labelsRef.current.clientHeight + 4, pos.left);
            }}
          >
            Edit Labels
          </EditorButton>
          <EditorButton
            onClick={e => {
              e.stopPropagation();
              onArchiveCard(taskGroupID, taskID);
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
