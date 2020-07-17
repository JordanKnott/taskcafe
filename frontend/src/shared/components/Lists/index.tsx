import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import List, { ListCards } from 'shared/components/List';
import Card from 'shared/components/Card';
import CardComposer from 'shared/components/CardComposer';
import AddList from 'shared/components/AddList';
import {
  isPositionChanged,
  getSortedDraggables,
  getNewDraggablePosition,
  getAfterDropDraggableList,
} from 'shared/utils/draggables';
import moment from 'moment';

import { Container, BoardContainer, BoardWrapper } from './Styles';

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
}

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
}) => {
  const onDragEnd = ({ draggableId, source, destination, type }: DropResult) => {
    if (typeof destination === 'undefined') return;
    if (!isPositionChanged(source, destination)) return;

    const isList = type === 'column';
    const isSameList = destination.droppableId === source.droppableId;
    let droppedDraggable: DraggableElement | null = null;
    let beforeDropDraggables: Array<DraggableElement> | null = null;

    if (isList) {
      const droppedGroup = taskGroups.find(taskGroup => taskGroup.id === draggableId);
      if (droppedGroup) {
        droppedDraggable = {
          id: draggableId,
          position: droppedGroup.position,
        };
        beforeDropDraggables = getSortedDraggables(
          taskGroups.map(taskGroup => {
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
        throw { error: 'task group can not be found' };
      }
    } else {
      const targetGroup = taskGroups.findIndex(
        taskGroup => taskGroup.tasks.findIndex(task => task.id === draggableId) !== -1,
      );
      const droppedTask = taskGroups[targetGroup].tasks.find(task => task.id === draggableId);

      if (droppedTask) {
        droppedDraggable = {
          id: draggableId,
          position: droppedTask.position,
        };
        beforeDropDraggables = getSortedDraggables(
          taskGroups[targetGroup].tasks.map(task => {
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
        onTaskDrop(newTask, droppedTask.taskGroup.id);
      }
    }
  };

  const [currentComposer, setCurrentComposer] = useState('');
  return (
    <BoardContainer>
      <BoardWrapper>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable direction="horizontal" type="column" droppableId="root">
            {provided => (
              <Container {...provided.droppableProps} ref={provided.innerRef}>
                {taskGroups
                  .slice()
                  .sort((a: any, b: any) => a.position - b.position)
                  .map((taskGroup: TaskGroup, index: number) => {
                    return (
                      <Draggable draggableId={taskGroup.id} key={taskGroup.id} index={index}>
                        {columnDragProvided => (
                          <Droppable type="tasks" droppableId={taskGroup.id}>
                            {(columnDropProvided, snapshot) => (
                              <List
                                name={taskGroup.name}
                                onOpenComposer={id => setCurrentComposer(id)}
                                isComposerOpen={currentComposer === taskGroup.id}
                                onSaveName={name => onChangeTaskGroupName(taskGroup.id, name)}
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
                                    .sort((a: any, b: any) => a.position - b.position)
                                    .map((task: Task, taskIndex: any) => {
                                      return (
                                        <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                                          {taskProvided => {
                                            return (
                                              <Card
                                                labelVariant={cardLabelVariant}
                                                wrapperProps={{
                                                  ...taskProvided.draggableProps,
                                                  ...taskProvided.dragHandleProps,
                                                }}
                                                onCardLabelClick={onCardLabelClick}
                                                ref={taskProvided.innerRef}
                                                taskID={task.id}
                                                complete={task.complete ?? false}
                                                taskGroupID={taskGroup.id}
                                                description=""
                                                labels={task.labels.map(label => label.projectLabel)}
                                                dueDate={
                                                  task.dueDate
                                                    ? {
                                                        isPastDue: false,
                                                        formattedDate: moment(task.dueDate).format('MMM D, YYYY'),
                                                      }
                                                    : undefined
                                                }
                                                title={task.name}
                                                members={task.assigned}
                                                onClick={() => {
                                                  onTaskClick(task);
                                                }}
                                                checklists={task.badges && task.badges.checklist}
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
                                      onCreateCard={name => {
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
                <AddList
                  onSave={listName => {
                    onCreateTaskGroup(listName);
                  }}
                />
                {provided.placeholder}
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </BoardWrapper>
    </BoardContainer>
  );
};

export default SimpleLists;
