import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import List, { ListCards } from 'shared/components/List';
import Card from 'shared/components/Card';
import CardComposer from 'shared/components/CardComposer';
import AddList from 'shared/components/AddList';
import log from 'loglevel';
import {
  isPositionChanged,
  getSortedDraggables,
  getNewDraggablePosition,
  getAfterDropDraggableList,
} from 'shared/utils/draggables';
import dayjs from 'dayjs';
import { TaskSorting, TaskSortingType, TaskSortingDirection, sortTasks } from 'shared/utils/sorting';

import { Container, BoardContainer, BoardWrapper } from './Styles';
import shouldMetaFilter from './metaFilter';

export enum TaskMeta {
  NONE,
  TITLE,
  MEMBER,
  LABEL,
  DUE_DATE,
}

export enum TaskMetaMatch {
  MATCH_ANY,
  MATCH_ALL,
}

export enum TaskStatus {
  ALL,
  COMPLETE,
  INCOMPLETE,
}

export enum TaskSince {
  ALL,
  TODAY,
  YESTERDAY,
  ONE_WEEK,
  TWO_WEEKS,
  THREE_WEEKS,
}

export type TaskStatusFilter = {
  status: TaskStatus;
  since: TaskSince;
};

export interface TaskMetaFilterName {
  meta: TaskMeta;
  value?: string | dayjs.Dayjs | null;
  id?: string | null;
}

export type TaskNameMetaFilter = {
  name: string;
};

export enum DueDateFilterType {
  TODAY,
  TOMORROW,
  THIS_WEEK,
  NEXT_WEEK,
  ONE_WEEK,
  TWO_WEEKS,
  THREE_WEEKS,
  OVERDUE,
  NO_DUE_DATE,
}

export type DueDateMetaFilter = {
  type: DueDateFilterType;
  label: string;
};

export type MemberMetaFilter = {
  id: string;
  username: string;
};

export type LabelMetaFilter = {
  id: string;
  name: string;
  color: string;
};

export type TaskMetaFilters = {
  match: TaskMetaMatch;
  dueDate: DueDateMetaFilter | null;
  taskName: TaskNameMetaFilter | null;
  members: Array<MemberMetaFilter>;
  labels: Array<LabelMetaFilter>;
};

function shouldStatusFilter(task: Task, filter: TaskStatusFilter) {
  if (filter.status === TaskStatus.ALL) {
    return true;
  }

  if (filter.status === TaskStatus.INCOMPLETE && task.complete === false) {
    return true;
  }
  if (filter.status === TaskStatus.COMPLETE && task.completedAt && task.complete === true) {
    const completedAt = dayjs(task.completedAt);
    const REFERENCE = dayjs();
    switch (filter.since) {
      case TaskSince.TODAY:
        const TODAY = REFERENCE.clone().startOf('day');
        return completedAt.isSame(TODAY, 'd');
      case TaskSince.YESTERDAY:
        const YESTERDAY = REFERENCE.clone().subtract(1, 'day').startOf('day');
        return completedAt.isSameOrAfter(YESTERDAY, 'd');
      case TaskSince.ONE_WEEK:
        const ONE_WEEK = REFERENCE.clone().subtract(7, 'day').startOf('day');
        return completedAt.isSameOrAfter(ONE_WEEK, 'd');
      case TaskSince.TWO_WEEKS:
        const TWO_WEEKS = REFERENCE.clone().subtract(14, 'day').startOf('day');
        return completedAt.isSameOrAfter(TWO_WEEKS, 'd');
      case TaskSince.THREE_WEEKS:
        const THREE_WEEKS = REFERENCE.clone().subtract(21, 'day').startOf('day');
        return completedAt.isSameOrAfter(THREE_WEEKS, 'd');
      default:
        return true;
    }
  }
  return false;
}

interface SimpleProps {
  taskGroups: Array<TaskGroup>;
  onTaskDrop: (task: Task, previousTaskGroupID: string) => void;
  onTaskGroupDrop: (taskGroup: TaskGroup) => void;

  onTaskClick: (task: Task) => void;
  onCreateTask: (taskGroupID: string, name: string) => void;
  onChangeTaskGroupName: (taskGroupID: string, name: string) => void;
  onQuickEditorOpen: ($target: React.RefObject<HTMLElement>, taskID: string, taskGroupID: string) => void;
  onCreateTaskGroup: (listName: string) => void;
  onExtraMenuOpen: (taskGroupID: string, $targetRef: React.RefObject<HTMLElement>) => void;
  onCardMemberClick: OnCardMemberClick;
  onCardLabelClick: () => void;
  cardLabelVariant: CardLabelVariant;
  isPublic?: boolean;
  taskStatusFilter?: TaskStatusFilter;
  taskMetaFilters?: TaskMetaFilters;
  taskSorting?: TaskSorting;
}

const initTaskStatusFilter: TaskStatusFilter = {
  status: TaskStatus.ALL,
  since: TaskSince.ALL,
};

const initTaskMetaFilters: TaskMetaFilters = {
  match: TaskMetaMatch.MATCH_ANY,
  dueDate: null,
  taskName: null,
  labels: [],
  members: [],
};

const initTaskSorting: TaskSorting = {
  type: TaskSortingType.NONE,
  direction: TaskSortingDirection.ASC,
};

const SimpleLists: React.FC<SimpleProps> = ({
  taskGroups,
  onTaskDrop,
  onChangeTaskGroupName,
  onCardLabelClick,
  onTaskGroupDrop,
  onTaskClick,
  onCreateTask,
  onQuickEditorOpen,
  onCreateTaskGroup,
  cardLabelVariant,
  onExtraMenuOpen,
  onCardMemberClick,
  taskStatusFilter = initTaskStatusFilter,
  isPublic = false,
  taskMetaFilters = initTaskMetaFilters,
  taskSorting = initTaskSorting,
}) => {
  const onDragEnd = ({ draggableId, source, destination, type }: DropResult) => {
    if (typeof destination === 'undefined') return;
    if (!isPositionChanged(source, destination)) return;

    const isList = type === 'column';
    const isSameList = destination.droppableId === source.droppableId;
    let droppedDraggable: DraggableElement | null = null;
    let beforeDropDraggables: Array<DraggableElement> | null = null;

    if (isList) {
      const droppedGroup = taskGroups.find((taskGroup) => taskGroup.id === draggableId);
      if (droppedGroup) {
        droppedDraggable = {
          id: draggableId,
          position: droppedGroup.position,
        };
        beforeDropDraggables = getSortedDraggables(
          taskGroups.map((taskGroup) => {
            return { id: taskGroup.id, position: taskGroup.position };
          }),
        );
        if (droppedDraggable === null || beforeDropDraggables === null) {
          throw new Error('before drop draggables is null');
        }
        const afterDropDraggables = getAfterDropDraggableList(
          beforeDropDraggables,
          droppedDraggable,
          isList,
          isSameList,
          destination,
        );
        const newPosition = getNewDraggablePosition(afterDropDraggables, destination.index);
        onTaskGroupDrop({
          ...droppedGroup,
          position: newPosition,
        });
      } else {
        throw new Error('task group can not be found');
      }
    } else {
      const curTaskGroup = taskGroups.findIndex(
        (taskGroup) => taskGroup.tasks.findIndex((task) => task.id === draggableId) !== -1,
      );
      let targetTaskGroup = curTaskGroup;
      if (!isSameList) {
        targetTaskGroup = taskGroups.findIndex((taskGroup) => taskGroup.id === destination.droppableId);
      }
      const droppedTask = taskGroups[curTaskGroup].tasks.find((task) => task.id === draggableId);

      if (droppedTask) {
        droppedDraggable = {
          id: draggableId,
          position: droppedTask.position,
        };
        beforeDropDraggables = getSortedDraggables(
          taskGroups[targetTaskGroup].tasks.map((task) => {
            return { id: task.id, position: task.position };
          }),
        );
        if (droppedDraggable === null || beforeDropDraggables === null) {
          throw new Error('before drop draggables is null');
        }
        const afterDropDraggables = getAfterDropDraggableList(
          beforeDropDraggables,
          droppedDraggable,
          isList,
          isSameList,
          destination,
        );
        const newPosition = getNewDraggablePosition(afterDropDraggables, destination.index);
        const newTask = {
          ...droppedTask,
          position: newPosition,
          taskGroup: {
            id: destination.droppableId,
          },
        };
        log.debug(
          `action=move taskId=${droppedTask.id} source=${source.droppableId} dest=${destination.droppableId} oldPos=${droppedTask.position} newPos=${newPosition}`,
        );
        onTaskDrop(newTask, droppedTask.taskGroup.id);
      }
    }
  };

  const [currentComposer, setCurrentComposer] = useState('');
  const [toggleLabels, setToggleLabels] = useState(false);
  const [toggleDirection, setToggleDirection] = useState<'shrink' | 'expand'>(
    cardLabelVariant === 'large' ? 'shrink' : 'expand',
  );

  return (
    <BoardContainer>
      <BoardWrapper>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable direction="horizontal" type="column" droppableId="root">
            {(provided) => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                {taskGroups
                  .slice()
                  .sort((a: any, b: any) => a.position - b.position)
                  .map((taskGroup: TaskGroup, index: number) => {
                    return (
                      <Draggable draggableId={taskGroup.id} key={taskGroup.id} index={index}>
                        {(columnDragProvided) => (
                          <Droppable type="tasks" droppableId={taskGroup.id}>
                            {(columnDropProvided, snapshot) => (
                              <List
                                name={taskGroup.name}
                                onOpenComposer={(id) => setCurrentComposer(id)}
                                isComposerOpen={currentComposer === taskGroup.id}
                                onSaveName={(name) => onChangeTaskGroupName(taskGroup.id, name)}
                                isPublic={isPublic}
                                ref={columnDragProvided.innerRef}
                                wrapperProps={columnDragProvided.draggableProps}
                                headerProps={columnDragProvided.dragHandleProps}
                                onExtraMenuOpen={onExtraMenuOpen}
                                id={taskGroup.id}
                                key={taskGroup.id}
                                index={index}
                              >
                                <ListCards ref={columnDropProvided.innerRef} {...columnDropProvided.droppableProps}>
                                  {taskGroup.tasks
                                    .slice()
                                    .filter((t) => shouldStatusFilter(t, taskStatusFilter))
                                    .filter((t) => shouldMetaFilter(t, taskMetaFilters))
                                    .sort((a: any, b: any) => a.position - b.position)
                                    .sort((a: any, b: any) => sortTasks(a, b, taskSorting))
                                    .map((task: Task, taskIndex: any) => {
                                      return (
                                        <Draggable
                                          key={task.id}
                                          draggableId={task.id}
                                          index={taskIndex}
                                          isDragDisabled={taskSorting.type !== TaskSortingType.NONE}
                                        >
                                          {(taskProvided) => {
                                            return (
                                              <Card
                                                toggleDirection={toggleDirection}
                                                toggleLabels={toggleLabels}
                                                isPublic={isPublic}
                                                labelVariant={cardLabelVariant}
                                                watched={task.watched}
                                                wrapperProps={{
                                                  ...taskProvided.draggableProps,
                                                  ...taskProvided.dragHandleProps,
                                                }}
                                                setToggleLabels={setToggleLabels}
                                                onCardLabelClick={() => {
                                                  setToggleLabels(true);
                                                  setToggleDirection(
                                                    cardLabelVariant === 'large' ? 'shrink' : 'expand',
                                                  );
                                                  if (onCardLabelClick) {
                                                    onCardLabelClick();
                                                  }
                                                }}
                                                ref={taskProvided.innerRef}
                                                taskID={task.id}
                                                complete={task.complete ?? false}
                                                taskGroupID={taskGroup.id}
                                                description=""
                                                labels={task.labels.map((label) => label.projectLabel)}
                                                dueDate={
                                                  task.dueDate.at
                                                    ? {
                                                        isPastDue: false,
                                                        formattedDate: dayjs(task.dueDate.at).format('MMM D, YYYY'),
                                                      }
                                                    : undefined
                                                }
                                                title={task.name}
                                                members={task.assigned}
                                                onClick={() => {
                                                  onTaskClick(task);
                                                }}
                                                checklists={task.badges && task.badges.checklist}
                                                comments={task.badges && task.badges.comments}
                                                onCardMemberClick={onCardMemberClick}
                                                onContextMenu={onQuickEditorOpen}
                                              />
                                            );
                                          }}
                                        </Draggable>
                                      );
                                    })}
                                  {columnDropProvided.placeholder}
                                  {currentComposer === taskGroup.id && (
                                    <CardComposer
                                      onClose={() => {
                                        setCurrentComposer('');
                                      }}
                                      onCreateCard={(name) => {
                                        onCreateTask(taskGroup.id, name);
                                      }}
                                      isOpen
                                    />
                                  )}
                                </ListCards>
                              </List>
                            )}
                          </Droppable>
                        )}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
        {!isPublic && (
          <AddList
            onSave={(listName) => {
              onCreateTaskGroup(listName);
            }}
          />
        )}
      </BoardWrapper>
    </BoardContainer>
  );
};

export default SimpleLists;
