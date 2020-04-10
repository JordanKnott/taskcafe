import { moveItemWithinArray, insertItemIntoArray } from 'shared/utils/arrays';

export const getNewDraggablePosition = (afterDropDraggables: any, draggableIndex: any) => {
  const prevDraggable = afterDropDraggables[draggableIndex - 1];
  const nextDraggable = afterDropDraggables[draggableIndex + 1];
  if (!prevDraggable && !nextDraggable) {
    return 1;
  }
  if (!prevDraggable) {
    return nextDraggable.position - 1;
  }
  if (!nextDraggable) {
    return prevDraggable.position + 1;
  }
  const newPos = (prevDraggable.position + nextDraggable.position) / 2.0;
  return newPos;
};

export const getSortedDraggables = (draggables: any) => {
  return draggables.sort((a: any, b: any) => a.position - b.position);
};

export const isPositionChanged = (source: any, destination: any) => {
  if (!destination) return false;
  const isSameList = destination.droppableId === source.droppableId;
  const isSamePosition = destination.index === source.index;
  return !isSameList || !isSamePosition;
};

export const getAfterDropDraggableList = (
  beforeDropDraggables: any,
  droppedDraggable: any,
  isList: any,
  isSameList: any,
  destination: any,
) => {
  if (isList) {
    return moveItemWithinArray(beforeDropDraggables, droppedDraggable, destination.index);
  }
  return isSameList
    ? moveItemWithinArray(beforeDropDraggables, droppedDraggable, destination.index)
    : insertItemIntoArray(beforeDropDraggables, droppedDraggable, destination.index);
};
