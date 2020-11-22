import React, { useState, useRef, useEffect, useMemo, useCallback, useContext, memo, createRef } from 'react';
import { DotCircle } from 'shared/icons';
import _ from 'lodash';
import produce from 'immer';
import Entry from './Entry';
import DragIndicator from './DragIndicator';
import Dragger from './Dragger';
import DragDebug from './DragDebug';
import { DragContext } from './useDrag';

import {
  DragDebugWrapper,
  DragIndicatorBar,
  PageContent,
  EntryChildren,
  EntryInnerContent,
  EntryWrapper,
  EntryContent,
  EntryHandle,
} from './Styles';
import { transformToTree, findNode, findNodeDepth, getNumberOfChildren, validateDepth } from './utils';

const listItems: Array<ItemElement> = [
  { id: 'root', position: 4096, parent: null },
  { id: 'entry-1', position: 4096, parent: 'root' },
  { id: 'entry-1_1', position: 4096, parent: 'entry-1' },
  { id: 'entry-1_1_1', position: 4096, parent: 'entry-1_1' },
  { id: 'entry-1_2', position: 4096 * 2, parent: 'entry-1' },
  { id: 'entry-1_2_1', position: 4096, parent: 'entry-1_2' },
  { id: 'entry-1_2_2', position: 4096 * 2, parent: 'entry-1_2' },
  { id: 'entry-1_2_3', position: 4096 * 3, parent: 'entry-1_2' },
  { id: 'entry-2', position: 4096 * 2, parent: 'root' },
  { id: 'entry-3', position: 4096 * 3, parent: 'root' },
  { id: 'entry-4', position: 4096 * 4, parent: 'root' },
  { id: 'entry-5', position: 4096 * 5, parent: 'root' },
];

const Outline: React.FC = () => {
  const [items, setItems] = useState(listItems);
  const [dragging, setDragging] = useState<{
    show: boolean;
    draggableID: null | string;
    initialPos: { x: number; y: number };
  }>({ show: false, draggableID: null, initialPos: { x: 0, y: 0 } });
  const [impact, setImpact] = useState<null | {
    listPosition: number;
    zone: ImpactZone;
    depthTarget: number;
  }>(null);
  const impactRef = useRef<null | { listPosition: number; depth: number; zone: ImpactZone }>(null);
  useEffect(() => {
    if (impact) {
      impactRef.current = { zone: impact.zone, depth: impact.depthTarget, listPosition: impact.listPosition };
    }
  }, [impact]);

  const $content = useRef<HTMLDivElement>(null);
  const outline = useRef<OutlineData>({
    published: new Map<string, string>(),
    dimensions: new Map<string, NodeDimensions>(),
    nodes: new Map<number, Map<string, OutlineNode>>(),
    relationships: new Map<string, NodeRelationships>(),
  });

  const tree = transformToTree(_.cloneDeep(items));
  let root: any = null;
  if (tree.length === 1) {
    root = tree[0];
  }
  useEffect(() => {
    outline.current.relationships = new Map<string, NodeRelationships>();
    outline.current.published = new Map<string, string>();
    outline.current.nodes = new Map<number, Map<string, OutlineNode>>();
    items.forEach(item => outline.current.published.set(item.id, item.parent ?? 'root'));

    for (let i = 0; i < items.length; i++) {
      const { position, id, parent: curParent } = items[i];
      if (id === 'root') {
        continue;
      }
      const parent = curParent ?? 'root';
      outline.current.published.set(id, parent ?? 'root');
      const { depth, ancestors } = findNodeDepth(outline.current.published, id);
      const children = getNumberOfChildren(root, ancestors);
      if (!outline.current.nodes.has(depth)) {
        outline.current.nodes.set(depth, new Map<string, OutlineNode>());
      }
      const targetDepthNodes = outline.current.nodes.get(depth);
      if (targetDepthNodes) {
        targetDepthNodes.set(id, {
          id,
          children,
          position,
          depth,
          ancestors,
          parent,
        });
      }
      if (!outline.current.relationships.has(parent)) {
        outline.current.relationships.set(parent, {
          self: {
            depth: depth - 1,
            id: parent,
          },
          children: [],
          numberOfSubChildren: 0,
        });
      }
      const nodeRelations = outline.current.relationships.get(parent);
      if (nodeRelations) {
        outline.current.relationships.set(parent, {
          self: nodeRelations.self,
          numberOfSubChildren: nodeRelations.numberOfSubChildren + children,
          children: [...nodeRelations.children, { id, position, depth, children }].sort(
            (a, b) => a.position - b.position,
          ),
        });
      }
    }
  }, [items]);

  if (!root) {
    return null;
  }
  return (
    <>
      <DragContext.Provider
        value={{
          outline,
          impact,
          setImpact: data => {
            if (data) {
              const { zone, depth } = data;
              let listPosition = 65535;
              const listAbove = validateDepth(zone.above ? zone.above.node : null, depth);
              const listBelow = validateDepth(zone.below ? zone.below.node : null, depth);
              if (listAbove && listBelow) {
                listPosition = (listAbove.position + listBelow.position) / 2.0;
              } else if (listAbove && !listBelow) {
                listPosition = listAbove.position * 2.0;
              } else if (!listAbove && listBelow) {
                listPosition = listBelow.position / 2.0;
              }

              if (!zone.above && zone.below) {
                const newPosition = zone.below.node.position / 2.0;
                setImpact(() => ({
                  zone,
                  listPosition: newPosition,
                  depthTarget: depth,
                }));
              }
              if (zone.above) {
                // console.log(`prev=${prev} next=${next} targetPosition=${targetPosition}`);
                // let targetID = depthTarget === 1 ? 'root' : node.ancestors[depthTarget - 1];
                // targetID = targetID ?? node.id;
                setImpact(() => ({
                  zone,
                  listPosition,
                  depthTarget: depth,
                }));
              }
            } else {
              setImpact(null);
            }
          },
          setNodeDimensions: (nodeID, ref) => {
            outline.current.dimensions.set(nodeID, ref);
          },
        }}
      >
        <>
          <PageContent ref={$content}>
            <Entry
              id="root"
              parentID="root"
              isRoot
              draggingID={dragging.draggableID}
              position={root.position}
              entries={root.children}
              onStartDrag={e => {
                if (e.id !== 'root') {
                  setImpact(null);
                  setDragging({ show: true, draggableID: e.id, initialPos: { x: e.clientX, y: e.clientY } });
                }
              }}
            />
          </PageContent>
          {dragging.show && dragging.draggableID && (
            <Dragger
              container={$content}
              draggingID={dragging.draggableID}
              initialPos={dragging.initialPos}
              isDragging={dragging.show}
              onDragEnd={() => {
                const draggingID = dragging.draggableID;
                if (draggingID && impactRef.current) {
                  const { zone, depth, listPosition } = impactRef.current;
                  const noZone = !zone.above && !zone.below;
                  const curParentID = outline.current.published.get(draggingID);
                  if (!noZone && curParentID) {
                    let parentID = 'root';
                    if (zone.above) {
                      parentID = zone.above.node.ancestors[depth - 1];
                    }
                    const node = findNode(curParentID, draggingID, outline.current);
                    console.log(`${node ? node.parent : null} => ${parentID}`);
                    // UPDATE OUTLINE DATA AFTER NODE MOVE
                    if (node) {
                      if (node.depth !== depth) {
                        const oldParentDepth = outline.current.nodes.get(node.depth - 1);
                        if (oldParentDepth) {
                          const oldParentNode = oldParentDepth.get(node.parent);
                          if (oldParentNode) {
                            oldParentNode.children -= 1;
                          }
                        }
                        const oldDepth = outline.current.nodes.get(node.depth);
                        if (oldDepth) {
                          oldDepth.delete(node.id);
                        }
                        if (!outline.current.nodes.has(depth)) {
                          outline.current.nodes.set(depth, new Map<string, OutlineNode>());
                        }
                        const newParentDepth = outline.current.nodes.get(depth - 1);
                        if (newParentDepth) {
                          const newParentNode = newParentDepth.get(parentID);
                          if (newParentNode) {
                            newParentNode.children += 1;
                          }
                        }
                        const newDepth = outline.current.nodes.get(depth);
                        if (newDepth) {
                          // TODO: rebuild ancestors
                          newDepth.set(node.id, {
                            ...node,
                            depth,
                            position: listPosition,
                            parent: parentID,
                          });
                        }
                      }
                      if (!outline.current.relationships.has(parentID)) {
                        outline.current.relationships.set(parentID, {
                          self: {
                            depth: depth - 1,
                            id: parentID,
                          },
                          children: [{ id: draggingID, position: listPosition, depth, children: node.children }],
                          numberOfSubChildren: 0,
                        });
                      }
                      const nodeRelations = outline.current.relationships.get(parentID);
                      if (parentID !== node.parent) {
                        // ??
                      }
                      if (nodeRelations) {
                        nodeRelations.children = produce(nodeRelations.children, draftChildren => {
                          const nodeIdx = draftChildren.findIndex(c => c.id === node.id);
                          if (nodeIdx !== -1) {
                            draftChildren[nodeIdx] = {
                              children: node.children,
                              depth,
                              position: listPosition,
                              id: node.id,
                            };
                          }
                          draftChildren.sort((a, b) => a.position - b.position);
                        });
                      }
                    }
                    outline.current.published.set(draggingID, parentID);
                    setItems(itemsPrev =>
                      produce(itemsPrev, draftItems => {
                        const curDragging = itemsPrev.findIndex(i => i.id === draggingID);
                        // console.log(`parent=${impactRef.current} target=${draggingID}`);
                        if (impactRef.current) {
                          // console.log(`updating position = ${impactRef.current.targetPosition}`);
                          draftItems[curDragging].parent = parentID;
                          draftItems[curDragging].position = listPosition;
                        }
                      }),
                    );
                  }
                }
                setImpact(null);
                setDragging({ show: false, draggableID: null, initialPos: { x: 0, y: 0 } });
              }}
            />
          )}
        </>
      </DragContext.Provider>
      {impact && <DragIndicator depthTarget={impact.depthTarget} container={$content} zone={impact.zone} />}
      {impact && (
        <DragDebug zone={impact.zone ?? null} draggingID={dragging.draggableID} depthTarget={impact.depthTarget} />
      )}
    </>
  );
};

export default Outline;
