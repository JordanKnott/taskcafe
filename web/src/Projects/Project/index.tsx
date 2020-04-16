import React, { useState } from 'react';
import * as BoardStateUtils from 'shared/utils/boardState';
import styled from 'styled-components/macro';
import { useParams, Route, useRouteMatch, useHistory, RouteComponentProps } from 'react-router-dom';
import {
  useFindProjectQuery,
  useUpdateTaskNameMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskLocationMutation,
  useUpdateTaskGroupLocationMutation,
  useCreateTaskGroupMutation,
  useDeleteTaskGroupMutation,
} from 'shared/generated/graphql';

import Navbar from 'App/Navbar';
import TopNavbar from 'App/TopNavbar';
import QuickCardEditor from 'shared/components/QuickCardEditor';
import PopupMenu from 'shared/components/PopupMenu';
import ListActions from 'shared/components/ListActions';
import Modal from 'shared/components/Modal';
import TaskDetails from 'shared/components/TaskDetails';
import MemberManager from 'shared/components/MemberManager';
import { LabelsPopup } from 'shared/components/PopupMenu/PopupMenu.stories';
import KanbanBoard from 'Projects/Project/KanbanBoard';

type TaskRouteProps = {
  taskID: string;
};

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

interface ProjectParams {
  projectId: string;
}

const initialState: BoardState = { tasks: {}, columns: {} };
const initialPopupState = { left: 0, top: 0, isOpen: false, taskGroupID: '' };
const initialQuickCardEditorState: QuickCardEditorState = { isOpen: false, top: 0, left: 0 };
const initialMemberPopupState = { taskID: '', isOpen: false, top: 0, left: 0 };
const initialLabelsPopupState = { taskID: '', isOpen: false, top: 0, left: 0 };
const initialTaskDetailsState = { isOpen: false, taskID: '' };

const Project = () => {
  const { projectId } = useParams<ProjectParams>();
  const match = useRouteMatch();
  const history = useHistory();

  const [listsData, setListsData] = useState(initialState);
  const [popupData, setPopupData] = useState(initialPopupState);
  const [memberPopupData, setMemberPopupData] = useState(initialMemberPopupState);
  const [taskDetails, setTaskDetails] = useState(initialTaskDetailsState);
  const [quickCardEditor, setQuickCardEditor] = useState(initialQuickCardEditorState);
  const [updateTaskLocation] = useUpdateTaskLocationMutation();
  const [updateTaskGroupLocation] = useUpdateTaskGroupLocationMutation();

  const [deleteTaskGroup] = useDeleteTaskGroupMutation({
    onCompleted: deletedTaskGroupData => {
      setListsData(
        BoardStateUtils.deleteTaskGroup(listsData, deletedTaskGroupData.deleteTaskGroup.taskGroup.taskGroupID),
      );
    },
  });

  const [createTaskGroup] = useCreateTaskGroupMutation({
    onCompleted: newTaskGroupData => {
      const newTaskGroup = {
        ...newTaskGroupData.createTaskGroup,
        tasks: [],
      };
      setListsData(BoardStateUtils.addTaskGroup(listsData, newTaskGroup));
    },
  });

  const [createTask] = useCreateTaskMutation({
    onCompleted: newTaskData => {
      const newTask = {
        ...newTaskData.createTask,
        labels: [],
      };
      setListsData(BoardStateUtils.addTask(listsData, newTask));
    },
  });

  const [deleteTask] = useDeleteTaskMutation({
    onCompleted: deletedTask => {
      setListsData(BoardStateUtils.deleteTask(listsData, deletedTask.deleteTask.taskID));
    },
  });

  const [updateTaskName] = useUpdateTaskNameMutation({
    onCompleted: newTaskData => {
      setListsData(
        BoardStateUtils.updateTaskName(listsData, newTaskData.updateTaskName.taskID, newTaskData.updateTaskName.name),
      );
    },
  });
  const { loading, data } = useFindProjectQuery({
    variables: { projectId },
    onCompleted: newData => {
      const newListsData: BoardState = { tasks: {}, columns: {} };
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
  const onCardDrop = (droppedTask: Task) => {
    updateTaskLocation({
      variables: {
        taskID: droppedTask.taskID,
        taskGroupID: droppedTask.taskGroup.taskGroupID,
        position: droppedTask.position,
      },
    });
    setListsData(BoardStateUtils.updateTask(listsData, droppedTask));
  };
  const onListDrop = (droppedColumn: TaskGroup) => {
    updateTaskGroupLocation({
      variables: { taskGroupID: droppedColumn.taskGroupID, position: droppedColumn.position },
    });
    setListsData(BoardStateUtils.updateTaskGroup(listsData, droppedColumn));
  };

  const onCreateList = (listName: string) => {
    const [lastColumn] = Object.values(listsData.columns)
      .sort((a, b) => a.position - b.position)
      .slice(-1);
    let position = 65535;
    if (lastColumn) {
      position = lastColumn.position * 2 + 1;
    }
    createTaskGroup({ variables: { projectID: projectId, name: listName, position } });
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
            <KanbanBoard
              listsData={listsData}
              onCardDrop={onCardDrop}
              onListDrop={onListDrop}
              onCardCreate={onCardCreate}
              onCreateList={onCreateList}
              onQuickEditorOpen={onQuickEditorOpen}
              onOpenListActionsPopup={(isOpen, left, top, taskGroupID) => {
                setPopupData({ isOpen, top, left, taskGroupID });
              }}
            />
          </TitleWrapper>
        </MainContent>
        {popupData.isOpen && (
          <PopupMenu
            title="List Actions"
            top={popupData.top}
            onClose={() => setPopupData(initialPopupState)}
            left={popupData.left}
          >
            <ListActions
              taskGroupID={popupData.taskGroupID}
              onArchiveTaskGroup={taskGroupID => {
                deleteTaskGroup({ variables: { taskGroupID } });
                setPopupData(initialPopupState);
              }}
            />
          </PopupMenu>
        )}
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
        <Route
          path={`${match.path}/c/:taskID`}
          render={(routeProps: RouteComponentProps<TaskRouteProps>) => (
            <Modal
              width={1040}
              onClose={() => {
                history.push(match.url);
              }}
              renderContent={() => {
                const task = listsData.tasks[routeProps.match.params.taskID];
                if (!task) {
                  return <div>loading</div>;
                }
                return (
                  <TaskDetails
                    task={task}
                    onTaskNameChange={(updatedTask, newName) => {
                      updateTaskName({ variables: { taskID: updatedTask.taskID, name: newName } });
                    }}
                    onTaskDescriptionChange={(updatedTask, newDescription) => {
                      console.log(updatedTask, newDescription);
                    }}
                    onDeleteTask={deletedTask => {
                      setTaskDetails(initialTaskDetailsState);
                      deleteTask({ variables: { taskID: deletedTask.taskID } });
                    }}
                    onCloseModal={() => history.push(match.url)}
                    onOpenAddMemberPopup={(task, bounds) => {
                      console.log(task, bounds);
                      setMemberPopupData({
                        isOpen: true,
                        taskID: task.taskID,
                        top: bounds.position.top + bounds.size.height + 10,
                        left: bounds.position.left,
                      });
                    }}
                    onOpenAddLabelPopup={(task, bounds) => {}}
                  />
                );
              }}
            />
          )}
        />
      </>
    );
  }
  return <Wrapper>Error</Wrapper>;
};

export default Project;
