import React, { useState, useRef, useEffect } from 'react';
import { Plus, Cross } from 'shared/icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import Button from 'shared/components/Button';

import {
  Container,
  Wrapper,
  Placeholder,
  AddIconWrapper,
  AddListButton,
  ListNameEditor,
  ListAddControls,
  CancelAdd,
  ListNameEditorWrapper,
} from './Styles';

type NameEditorProps = {
  onSave: (listName: string) => void;
  onCancel: () => void;
};

const NameEditor: React.FC<NameEditorProps> = ({ onSave, onCancel }) => {
  const $editorRef = useRef<HTMLTextAreaElement>(null);
  const [listName, setListName] = useState('');
  useEffect(() => {
    if ($editorRef && $editorRef.current) {
      $editorRef.current.focus();
    }
  });
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave(listName);
      setListName('');
      if ($editorRef && $editorRef.current) {
        $editorRef.current.focus();
      }
    }
  };
  return (
    <>
      <ListNameEditorWrapper>
        <ListNameEditor
          ref={$editorRef}
          onKeyDown={onKeyDown}
          value={listName}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setListName(e.currentTarget.value)}
          placeholder="Enter a title for this list..."
        />
      </ListNameEditorWrapper>
      <ListAddControls>
        <AddListButton
          variant="relief"
          onClick={() => {
            onSave(listName);
            setListName('');
            if ($editorRef && $editorRef.current) {
              $editorRef.current.focus();
            }
          }}
        >
          Save
        </AddListButton>
        <CancelAdd onClick={() => onCancel()}>
          <Cross width={16} height={16} />
        </CancelAdd>
      </ListAddControls>
    </>
  );
};

type AddListProps = {
  onSave: (listName: string) => void;
};

const AddList: React.FC<AddListProps> = ({ onSave }) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const $wrapperRef = useRef<HTMLDivElement>(null);
  const onOutsideClick = () => {
    setEditorOpen(false);
  };
  useOnOutsideClick($wrapperRef, editorOpen, onOutsideClick, null);

  return (
    <Container>
      <Wrapper
        ref={$wrapperRef}
        editorOpen={editorOpen}
        onClick={() => {
          if (!editorOpen) {
            setEditorOpen(true);
          }
        }}
      >
        {editorOpen ? (
          <NameEditor onCancel={() => setEditorOpen(false)} onSave={onSave} />
        ) : (
          <Placeholder>
            <AddIconWrapper>
              <Plus width={12} height={12} />
            </AddIconWrapper>
            Add another list
          </Placeholder>
        )}
      </Wrapper>
    </Container>
  );
};

export default AddList;
