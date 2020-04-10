import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import List, { ListCards } from 'shared/components/List';
import Card from 'shared/components/Card';
import CardComposer from 'shared/components/CardComposer';
import {
  isPositionChanged,
  getSortedDraggables,
  getNewDraggablePosition,
  getAfterDropDraggableList,
} from 'shared/utils/draggables';

import { Container } from './Styles';

interface Columns {
  [key: string]: TaskGroup;
}
interface Tasks {
  [key: string]: Task;
}

type Props = {
  columns: Columns;
  tasks: Tasks;
  onCardDrop: any;
  onListDrop: any;
  onCardCreate: (taskGroupID: string, name: string) => void;
  onQuickEditorOpen: (e: ContextMenuEvent) => void;
};

const Lists = ({ columns, tasks, onCardDrop, onListDrop, onCardCreate, onQuickEditorOpen }: Props) => {
  const onDragEnd = ({ draggableId, source, destination, type }: DropResult) => {
    if (typeof destination === 'undefined') return;
    if (!isPositionChanged(source, destination)) return;

    const isList = type === 'column';
    const isSameList = destination.droppableId === source.droppableId;
    const droppedDraggable = isList ? columns[draggableId] : tasks[draggableId];
    const beforeDropDraggables = isList
      ? getSortedDraggables(Object.values(columns))
      : getSortedDraggables(Object.values(tasks).filter((t: any) => t.taskGroupID === destination.droppableId));

    const afterDropDraggables = getAfterDropDraggableList(
      beforeDropDraggables,
      droppedDraggable,
      isList,
      isSameList,
      destination,
    );
    const newPosition = getNewDraggablePosition(afterDropDraggables, destination.index);

    if (isList) {
      onListDrop({
        ...droppedDraggable,
        position: newPosition,
      });
    } else {
      const newCard = {
        ...droppedDraggable,
        position: newPosition,
        taskGroupID: destination.droppableId,
      };
      onCardDrop(newCard);
    }
  };

  const orderedColumns = getSortedDraggables(Object.values(columns));

  const [currentComposer, setCurrentComposer] = useState('');
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable direction="horizontal" type="column" droppableId="root">
        {provided => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {orderedColumns.map((column: TaskGroup, index: number) => {
              const columnCards = getSortedDraggables(
                Object.values(tasks).filter((t: any) => t.taskGroupID === column.taskGroupID),
              );
              return (
                <Draggable draggableId={column.taskGroupID} key={column.taskGroupID} index={index}>
                  {columnDragProvided => (
                    <List
                      id={column.taskGroupID}
                      name={column.name}
                      key={column.taskGroupID}
                      onOpenComposer={id => setCurrentComposer(id)}
                      isComposerOpen={currentComposer === column.taskGroupID}
                      onSaveName={name => console.log(name)}
                      index={index}
                      tasks={columnCards}
                      ref={columnDragProvided.innerRef}
                      wrapperProps={columnDragProvided.draggableProps}
                      headerProps={columnDragProvided.dragHandleProps}
                    >
                      <Droppable type="tasks" droppableId={column.taskGroupID}>
                        {columnDropProvided => (
                          <ListCards ref={columnDropProvided.innerRef} {...columnDropProvided.droppableProps}>
                            {columnCards.map((task: Task, taskIndex: any) => {
                              return (
                                <Draggable key={task.taskID} draggableId={task.taskID} index={taskIndex}>
                                  {taskProvided => {
                                    return (
                                      <Card
                                        wrapperProps={{
                                          ...taskProvided.draggableProps,
                                          ...taskProvided.dragHandleProps,
                                        }}
                                        ref={taskProvided.innerRef}
                                        taskID={task.taskID}
                                        taskGroupID={column.taskGroupID}
                                        description=""
                                        title={task.name}
                                        labels={task.labels}
                                        onClick={e => console.log(e)}
                                        onContextMenu={onQuickEditorOpen}
                                      />
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {columnDropProvided.placeholder}

                            {currentComposer === column.taskGroupID && (
                              <CardComposer
                                onClose={() => {
                                  setCurrentComposer('');
                                }}
                                onCreateCard={name => {
                                  setCurrentComposer('');
                                  onCardCreate(column.taskGroupID, name);
                                }}
                                isOpen
                              />
                            )}
                          </ListCards>
                        )}
                      </Droppable>
                    </List>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Lists;
