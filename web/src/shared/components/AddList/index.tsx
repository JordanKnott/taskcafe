import React, { useState, useRef, useEffect } from 'react';
import { Plus, Cross } from 'shared/icons';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';

import {
  Wrapper,
  Placeholder,
  AddIconWrapper,
  ListNameEditor,
  ListAddControls,
  CancelAdd,
  AddListButton,
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
        />
      </ListNameEditorWrapper>
      <ListAddControls>
        <AddListButton
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
          <Cross />
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
            <Plus size={12} color="#c2c6dc" />
          </AddIconWrapper>
          Add another list
        </Placeholder>
      )}
    </Wrapper>
  );
};

export default AddList;
