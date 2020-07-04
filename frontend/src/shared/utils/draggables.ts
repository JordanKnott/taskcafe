import { DraggableLocation } from 'react-beautiful-dnd';

export const moveItemWithinArray = (arr: Array<DraggableElement>, item: DraggableElement, newIndex: number) => {
  const arrClone = [...arr];
  const oldIndex = arrClone.findIndex(i => i.id === item.id);
  arrClone.splice(newIndex, 0, arrClone.splice(oldIndex, 1)[0]);
  return arrClone;
};

export const insertItemIntoArray = (arr: Array<DraggableElement>, item: DraggableElement, index: number) => {
  const arrClone = [...arr];
  arrClone.splice(index, 0, item);
  return arrClone;
};

export const updateArrayItemById = (arr: Array<DraggableElement>, itemId: string, fields: any) => {
  const arrClone = [...arr];
  const item = arrClone.find(({ id }) => id === itemId);
  if (item) {
    const itemIndex = arrClone.indexOf(item);
    arrClone.splice(itemIndex, 1, { ...item, ...fields });
  }
  return arrClone;
};

export const getNewDraggablePosition = (afterDropDraggables: Array<DraggableElement>, draggableIndex: number) => {
  const prevDraggable = afterDropDraggables[draggableIndex - 1];
  const nextDraggable = afterDropDraggables[draggableIndex + 1];
  if (!prevDraggable && !nextDraggable) {
    return 65535;
  }
  if (!prevDraggable) {
    return nextDraggable.position / 2.0;
  }
  if (!nextDraggable) {
    return prevDraggable.position * 2.0;
  }
  const newPos = (prevDraggable.position + nextDraggable.position) / 2.0;
  return newPos;
};

export const getSortedDraggables = (draggables: Array<DraggableElement>) => {
  return draggables.sort((a: any, b: any) => a.position - b.position);
};

export const isPositionChanged = (source: DraggableLocation, destination: DraggableLocation) => {
  if (!destination) return false;
  const isSameList = destination.droppableId === source.droppableId;
  const isSamePosition = destination.index === source.index;
  return !isSameList || !isSamePosition;
};

export const getAfterDropDraggableList = (
  beforeDropDraggables: Array<DraggableElement>,
  droppedDraggable: DraggableElement,
  isList: boolean,
  isSameList: boolean,
  destination: DraggableLocation,
) => {
  if (isList) {
    return moveItemWithinArray(beforeDropDraggables, droppedDraggable, destination.index);
  }
  return isSameList
    ? moveItemWithinArray(beforeDropDraggables, droppedDraggable, destination.index)
    : insertItemIntoArray(beforeDropDraggables, droppedDraggable, destination.index);
};
