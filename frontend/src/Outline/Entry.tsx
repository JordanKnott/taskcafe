import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Dot, CaretDown, CaretRight } from 'shared/icons';
import _ from 'lodash';
import marked from 'marked';
import VisibilitySensor from 'react-visibility-sensor';

import {
  EntryChildren,
  EntryWrapper,
  EntryContent,
  EntryInnerContent,
  EntryHandle,
  ExpandButton,
  EntryContentEditor,
  EntryContentDisplay,
} from './Styles';
import { useDrag } from './useDrag';
import { getCaretPosition, setCurrentCursorPosition } from './utils';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';

type EditorProps = {
  text: string;
  initFocus: null | { caret: null | number };
  autoFocus: number | null;
  onChangeCurrentText: (text: string) => void;
  onDeleteEntry: (caret: number) => void;
  onBlur: () => void;
  handleChangeText: (caret: number) => void;
  onDepthChange: (delta: number) => void;
  onCreateEntry: () => void;
  onNodeFocused: () => void;
};
const Editor: React.FC<EditorProps> = ({
  text,
  onCreateEntry,
  initFocus,
  autoFocus,
  onChangeCurrentText,
  onDepthChange,
  onDeleteEntry,
  onNodeFocused,
  handleChangeText,
  onBlur,
}) => {
  const $editor = useRef<HTMLInputElement>(null);
  useOnOutsideClick($editor, true, () => onBlur(), null);
  useEffect(() => {
    if (autoFocus && $editor.current) {
      $editor.current.focus();
      $editor.current.setSelectionRange(autoFocus, autoFocus);
      onNodeFocused();
    }
  }, [autoFocus]);
  useEffect(() => {
    if (initFocus && $editor.current) {
      $editor.current.focus();
      if (initFocus.caret) {
        $editor.current.setSelectionRange(initFocus.caret ?? 0, initFocus.caret ?? 0);
      }
      onNodeFocused();
    }
  }, []);
  return (
    <EntryContentEditor
      value={text}
      ref={$editor}
      onChange={e => {
        onChangeCurrentText(e.currentTarget.value);
      }}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          e.preventDefault();
          // onCreateEntry(parentID, position * 2);
          onCreateEntry();
          return;
        } else if (e.keyCode === 9) {
          e.preventDefault();
          onDepthChange(e.shiftKey ? -1 : 1);
        } else if (e.keyCode === 8) {
          const caretPos = e.currentTarget.selectionEnd;
          if (caretPos === 0) {
            // handleChangeText.flush();
            // onDeleteEntry(depth, id, currentText, caretPos);
            onDeleteEntry(caretPos);
            e.preventDefault();
            return;
          }
        } else if (e.key === 'z' && e.ctrlKey) {
          e.preventDefault();
          return;
        }
        handleChangeText(e.currentTarget.selectionEnd ?? 0);
        // setCaretPos(e.currentTarget.selectionEnd ?? 0);
        // handleChangeText();
      }}
    />
  );
};

type EntryProps = {
  id: string;
  collapsed?: boolean;
  onToggleCollapse: (id: string, collapsed: boolean) => void;
  parentID: string;
  onStartDrag: (e: { id: string; clientX: number; clientY: number }) => void;
  onStartSelect: (e: { id: string; depth: number }) => void;
  isRoot?: boolean;
  selection: null | Array<{ id: string }>;
  draggedNodes: null | Array<string>;
  onNodeFocused: (id: string) => void;
  text: string;
  entries: Array<ItemElement>;
  onTextChange: (id: string, prex: string, next: string, caret: number) => void;
  onCancelDrag: () => void;
  autoFocus: null | { caret: null | number };
  onCreateEntry: (parent: string, nextPositon: number) => void;
  position: number;
  chain?: Array<string>;
  onHandleClick: (id: string) => void;
  onDepthChange: (id: string, parent: string, position: number, depth: number, depthDelta: number) => void;
  onDeleteEntry: (depth: number, id: string, text: string, caretPos: number) => void;
  depth?: number;
};

const Entry: React.FC<EntryProps> = ({
  id,
  text,
  parentID,
  isRoot = false,
  selection,
  onToggleCollapse,
  autoFocus,
  onStartSelect,
  onHandleClick,
  onTextChange,
  position,
  onNodeFocused,
  onDepthChange,
  onCreateEntry,
  onDeleteEntry,
  onCancelDrag,
  onStartDrag,
  collapsed = false,
  draggedNodes,
  entries,
  chain = [],
  depth = 0,
}) => {
  const $entry = useRef<HTMLDivElement>(null);
  const $children = useRef<HTMLDivElement>(null);
  const { setNodeDimensions, clearNodeDimensions } = useDrag();
  if (autoFocus) {
  }

  const $snapshot = useRef<{ now: string; prev: string }>({ now: text, prev: text });
  const [currentText, setCurrentText] = useState(text);
  const [caretPos, setCaretPos] = useState(0);
  const $firstRun = useRef<boolean>(true);
  useEffect(() => {
    if ($firstRun.current) {
      $firstRun.current = false;
      return;
    }
    console.log('updating text');
    setCurrentText(text);
  }, [text]);

  const [editor, setEditor] = useState<{ open: boolean; caret: null | number }>({
    open: false,
    caret: null,
  });
  useEffect(() => {
    if (autoFocus) setEditor({ open: true, caret: null });
  }, [autoFocus]);
  useEffect(() => {
    $snapshot.current.now = currentText;
  }, [currentText]);
  const handleChangeText = useCallback(
    _.debounce(() => {
      onTextChange(id, $snapshot.current.prev, $snapshot.current.now, caretPos);
      $snapshot.current.prev = $snapshot.current.now;
    }, 500),
    [],
  );
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isRoot) return;
    if (!visible) {
      clearNodeDimensions(id);
      return;
    }
    if ($entry && $entry.current) {
      setNodeDimensions(id, {
        entry: $entry,
        children: entries.length !== 0 ? $children : null,
      });
    }
    return () => {
      clearNodeDimensions(id);
    };
  }, [position, depth, entries, visible]);
  let showHandle = true;
  if (draggedNodes && draggedNodes.length === 1 && draggedNodes.find(c => c === id)) {
    showHandle = false;
  }
  let isSelected = false;
  if (selection && selection.find(c => c.id === id)) {
    isSelected = true;
  }
  const renderMap: Array<number> = [];
  const renderer = {
    text(text: any) {
      const localId = renderMap.length;
      renderMap.push(text.length);
      return `<span id="${id}_${localId}">${text}</span>`;
    },
    codespan(text: any) {
      const localId = renderMap.length;
      renderMap.push(text.length + 2);
      return `<span class="markdown-code" id="${id}_${localId}">${text}</span>`;
    },
    strong(text: string) {
      const idx = parseInt(text.split('"')[1].split('_')[1]);
      renderMap[idx] += 4;
      return text.replace('<span', '<span class="markdown-strong"');
    },
    em(text: string) {
      const idx = parseInt(text.split('"')[1].split('_')[1]);
      renderMap[idx] += 2;
      return text.replace('<span', '<span class="markdown-em"');
    },
    del(text: string) {
      const idx = parseInt(text.split('"')[1].split('_')[1]);
      renderMap[idx] += 2;
      return text.replace('<span', '<span class="markdown-del"');
    },
  };

  // @ts-ignore
  marked.use({ renderer });

  const handleMouseDown = useCallback(
    _.debounce((e: any) => {
      onStartDrag({ id, clientX: e.clientX, clientY: e.clientY });
    }, 100),
    [],
  );
  return (
    <VisibilitySensor
      onChange={v => {
        if (v) {
          setVisible(v);
        }
      }}
    >
      <EntryWrapper isSelected={isSelected} isDragging={!showHandle}>
        {!isRoot && (
          <EntryContent>
            {entries.length !== 0 && (
              <ExpandButton onClick={() => onToggleCollapse(id, !collapsed)}>
                {collapsed ? <CaretRight width={20} height={20} /> : <CaretDown width={20} height={20} />}
              </ExpandButton>
            )}
            {showHandle && (
              <EntryHandle
                onMouseUp={() => {
                  handleMouseDown.cancel();
                  onHandleClick(id);
                }}
                onMouseDown={e => {
                  handleMouseDown(e);
                }}
              >
                <Dot width={18} height={18} />
              </EntryHandle>
            )}
            <EntryInnerContent
              onMouseDown={() => {
                onStartSelect({ id, depth });
              }}
              ref={$entry}
            >
              {editor.open ? (
                <Editor
                  onDepthChange={delta => onDepthChange(id, parentID, depth, position, delta)}
                  onBlur={() => setEditor({ open: false, caret: null })}
                  onNodeFocused={() => onNodeFocused(id)}
                  autoFocus={autoFocus ? (autoFocus.caret ? autoFocus.caret : 0) : null}
                  initFocus={editor.open ? { caret: editor.caret } : null}
                  text={currentText}
                  onDeleteEntry={caret => {
                    handleChangeText.flush();
                    onDeleteEntry(depth, id, currentText, caret);
                  }}
                  onCreateEntry={() => {
                    onCreateEntry(parentID, position * 2);
                  }}
                  onChangeCurrentText={text => setCurrentText(text)}
                  handleChangeText={caret => {
                    setCaretPos(caret);
                    handleChangeText();
                  }}
                />
              ) : (
                <EntryContentDisplay
                  onClick={e => {
                    let offset = 0;
                    let textNode: any;
                    if (document.caretPositionFromPoint) {
                      // standard
                      const range = document.caretPositionFromPoint(e.pageX, e.pageY);
                      console.dir(range);
                      if (range) {
                        textNode = range.offsetNode;
                        offset = range.offset;
                      }
                    } else if (document.caretRangeFromPoint) {
                      // WebKit
                      const range = document.caretRangeFromPoint(e.pageX, e.pageY);
                      if (range) {
                        textNode = range.startContainer;
                        offset = range.startOffset;
                      }
                    }

                    const id = textNode.parentNode.id.split('_');
                    const index = parseInt(id[1]);
                    let caret = offset;
                    for (let i = 0; i < index; i++) {
                      caret += renderMap[i];
                    }
                    setEditor({ open: true, caret });
                  }}
                  dangerouslySetInnerHTML={{ __html: marked.parseInline(text) }}
                />
              )}
            </EntryInnerContent>
          </EntryContent>
        )}
        {entries.length !== 0 && !collapsed && (
          <EntryChildren ref={$children} isRoot={isRoot}>
            {entries
              .sort((a, b) => a.position - b.position)
              .map(entry => (
                <Entry
                  onDeleteEntry={onDeleteEntry}
                  onHandleClick={onHandleClick}
                  onDepthChange={onDepthChange}
                  parentID={id}
                  key={entry.id}
                  onTextChange={onTextChange}
                  position={entry.position}
                  text={entry.text}
                  depth={depth + 1}
                  draggedNodes={draggedNodes}
                  collapsed={entry.collapsed}
                  id={entry.id}
                  autoFocus={entry.focus}
                  onNodeFocused={onNodeFocused}
                  onStartSelect={onStartSelect}
                  onStartDrag={onStartDrag}
                  onCancelDrag={onCancelDrag}
                  entries={entry.children ?? []}
                  chain={[...chain, id]}
                  selection={selection}
                  onToggleCollapse={onToggleCollapse}
                  onCreateEntry={onCreateEntry}
                />
              ))}
          </EntryChildren>
        )}
      </EntryWrapper>
    </VisibilitySensor>
  );
};

export default Entry;
