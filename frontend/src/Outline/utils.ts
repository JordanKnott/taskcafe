import _ from 'lodash';

export function validateDepth(node: OutlineNode | null, depth: number) {
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
      if (targetParent.children.length === 0) {
        const parentNodes = outline.nodes.get(targetParent.self.depth);
        const parentNode = parentNodes ? parentNodes.get(targetParent.self.id) : null;
        if (parentNode) {
          nodeAbove = {
            id: parentNode.id,
            depth: parentNode.depth,
            position: parentNode.position,
            children: parentNode.children,
          };
        }
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

export function findNextDraggable(
  pos: { x: number; y: number },
  outline: OutlineData,
  curDepth: number,
  draggingID: string,
) {
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
