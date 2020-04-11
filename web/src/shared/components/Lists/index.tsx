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

import { Container, BoardWrapper } from './Styles';

interface Columns {
  [key: string]: TaskGroup;
}
interface Tasks {
  [key: string]: Task;
}

type Props = {
  columns: Columns;
  tasks: Tasks;
  onCardDrop: (task: Task) => void;
  onListDrop: (taskGroup: TaskGroup) => void;
  onCardCreate: (taskGroupID: string, name: string) => void;
  onQuickEditorOpen: (e: ContextMenuEvent) => void;
  onCreateList: (listName: string) => void;
  onExtraMenuOpen: (taskGroupID: string, pos: ElementPosition, size: ElementSize) => void;
};

const Lists: React.FC<Props> = ({
  columns,
  tasks,
  onCardDrop,
  onListDrop,
  onCardCreate,
  onQuickEditorOpen,
  onCreateList,
  onExtraMenuOpen,
}) => {
  const onDragEnd = ({ draggableId, source, destination, type }: DropResult) => {
    if (typeof destination === 'undefined') return;
    if (!isPositionChanged(source, destination)) return;

    const isList = type === 'column';
    const isSameList = destination.droppableId === source.droppableId;
    const droppedDraggable: DraggableElement = isList
      ? {
          id: draggableId,
          position: columns[draggableId].position,
        }
      : {
          id: draggableId,
          position: tasks[draggableId].position,
        };
    const beforeDropDraggables = isList
      ? getSortedDraggables(
          Object.values(columns).map(column => {
            return { id: column.taskGroupID, position: column.position };
          }),
        )
      : getSortedDraggables(
          Object.values(tasks)
            .filter((t: any) => t.taskGroup.taskGroupID === destination.droppableId)
            .map(task => {
              return { id: task.taskID, position: task.position };
            }),
        );

    console.log(beforeDropDraggables);
    console.log(destination);
    console.log(droppedDraggable);
    const afterDropDraggables = getAfterDropDraggableList(
      beforeDropDraggables,
      droppedDraggable,
      isList,
      isSameList,
      destination,
    );
    console.log(afterDropDraggables);
    const newPosition = getNewDraggablePosition(afterDropDraggables, destination.index);

    if (isList) {
      const droppedList = columns[droppedDraggable.id];
      onListDrop({
        ...droppedList,
        position: newPosition,
      });
    } else {
      const droppedCard = tasks[droppedDraggable.id];
      const newCard = {
        ...droppedCard,
        position: newPosition,
        taskGroupID: destination.droppableId,
      };
      onCardDrop(newCard);
    }
  };

  const orderedColumns = getSortedDraggables(
    Object.values(columns).map(column => {
      return { id: column.taskGroupID, position: column.position };
    }),
  );

  const [currentComposer, setCurrentComposer] = useState('');
  return (
    <BoardWrapper>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable direction="horizontal" type="column" droppableId="root">
          {provided => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {orderedColumns.map((columnDraggable, index: number) => {
                const column = columns[columnDraggable.id];
                const columnCards = Object.values(tasks)
                  .filter((t: Task) => t.taskGroup.taskGroupID === column.taskGroupID)
                  .sort((a, b) => a.position - b.position);
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
                        onExtraMenuOpen={onExtraMenuOpen}
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
      <AddList onSave={onCreateList} />
    </BoardWrapper>
  );
};

export default Lists;
