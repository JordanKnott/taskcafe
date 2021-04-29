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
  buttonLabel?: string;
  onSave: (listName: string) => void;
  onCancel: () => void;
};

export const NameEditor: React.FC<NameEditorProps> = ({ onSave: handleSave, onCancel, buttonLabel = 'Save' }) => {
  const $editorRef = useRef<HTMLTextAreaElement>(null);
  const [listName, setListName] = useState('');
  useEffect(() => {
    if ($editorRef && $editorRef.current) {
      $editorRef.current.focus();
    }
  });
  const onSave = (newName: string) => {
    if (newName.replace(/\s+/g, '') !== '') {
      handleSave(newName);
    }
  };
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
          height={40}
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
          {buttonLabel}
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
