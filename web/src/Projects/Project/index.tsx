import React, { useState, useRef } from 'react';
import * as BoardStateUtils from 'shared/utils/boardState';
import GlobalTopNavbar from 'App/TopNavbar';
import styled from 'styled-components/macro';
import { Bolt, ToggleOn, Tags } from 'shared/icons';
import { usePopup, Popup } from 'shared/components/PopupMenu';
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
  useUpdateTaskDescriptionMutation,
  useAssignTaskMutation,
  DeleteTaskDocument,
  FindProjectDocument,
} from 'shared/generated/graphql';

import QuickCardEditor from 'shared/components/QuickCardEditor';
import ListActions from 'shared/components/ListActions';
import MemberManager from 'shared/components/MemberManager';
import { LabelsPopup } from 'shared/components/PopupMenu/PopupMenu.stories';
import KanbanBoard from 'Projects/Project/KanbanBoard';
import { mixin } from 'shared/utils/styles';
import LabelManager from 'shared/components/PopupMenu/LabelManager';
import LabelEditor from 'shared/components/PopupMenu/LabelEditor';
import produce from 'immer';
import Details from './Details';

type TaskRouteProps = {
  taskID: string;
};

interface QuickCardEditorState {
  isOpen: boolean;
  left: number;
  top: number;
  task?: Task;
}

const TitleWrapper = styled.div`
  margin-left: 38px;
  margin-bottom: 15px;
`;

const Title = styled.span`
  text-align: center;
  font-size: 24px;
  color: #fff;
`;

type LabelManagerEditorProps = {
  labels: Array<Label>;
};

const LabelManagerEditor: React.FC<LabelManagerEditorProps> = ({ labels: initialLabels }) => {
  const [labels, setLabels] = useState<Array<Label>>(initialLabels);
  const [currentLabel, setCurrentLabel] = useState('');
  const { setTab } = usePopup();
  return (
    <>
      <Popup title="Labels" tab={0} onClose={() => {}}>
        <LabelManager
          labels={labels}
          onLabelCreate={() => {
            setTab(2);
          }}
          onLabelEdit={labelId => {
            setCurrentLabel(labelId);
            setTab(1);
          }}
          onLabelToggle={labelId => {
            setLabels(
              produce(labels, draftState => {
                const idx = labels.findIndex(label => label.labelId === labelId);
                if (idx !== -1) {
                  draftState[idx] = { ...draftState[idx], active: !labels[idx].active };
                }
              }),
            );
          }}
        />
      </Popup>
      <Popup onClose={() => {}} title="Edit label" tab={1}>
        <LabelEditor
          label={labels.find(label => label.labelId === currentLabel) ?? null}
          onLabelEdit={(_labelId, name, color) => {
            setLabels(
              produce(labels, draftState => {
                const idx = labels.findIndex(label => label.labelId === currentLabel);
                if (idx !== -1) {
                  draftState[idx] = { ...draftState[idx], name, color };
                }
              }),
            );
            setTab(0);
          }}
        />
      </Popup>
      <Popup onClose={() => {}} title="Create new label" tab={2}>
        <LabelEditor
          label={null}
          onLabelEdit={(_labelId, name, color) => {
            setLabels([...labels, { labelId: name, name, color, active: false }]);
            setTab(0);
          }}
        />
      </Popup>
    </>
  );
};

interface ProjectParams {
  projectId: string;
}

const initialState: BoardState = { tasks: {}, columns: {} };
const initialPopupState = { left: 0, top: 0, isOpen: false, taskGroupID: '' };
const initialQuickCardEditorState: QuickCardEditorState = { isOpen: false, top: 0, left: 0 };
const initialLabelsPopupState = { taskID: '', isOpen: false, top: 0, left: 0 };
const initialTaskDetailsState = { isOpen: false, taskID: '' };

const ProjectActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  padding: 0 12px;
`;

const ProjectAction = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #c2c6dc;

  &:not(:last-child) {
    margin-right: 16px;
  }

  &:hover {
    color: ${mixin.lighten('#c2c6dc', 0.25)};
  }
`;

const ProjectActionText = styled.span`
  padding-left: 4px;
`;

const Project = () => {
  const { projectId } = useParams<ProjectParams>();
  const match = useRouteMatch();
  const history = useHistory();

  const [updateTaskDescription] = useUpdateTaskDescriptionMutation();
  const [listsData, setListsData] = useState(initialState);
  const [popupData, setPopupData] = useState(initialPopupState);
  const [taskDetails, setTaskDetails] = useState(initialTaskDetailsState);
  const [quickCardEditor, setQuickCardEditor] = useState(initialQuickCardEditorState);
  const [updateTaskLocation] = useUpdateTaskLocationMutation();
  const [updateTaskGroupLocation] = useUpdateTaskGroupLocationMutation();

  const [deleteTaskGroup] = useDeleteTaskGroupMutation({
    onCompleted: deletedTaskGroupData => {
      setListsData(BoardStateUtils.deleteTaskGroup(listsData, deletedTaskGroupData.deleteTaskGroup.taskGroup.id));
    },
  });

  const [createTaskGroup] = useCreateTaskGroupMutation({
    onCompleted: newTaskGroupData => {
      const newTaskGroup = {
        taskGroupID: newTaskGroupData.createTaskGroup.id,
        tasks: [],
        ...newTaskGroupData.createTaskGroup,
      };
      setListsData(BoardStateUtils.addTaskGroup(listsData, newTaskGroup));
    },
  });

  const [createTask] = useCreateTaskMutation({
    onCompleted: newTaskData => {
      const newTask = {
        ...newTaskData.createTask,
        taskID: newTaskData.createTask.id,
        taskGroup: { taskGroupID: newTaskData.createTask.taskGroup.id },
        labels: [],
      };
      setListsData(BoardStateUtils.addTask(listsData, newTask));
    },
    update: (client, newTaskData) => {
      const cacheData: any = client.readQuery({
        query: FindProjectDocument,
        variables: {
          projectId: projectId,
        },
      });
      console.log(cacheData);
      console.log(newTaskData);
      const newTaskGroups = produce(cacheData.findProject.taskGroups, (draftState: any) => {
        const targetIndex = draftState.findIndex(
          (taskGroup: any) => taskGroup.id === newTaskData.data.createTask.taskGroup.id,
        );
        draftState[targetIndex] = {
          ...draftState[targetIndex],
          tasks: [...draftState[targetIndex].tasks, { ...newTaskData.data.createTask }],
        };
      });
      console.log(newTaskGroups);
      const newData = {
        ...cacheData.findProject,
        taskGroups: newTaskGroups,
      };
      client.writeQuery({
        query: FindProjectDocument,
        variables: {
          projectId: projectId,
        },
        data: { findProject: newData },
      });
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
        BoardStateUtils.updateTaskName(listsData, newTaskData.updateTaskName.id, newTaskData.updateTaskName.name),
      );
    },
  });
  const { loading, data, refetch } = useFindProjectQuery({
    variables: { projectId },
  });
  console.log(`loading ${loading} - ${data}`);

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

  const [assignTask] = useAssignTaskMutation();

  const { showPopup } = usePopup();
  const $labelsRef = useRef<HTMLDivElement>(null);
  if (loading) {
    return (
      <>
        <GlobalTopNavbar name="Project" />
        <Title>Error Loading</Title>
      </>
    );
  }
  if (data) {
    const currentListsData: BoardState = { tasks: {}, columns: {} };
    data.findProject.taskGroups.forEach(taskGroup => {
      currentListsData.columns[taskGroup.id] = {
        taskGroupID: taskGroup.id,
        name: taskGroup.name,
        position: taskGroup.position,
        tasks: [],
      };
      taskGroup.tasks.forEach(task => {
        const taskMembers = task.assigned.map(assigned => {
          return {
            userID: assigned.id,
            displayName: `${assigned.firstName} ${assigned.lastName}`,
            profileIcon: {
              url: null,
              initials: assigned.profileIcon.initials ?? '',
              bgColor: assigned.profileIcon.bgColor ?? '#7367F0',
            },
          };
        });
        currentListsData.tasks[task.id] = {
          taskID: task.id,
          taskGroup: {
            taskGroupID: taskGroup.id,
          },
          name: task.name,
          labels: [],
          position: task.position,
          description: task.description ?? undefined,
          members: taskMembers,
        };
      });
    });
    const availableMembers = data.findProject.members.map(member => {
      return {
        displayName: `${member.firstName} ${member.lastName}`,
        profileIcon: {
          url: null,
          initials: member.profileIcon.initials ?? null,
          bgColor: member.profileIcon.bgColor ?? null,
        },
        userID: member.id,
      };
    });
    const onQuickEditorOpen = (e: ContextMenuEvent) => {
      const currentTask = Object.values(currentListsData.tasks).find(task => task.taskID === e.taskID);
      console.log(`currentTask: ${currentTask?.taskID}`);
      setQuickCardEditor({
        top: e.top,
        left: e.left,
        isOpen: true,
        task: currentTask,
      });
    };
    return (
      <>
        <GlobalTopNavbar name={data.findProject.name} />
        <ProjectActions>
          <ProjectAction
            ref={$labelsRef}
            onClick={() => {
              showPopup(
                $labelsRef,
                <LabelManagerEditor
                  labels={data.findProject.labels.map(label => {
                    return {
                      labelId: label.id,
                      name: label.name ?? '',
                      color: label.colorHex,
                      active: false,
                    };
                  })}
                />,
              );
            }}
          >
            <Tags size={13} color="#c2c6dc" />
            <ProjectActionText>Labels</ProjectActionText>
          </ProjectAction>
          <ProjectAction>
            <ToggleOn size={13} color="#c2c6dc" />
            <ProjectActionText>Fields</ProjectActionText>
          </ProjectAction>
          <ProjectAction>
            <Bolt size={13} color="#c2c6dc" />
            <ProjectActionText>Rules</ProjectActionText>
          </ProjectAction>
        </ProjectActions>
        <KanbanBoard
          listsData={currentListsData}
          onCardDrop={onCardDrop}
          onListDrop={onListDrop}
          onCardCreate={onCardCreate}
          onCreateList={onCreateList}
          onQuickEditorOpen={onQuickEditorOpen}
          onOpenListActionsPopup={($targetRef, taskGroupID) => {
            showPopup(
              $targetRef,
              <Popup title="List actions" tab={0} onClose={() => {}}>
                <ListActions
                  taskGroupID={taskGroupID}
                  onArchiveTaskGroup={tgID => {
                    deleteTaskGroup({ variables: { taskGroupID: tgID } });
                    setPopupData(initialPopupState);
                  }}
                />
              </Popup>,
            );
          }}
        />
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
            onArchiveCard={(_listId: string, cardId: string) =>
              deleteTask({
                variables: { taskID: cardId },
                update: client => {
                  const cacheData: any = client.readQuery({
                    query: FindProjectDocument,
                    variables: {
                      projectId: projectId,
                    },
                  });
                  const newData = {
                    ...cacheData.findProject,
                    taskGroups: cacheData.findProject.taskGroups.map((taskGroup: any) => {
                      return {
                        ...taskGroup,
                        tasks: taskGroup.tasks.filter((t: any) => t.id !== cardId),
                      };
                    }),
                  };
                  client.writeQuery({
                    query: FindProjectDocument,
                    variables: {
                      projectId: projectId,
                    },
                    data: { findProject: newData },
                  });
                },
              })
            }
            labels={[]}
            top={quickCardEditor.top}
            left={quickCardEditor.left}
          />
        )}
        <Route
          path={`${match.path}/c/:taskID`}
          render={(routeProps: RouteComponentProps<TaskRouteProps>) => (
            <Details
              refreshCache={() => {
                console.log('beep 2!');
                // refetch();
              }}
              availableMembers={availableMembers}
              projectURL={match.url}
              taskID={routeProps.match.params.taskID}
              onTaskNameChange={(updatedTask, newName) => {
                updateTaskName({ variables: { taskID: updatedTask.taskID, name: newName } });
              }}
              onTaskDescriptionChange={(updatedTask, newDescription) => {
                updateTaskDescription({ variables: { taskID: updatedTask.taskID, description: newDescription } });
              }}
              onDeleteTask={deletedTask => {
                setTaskDetails(initialTaskDetailsState);
                deleteTask({ variables: { taskID: deletedTask.taskID } });
              }}
              onOpenAddLabelPopup={(task, $targetRef) => {}}
            />
          )}
        />
      </>
    );
  }
  return <div>Error</div>;
};

export default Project;
