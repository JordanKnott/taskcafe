import {
  getSortedDraggables,
  isPositionChanged,
  getNewDraggablePosition,
  getAfterDropDraggableList,
} from 'shared/utils/draggables';
import { DropResult } from 'react-beautiful-dnd';

type OnChecklistDropFn = (checklist: TaskChecklist) => void;
type OnChecklistItemDropFn = (prevChecklistID: string, checklistID: string, checklistItem: TaskChecklistItem) => void;

const onDragEnd = (
  { draggableId, source, destination, type }: DropResult,
  task: Task,
  onChecklistDrop: OnChecklistDropFn,
  onChecklistItemDrop: OnChecklistItemDropFn,
) => {
  if (typeof destination === 'undefined') return;
  if (!isPositionChanged(source, destination)) return;

  const isChecklist = type === 'checklist';
  const isSameChecklist = destination.droppableId === source.droppableId;
  let droppedDraggable: DraggableElement | null = null;
  let beforeDropDraggables: Array<DraggableElement> | null = null;

  if (!task.checklists) return;
  if (isChecklist) {
    const droppedGroup = task.checklists.find(taskGroup => taskGroup.id === draggableId);
    if (droppedGroup) {
      droppedDraggable = {
        id: draggableId,
        position: droppedGroup.position,
      };
      beforeDropDraggables = getSortedDraggables(
        task.checklists.map(checklist => {
          return { id: checklist.id, position: checklist.position };
        }),
      );
      if (droppedDraggable === null || beforeDropDraggables === null) {
        throw new Error('before drop draggables is null');
      }
      const afterDropDraggables = getAfterDropDraggableList(
        beforeDropDraggables,
        droppedDraggable,
        isChecklist,
        isSameChecklist,
        destination,
      );
      const newPosition = getNewDraggablePosition(afterDropDraggables, destination.index);
      onChecklistDrop({ ...droppedGroup, position: newPosition });
    } else {
      throw new Error('task group can not be found');
    }
  } else {
    const targetChecklist = task.checklists.findIndex(
      checklist => checklist.items.findIndex(item => item.id === draggableId) !== -1,
    );
    const droppedChecklistItem = task.checklists[targetChecklist].items.find(item => item.id === draggableId);

    if (droppedChecklistItem) {
      droppedDraggable = {
        id: draggableId,
        position: droppedChecklistItem.position,
      };
      beforeDropDraggables = getSortedDraggables(
        task.checklists[targetChecklist].items.map(item => {
          return { id: item.id, position: item.position };
        }),
      );
      if (droppedDraggable === null || beforeDropDraggables === null) {
        throw new Error('before drop draggables is null');
      }
      const afterDropDraggables = getAfterDropDraggableList(
        beforeDropDraggables,
        droppedDraggable,
        isChecklist,
        isSameChecklist,
        destination,
      );
      const newPosition = getNewDraggablePosition(afterDropDraggables, destination.index);
      const newItem = {
        ...droppedChecklistItem,
        position: newPosition,
      };
      onChecklistItemDrop(droppedChecklistItem.taskChecklistID, destination.droppableId, newItem);
    }
  }
};

export default onDragEnd;
