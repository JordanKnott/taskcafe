import React, { useRef, useEffect } from 'react';
import { DotCircle } from 'shared/icons';

import { EntryChildren, EntryWrapper, EntryContent, EntryInnerContent, EntryHandle } from './Styles';
import { useDrag } from './useDrag';

type EntryProps = {
  id: string;
  parentID: string;
  onStartDrag: (e: { id: string; clientX: number; clientY: number }) => void;
  isRoot?: boolean;
  draggingID: null | string;
  entries: Array<ItemElement>;
  position: number;
  chain?: Array<string>;
  depth?: number;
};

const Entry: React.FC<EntryProps> = ({
  id,
  parentID,
  isRoot = false,
  position,
  onStartDrag,
  draggingID,
  entries,
  chain = [],
  depth = 0,
}) => {
  const $entry = useRef<HTMLDivElement>(null);
  const $children = useRef<HTMLDivElement>(null);
  const { setNodeDimensions } = useDrag();
  useEffect(() => {
    if (isRoot) return;
    if ($entry && $entry.current) {
      setNodeDimensions(id, {
        entry: $entry,
        children: entries.length !== 0 ? $children : null,
      });
    }
  }, [position, depth, entries]);
  let showHandle = true;
  if (draggingID && draggingID === id) {
    showHandle = false;
  }
  return (
    <EntryWrapper isDragging={!showHandle}>
      {!isRoot && (
        <EntryContent>
          {showHandle && (
            <EntryHandle onMouseDown={e => onStartDrag({ id, clientX: e.clientX, clientY: e.clientY })}>
              <DotCircle width={18} height={18} />
            </EntryHandle>
          )}
          <EntryInnerContent ref={$entry}>{id.toString()}</EntryInnerContent>
        </EntryContent>
      )}
      {entries.length !== 0 && (
        <EntryChildren ref={$children} isRoot={isRoot}>
          {entries
            .sort((a, b) => a.position - b.position)
            .map(entry => (
              <Entry
                parentID={id}
                key={entry.id}
                position={entry.position}
                depth={depth + 1}
                draggingID={draggingID}
                id={entry.id}
                onStartDrag={onStartDrag}
                entries={entry.children ?? []}
                chain={[...chain, id]}
              />
            ))}
        </EntryChildren>
      )}
    </EntryWrapper>
  );
};

export default Entry;
