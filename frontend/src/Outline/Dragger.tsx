import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { DotCircle } from 'shared/icons';
import { findNextDraggable, getDimensions, getTargetDepth, getNodeAbove, getBelowParent, findNodeAbove } from './utils';
import { useDrag } from './useDrag';

type DraggerProps = {
  container: React.RefObject<HTMLDivElement>;
  draggingID: string;
  isDragging: boolean;
  onDragEnd: (zone: ImpactZone) => void;
  initialPos: { x: number; y: number };
};

const Dragger: React.FC<DraggerProps> = ({ draggingID, container, onDragEnd, isDragging, initialPos }) => {
  const [pos, setPos] = useState<{ x: number; y: number }>(initialPos);
  const { outline, impact, setImpact } = useDrag();
  const $handle = useRef<HTMLDivElement>(null);
  const handleMouseUp = useCallback(() => {
    onDragEnd(impact ? impact.zone : { below: null, above: null });
  }, [impact]);
  const handleMouseMove = useCallback(
    e => {
      e.preventDefault();
      const { clientX, clientY, pageX, pageY } = e;
      console.log(clientX, clientY);
      setPos({ x: clientX, y: clientY });
      let curDepth = 1;
      let curDraggables: any;
      let prevDraggable: any;
      let curDraggable: any;
      let depthTarget = 1;
      let curPosition: ImpactPosition = 'after';

      // get hovered over node
      // decide if node is bottom or top
      // calculate the missing node, if it exists
      // calculate available depth
      // calulcate current selected depth

      while (outline.current.nodes.size + 1 > curDepth) {
        curDraggables = outline.current.nodes.get(curDepth);
        if (curDraggables) {
          const nextDraggable = findNextDraggable({ x: clientX, y: clientY }, outline.current, curDepth, draggingID);
          if (nextDraggable) {
            prevDraggable = curDraggable;
            curDraggable = nextDraggable.node;
            curPosition = nextDraggable.position;
            if (nextDraggable.found) {
              break;
            }
            curDepth += 1;
          } else {
            break;
          }
        }
      }
      let aboveNode: null | OutlineNode = null;
      let belowNode: null | OutlineNode = null;

      if (curPosition === 'before') {
        belowNode = curDraggable;
      } else {
        aboveNode = curDraggable;
      }

      // if belowNode has the depth of 1, then the above element will be a part of a different branch

      const { relationships, nodes } = outline.current;
      if (belowNode) {
        aboveNode = findNodeAbove(outline.current, curDepth, belowNode);
      } else if (aboveNode) {
        let targetBelowNode: RelationshipChild | null = null;
        const parent = relationships.get(aboveNode.parent);
        if (aboveNode.children !== 0) {
          const abr = relationships.get(aboveNode.id);
          if (abr) {
            const newTarget = abr.children[0];
            if (newTarget) {
              targetBelowNode = newTarget;
            }
          }
        } else if (parent) {
          const aboveNodeIndex = parent.children.findIndex(c => aboveNode && c.id === aboveNode.id);
          if (aboveNodeIndex !== -1) {
            if (aboveNodeIndex === parent.children.length - 1) {
              targetBelowNode = getBelowParent(aboveNode, outline.current);
            } else {
              const nextChild = parent.children[aboveNodeIndex + 1];
              targetBelowNode = nextChild ?? null;
            }
          }
        }
        if (targetBelowNode) {
          const depthNodes = nodes.get(targetBelowNode.depth);
          if (depthNodes) {
            belowNode = depthNodes.get(targetBelowNode.id) ?? null;
          }
        }
      }

      // if outside outline, get either first or last item in list based on mouse Y
      if (!aboveNode && !belowNode) {
        if (container && container.current) {
          const bounds = container.current.getBoundingClientRect();
          if (clientY < bounds.top + bounds.height / 2) {
            const rootChildren = outline.current.relationships.get('root');
            const rootDepth = outline.current.nodes.get(1);
            if (rootChildren && rootDepth) {
              const firstChild = rootChildren.children[0];
              belowNode = rootDepth.get(firstChild.id) ?? null;
              aboveNode = null;
            }
          } else {
            const rootChildren = outline.current.relationships.get('root');
            const rootDepth = outline.current.nodes.get(1);
            if (rootChildren && rootDepth) {
              const lastChild = rootChildren.children[rootChildren.children.length - 1];
              aboveNode = rootDepth.get(lastChild.id) ?? null;
            }
          }
        }
      }

      if (aboveNode && aboveNode.id === draggingID) {
        belowNode = aboveNode;
        aboveNode = findNodeAbove(outline.current, aboveNode.depth, aboveNode);
      }

      // calculate available depths

      let minDepth = 1;
      let maxDepth = 2;
      if (aboveNode) {
        const aboveParent = relationships.get(aboveNode.parent);
        if (aboveNode.children !== 0) {
          minDepth = aboveNode.depth + 1;
          maxDepth = aboveNode.depth + 1;
        } else if (aboveParent) {
          minDepth = aboveNode.depth;
          maxDepth = aboveNode.depth + 1;
          const aboveNodeIndex = aboveParent.children.findIndex(c => aboveNode && c.id === aboveNode.id);
          if (aboveNodeIndex === aboveParent.children.length - 1) {
            minDepth = belowNode ? belowNode.depth : minDepth;
          }
        }
      }
      if (aboveNode) {
        const dimensions = outline.current.dimensions.get(aboveNode.id);
        const entry = getDimensions(dimensions?.entry);
        if (entry) {
          depthTarget = getTargetDepth(clientX, entry.left, { min: minDepth, max: maxDepth });
        }
      }

      let aboveImpact: null | ImpactZoneData = null;
      let belowImpact: null | ImpactZoneData = null;
      if (aboveNode) {
        const aboveDim = outline.current.dimensions.get(aboveNode.id);
        if (aboveDim) {
          aboveImpact = {
            node: aboveNode,
            dimensions: aboveDim,
          };
        }
      }
      if (belowNode) {
        const belowDim = outline.current.dimensions.get(belowNode.id);
        if (belowDim) {
          belowImpact = {
            node: belowNode,
            dimensions: belowDim,
          };
        }
      }

      setImpact({
        zone: {
          above: aboveImpact,
          below: belowImpact,
        },
        depth: depthTarget,
      });
    },
    [outline.current.nodes],
  );
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  const styles = useMemo(() => {
    const position: 'absolute' | 'relative' = isDragging ? 'absolute' : 'relative';
    return {
      cursor: isDragging ? '-webkit-grabbing' : '-webkit-grab',
      transform: `translate(${pos.x - 10}px, ${pos.y - 4}px)`,
      transition: isDragging ? 'none' : 'transform 500ms',
      zIndex: isDragging ? 2 : 1,
      position,
    };
  }, [isDragging, pos]);

  return (
    <>
      {pos && (
        <div ref={$handle} style={styles}>
          <DotCircle width={18} height={18} />
        </div>
      )}
    </>
  );
};

export default Dragger;
