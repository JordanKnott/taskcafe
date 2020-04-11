import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useParams } from 'react-router-dom';
import {
  useFindProjectQuery,
  useUpdateTaskNameMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskLocationMutation,
  useUpdateTaskGroupLocationMutation,
  useCreateTaskGroupMutation,
} from 'shared/generated/graphql';

import Navbar from 'App/Navbar';
import TopNavbar from 'App/TopNavbar';
import Lists from 'shared/components/Lists';
import QuickCardEditor from 'shared/components/QuickCardEditor';
import PopupMenu from 'shared/components/PopupMenu';
import ListActions from 'shared/components/ListActions';

interface ColumnState {
  [key: string]: TaskGroup;
}

interface TaskState {
  [key: string]: Task;
}

interface State {
  columns: ColumnState;
  tasks: TaskState;
}

interface QuickCardEditorState {
  isOpen: boolean;
  left: number;
  top: number;
  task?: Task;
}

const MainContent = styled.div`
  padding: 0 0 50px 80px;
  height: 100%;
  background: #262c49;
`;

const Wrapper = styled.div`
  font-size: 16px;
  background-color: red;
`;

const TitleWrapper = styled.div`
  margin-left: 38px;
  margin-bottom: 15px;
`;

const Title = styled.span`
  text-align: center;
  font-size: 24px;
  color: #fff;
`;

const Board = styled.div`
  margin-left: 36px;
`;

interface ProjectParams {
  projectId: string;
}

const initialState: State = { tasks: {}, columns: {} };
const initialPopupState = { left: 0, top: 0, isOpen: false, taskGroupID: '' };
const initialQuickCardEditorState: QuickCardEditorState = { isOpen: false, top: 0, left: 0 };

const Project = () => {
  const { projectId } = useParams<ProjectParams>();
  const [listsData, setListsData] = useState(initialState);
  const [popupData, setPopupData] = useState(initialPopupState);
  const [quickCardEditor, setQuickCardEditor] = useState(initialQuickCardEditorState);
  const [updateTaskLocation] = useUpdateTaskLocationMutation();
  const [updateTaskGroupLocation] = useUpdateTaskGroupLocationMutation();
  const [createTaskGroup] = useCreateTaskGroupMutation({
    onCompleted: newTaskGroupData => {
      const newListsData = {
        ...listsData,
        columns: {
          ...listsData.columns,
          [newTaskGroupData.createTaskGroup.taskGroupID]: {
            taskGroupID: newTaskGroupData.createTaskGroup.taskGroupID,
            name: newTaskGroupData.createTaskGroup.name,
            position: newTaskGroupData.createTaskGroup.position,
            tasks: [],
          },
        },
      };
      setListsData(newListsData);
    },
  });
  const [createTask] = useCreateTaskMutation({
    onCompleted: newTaskData => {
      const newListsData = {
        ...listsData,
        tasks: {
          ...listsData.tasks,
          [newTaskData.createTask.taskID]: {
            taskGroup: {
              taskGroupID: newTaskData.createTask.taskGroup.taskGroupID,
            },
            taskID: newTaskData.createTask.taskID,
            name: newTaskData.createTask.name,
            position: newTaskData.createTask.position,
            labels: [],
          },
        },
      };
      setListsData(newListsData);
    },
  });
  const [deleteTask] = useDeleteTaskMutation({
    onCompleted: deletedTask => {
      const { [deletedTask.deleteTask.taskID]: removedTask, ...remainingTasks } = listsData.tasks;
      const newListsData = {
        ...listsData,
        tasks: remainingTasks,
      };
      setListsData(newListsData);
    },
  });
  const [updateTaskName] = useUpdateTaskNameMutation({
    onCompleted: newTaskData => {
      const newListsData = {
        ...listsData,
        tasks: {
          ...listsData.tasks,
          [newTaskData.updateTaskName.taskID]: {
            ...listsData.tasks[newTaskData.updateTaskName.taskID],
            name: newTaskData.updateTaskName.name,
          },
        },
      };
      setListsData(newListsData);
    },
  });
  const { loading, data } = useFindProjectQuery({
    variables: { projectId },
    onCompleted: newData => {
      const newListsData: State = { tasks: {}, columns: {} };
      newData.findProject.taskGroups.forEach(taskGroup => {
        newListsData.columns[taskGroup.taskGroupID] = {
          taskGroupID: taskGroup.taskGroupID,
          name: taskGroup.name,
          position: taskGroup.position,
          tasks: [],
        };
        taskGroup.tasks.forEach(task => {
          newListsData.tasks[task.taskID] = {
            taskID: task.taskID,
            taskGroup: {
              taskGroupID: taskGroup.taskGroupID,
            },
            name: task.name,
            position: task.position,
            labels: [],
          };
        });
      });
      setListsData(newListsData);
    },
  });
  const onCardDrop = (droppedTask: any) => {
    updateTaskLocation({
      variables: { taskID: droppedTask.taskID, taskGroupID: droppedTask.taskGroupID, position: droppedTask.position },
    });
    const newState = {
      ...listsData,
      tasks: {
        ...listsData.tasks,
        [droppedTask.taskID]: droppedTask,
      },
    };
    setListsData(newState);
  };
  const onListDrop = (droppedColumn: any) => {
    updateTaskGroupLocation({
      variables: { taskGroupID: droppedColumn.taskGroupID, position: droppedColumn.position },
    });
    const newState = {
      ...listsData,
      columns: {
        ...listsData.columns,
        [droppedColumn.taskGroupID]: droppedColumn,
      },
    };
    setListsData(newState);
  };
  const onCardCreate = (taskGroupID: string, name: string) => {
    const taskGroupTasks = Object.values(listsData.tasks).filter(
      (task: Task) => task.taskGroup.taskGroupID === taskGroupID,
    );
    let position = 65535;
    if (taskGroupTasks.length !== 0) {
      const [lastTask] = taskGroupTasks.sort((a: any, b: any) => a.position - b.position).slice(-1);
      position = Math.ceil(lastTask.position) * 2 + 1;
    }

    createTask({ variables: { taskGroupID, name, position } });
  };
  const onQuickEditorOpen = (e: ContextMenuEvent) => {
    const currentTask = Object.values(listsData.tasks).find(task => task.taskID === e.taskID);
    setQuickCardEditor({
      top: e.top,
      left: e.left,
      isOpen: true,
      task: currentTask,
    });
  };

  if (loading) {
    return <Wrapper>Loading</Wrapper>;
  }
  if (data) {
    return (
      <>
        <Navbar />
        <MainContent>
          <TopNavbar />
          <TitleWrapper>
            <Title>{data.findProject.name}</Title>
          </TitleWrapper>
          <Board>
            <Lists
              onQuickEditorOpen={onQuickEditorOpen}
              onCardCreate={onCardCreate}
              {...listsData}
              onCardDrop={onCardDrop}
              onListDrop={onListDrop}
              onCreateList={listName => {
                const [lastColumn] = Object.values(listsData.columns)
                  .sort((a, b) => a.position - b.position)
                  .slice(-1);
                let position = 65535;
                if (lastColumn) {
                  position = lastColumn.position * 2 + 1;
                }
                createTaskGroup({ variables: { projectID: projectId, name: listName, position } });
              }}
            />
          </Board>
        </MainContent>
        {quickCardEditor.isOpen && (
          <QuickCardEditor
            isOpen
            taskID={quickCardEditor.task ? quickCardEditor.task.taskID : ''}
            taskGroupID={quickCardEditor.task ? quickCardEditor.task.taskGroup.taskGroupID : ''}
            cardTitle={quickCardEditor.task ? quickCardEditor.task.name : ''}
            onCloseEditor={() => setQuickCardEditor(initialQuickCardEditorState)}
            onEditCard={(_listId: string, cardId: string, cardName: string) => {
              updateTaskName({ variables: { taskID: cardId, name: cardName } });
            }}
            onOpenPopup={() => console.log()}
            onArchiveCard={(_listId: string, cardId: string) => deleteTask({ variables: { taskID: cardId } })}
            labels={[]}
            top={quickCardEditor.top}
            left={quickCardEditor.left}
          />
        )}
        {popupData.isOpen && (
          <PopupMenu
            title="List Actions"
            top={popupData.top}
            onClose={() => setPopupData(initialPopupState)}
            left={popupData.left}
          >
            <ListActions taskGroupID={popupData.taskGroupID} />
          </PopupMenu>
        )}
      </>
    );
  }
  return <Wrapper>Error</Wrapper>;
};

export default Project;
