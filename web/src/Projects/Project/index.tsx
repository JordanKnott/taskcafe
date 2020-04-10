import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useParams } from 'react-router-dom';

import Navbar from 'App/Navbar';
import TopNavbar from 'App/TopNavbar';
import Lists from 'shared/components/Lists';
import QuickCardEditor from 'shared/components/QuickCardEditor';

interface ColumnState {
  [key: string]: TaskGroup;
}

interface TaskState {
  [key: string]: RemoteTask;
}

interface State {
  columns: ColumnState;
  tasks: TaskState;
}

interface QuickCardEditorState {
  isOpen: boolean;
  left: number;
  top: number;
  task?: RemoteTask;
}

const MainContent = styled.div`
  padding: 0 0 50px 100px;
  height: 100%;
  background: #262c49;
`;

const Wrapper = styled.div`
  font-size: 16px;
  background-color: red;
`;

const Title = styled.span`
  text-align: center;
  font-size: 24px;
  color: #fff;
`;

interface ProjectData {
  findProject: Project;
}

interface UpdateTaskLocationData {
  updateTaskLocation: Task;
}

interface UpdateTaskLocationVars {
  taskID: string;
  taskGroupID: string;
  position: number;
}

interface ProjectVars {
  projectId: string;
}

interface CreateTaskVars {
  taskGroupID: string;
  name: string;
  position: number;
}

interface CreateTaskData {
  createTask: RemoteTask;
}

interface ProjectParams {
  projectId: string;
}

interface DeleteTaskData {
  deleteTask: { taskID: string };
}

interface DeleteTaskVars {
  taskID: string;
}

interface UpdateTaskNameData {
  updateTaskName: RemoteTask;
}

interface UpdateTaskNameVars {
  taskID: string;
  name: string;
}

const UPDATE_TASK_NAME = gql`
  mutation updateTaskName($taskID: String!, $name: String!) {
    updateTaskName(input: { taskID: $taskID, name: $name }) {
      taskID
      name
      position
    }
  }
`;

const GET_PROJECT = gql`
  query getProject($projectId: String!) {
    findProject(input: { projectId: $projectId }) {
      name
      taskGroups {
        taskGroupID
        name
        position
        tasks {
          taskID
          name
          position
        }
      }
    }
  }
`;

const CREATE_TASK = gql`
  mutation createTask($taskGroupID: String!, $name: String!, $position: Float!) {
    createTask(input: { taskGroupID: $taskGroupID, name: $name, position: $position }) {
      taskID
      taskGroupID
      name
      position
    }
  }
`;

const DELETE_TASK = gql`
  mutation deleteTask($taskID: String!) {
    deleteTask(input: { taskID: $taskID }) {
      taskID
    }
  }
`;

const UPDATE_TASK_LOCATION = gql`
  mutation updateTaskLocation($taskID: String!, $taskGroupID: String!, $position: Float!) {
    updateTaskLocation(input: { taskID: $taskID, taskGroupID: $taskGroupID, position: $position }) {
      taskID
      createdAt
      name
      position
    }
  }
`;

const initialState: State = { tasks: {}, columns: {} };
const initialQuickCardEditorState: QuickCardEditorState = { isOpen: false, top: 0, left: 0 };

const Project = () => {
  const { projectId } = useParams<ProjectParams>();
  const [listsData, setListsData] = useState(initialState);
  const [quickCardEditor, setQuickCardEditor] = useState(initialQuickCardEditorState);
  const [updateTaskLocation, updateTaskLocationData] = useMutation<UpdateTaskLocationData, UpdateTaskLocationVars>(
    UPDATE_TASK_LOCATION,
  );
  const [createTask, createTaskData] = useMutation<CreateTaskData, CreateTaskVars>(CREATE_TASK, {
    onCompleted: newTaskData => {
      const newListsData = {
        ...listsData,
        tasks: {
          ...listsData.tasks,
          [newTaskData.createTask.taskID]: {
            taskGroupID: newTaskData.createTask.taskGroupID,
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
  const [deleteTask, deleteTaskData] = useMutation<DeleteTaskData, DeleteTaskVars>(DELETE_TASK, {
    onCompleted: deletedTask => {
      const { [deletedTask.deleteTask.taskID]: removedTask, ...remainingTasks } = listsData.tasks;
      const newListsData = {
        ...listsData,
        tasks: remainingTasks,
      };
      setListsData(newListsData);
    },
  });
  const [updateTaskName, updateTaskNameData] = useMutation<UpdateTaskNameData, UpdateTaskNameVars>(UPDATE_TASK_NAME, {
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
  const { loading, data } = useQuery<ProjectData, ProjectVars>(GET_PROJECT, {
    variables: { projectId },
    onCompleted: newData => {
      let newListsData: State = { tasks: {}, columns: {} };
      newData.findProject.taskGroups.forEach((taskGroup: TaskGroup) => {
        newListsData.columns[taskGroup.taskGroupID] = {
          taskGroupID: taskGroup.taskGroupID,
          name: taskGroup.name,
          position: taskGroup.position,
          tasks: [],
        };
        taskGroup.tasks.forEach((task: RemoteTask) => {
          newListsData.tasks[task.taskID] = {
            taskID: task.taskID,
            taskGroupID: taskGroup.taskGroupID,
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
      (task: RemoteTask) => task.taskGroupID === taskGroupID,
    );
    var position = 65535;
    console.log(taskGroupID);
    console.log(taskGroupTasks);
    if (taskGroupTasks.length !== 0) {
      const [lastTask] = taskGroupTasks.sort((a: any, b: any) => a.position - b.position).slice(-1);
      console.log(`last tasks position ${lastTask.position}`);
      position = Math.ceil(lastTask.position) * 2 + 1;
    }

    createTask({ variables: { taskGroupID: taskGroupID, name: name, position: position } });
  };
  const onQuickEditorOpen = (e: ContextMenuEvent) => {
    const task = Object.values(listsData.tasks).find(task => task.taskID === e.cardId);
    setQuickCardEditor({
      top: e.top,
      left: e.left,
      isOpen: true,
      task,
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
          <Title>{data.findProject.name}</Title>
          <Lists
            onQuickEditorOpen={onQuickEditorOpen}
            onCardCreate={onCardCreate}
            {...listsData}
            onCardDrop={onCardDrop}
            onListDrop={onListDrop}
          />
        </MainContent>
        {quickCardEditor.isOpen && (
          <QuickCardEditor
            isOpen={true}
            listId={quickCardEditor.task ? quickCardEditor.task.taskGroupID : ''}
            cardId={quickCardEditor.task ? quickCardEditor.task.taskID : ''}
            cardTitle={quickCardEditor.task ? quickCardEditor.task.name : ''}
            onCloseEditor={() => setQuickCardEditor(initialQuickCardEditorState)}
            onEditCard={(listId: string, cardId: string, cardName: string) =>
              updateTaskName({ variables: { taskID: cardId, name: cardName } })
            }
            onOpenPopup={() => console.log()}
            onArchiveCard={(listId: string, cardId: string) => deleteTask({ variables: { taskID: cardId } })}
            labels={[]}
            top={quickCardEditor.top}
            left={quickCardEditor.left}
          />
        )}
      </>
    );
  }
  return <Wrapper>Error</Wrapper>;
};

export default Project;
