import _ from 'lodash';

export function getCorrectNode(data: OutlineData, node: OutlineNode | null, depth: number) {
  if (node) {
    console.log(depth, node);
    if (depth === node.depth) {
      return node;
    }
    const parent = node.ancestors[depth];
    console.log('parent', parent);
    if (parent) {
      const parentNode = data.relationships.get(parent);
      if (parentNode) {
        const parentDepth = parentNode.self.depth;
        const nodeDepth = data.nodes.get(parentDepth);
        return nodeDepth ? nodeDepth.get(parent) : null;
      }
    }
  }
  return null;
}
export function validateDepth(node: OutlineNode | null | undefined, depth: number) {
  if (node) {
    return node.depth === depth ? node : null;
  }
  return null;
}

export function getNodeAbove(node: OutlineNode, startingParent: RelationshipChild, outline: OutlineData) {
  let hasChildren = true;
  let nodeAbove: null | RelationshipChild = null;
  let aboveTargetID = startingParent.id;
  while (hasChildren) {
    const targetParent = outline.relationships.get(aboveTargetID);
    if (targetParent) {
      const parentNodes = outline.nodes.get(targetParent.self.depth);
      const parentNode = parentNodes ? parentNodes.get(targetParent.self.id) : null;
      if (targetParent.children.length === 0) {
        if (parentNode) {
          nodeAbove = {
            id: parentNode.id,
            depth: parentNode.depth,
            position: parentNode.position,
            children: parentNode.children,
          };
          console.log('node above', nodeAbove);
        }
        hasChildren = false;
        continue;
      }
      nodeAbove = targetParent.children[targetParent.children.length - 1];
      if (targetParent.numberOfSubChildren === 0) {
        hasChildren = false;
      } else {
        aboveTargetID = nodeAbove.id;
      }
    } else {
      const target = outline.relationships.get(node.ancestors[0]);
      if (target) {
        const targetChild = target.children.find(i => i.id === aboveTargetID);
        if (targetChild) {
          nodeAbove = targetChild;
        }
        hasChildren = false;
      }
    }
  }
  console.log('final node above', nodeAbove);
  return nodeAbove;
}

export function getBelowParent(node: OutlineNode, outline: OutlineData) {
  const { relationships, nodes } = outline;
  const parentDepth = nodes.get(node.depth - 1);
  const parent = parentDepth ? parentDepth.get(node.parent) : null;
  if (parent) {
    const grandfather = relationships.get(parent.parent);
    if (grandfather) {
      const parentIndex = grandfather.children.findIndex(c => c.id === parent.id);
      if (parentIndex !== -1) {
        if (parentIndex === grandfather.children.length - 1) {
          const root = relationships.get(node.ancestors[0]);
          if (root) {
            const ancestorIndex = root.children.findIndex(c => c.id === node.ancestors[1]);
            if (ancestorIndex !== -1) {
              const nextAncestor = root.children[ancestorIndex + 1];
              if (nextAncestor) {
                return nextAncestor;
              }
            }
          }
        } else {
          const nextChild = grandfather.children[parentIndex + 1];
          if (nextChild) {
            return nextChild;
          }
        }
      }
    }
  }
  return null;
}

export function getDimensions(ref: React.RefObject<HTMLElement> | null | undefined) {
  if (ref && ref.current) {
    return ref.current.getBoundingClientRect();
  }
  return null;
}

export function getTargetDepth(mouseX: number, handleLeft: number, availableDepths: { min: number; max: number }) {
  if (mouseX > handleLeft) {
    return availableDepths.max;
  }
  let curDepth = availableDepths.max - 1;
  for (let x = availableDepths.min; x < availableDepths.max; x++) {
    const breakpoint = handleLeft - x * 35;
    // console.log(`mouseX=${mouseX} breakpoint=${breakpoint} x=${x} curDepth=${curDepth}`);
    if (mouseX > breakpoint) {
      return curDepth;
    }
    curDepth -= 1;
  }

  return availableDepths.min;
}

export function findNextDraggable(pos: { x: number; y: number }, outline: OutlineData, curDepth: number) {
  let index = 0;
  const currentDepthNodes = outline.nodes.get(curDepth);
  let nodeAbove: null | RelationshipChild = null;
  if (!currentDepthNodes) {
    return null;
  }
  for (const [id, node] of currentDepthNodes) {
    const dimensions = outline.dimensions.get(id);
    const target = dimensions ? getDimensions(dimensions.entry) : null;
    const children = dimensions ? getDimensions(dimensions.children) : null;
    if (target) {
      console.log(
        `[${id}] ${pos.y} <= ${target.bottom} = ${pos.y <= target.bottom} / ${pos.y} >= ${target.top} = ${pos.y >=
          target.top}`,
      );
      if (pos.y <= target.bottom && pos.y >= target.top) {
        const middlePoint = target.top + target.height / 2;
        const position: ImpactPosition = pos.y > middlePoint ? 'after' : 'before';
        return {
          found: true,
          node,
          position,
        };
      }
    }
    if (children) {
      console.log(
        `[${id}] ${pos.y} <= ${children.bottom} = ${pos.y <= children.bottom} / ${pos.y} >= ${children.top} = ${pos.y >=
          children.top}`,
      );
      if (pos.y <= children.bottom && pos.y >= children.top) {
        const position: ImpactPosition = 'after';
        return { found: false, node, position };
      }
    }
    index += 1;
  }
  return null;
}

export function transformToTree(arr: any) {
  const nodes: any = {};
  return arr.filter(function(obj: any) {
    var id = obj['id'],
      parentId = obj['parent'];

    nodes[id] = _.defaults(obj, nodes[id], { children: [] });
    parentId && (nodes[parentId] = nodes[parentId] || { children: [] })['children'].push(obj);

    return !parentId;
  });
}

export function findNode(parentID: string, nodeID: string, data: OutlineData) {
  const nodeRelations = data.relationships.get(parentID);
  if (nodeRelations) {
    const nodeDepth = data.nodes.get(nodeRelations.self.depth + 1);
    if (nodeDepth) {
      const node = nodeDepth.get(nodeID);
      return node ?? null;
    }
  }
  return null;
}

export function findNodeDepth(published: Map<string, string>, id: string) {
  let currentID = id;
  let breaker = 0;
  let depth = 0;
  let ancestors = [id];
  while (currentID !== 'root') {
    const nextID = published.get(currentID);
    if (nextID) {
      ancestors = [nextID, ...ancestors];
      currentID = nextID;
      depth += 1;
      breaker += 1;
      if (breaker > 100) {
        throw new Error('node depth breaker was thrown');
      }
    } else {
      throw new Error('unable to find nextID');
    }
  }
  return { depth, ancestors };
}

export function getNumberOfChildren(root: ItemElement, ancestors: Array<string>) {
  let currentBranch = root;
  for (let i = 1; i < ancestors.length; i++) {
    const nextBranch = currentBranch.children ? currentBranch.children.find(c => c.id === ancestors[i]) : null;
    if (nextBranch) {
      currentBranch = nextBranch;
    } else {
      throw new Error('unable to find next branch');
    }
  }
  return currentBranch.children ? currentBranch.children.length : 0;
}

export function findNodeAbove(outline: OutlineData, curDepth: number, belowNode: OutlineNode) {
  let targetAboveNode: null | RelationshipChild = null;
  if (curDepth === 1) {
    const relations = outline.relationships.get(belowNode.ancestors[0]);
    if (relations) {
      const parentIndex = relations.children.findIndex(n => belowNode && n.id === belowNode.ancestors[1]);
      if (parentIndex !== -1) {
        const aboveParent = relations.children[parentIndex - 1];
        if (parentIndex === 0) {
          targetAboveNode = null;
        } else {
          targetAboveNode = getNodeAbove(belowNode, aboveParent, outline);
        }
      }
    }
  } else {
    const relations = outline.relationships.get(belowNode.parent);
    if (relations) {
      const currentIndex = relations.children.findIndex(n => belowNode && n.id === belowNode.id);
      // is first child, so use parent
      if (currentIndex === 0) {
        const parentNodes = outline.nodes.get(belowNode.depth - 1);
        const parentNode = parentNodes ? parentNodes.get(belowNode.parent) : null;
        if (parentNode) {
          targetAboveNode = {
            id: belowNode.parent,
            depth: belowNode.depth - 1,
            position: parentNode.position,
            children: parentNode.children,
          };
        }
      } else if (currentIndex !== -1) {
        // is not first child, so first prev sibling
        const aboveParentNode = relations.children[currentIndex - 1];
        if (aboveParentNode) {
          targetAboveNode = getNodeAbove(belowNode, aboveParentNode, outline);
          if (targetAboveNode === null) {
            targetAboveNode = aboveParentNode;
          }
        }
      }
    }
  }
  if (targetAboveNode) {
    const depthNodes = outline.nodes.get(targetAboveNode.depth);
    if (depthNodes) {
      return depthNodes.get(targetAboveNode.id) ?? null;
    }
  }
  return null;
}

export function getNodeOver(mouse: { x: number; y: number }, outline: OutlineData) {
  let curDepth = 1;
  let curDraggables: any;
  let curDraggable: any;
  let curPosition: ImpactPosition = 'after';
  while (outline.nodes.size + 1 > curDepth) {
    curDraggables = outline.nodes.get(curDepth);
    if (curDraggables) {
      const nextDraggable = findNextDraggable(mouse, outline, curDepth);
      if (nextDraggable) {
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
  return {
    curDepth,
    curDraggable,
    curPosition,
  };
}

export function findCommonParent(outline: OutlineData, aboveNode: OutlineNode, belowNode: OutlineNode) {
  let aboveParentID = null;
  let depth = 0;
  for (let aIdx = aboveNode.ancestors.length - 1; aIdx !== 0; aIdx--) {
    depth = aIdx;
    const aboveNodeParent = aboveNode.ancestors[aIdx];
    for (let bIdx = belowNode.ancestors.length - 1; bIdx !== 0; bIdx--) {
      if (belowNode.ancestors[bIdx] === aboveNodeParent) {
        aboveParentID = aboveNodeParent;
      }
    }
  }
  if (aboveParentID) {
    const parent = outline.relationships.get(aboveParentID) ?? null;
    if (parent) {
      return {
        parent,
        depth,
      };
    }
    return null;
  }
  return null;
}

export function getLastChildInBranch(outline: OutlineData, lastParentNode: OutlineNode) {
  let curParentRelation = outline.relationships.get(lastParentNode.id);
  if (!curParentRelation) {
    return { id: lastParentNode.id, depth: 1 };
  }
  let hasChildren = lastParentNode.children !== 0;
  let depth = 1;
  let finalID: null | string = null;
  while (hasChildren) {
    if (curParentRelation) {
      const lastChild = curParentRelation.children.sort((a, b) => a.position - b.position)[
        curParentRelation.children.length - 1
      ];
      depth += 1;
      if (lastChild.children === 0) {
        finalID = lastChild.id;
        break;
      }
      curParentRelation = outline.relationships.get(lastChild.id);
    } else {
      hasChildren = false;
    }
  }
  if (finalID !== null) {
    return { id: finalID, depth };
  }
  return null;
}
