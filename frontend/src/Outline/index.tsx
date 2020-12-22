import React, { useState, useRef, useEffect, useMemo, useCallback, useContext, memo, createRef } from 'react';
import { DotCircle } from 'shared/icons';
import styled from 'styled-components/macro';
import GlobalTopNavbar from 'App/TopNavbar';
import _ from 'lodash';
import produce from 'immer';
import Entry from './Entry';
import DragIndicator from './DragIndicator';
import Dragger from './Dragger';
import DragDebug from './DragDebug';
import { DragContext } from './useDrag';

import {
  PageContainer,
  DragDebugWrapper,
  DragIndicatorBar,
  PageContent,
  EntryChildren,
  EntryInnerContent,
  EntryWrapper,
  EntryContent,
  RootWrapper,
  EntryHandle,
} from './Styles';
import {
  transformToTree,
  findNode,
  findNodeDepth,
  getNumberOfChildren,
  validateDepth,
  getDimensions,
  findNextDraggable,
  getNodeOver,
  getCorrectNode,
  findCommonParent,
} from './utils';
import NOOP from 'shared/utils/noop';

type OutlineCommand = {
  nodes: Array<{
    id: string;
    prev: { position: number; parent: string | null };
    next: { position: number; parent: string | null };
  }>;
};

type ItemCollapsed = {
  id: string;
  collapsed: boolean;
};

const listItems: Array<ItemElement> = [
  { id: 'root', position: 4096, parent: null, collapsed: false },
  { id: 'entry-1', position: 4096, parent: 'root', collapsed: false },
  { id: 'entry-1_3', position: 4096 * 3, parent: 'entry-1', collapsed: false },
  { id: 'entry-1_3_1', position: 4096, parent: 'entry-1_3', collapsed: false },
  { id: 'entry-1_3_2', position: 4096 * 2, parent: 'entry-1_3', collapsed: false },
  { id: 'entry-1_3_3', position: 4096 * 3, parent: 'entry-1_3', collapsed: false },
  { id: 'entry-1_3_3_1', position: 4096 * 1, parent: 'entry-1_3_3', collapsed: false },
  { id: 'entry-1_3_3_1_1', position: 4096 * 1, parent: 'entry-1_3_3_1', collapsed: false },
  { id: 'entry-2', position: 4096 * 2, parent: 'root', collapsed: false },
  { id: 'entry-3', position: 4096 * 3, parent: 'root', collapsed: false },
  { id: 'entry-4', position: 4096 * 4, parent: 'root', collapsed: false },
  { id: 'entry-5', position: 4096 * 5, parent: 'root', collapsed: false },
];

const Outline: React.FC = () => {
  const [items, setItems] = useState(listItems);
  const [selecting, setSelecting] = useState<{
    isSelecting: boolean;
    node: { id: string; depth: number } | null;
  }>({ isSelecting: false, node: null });
  const [selection, setSelection] = useState<null | { nodes: Array<{ id: string }>; first?: OutlineNode | null }>(null);
  const [dragging, setDragging] = useState<{
    show: boolean;
    draggedNodes: null | Array<string>;
    initialPos: { x: number; y: number };
  }>({ show: false, draggedNodes: null, initialPos: { x: 0, y: 0 } });
  const [impact, setImpact] = useState<null | {
    listPosition: number;
    zone: ImpactZone;
    depthTarget: number;
  }>(null);
  const selectRef = useRef<{ isSelecting: boolean; hasSelection: boolean; node: { id: string; depth: number } | null }>(
    {
      isSelecting: false,
      node: null,
      hasSelection: false,
    },
  );
  const impactRef = useRef<null | { listPosition: number; depth: number; zone: ImpactZone }>(null);
  useEffect(() => {
    if (impact) {
      impactRef.current = { zone: impact.zone, depth: impact.depthTarget, listPosition: impact.listPosition };
    }
  }, [impact]);
  useEffect(() => {
    selectRef.current.isSelecting = selecting.isSelecting;
    selectRef.current.node = selecting.node;
  }, [selecting]);

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
  const outlineHistory = useRef<{ commands: Array<OutlineCommand>; current: number }>({ current: -1, commands: [] });

  useEffect(() => {
    outline.current.relationships = new Map<string, NodeRelationships>();
    outline.current.published = new Map<string, string>();
    outline.current.nodes = new Map<number, Map<string, OutlineNode>>();
    const collapsedMap = items.reduce((map, next) => {
      if (next.collapsed) {
        map.set(next.id, true);
      }
      return map;
    }, new Map<string, boolean>());
    items.forEach(item => outline.current.published.set(item.id, item.parent ?? 'root'));

    for (let i = 0; i < items.length; i++) {
      const { collapsed, position, id, parent: curParent } = items[i];
      if (id === 'root') {
        continue;
      }
      const parent = curParent ?? 'root';
      outline.current.published.set(id, parent ?? 'root');
      const { depth, ancestors } = findNodeDepth(outline.current.published, id);
      const collapsedParent = ancestors.slice(0, -1).find(a => collapsedMap.get(a));
      if (collapsedParent) {
        continue;
      }
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
          collapsed,
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
  const handleKeyDown = useCallback(e => {
    if (e.code === 'KeyZ' && e.ctrlKey) {
      const currentCommand = outlineHistory.current.commands[outlineHistory.current.current];
      if (currentCommand) {
        setItems(prevItems =>
          produce(prevItems, draftItems => {
            currentCommand.nodes.forEach(node => {
              const idx = prevItems.findIndex(c => c.id === node.id);
              if (idx !== -1) {
                draftItems[idx].parent = node.prev.parent;
                draftItems[idx].position = node.prev.position;
              }
            });
            outlineHistory.current.current--;
          }),
        );
      }
    } else if (e.code === 'KeyY' && e.ctrlKey) {
      const currentCommand = outlineHistory.current.commands[outlineHistory.current.current + 1];
      if (currentCommand) {
        setItems(prevItems =>
          produce(prevItems, draftItems => {
            currentCommand.nodes.forEach(node => {
              const idx = prevItems.findIndex(c => c.id === node.id);
              if (idx !== -1) {
                draftItems[idx].parent = node.next.parent;
                draftItems[idx].position = node.next.position;
              }
            });
            outlineHistory.current.current++;
          }),
        );
      }
    }
  }, []);

  const handleMouseUp = useCallback(
    e => {
      if (selectRef.current.hasSelection && !selectRef.current.isSelecting) {
        setSelection(null);
      }
      if (selectRef.current.isSelecting) {
        setSelecting({ isSelecting: false, node: null });
      }
    },
    [dragging, selecting],
  );
  const handleMouseMove = useCallback(e => {
    if (selectRef.current.isSelecting && selectRef.current.node) {
      const { clientX, clientY } = e;
      const dimensions = outline.current.dimensions.get(selectRef.current.node.id);
      if (dimensions) {
        const entry = getDimensions(dimensions.entry);
        if (entry) {
          const isAbove = clientY < entry.top;
          const isBelow = clientY > entry.bottom;
          if (!isAbove && !isBelow && selectRef.current.hasSelection) {
            const nodeDepth = outline.current.nodes.get(selectRef.current.node.depth);
            const aboveNode = nodeDepth ? nodeDepth.get(selectRef.current.node.id) : null;
            if (aboveNode) {
              setSelection({ nodes: [{ id: selectRef.current.node.id }], first: aboveNode });
              selectRef.current.hasSelection = false;
            }
          }
          if (isAbove || isBelow) {
            e.preventDefault();
            const { curDraggable } = getNodeOver({ x: clientX, y: clientY }, outline.current);
            const nodeDepth = outline.current.nodes.get(selectRef.current.node.depth);
            const selectedNode = nodeDepth ? nodeDepth.get(selectRef.current.node.id) : null;
            let aboveNode: OutlineNode | undefined | null = null;
            let belowNode: OutlineNode | undefined | null = null;
            if (isBelow) {
              aboveNode = selectedNode;
              belowNode = curDraggable;
            } else {
              aboveNode = curDraggable;
              belowNode = selectedNode;
            }
            if (aboveNode && belowNode) {
              const aboveDim = outline.current.dimensions.get(aboveNode.id);
              const belowDim = outline.current.dimensions.get(belowNode.id);
              if (aboveDim && belowDim) {
                const aboveDimBounds = getDimensions(aboveDim.entry);
                const belowDimBounds = getDimensions(belowDim.children ? belowDim.children : belowDim.entry);
                const aboveDimY = aboveDimBounds ? aboveDimBounds.bottom : 0;
                const belowDimY = belowDimBounds ? belowDimBounds.top : 0;
                const inbetweenNodes: Array<{ id: string }> = [];
                for (const [id, dimension] of outline.current.dimensions.entries()) {
                  if (id === aboveNode.id || id === belowNode.id) {
                    inbetweenNodes.push({ id });
                    continue;
                  }
                  const targetNodeBounds = getDimensions(dimension.entry);
                  if (targetNodeBounds) {
                    if (
                      Math.round(aboveDimY) <= Math.round(targetNodeBounds.top) &&
                      Math.round(belowDimY) >= Math.round(targetNodeBounds.bottom)
                    ) {
                      inbetweenNodes.push({ id });
                    }
                  }
                }
                const filteredNodes = inbetweenNodes.filter(n => {
                  const parent = outline.current.published.get(n.id);
                  if (parent) {
                    const foundParent = inbetweenNodes.find(c => c.id === parent);
                    if (foundParent) {
                      return false;
                    }
                  }
                  return true;
                });
                selectRef.current.hasSelection = true;
                setSelection({ nodes: filteredNodes, first: aboveNode });
              }
            }
          }
        }
      }
    }
  }, []);
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.addEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!root) {
    return null;
  }
  return (
    <>
      <GlobalTopNavbar onSaveProjectName={NOOP} projectID={null} name={null} />
      <DragContext.Provider
        value={{
          outline,
          impact,
          setImpact: data => {
            if (data) {
              const { zone, depth } = data;
              let listPosition = 65535;
              if (zone.above && zone.above.node.depth + 1 <= depth && zone.above.node.collapsed) {
                const aboveChildren = items
                  .filter(i => (zone.above ? i.parent === zone.above.node.id : false))
                  .sort((a, b) => a.position - b.position);
                const lastChild = aboveChildren[aboveChildren.length - 1];
                if (lastChild) {
                  listPosition = lastChild.position * 2.0;
                }
              } else {
                console.log(zone.above);
                console.log(zone.below);
                const correctNode = getCorrectNode(outline.current, zone.above ? zone.above.node : null, depth);
                console.log(correctNode);
                const listAbove = validateDepth(correctNode, depth);
                const listBelow = validateDepth(zone.below ? zone.below.node : null, depth);
                console.log(listAbove, listBelow);
                if (listAbove && listBelow) {
                  listPosition = (listAbove.position + listBelow.position) / 2.0;
                } else if (listAbove && !listBelow) {
                  listPosition = listAbove.position * 2.0;
                } else if (!listAbove && listBelow) {
                  listPosition = listBelow.position / 2.0;
                }
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
          clearNodeDimensions: nodeID => {
            outline.current.dimensions.delete(nodeID);
          },
        }}
      >
        <>
          <PageContainer>
            <PageContent>
              <RootWrapper ref={$content}>
                <Entry
                  onStartSelect={({ id, depth }) => {
                    setSelection(null);
                    setSelecting({ isSelecting: true, node: { id, depth } });
                  }}
                  onToggleCollapse={(id, collapsed) => {
                    setItems(prevItems =>
                      produce(prevItems, draftItems => {
                        const idx = prevItems.findIndex(c => c.id === id);
                        if (idx !== -1) {
                          draftItems[idx].collapsed = collapsed;
                        }
                      }),
                    );
                  }}
                  id="root"
                  parentID="root"
                  isRoot
                  selection={selection ? selection.nodes : null}
                  draggedNodes={dragging.draggedNodes}
                  position={root.position}
                  entries={root.children}
                  onCancelDrag={() => {
                    setImpact(null);
                    setDragging({ show: false, draggedNodes: null, initialPos: { x: 0, y: 0 } });
                  }}
                  onStartDrag={e => {
                    if (e.id !== 'root') {
                      if (selectRef.current.hasSelection && selection && selection.nodes.find(c => c.id === e.id)) {
                        setImpact(null);
                        setDragging({
                          show: true,
                          draggedNodes: [...selection.nodes.map(c => c.id)],
                          initialPos: { x: e.clientX, y: e.clientY },
                        });
                      } else {
                        setImpact(null);
                        setDragging({ show: true, draggedNodes: [e.id], initialPos: { x: e.clientX, y: e.clientY } });
                      }
                    }
                  }}
                />
              </RootWrapper>
            </PageContent>
          </PageContainer>
          {dragging.show && dragging.draggedNodes && (
            <Dragger
              container={$content}
              initialPos={dragging.initialPos}
              draggedNodes={{ nodes: dragging.draggedNodes, first: selection ? selection.first : null }}
              isDragging={dragging.show}
              onDragEnd={() => {
                if (dragging.draggedNodes && impactRef.current) {
                  const { zone, depth, listPosition } = impactRef.current;
                  const noZone = !zone.above && !zone.below;
                  if (!noZone) {
                    let parentID = 'root';
                    if (zone.above) {
                      parentID = zone.above.node.ancestors[depth - 1];
                    }
                    let reparent = true;
                    for (let i = 0; i < dragging.draggedNodes.length; i++) {
                      const draggedID = dragging.draggedNodes[i];
                      const prevItem = items.find(i => i.id === draggedID);
                      if (prevItem && prevItem.position === listPosition && prevItem.parent === parentID) {
                        reparent = false;
                        break;
                      }
                    }
                    // TODO: set reparent if list position changed but parent did not
                    //

                    if (reparent) {
                      // UPDATE OUTLINE DATA AFTER NODE MOVE
                      setItems(itemsPrev =>
                        produce(itemsPrev, draftItems => {
                          if (dragging.draggedNodes) {
                            const command: OutlineCommand = { nodes: [] };
                            outlineHistory.current.current += 1;
                            dragging.draggedNodes.forEach(n => {
                              const curDragging = itemsPrev.findIndex(i => i.id === n);
                              command.nodes.push({
                                id: n,
                                prev: {
                                  parent: draftItems[curDragging].parent,
                                  position: draftItems[curDragging].position,
                                },
                                next: {
                                  parent: parentID,
                                  position: listPosition,
                                },
                              });
                              draftItems[curDragging].parent = parentID;
                              draftItems[curDragging].position = listPosition;
                            });
                            outlineHistory.current.commands[outlineHistory.current.current] = command;
                            if (outlineHistory.current.commands[outlineHistory.current.current + 1]) {
                              outlineHistory.current.commands.splice(outlineHistory.current.current + 1);
                            }
                          }
                        }),
                      );
                    }
                  }
                }
                setImpact(null);
                setDragging({ show: false, draggedNodes: null, initialPos: { x: 0, y: 0 } });
              }}
            />
          )}
        </>
      </DragContext.Provider>
      {impact && <DragIndicator depthTarget={impact.depthTarget} container={$content} zone={impact.zone} />}
      {impact && (
        <DragDebug zone={impact.zone ?? null} draggedNodes={dragging.draggedNodes} depthTarget={impact.depthTarget} />
      )}
    </>
  );
};

export default Outline;
