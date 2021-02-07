import React, { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { Dot } from 'shared/icons';
import styled from 'styled-components';
import {
  findNextDraggable,
  getDimensions,
  getTargetDepth,
  getNodeAbove,
  getBelowParent,
  findNodeAbove,
  getNodeOver,
  getLastChildInBranch,
  findNodeDepth,
} from './utils';
import { useDrag } from './useDrag';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: rgba(${p => p.theme.colors.primary});
  svg {
    fill: rgba(${p => p.theme.colors.text.primary});
    stroke: rgba(${p => p.theme.colors.text.primary});
  }
`;

type DraggerProps = {
  container: React.RefObject<HTMLDivElement>;
  draggedNodes: { nodes: Array<string>; first?: OutlineNode | null };
  isDragging: boolean;
  onDragEnd: (zone: ImpactZone) => void;
  initialPos: { x: number; y: number };
  pageRef: React.RefObject<HTMLDivElement>;
};

let timer: any = null;

type windowScrollOptions = {
  maxScrollX: number;
  maxScrollY: number;
  isInTopEdge: boolean;
  isInBottomEdge: boolean;
  edgeTop: number;
  edgeBottom: number;
  edgeSize: number;
  viewportY: number;
  $page: React.RefObject<HTMLDivElement>;
};
function adjustWindowScroll({
  maxScrollY,
  maxScrollX,
  $page,
  isInTopEdge,
  isInBottomEdge,
  edgeTop,
  edgeBottom,
  edgeSize,
  viewportY,
}: windowScrollOptions) {
  // Get the current scroll position of the document.
  if ($page.current) {
    var currentScrollX = $page.current.scrollLeft;
    var currentScrollY = $page.current.scrollTop;

    // Determine if the window can be scrolled in any particular direction.
    var canScrollUp = currentScrollY > 0;
    var canScrollDown = currentScrollY < maxScrollY;

    // Since we can potentially scroll in two directions at the same time,
    // let's keep track of the next scroll, starting with the current scroll.
    // Each of these values can then be adjusted independently in the logic
    // below.
    var nextScrollX = currentScrollX;
    var nextScrollY = currentScrollY;

    // As we examine the mouse position within the edge, we want to make the
    // incremental scroll changes more "intense" the closer that the user
    // gets the viewport edge. As such, we'll calculate the percentage that
    // the user has made it "through the edge" when calculating the delta.
    // Then, that use that percentage to back-off from the "max" step value.
    var maxStep = 50;

    // Should we scroll up?
    if (isInTopEdge && canScrollUp) {
      var intensity = (edgeTop - viewportY) / edgeSize;

      nextScrollY = nextScrollY - maxStep * intensity;

      // Should we scroll down?
    } else if (isInBottomEdge && canScrollDown) {
      var intensity = (viewportY - edgeBottom) / edgeSize;

      nextScrollY = nextScrollY + maxStep * intensity;
    }

    // Sanitize invalid maximums. An invalid scroll offset won't break the
    // subsequent .scrollTo() call; however, it will make it harder to
    // determine if the .scrollTo() method should have been called in the
    // first place.
    nextScrollX = Math.max(0, Math.min(maxScrollX, nextScrollX));
    nextScrollY = Math.max(0, Math.min(maxScrollY, nextScrollY));

    if (nextScrollX !== currentScrollX || nextScrollY !== currentScrollY) {
      $page.current.scrollTo(nextScrollX, nextScrollY);
      return true;
    } else {
      return false;
    }
  }
}

const Dragger: React.FC<DraggerProps> = ({
  draggedNodes,
  container,
  onDragEnd,
  isDragging,
  initialPos,
  pageRef: $page,
}) => {
  const [pos, setPos] = useState<{ x: number; y: number }>(initialPos);
  const { outline, impact, setImpact } = useDrag();
  const $handle = useRef<HTMLDivElement>(null);
  const handleMouseUp = useCallback(() => {
    onDragEnd(impact ? impact.zone : { below: null, above: null });
  }, [impact]);
  const handleMouseMove = useCallback(
    e => {
      var t0 = performance.now();

      e.preventDefault();
      const { clientX, clientY, pageX, pageY } = e;
      setPos({ x: clientX, y: clientY });
      const { curDepth, curPosition, curDraggable } = getNodeOver({ x: clientX, y: clientY }, outline.current);
      let depthTarget: number = 0;
      let aboveNode: null | OutlineNode = null;
      let belowNode: null | OutlineNode = null;

      const edgeSize = 50;

      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = document.documentElement.clientHeight;

      var edgeTop = edgeSize + 80;
      var edgeBottom = viewportHeight - edgeSize;

      var isInTopEdge = clientY < edgeTop;
      var isInBottomEdge = clientY > edgeBottom;

      if ((isInBottomEdge || isInTopEdge) && $page.current) {
        var documentWidth = Math.max(
          $page.current.scrollWidth,
          $page.current.offsetWidth,
          $page.current.clientWidth,
          $page.current.scrollWidth,
          $page.current.offsetWidth,
          $page.current.clientWidth,
        );
        var documentHeight = Math.max(
          $page.current.scrollHeight,
          $page.current.offsetHeight,
          $page.current.clientHeight,
          $page.current.scrollHeight,
          $page.current.offsetHeight,
          $page.current.clientHeight,
        );

        var maxScrollX = documentWidth - viewportWidth;
        var maxScrollY = documentHeight - viewportHeight;

        (function checkForWindowScroll() {
          clearTimeout(timer);

          if (
            adjustWindowScroll({
              maxScrollX,
              maxScrollY,
              edgeBottom,
              $page,
              edgeTop,
              edgeSize,
              isInBottomEdge,
              isInTopEdge,
              viewportY: clientY,
            })
          ) {
            timer = setTimeout(checkForWindowScroll, 30);
          }
        })();
      } else {
        clearTimeout(timer);
      }

      if (curPosition === 'before') {
        belowNode = curDraggable;
      } else {
        aboveNode = curDraggable;
      }

      // if belowNode has the depth of 1, then the above element will be a part of a different branch

      const { relationships, nodes } = outline.current;
      if (!belowNode || !aboveNode) {
        if (belowNode) {
          aboveNode = findNodeAbove(outline.current, curDepth, belowNode);
        } else if (aboveNode) {
          let targetBelowNode: RelationshipChild | null = null;
          const parent = relationships.get(aboveNode.parent);
          if (aboveNode.children !== 0 && !aboveNode.collapsed) {
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
            // TODO: enhance to actually get last child item, not last top level branch
            const rootChildren = outline.current.relationships.get('root');
            const rootDepth = outline.current.nodes.get(1);
            if (rootChildren && rootDepth) {
              const lastChild = rootChildren.children[rootChildren.children.length - 1];
              const lastParentNode = rootDepth.get(lastChild.id) ?? null;

              if (lastParentNode) {
                const lastBranchChild = getLastChildInBranch(outline.current, lastParentNode);
                if (lastBranchChild) {
                  const lastChildDepth = outline.current.nodes.get(lastBranchChild.depth);
                  if (lastChildDepth) {
                    aboveNode = lastChildDepth.get(lastBranchChild.id) ?? null;
                  }
                }
              }
            }
          }
        }
      }

      if (aboveNode) {
        const foundDepth = findNodeDepth(outline.current.published, aboveNode.id);
        if (foundDepth === null) return;
        for (let i = 0; i < draggedNodes.nodes.length; i++) {
          const nodeID = draggedNodes.nodes[i];
          if (foundDepth.ancestors.find(c => c === nodeID)) {
            if (draggedNodes.first) {
              belowNode = draggedNodes.first;
              aboveNode = findNodeAbove(outline.current, aboveNode ? aboveNode.depth : 1, draggedNodes.first);
            } else {
              const foundDepth = findNodeDepth(outline.current.published, nodeID);
              if (foundDepth === null) return;
              const nodeDepth = outline.current.nodes.get(foundDepth.depth);
              const targetNode = nodeDepth ? nodeDepth.get(nodeID) : null;
              if (targetNode) {
                belowNode = targetNode;

                aboveNode = findNodeAbove(outline.current, foundDepth.depth, targetNode);
              }
            }
          }
        }
      }

      // calculate available depths

      let minDepth = 1;
      let maxDepth = 2;
      if (aboveNode) {
        const aboveParent = relationships.get(aboveNode.parent);
        if (aboveNode.children !== 0 && !aboveNode.collapsed) {
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
    const position: 'fixed' | 'relative' = isDragging ? 'fixed' : 'relative';
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
        <Container ref={$handle} style={styles}>
          <Dot width={18} height={18} />
        </Container>
      )}
    </>
  );
};

export default Dragger;
