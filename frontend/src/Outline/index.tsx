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
  PageNameContent,
  PageNameText,
  PageName,
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
  getNodeAbove,
  findNodeAbove,
} from './utils';
import NOOP from 'shared/utils/noop';

enum CommandType {
  MOVE,
  MERGE,
  CHANGE_TEXT,
  DELETE,
  CREATE,
}

type MoveData = {
  prev: { position: number; parent: string | null };
  next: { position: number; parent: string | null };
};

type ChangeTextData = {
  node: {
    id: string;
    parentID: string;
    position: number;
  };
  caret: number;
  prev: string;
  next: string;
};

type DeleteData = {
  node: {
    id: string;
    parentID: string;
    position: number;
    text: string;
  };
};

type OutlineCommand = {
  nodes: Array<{
    id: string;
    type: CommandType;
    data: MoveData | DeleteData | ChangeTextData;
  }>;
};

type ItemCollapsed = {
  id: string;
  collapsed: boolean;
};

function generateItems(c: number) {
  const items: Array<ItemElement> = [];
  for (let i = 0; i < c; i++) {
    items.push({
      collapsed: false,
      focus: null,
      id: `entry-gen-${i}`,
      text: `entry-gen-${i}`,
      parent: 'root',
      position: 4096 * (6 + i),
    });
  }
  return items;
}

const listItems: Array<ItemElement> = [
  { id: 'root', text: '', position: 4096, parent: null, collapsed: false, focus: null },
  { id: 'entry-1', text: 'entry-1', position: 4096, parent: 'root', collapsed: false, focus: null },
  { id: 'entry-1-3', text: 'entry-1-3', position: 4096 * 3, parent: 'entry-1', collapsed: false, focus: null },
  { id: 'entry-1-3-1', text: 'entry-1-3-1', position: 4096, parent: 'entry-1-3', collapsed: false, focus: null },
  { id: 'entry-1-3-2', text: 'entry-1-3-2', position: 4096 * 2, parent: 'entry-1-3', collapsed: false, focus: null },
  { id: 'entry-1-3-3', text: 'entry-1-3-3', position: 4096 * 3, parent: 'entry-1-3', collapsed: false, focus: null },
  {
    id: 'entry-1-3-3-1',
    text: '*Hello!* I am `doing super` well ~how~ are **you**?',
    position: 4096 * 1,
    parent: 'entry-1-3-3',
    collapsed: false,
    focus: null,
  },
  {
    id: 'entry-1-3-3-1-1',
    text: 'entry-1-3-3-1-1',
    position: 4096 * 1,
    parent: 'entry-1-3-3-1',
    collapsed: false,
    focus: null,
  },
  { id: 'entry-2', text: 'entry-2', position: 4096 * 2, parent: 'root', collapsed: false, focus: null },
  { id: 'entry-3', text: 'entry-3', position: 4096 * 3, parent: 'root', collapsed: false, focus: null },
  { id: 'entry-4', text: 'entry-4', position: 4096 * 4, parent: 'root', collapsed: false, focus: null },
  { id: 'entry-5', text: 'entry-5', position: 4096 * 5, parent: 'root', collapsed: false, focus: null },
  ...generateItems(100),
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
      const foundDepth = findNodeDepth(outline.current.published, id);
      if (foundDepth === null) {
        continue;
      }
      const { depth, ancestors } = foundDepth;
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
              if (node.type === CommandType.MOVE) {
                if (idx === -1) return;
                const data = node.data as MoveData;
                draftItems[idx].parent = data.prev.parent;
                draftItems[idx].position = data.prev.position;
              } else if (node.type === CommandType.CHANGE_TEXT) {
                if (idx === -1) return;
                const data = node.data as ChangeTextData;
                draftItems[idx] = produce(prevItems[idx], draftItem => {
                  draftItem.text = data.prev;
                  draftItem.focus = { caret: data.caret };
                });
              } else if (node.type === CommandType.DELETE) {
                const data = node.data as DeleteData;
                draftItems.push({
                  id: data.node.id,
                  position: data.node.position,
                  parent: data.node.parentID,
                  text: '',
                  focus: { caret: null },
                  children: [],
                  collapsed: false,
                });
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
                if (node.type === CommandType.MOVE) {
                  const data = node.data as MoveData;
                  draftItems[idx].parent = data.next.parent;
                  draftItems[idx].position = data.next.position;
                }
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

  const $page = useRef<HTMLDivElement>(null);
  const $pageName = useRef<HTMLDivElement>(null);
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
                const correctNode = getCorrectNode(outline.current, zone.above ? zone.above.node : null, depth);
                const listAbove = validateDepth(correctNode, depth);
                const listBelow = validateDepth(zone.below ? zone.below.node : null, depth);
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
          <PageContainer ref={$page}>
            <PageContent>
              <RootWrapper ref={$content}>
                <PageName>
                  <PageNameContent ref={$pageName}>
                    <PageNameText>entry-1-3-1</PageNameText>
                  </PageNameContent>
                </PageName>
                <Entry
                  onDepthChange={(id, parentID, position, depth, depthDelta) => {
                    if (depthDelta === -1) {
                      const parentRelation = outline.current.relationships.get(parentID);
                      if (parentRelation) {
                        const nodeIdx = parentRelation.children
                          .sort((a, b) => a.position - b.position)
                          .findIndex(c => c.id === id);
                        if (parentRelation.children.length !== 0) {
                          const grandparent = outline.current.published.get(parentID);
                          if (grandparent) {
                            const grandparentNode = outline.current.relationships.get(grandparent);
                            if (grandparentNode) {
                              const parents = grandparentNode.children.sort((a, b) => a.position - b.position);
                              const parentIdx = parents.findIndex(c => c.id === parentID);
                              if (parentIdx === -1) return;
                              let position = parents[parentIdx].position * 2;
                              const nextParent = parents[parentIdx + 1];
                              if (nextParent) {
                                position = (parents[parentIdx].position + nextParent.position) / 2.0;
                              }
                              setItems(prevItems =>
                                produce(prevItems, draftItems => {
                                  const idx = prevItems.findIndex(c => c.id === id);
                                  draftItems[idx] = produce(prevItems[idx], draftItem => {
                                    draftItem.parent = grandparent;
                                    draftItem.position = position;
                                    draftItem.focus = { caret: 0 };
                                  });
                                }),
                              );
                            }
                          }
                        }
                      }
                    } else {
                      const parent = outline.current.relationships.get(parentID);
                      if (parent) {
                        const nodeIdx = parent.children
                          .sort((a, b) => a.position - b.position)
                          .findIndex(c => c.id === id);
                        const aboveNode = parent.children[nodeIdx - 1];
                        if (aboveNode) {
                          const aboveNodeRelations = outline.current.relationships.get(aboveNode.id);
                          let position = 65535;
                          if (aboveNodeRelations) {
                            const children = aboveNodeRelations.children.sort((a, b) => a.position - b.position);
                            if (children.length !== 0) {
                              position = children[children.length - 1].position * 2;
                            }
                          }
                          setItems(prevItems =>
                            produce(prevItems, draftItems => {
                              const idx = prevItems.findIndex(c => c.id === id);
                              draftItems[idx] = produce(prevItems[idx], draftItem => {
                                draftItem.parent = aboveNode.id;
                                draftItem.position = position;
                                draftItem.focus = { caret: 0 };
                              });
                            }),
                          );
                        }
                      }
                    }
                  }}
                  onTextChange={(id, prev, next, caret) => {
                    outlineHistory.current.current += 1;
                    const data: ChangeTextData = {
                      node: {
                        id,
                        position: 0,
                        parentID: '',
                      },
                      caret,
                      prev,
                      next,
                    };
                    const command: OutlineCommand = {
                      nodes: [
                        {
                          id,
                          type: CommandType.CHANGE_TEXT,
                          data,
                        },
                      ],
                    };
                    outlineHistory.current.commands[outlineHistory.current.current] = command;
                    if (outlineHistory.current.commands[outlineHistory.current.current + 1]) {
                      outlineHistory.current.commands.splice(outlineHistory.current.current + 1);
                    }
                    setItems(prevItems =>
                      produce(prevItems, draftItems => {
                        const idx = prevItems.findIndex(c => c.id === id);
                        if (idx !== -1) {
                          draftItems[idx] = produce(prevItems[idx], draftItem => {
                            draftItem.text = next;
                          });
                        }
                      }),
                    );
                  }}
                  text=""
                  autoFocus={null}
                  onDeleteEntry={(depth, id, text, caretPos) => {
                    const nodeDepth = outline.current.nodes.get(depth);
                    if (nodeDepth) {
                      const node = nodeDepth.get(id);
                      if (node) {
                        const nodeAbove = findNodeAbove(outline.current, depth, node);
                        setItems(prevItems => {
                          return produce(prevItems, draftItems => {
                            draftItems = prevItems.filter(c => c.id !== id);
                            const idx = prevItems.findIndex(c => c.id === nodeAbove?.id);
                            if (idx !== -1) {
                              draftItems[idx] = produce(prevItems[idx], draftItem => {
                                draftItem.focus = { caret: draftItem.text.length };
                                const cType = CommandType.DELETE;
                                const data: DeleteData = {
                                  node: {
                                    id,
                                    position: node.position,
                                    parentID: node.parent,
                                    text: '',
                                  },
                                };
                                if (text !== '') {
                                  draftItem.text += text;
                                }

                                const command: OutlineCommand = {
                                  nodes: [
                                    {
                                      id,
                                      type: cType,
                                      data,
                                    },
                                  ],
                                };
                                outlineHistory.current.current += 1;
                                outlineHistory.current.commands[outlineHistory.current.current] = command;
                                if (outlineHistory.current.commands[outlineHistory.current.current + 1]) {
                                  outlineHistory.current.commands.splice(outlineHistory.current.current + 1);
                                }
                              });
                            }
                            return draftItems;
                          });
                        });
                      }
                    }
                  }}
                  onCreateEntry={(parent, position) => {
                    setItems(prevItems =>
                      produce(prevItems, draftItems => {
                        draftItems.push({
                          id: '' + Math.random(),
                          collapsed: false,
                          position,
                          text: '',
                          focus: {
                            caret: null,
                          },
                          parent,
                          children: [],
                        });
                      }),
                    );
                  }}
                  onNodeFocused={id => {
                    setItems(prevItems =>
                      produce(prevItems, draftItems => {
                        const idx = draftItems.findIndex(c => c.id === id);
                        draftItems[idx] = produce(draftItems[idx], draftItem => {
                          draftItem.focus = null;
                        });
                      }),
                    );
                  }}
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
                  onHandleClick={id => {}}
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
              pageRef={$page}
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
                                type: CommandType.MOVE,
                                data: {
                                  prev: {
                                    parent: draftItems[curDragging].parent,
                                    position: draftItems[curDragging].position,
                                  },
                                  next: {
                                    parent: parentID,
                                    position: listPosition,
                                  },
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
