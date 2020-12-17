import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CheckSquare, Trash, Square, CheckSquareOutline, Clock, Cross, AccountPlus } from 'shared/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  isPositionChanged,
  getSortedDraggables,
  getNewDraggablePosition,
  getAfterDropDraggableList,
} from 'shared/utils/draggables';
import Button from 'shared/components/Button';
import TextareaAutosize from 'react-autosize-textarea';
import Control from 'react-select/src/components/Control';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import { mixin } from 'shared/utils/styles';

const Wrapper = styled.div`
  margin-bottom: 24px;
`;

const WindowTitle = styled.div`
  padding: 8px 0;
  position: relative;
  margin: 0 0 4px 40px;
`;

const WindowTitleIcon = styled(CheckSquareOutline)`
  top: 10px;
  left: -32px;
  position: absolute;
`;

const WindowChecklistTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: row wrap;
`;

const WindowTitleText = styled.h3`
  cursor: pointer;
  color: ${props => props.theme.colors.text.primary};
  margin: 6px 0;
  display: inline-block;
  width: auto;
  min-height: 18px;
  font-size: 16px;
  line-height: 20px;
  min-width: 40px;
`;

const WindowOptions = styled.div`
  margin: 0 2px 0 auto;
  float: right;
`;

const DeleteButton = styled(Button)`
  padding: 6px 12px;
`;

const ChecklistProgress = styled.div`
  margin-bottom: 6px;
  position: relative;
`;
const ChecklistProgressPercent = styled.span`
  color: #5e6c84;
  font-size: 11px;
  line-height: 10px;
  position: absolute;
  left: 5px;
  top: -1px;
  text-align: center;
  width: 32px;
`;

const ChecklistProgressBar = styled.div`
  background: ${props => props.theme.colors.bg.primary};
  border-radius: 4px;
  clear: both;
  height: 8px;
  margin: 0 0 0 40px;
  overflow: hidden;
  position: relative;
`;
const ChecklistProgressBarCurrent = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  background: ${props => (props.width === 100 ? props.theme.colors.success : props.theme.colors.primary)};
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
  transition: width 0.14s ease-in, background 0.14s ease-in;
`;

export const ChecklistItems = styled.div`
  min-height: 8px;
`;

const ChecklistItemUncheckedIcon = styled(Square)``;

const ChecklistIcon = styled.div`
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  margin: 10px;
  text-align: center;

  &:hover {
    opacity: 0.8;
  }
`;

const ChecklistItemCheckedIcon = styled(CheckSquare)`
  fill: ${props => props.theme.colors.primary};
`;

const ChecklistItemDetails = styled.div`
  word-break: break-word;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;
const ChecklistItemRow = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
`;

const ChecklistItemTextControls = styled.div`
  padding: 6px 0;
  width: 100%;
  display: inline-flex;
  align-items: center;
`;

const ChecklistItemText = styled.span<{ complete: boolean }>`
  color: ${props => (props.complete ? '#5e6c84' : `${props.theme.colors.text.primary}`)};
  ${props => props.complete && 'text-decoration: line-through;'}
  line-height: 20px;
  font-size: 16px;

  min-height: 20px;
  margin-bottom: 0;
  align-self: center;
  flex: 1;
`;

const ChecklistControls = styled.div`
  display: inline-flex;
  flex-direction: row;
  float: right;
`;

const ControlButton = styled.div`
  opacity: 0;
  margin-left: 4px;
  padding: 4px 6px;
  border-radius: 6px;
  background-color: ${props => mixin.rgba(props.theme.colors.bg.primary, 0.8)};
  display: flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${props => mixin.rgba(props.theme.colors.primary, 1)};
  }
`;

const ChecklistNameEditorWrapper = styled.div`
  display: block;
  float: left;
  padding-top: 6px;
  padding-bottom: 8px;
  z-index: 50;
  width: 100%;
`;
export const ChecklistNameEditor = styled(TextareaAutosize)`
  overflow: hidden;
  overflow-wrap: break-word;
  resize: none;
  height: 54px;
  width: 100%;

  background: none;
  border: none;
  box-shadow: none;
  max-height: 162px;
  min-height: 54px;
  padding: 8px 12px;
  font-size: 16px;
  line-height: 20px;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 3px;
  color: ${props => props.theme.colors.text.primary};

  border-color: ${props => props.theme.colors.border};
  background-color: ${props => mixin.rgba(props.theme.colors.bg.primary, 0.4)};
  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const AssignUserButton = styled(AccountPlus)`
  fill: ${props => props.theme.colors.text.primary};
`;

const ClockButton = styled(Clock)`
  fill: ${props => props.theme.colors.text.primary};
`;

const TrashButton = styled(Trash)`
  fill: ${props => props.theme.colors.text.primary};
`;

const ChecklistItemWrapper = styled.div<{ ref: any }>`
  user-select: none;
  clear: both;
  padding-left: 40px;
  position: relative;
  border-radius: 6px;

  & ${ControlButton}:last-child {
    margin-right: 4px;
  }

  &:hover {
    background-color: ${props => mixin.rgba(props.theme.colors.bg.primary, 0.4)};
  }
  &:hover ${ControlButton} {
    opacity: 1;
  }
`;

const EditControls = styled.div`
  clear: both;
  display: flex;
  padding-bottom: 9px;
  flex-direction: row;
`;

const SaveButton = styled(Button)`
  margin-right: 4px;
  padding: 6px 12px;
`;
const CancelButton = styled.div`
  cursor: pointer;
  margin: 5px;
  & svg {
    fill: ${props => props.theme.colors.text.primary};
  }
  &:hover svg {
    fill: ${props => props.theme.colors.text.secondary};
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const EditableDeleteButton = styled.button`
  cursor: pointer;
  display: flex;
  margin: 0 2px;
  padding: 6px 8px;
  border-radius: 3px;

  &:hover {
    background: ${props => mixin.rgba(props.theme.colors.primary, 0.8)};
  }
`;

const NewItemButton = styled(Button)`
  padding: 6px 8px;
`;

const ChecklistNewItem = styled.div`
  margin: 8px 0;
  margin-left: 40px;
`;

type ChecklistItemProps = {
  itemID: string;
  checklistID: string;
  complete: boolean;
  name: string;
  onChangeName: (itemID: string, currentName: string) => void;
  wrapperProps: any;
  handleProps: any;
  onToggleItem: (itemID: string, complete: boolean) => void;
  onDeleteItem: (checklistIDID: string, itemID: string) => void;
};

export const ChecklistItem = React.forwardRef(
  (
    {
      itemID,
      checklistID,
      complete,
      name,
      wrapperProps,
      handleProps,
      onChangeName,
      onToggleItem,
      onDeleteItem,
    }: ChecklistItemProps,
    $item,
  ) => {
    const $editor = useRef<HTMLTextAreaElement>(null);
    const [editting, setEditting] = useState(false);
    const [currentName, setCurrentName] = useState(name);
    useEffect(() => {
      if (editting && $editor && $editor.current) {
        $editor.current.focus();
        $editor.current.select();
      }
    }, [editting]);
    // useOnOutsideClick($item, true, () => setEditting(false), null);
    return (
      <ChecklistItemWrapper ref={$item} {...wrapperProps} {...handleProps}>
        <ChecklistIcon
          onClick={e => {
            e.stopPropagation();
            onToggleItem(itemID, !complete);
          }}
        >
          {complete ? (
            <ChecklistItemCheckedIcon width={20} height={20} />
          ) : (
            <ChecklistItemUncheckedIcon width={20} height={20} />
          )}
        </ChecklistIcon>
        {editting ? (
          <>
            <ChecklistNameEditorWrapper>
              <ChecklistNameEditor
                ref={$editor}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    onChangeName(itemID, currentName);
                    setEditting(false);
                  }
                }}
                onChange={e => {
                  setCurrentName(e.currentTarget.value);
                }}
                value={currentName}
              />
            </ChecklistNameEditorWrapper>
            <EditControls>
              <SaveButton
                onClick={() => {
                  onChangeName(itemID, currentName);
                  setEditting(false);
                }}
                variant="relief"
              >
                Save
              </SaveButton>
              <CancelButton
                onClick={e => {
                  e.stopPropagation();
                  setEditting(false);
                }}
              >
                <Cross width={20} height={20} />
              </CancelButton>
              <Spacer />
              <EditableDeleteButton
                onClick={e => {
                  e.stopPropagation();
                  setEditting(false);
                  onDeleteItem(checklistID, itemID);
                }}
              >
                <Trash width={16} height={16} />
              </EditableDeleteButton>
            </EditControls>
          </>
        ) : (
          <ChecklistItemDetails
            onClick={() => {
              setEditting(true);
            }}
          >
            <ChecklistItemRow>
              <ChecklistItemTextControls>
                <ChecklistItemText complete={complete}>{name}</ChecklistItemText>
                <ChecklistControls>
                  <ControlButton>
                    <AssignUserButton width={14} height={14} />
                  </ControlButton>
                  <ControlButton>
                    <ClockButton width={14} height={14} />
                  </ControlButton>
                  <ControlButton
                    onClick={e => {
                      e.stopPropagation();
                      onDeleteItem(checklistID, itemID);
                    }}
                  >
                    <TrashButton width={14} height={14} />
                  </ControlButton>
                </ChecklistControls>
              </ChecklistItemTextControls>
            </ChecklistItemRow>
          </ChecklistItemDetails>
        )}
      </ChecklistItemWrapper>
    );
  },
);

type AddNewItemProps = {
  onAddItem: (name: string) => void;
};

const AddNewItem: React.FC<AddNewItemProps> = ({ onAddItem }) => {
  const $editor = useRef<HTMLTextAreaElement>(null);
  const $wrapper = useRef<HTMLDivElement>(null);
  const [currentName, setCurrentName] = useState('');
  const [editting, setEditting] = useState(false);
  useEffect(() => {
    if (editting && $editor && $editor.current) {
      $editor.current.focus();
      $editor.current.select();
    }
  }, [editting]);
  useOnOutsideClick($wrapper, true, () => setEditting(false), null);
  return (
    <ChecklistNewItem ref={$wrapper}>
      {editting ? (
        <>
          <ChecklistNameEditorWrapper>
            <ChecklistNameEditor
              ref={$editor}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddItem(currentName);
                  setCurrentName('');
                }
              }}
              onChange={e => {
                setCurrentName(e.currentTarget.value);
              }}
              value={currentName}
            />
          </ChecklistNameEditorWrapper>
          <EditControls>
            <SaveButton
              onClick={() => {
                onAddItem(currentName);
                setCurrentName('');
                if (editting && $editor && $editor.current) {
                  $editor.current.focus();
                  $editor.current.select();
                }
              }}
              variant="relief"
            >
              Save
            </SaveButton>
            <CancelButton
              onClick={e => {
                e.stopPropagation();
                setEditting(false);
              }}
            >
              <Cross width={20} height={20} />
            </CancelButton>
          </EditControls>
        </>
      ) : (
        <NewItemButton onClick={() => setEditting(true)}>Add an item</NewItemButton>
      )}
    </ChecklistNewItem>
  );
};

type ChecklistTitleEditorProps = {
  name: string;
  onChangeName: (item: string) => void;
  onCancel: () => void;
};

const ChecklistTitleEditor = React.forwardRef(
  ({ name, onChangeName, onCancel }: ChecklistTitleEditorProps, $name: any) => {
    const [currentName, setCurrentName] = useState(name);
    return (
      <>
        <ChecklistNameEditor
          ref={$name}
          value={currentName}
          onChange={e => {
            setCurrentName(e.currentTarget.value);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onChangeName(currentName);
            }
          }}
        />
        <EditControls>
          <SaveButton
            onClick={() => {
              onChangeName(currentName);
            }}
            variant="relief"
          >
            Save
          </SaveButton>
          <CancelButton
            onClick={e => {
              e.stopPropagation();
              onCancel();
            }}
          >
            <Cross width={20} height={20} />
          </CancelButton>
        </EditControls>
      </>
    );
  },
);
type ChecklistProps = {
  checklistID: string;
  onDeleteChecklist: ($target: React.RefObject<HTMLElement>, checklistID: string) => void;
  name: string;
  children: React.ReactNode;
  onChangeName: (item: string) => void;
  onToggleItem: (taskID: string, complete: boolean) => void;
  onChangeItemName: (itemID: string, currentName: string) => void;
  wrapperProps: any;
  handleProps: any;
  onDeleteItem: (checklistID: string, itemID: string) => void;
  onAddItem: (itemName: string) => void;
  items: Array<TaskChecklistItem>;
};

const Checklist = React.forwardRef(
  (
    {
      checklistID,
      children,
      onDeleteChecklist,
      name,
      items,
      wrapperProps,
      handleProps,
      onToggleItem,
      onAddItem,
      onChangeItemName,
      onChangeName,
      onDeleteItem,
    }: ChecklistProps,
    $container,
  ) => {
    const $name = useRef<HTMLTextAreaElement>(null);
    const complete = items.reduce((prev, item) => prev + (item.complete ? 1 : 0), 0);
    const percent = items.length === 0 ? 0 : Math.floor((complete / items.length) * 100);
    const [editting, setEditting] = useState(false);
    // useOnOutsideClick($name, true, () => setEditting(false), null);
    useEffect(() => {
      if (editting && $name && $name.current) {
        $name.current.focus();
        $name.current.select();
      }
    }, [editting]);
    return (
      <Wrapper ref={$container} {...wrapperProps}>
        <WindowTitle>
          <WindowTitleIcon width={24} height={24} />
          {editting ? (
            <ChecklistTitleEditor
              ref={$name}
              name={name}
              onChangeName={currentName => {
                onChangeName(currentName);
                setEditting(false);
              }}
              onCancel={() => {
                setEditting(false);
              }}
            />
          ) : (
            <WindowChecklistTitle {...handleProps}>
              <WindowTitleText onClick={() => setEditting(true)}>{name}</WindowTitleText>
              <WindowOptions>
                <DeleteButton
                  onClick={$target => {
                    onDeleteChecklist($target, checklistID);
                  }}
                  color="danger"
                  variant="outline"
                >
                  Delete
                </DeleteButton>
              </WindowOptions>
            </WindowChecklistTitle>
          )}
        </WindowTitle>
        <ChecklistProgress>
          <ChecklistProgressPercent>{`${percent}%`}</ChecklistProgressPercent>
          <ChecklistProgressBar>
            <ChecklistProgressBarCurrent width={percent} />
          </ChecklistProgressBar>
        </ChecklistProgress>
        {children}
        <AddNewItem onAddItem={onAddItem} />
      </Wrapper>
    );
  },
);
/*
  <ChecklistItems>
    {items
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((item, idx) => (
        <ChecklistItem
          index={idx}
          key={item.id}
          itemID={item.id}
          name={item.name}
          complete={item.complete}
          onDeleteItem={onDeleteItem}
          onChangeName={onChangeItemName}
          onToggleItem={onToggleItem}
        />
      ))}

 </ChecklistItems>
 */
export default Checklist;
