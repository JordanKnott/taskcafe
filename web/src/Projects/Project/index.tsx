import React, { useState, useRef, useContext, useEffect } from 'react';
import GlobalTopNavbar from 'App/TopNavbar';
import styled from 'styled-components/macro';
import { Bolt, ToggleOn, Tags } from 'shared/icons';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import { useParams, Route, useRouteMatch, useHistory, RouteComponentProps } from 'react-router-dom';
import {
  useSetTaskCompleteMutation,
  useToggleTaskLabelMutation,
  useUpdateProjectNameMutation,
  useFindProjectQuery,
  useUpdateTaskGroupNameMutation,
  useUpdateTaskNameMutation,
  useUpdateProjectLabelMutation,
  useCreateTaskMutation,
  useDeleteProjectLabelMutation,
  useDeleteTaskMutation,
  useUpdateTaskLocationMutation,
  useUpdateTaskGroupLocationMutation,
  useCreateTaskGroupMutation,
  useDeleteTaskGroupMutation,
  useUpdateTaskDescriptionMutation,
  useAssignTaskMutation,
  DeleteTaskDocument,
  FindProjectDocument,
  useCreateProjectLabelMutation,
  useUnassignTaskMutation,
  useUpdateTaskDueDateMutation,
} from 'shared/generated/graphql';

import TaskAssignee from 'shared/components/TaskAssignee';
import QuickCardEditor from 'shared/components/QuickCardEditor';
import ListActions from 'shared/components/ListActions';
import MemberManager from 'shared/components/MemberManager';
import { LabelsPopup } from 'shared/components/PopupMenu/PopupMenu.stories';
import KanbanBoard from 'Projects/Project/KanbanBoard';
import SimpleLists from 'shared/components/Lists';
import { mixin } from 'shared/utils/styles';
import LabelManager from 'shared/components/PopupMenu/LabelManager';
import LabelEditor from 'shared/components/PopupMenu/LabelEditor';
import produce from 'immer';
import MiniProfile from 'shared/components/MiniProfile';
import Details from './Details';
import { useApolloClient } from '@apollo/react-hooks';
import UserIDContext from 'App/context';
import DueDateManager from 'shared/components/DueDateManager';

const getCacheData = (client: any, projectID: string) => {
  const cacheData: any = client.readQuery({
    query: FindProjectDocument,
    variables: {
      projectId: projectID,
    },
  });
  return cacheData;
};

const writeCacheData = (client: any, projectID: string, cacheData: any, newData: any) => {
  client.writeQuery({
    query: FindProjectDocument,
    variables: {
      projectId: projectID,
    },
    data: { ...cacheData, findProject: newData },
  });
};

type TaskRouteProps = {
  taskID: string;
};

interface QuickCardEditorState {
  isOpen: boolean;
  left: number;
  top: number;
  width: number;
  taskID: string | null;
  taskGroupID: string | null;
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
const ProjectMembers = styled.div`
  display: flex;
  padding-left: 4px;
  padding-top: 4px;
  align-items: center;
`;

type LabelManagerEditorProps = {
  labels: React.RefObject<Array<ProjectLabel>>;
  taskLabels: null | React.RefObject<Array<TaskLabel>>;
  projectID: string;
  labelColors: Array<LabelColor>;
  onLabelToggle?: (labelId: string) => void;
};

const LabelManagerEditor: React.FC<LabelManagerEditorProps> = ({
  labels: labelsRef,
  projectID,
  labelColors,
  onLabelToggle,
  taskLabels: taskLabelsRef,
}) => {
  const [currentLabel, setCurrentLabel] = useState('');
  const [createProjectLabel] = useCreateProjectLabelMutation({
    update: (client, newLabelData) => {
      const cacheData = getCacheData(client, projectID);
      const newData = {
        ...cacheData.findProject,
        labels: [...cacheData.findProject.labels, { ...newLabelData.data.createProjectLabel }],
      };
      writeCacheData(client, projectID, cacheData, newData);
    },
  });
  const [updateProjectLabel] = useUpdateProjectLabelMutation();
  const [deleteProjectLabel] = useDeleteProjectLabelMutation({
    update: (client, newLabelData) => {
      const cacheData = getCacheData(client, projectID);
      const newData = {
        ...cacheData.findProject,
        labels: cacheData.findProject.labels.filter(
          (label: any) => label.id !== newLabelData.data.deleteProjectLabel.id,
        ),
      };
      writeCacheData(client, projectID, cacheData, newData);
    },
  });
  const labels = labelsRef.current ? labelsRef.current : [];
  const taskLabels = taskLabelsRef && taskLabelsRef.current ? taskLabelsRef.current : [];
  const [currentTaskLabels, setCurrentTaskLabels] = useState(taskLabels);
  console.log(taskLabels);
  const { setTab } = usePopup();
  return (
    <>
      <Popup title="Labels" tab={0} onClose={() => {}}>
        <LabelManager
          labels={labels}
          taskLabels={currentTaskLabels}
          onLabelCreate={() => {
            setTab(2);
          }}
          onLabelEdit={labelId => {
            setCurrentLabel(labelId);
            setTab(1);
          }}
          onLabelToggle={labelId => {
            if (onLabelToggle) {
              if (currentTaskLabels.find(t => t.projectLabel.id === labelId)) {
                setCurrentTaskLabels(currentTaskLabels.filter(t => t.projectLabel.id !== labelId));
              } else {
                const newProjectLabel = labels.find(l => l.id === labelId);
                if (newProjectLabel) {
                  setCurrentTaskLabels([
                    ...currentTaskLabels,
                    { id: '', assignedDate: '', projectLabel: { ...newProjectLabel } },
                  ]);
                }
              }
              setCurrentLabel(labelId);
              onLabelToggle(labelId);
            } else {
              setCurrentLabel(labelId);
              setTab(1);
            }
          }}
        />
      </Popup>
      <Popup onClose={() => {}} title="Edit label" tab={1}>
        <LabelEditor
          labelColors={labelColors}
          label={labels.find(label => label.id === currentLabel) ?? null}
          onLabelEdit={(projectLabelID, name, color) => {
            if (projectLabelID) {
              updateProjectLabel({ variables: { projectLabelID, labelColorID: color.id, name: name ?? '' } });
            }
            setTab(0);
          }}
          onLabelDelete={labelID => {
            deleteProjectLabel({ variables: { projectLabelID: labelID } });
            setTab(0);
          }}
        />
      </Popup>
      <Popup onClose={() => {}} title="Create new label" tab={2}>
        <LabelEditor
          labelColors={labelColors}
          label={null}
          onLabelEdit={(_labelId, name, color) => {
            createProjectLabel({ variables: { projectID, labelColorID: color.id, name: name ?? '' } });
            setTab(0);
          }}
        />
      </Popup>
    </>
  );
};

interface ProjectParams {
  projectID: string;
}

const initialQuickCardEditorState: QuickCardEditorState = {
  taskID: null,
  taskGroupID: null,
  isOpen: false,
  top: 0,
  left: 0,
  width: 272,
};

const ProjectBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  padding: 0 12px;
`;

const ProjectActions = styled.div`
  display: flex;
  align-items: center;
`;

const ProjectAction = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: rgba(${props => props.theme.colors.text.primary});

  &:not(:last-child) {
    margin-right: 16px;
  }

  &:hover {
    color: rgba(${props => props.theme.colors.text.secondary});
  }
`;

const ProjectActionText = styled.span`
  padding-left: 4px;
`;

const Project = () => {
  const { projectID } = useParams<ProjectParams>();
  const history = useHistory();
  const match = useRouteMatch();

  const [updateTaskDescription] = useUpdateTaskDescriptionMutation();
  const [quickCardEditor, setQuickCardEditor] = useState(initialQuickCardEditorState);
  const [updateTaskLocation] = useUpdateTaskLocationMutation({
    update: (client, newTask) => {
      const cacheData = getCacheData(client, projectID);
      console.log(cacheData);
      console.log(newTask);

      const newTaskGroups = produce(cacheData.findProject.taskGroups, (draftState: Array<TaskGroup>) => {
        const { previousTaskGroupID, task } = newTask.data.updateTaskLocation;
        if (previousTaskGroupID !== task.taskGroup.id) {
          const oldTaskGroupIdx = draftState.findIndex((t: TaskGroup) => t.id === previousTaskGroupID);
          const newTaskGroupIdx = draftState.findIndex((t: TaskGroup) => t.id === task.taskGroup.id);
          if (oldTaskGroupIdx !== -1 && newTaskGroupIdx !== -1) {
            draftState[oldTaskGroupIdx].tasks = draftState[oldTaskGroupIdx].tasks.filter((t: Task) => t.id !== task.id);
            draftState[newTaskGroupIdx].tasks = [...draftState[newTaskGroupIdx].tasks, { ...task }];
          }
        }
      });

      const newData = {
        ...cacheData.findProject,
        taskGroups: newTaskGroups,
      };
      writeCacheData(client, projectID, cacheData, newData);
    },
  });
  const [updateTaskGroupLocation] = useUpdateTaskGroupLocationMutation({});

  const [deleteTaskGroup] = useDeleteTaskGroupMutation({
    onCompleted: deletedTaskGroupData => {},
    update: (client, deletedTaskGroupData) => {
      const cacheData = getCacheData(client, projectID);
      const newData = {
        ...cacheData.findProject,
        taskGroups: cacheData.findProject.taskGroups.filter(
          (taskGroup: any) => taskGroup.id !== deletedTaskGroupData.data.deleteTaskGroup.taskGroup.id,
        ),
      };

      writeCacheData(client, projectID, cacheData, newData);
    },
  });

  const [createTaskGroup] = useCreateTaskGroupMutation({
    onCompleted: newTaskGroupData => {},
    update: (client, newTaskGroupData) => {
      const cacheData = getCacheData(client, projectID);
      const newData = {
        ...cacheData.findProject,
        taskGroups: [...cacheData.findProject.taskGroups, { ...newTaskGroupData.data.createTaskGroup, tasks: [] }],
      };

      writeCacheData(client, projectID, cacheData, newData);
    },
  });

  const [createTask] = useCreateTaskMutation({
    onCompleted: newTaskData => {},
    update: (client, newTaskData) => {
      const cacheData = getCacheData(client, projectID);
      const newTaskGroups = produce(cacheData.findProject.taskGroups, (draftState: any) => {
        const targetIndex = draftState.findIndex(
          (taskGroup: any) => taskGroup.id === newTaskData.data.createTask.taskGroup.id,
        );
        draftState[targetIndex] = {
          ...draftState[targetIndex],
          tasks: [...draftState[targetIndex].tasks, { ...newTaskData.data.createTask }],
        };
      });
      const newData = {
        ...cacheData.findProject,
        taskGroups: newTaskGroups,
      };
      writeCacheData(client, projectID, cacheData, newData);
    },
  });

  const [deleteTask] = useDeleteTaskMutation({
    onCompleted: deletedTask => {},
  });

  const [updateTaskName] = useUpdateTaskNameMutation({
    onCompleted: newTaskData => {},
  });
  const [toggleTaskLabel] = useToggleTaskLabelMutation({
    onCompleted: newTaskLabel => {
      taskLabelsRef.current = newTaskLabel.toggleTaskLabel.task.labels;
      console.log(taskLabelsRef.current);
    },
  });
  const { loading, data, refetch } = useFindProjectQuery({
    variables: { projectId: projectID },
    onCompleted: newData => {},
  });

  const onCardCreate = (taskGroupID: string, name: string) => {
    if (data) {
      const taskGroupTasks = data.findProject.taskGroups.filter(t => t.id === taskGroupID);
      if (taskGroupTasks) {
        let position = 65535;
        if (taskGroupTasks.length !== 0) {
          const [lastTask] = taskGroupTasks.sort((a: any, b: any) => a.position - b.position).slice(-1);
          position = Math.ceil(lastTask.position) * 2 + 1;
        }

        createTask({ variables: { taskGroupID, name, position } });
      }
    }
  };

  const onCreateTask = (taskGroupID: string, name: string) => {
    if (data) {
      const taskGroup = data.findProject.taskGroups.find(t => t.id === taskGroupID);
      console.log(`taskGroup ${taskGroup}`);
      if (taskGroup) {
        let position = 65535;
        if (taskGroup.tasks.length !== 0) {
          const [lastTask] = taskGroup.tasks
            .slice()
            .sort((a: any, b: any) => a.position - b.position)
            .slice(-1);
          position = Math.ceil(lastTask.position) * 2 + 1;
        }

        console.log(`position ${position}`);
        createTask({
          variables: { taskGroupID, name, position },
          optimisticResponse: {
            __typename: 'Mutation',
            createTask: {
              __typename: 'Task',
              id: '' + Math.round(Math.random() * -1000000),
              name: name,
              taskGroup: {
                __typename: 'TaskGroup',
                id: taskGroup.id,
                name: taskGroup.name,
                position: taskGroup.position,
              },
              position: position,
              dueDate: null,
              description: null,
              labels: [],
              assigned: [],
            },
          },
        });
      }
    }
  };

  const onListDrop = (droppedColumn: TaskGroup) => {
    console.log(`list drop ${droppedColumn.id}`);
    const cacheData = getCacheData(client, projectID);
    const newData = produce(cacheData, (draftState: any) => {
      const taskGroupIdx = cacheData.findProject.taskGroups.findIndex((t: any) => t.id === droppedColumn.id);
      cacheData.findProject.taskGroups[taskGroupIdx].position = droppedColumn.position;
    });
    writeCacheData(client, projectID, cacheData, newData);
    updateTaskGroupLocation({
      variables: { taskGroupID: droppedColumn.id, position: droppedColumn.position },
      optimisticResponse: {
        updateTaskGroupLocation: {
          id: droppedColumn.id,
          position: droppedColumn.position,
        },
      },
    });
  };

  const onCreateList = (listName: string) => {
    if (data) {
      const [lastColumn] = data.findProject.taskGroups.sort((a, b) => a.position - b.position).slice(-1);
      let position = 65535;
      if (lastColumn) {
        position = lastColumn.position * 2 + 1;
      }
      createTaskGroup({ variables: { projectID, name: listName, position } });
    }
  };

  const [assignTask] = useAssignTaskMutation();
  const [unassignTask] = useUnassignTaskMutation();

  const [updateTaskGroupName] = useUpdateTaskGroupNameMutation({});

  const [updateTaskDueDate] = useUpdateTaskDueDateMutation();

  const [updateProjectName] = useUpdateProjectNameMutation({
    update: (client, newName) => {
      const cacheData = getCacheData(client, projectID);
      const newData = {
        ...cacheData.findProject,
        name: newName.data.updateProjectName.name,
      };
      writeCacheData(client, projectID, cacheData, newData);
    },
  });

  const [setTaskComplete] = useSetTaskCompleteMutation();

  const client = useApolloClient();
  const { userID } = useContext(UserIDContext);

  const { showPopup, hidePopup } = usePopup();
  const $labelsRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<Array<ProjectLabel>>([]);
  const taskLabelsRef = useRef<Array<TaskLabel>>([]);
  useEffect(() => {
    if (data) {
      document.title = `${data.findProject.name} | Citadel`;
    }
  }, [data]);
  if (loading) {
    return (
      <>
        <GlobalTopNavbar onSaveProjectName={projectName => {}} name="" projectID={null} />
      </>
    );
  }
  if (data) {
    console.log(data.findProject);
    const onQuickEditorOpen = (e: ContextMenuEvent) => {
      const taskGroup = data.findProject.taskGroups.find(t => t.id === e.taskGroupID);
      const currentTask = taskGroup ? taskGroup.tasks.find(t => t.id === e.taskID) : null;
      if (currentTask) {
        setQuickCardEditor({
          top: e.top,
          left: e.left,
          width: e.width,
          isOpen: true,
          taskID: currentTask.id,
          taskGroupID: currentTask.taskGroup.id,
        });
      }
    };

    labelsRef.current = data.findProject.labels;

    let currentQuickTask = null;
    if (quickCardEditor.taskID && quickCardEditor.taskGroupID) {
      const targetGroup = data.findProject.taskGroups.find(t => t.id === quickCardEditor.taskGroupID);
      if (targetGroup) {
        currentQuickTask = targetGroup.tasks.find(t => t.id === quickCardEditor.taskID);
      }
    }

    return (
      <>
        <GlobalTopNavbar
          onSaveProjectName={projectName => {
            updateProjectName({ variables: { projectID, name: projectName } });
          }}
          projectMembers={data.findProject.members}
          projectID={projectID}
          name={data.findProject.name}
        />
        <ProjectBar>
          <ProjectActions>
            <ProjectAction
              ref={$labelsRef}
              onClick={() => {
                showPopup(
                  $labelsRef,
                  <LabelManagerEditor
                    taskLabels={null}
                    labelColors={data.labelColors}
                    labels={labelsRef}
                    projectID={projectID}
                  />,
                );
              }}
            >
              <Tags width={13} height={13} />
              <ProjectActionText>Labels</ProjectActionText>
            </ProjectAction>
            <ProjectAction>
              <ToggleOn width={13} height={13} />
              <ProjectActionText>Fields</ProjectActionText>
            </ProjectAction>
            <ProjectAction>
              <Bolt width={13} height={13} />
              <ProjectActionText>Rules</ProjectActionText>
            </ProjectAction>
          </ProjectActions>
        </ProjectBar>
        <SimpleLists
          onTaskClick={task => {
            history.push(`${match.url}/c/${task.id}`);
          }}
          onTaskDrop={(droppedTask, previousTaskGroupID) => {
            updateTaskLocation({
              variables: {
                taskID: droppedTask.id,
                taskGroupID: droppedTask.taskGroup.id,
                position: droppedTask.position,
              },
              optimisticResponse: {
                __typename: 'Mutation',
                updateTaskLocation: {
                  previousTaskGroupID,
                  task: {
                    name: droppedTask.name,
                    id: droppedTask.id,
                    position: droppedTask.position,
                    taskGroup: {
                      id: droppedTask.taskGroup.id,
                      __typename: 'TaskGroup',
                    },
                    createdAt: '',
                    __typename: 'Task',
                  },
                },
              },
            });
          }}
          onTaskGroupDrop={droppedTaskGroup => {
            updateTaskGroupLocation({
              variables: { taskGroupID: droppedTaskGroup.id, position: droppedTaskGroup.position },
              optimisticResponse: {
                __typename: 'Mutation',
                updateTaskGroupLocation: {
                  id: droppedTaskGroup.id,
                  position: droppedTaskGroup.position,
                  __typename: 'TaskGroup',
                },
              },
            });
          }}
          taskGroups={data.findProject.taskGroups}
          onCreateTask={onCreateTask}
          onCreateTaskGroup={onCreateList}
          onCardMemberClick={($targetRef, taskID, memberID) => {
            const member = data.findProject.members.find(m => m.id === memberID);
            const profileIcon = member ? member.profileIcon : null;
            showPopup(
              $targetRef,
              <Popup title={null} onClose={() => {}} tab={0}>
                <MiniProfile
                  profileIcon={profileIcon}
                  displayName="Jordan Knott"
                  username="@jordanthedev"
                  bio="None"
                  onRemoveFromTask={() => {
                    /* unassignTask({ variables: { taskID: data.findTask.id, userID: userID ?? '' } }); */
                  }}
                />
              </Popup>,
            );
          }}
          onChangeTaskGroupName={(taskGroupID, name) => {
            updateTaskGroupName({ variables: { taskGroupID, name } });
          }}
          onQuickEditorOpen={onQuickEditorOpen}
          onExtraMenuOpen={(taskGroupID: string, $targetRef: any) => {
            showPopup(
              $targetRef,
              <Popup title="List actions" tab={0} onClose={() => {}}>
                <ListActions
                  taskGroupID={taskGroupID}
                  onArchiveTaskGroup={tgID => {
                    deleteTaskGroup({ variables: { taskGroupID: tgID } });
                    hidePopup();
                  }}
                />
              </Popup>,
            );
          }}
        />
        {quickCardEditor.isOpen && currentQuickTask && (
          <QuickCardEditor
            task={currentQuickTask}
            onCloseEditor={() => setQuickCardEditor(initialQuickCardEditorState)}
            onEditCard={(_taskGroupID: string, taskID: string, cardName: string) => {
              updateTaskName({ variables: { taskID, name: cardName } });
            }}
            onOpenMembersPopup={($targetRef, task) => {
              showPopup(
                $targetRef,
                <Popup title="Members" tab={0} onClose={() => {}}>
                  <MemberManager
                    availableMembers={data.findProject.members}
                    activeMembers={task.assigned ?? []}
                    onMemberChange={(member, isActive) => {
                      if (isActive) {
                        assignTask({ variables: { taskID: task.id, userID: userID ?? '' } });
                      } else {
                        unassignTask({ variables: { taskID: task.id, userID: userID ?? '' } });
                      }
                    }}
                  />
                </Popup>,
              );
            }}
            onCardMemberClick={($targetRef, taskID, memberID) => {
              const member = data.findProject.members.find(m => m.id === memberID);
              const profileIcon = member ? member.profileIcon : null;
              showPopup(
                $targetRef,
                <Popup title={null} onClose={() => {}} tab={0}>
                  <MiniProfile
                    profileIcon={profileIcon}
                    displayName="Jordan Knott"
                    username="@jordanthedev"
                    bio="None"
                    onRemoveFromTask={() => {
                      /* unassignTask({ variables: { taskID: data.findTask.id, userID: userID ?? '' } }); */
                    }}
                  />
                </Popup>,
              );
            }}
            onOpenLabelsPopup={($targetRef, task) => {
              taskLabelsRef.current = task.labels;
              showPopup(
                $targetRef,
                <LabelManagerEditor
                  onLabelToggle={labelID => {
                    toggleTaskLabel({ variables: { taskID: task.id, projectLabelID: labelID } });
                  }}
                  labelColors={data.labelColors}
                  labels={labelsRef}
                  taskLabels={taskLabelsRef}
                  projectID={projectID}
                />,
              );
            }}
            onArchiveCard={(_listId: string, cardId: string) =>
              deleteTask({
                variables: { taskID: cardId },
                update: () => {
                  const cacheData = getCacheData(client, projectID);
                  const newData = {
                    ...cacheData.findProject,
                    taskGroups: cacheData.findProject.taskGroups.map((taskGroup: any) => {
                      return {
                        ...taskGroup,
                        tasks: taskGroup.tasks.filter((t: any) => t.id !== cardId),
                      };
                    }),
                  };
                  writeCacheData(client, projectID, cacheData, newData);
                },
              })
            }
            onOpenDueDatePopup={($targetRef, task) => {
              showPopup(
                $targetRef,
                <Popup
                  title={'Change Due Date'}
                  tab={0}
                  onClose={() => {
                    hidePopup();
                  }}
                >
                  <DueDateManager
                    task={task}
                    onRemoveDueDate={t => {
                      updateTaskDueDate({ variables: { taskID: t.id, dueDate: null } });
                      hidePopup();
                    }}
                    onDueDateChange={(t, newDueDate) => {
                      updateTaskDueDate({ variables: { taskID: t.id, dueDate: newDueDate } });
                      hidePopup();
                    }}
                    onCancel={() => {}}
                  />
                </Popup>,
              );
            }}
            onToggleComplete={task => {
              setTaskComplete({ variables: { taskID: task.id, complete: !task.complete } });
            }}
            top={quickCardEditor.top}
            left={quickCardEditor.left}
            width={quickCardEditor.width}
          />
        )}
        <Route
          path={`${match.path}/c/:taskID`}
          render={(routeProps: RouteComponentProps<TaskRouteProps>) => (
            <Details
              refreshCache={() => {}}
              availableMembers={data.findProject.members}
              projectURL={match.url}
              taskID={routeProps.match.params.taskID}
              onTaskNameChange={(updatedTask, newName) => {
                updateTaskName({ variables: { taskID: updatedTask.id, name: newName } });
              }}
              onTaskDescriptionChange={(updatedTask, newDescription) => {
                updateTaskDescription({ variables: { taskID: updatedTask.id, description: newDescription } });
              }}
              onDeleteTask={deletedTask => {
                deleteTask({ variables: { taskID: deletedTask.id } });
              }}
              onOpenAddLabelPopup={(task, $targetRef) => {
                taskLabelsRef.current = task.labels;
                showPopup(
                  $targetRef,
                  <LabelManagerEditor
                    onLabelToggle={labelID => {
                      toggleTaskLabel({ variables: { taskID: task.id, projectLabelID: labelID } });
                    }}
                    labelColors={data.labelColors}
                    labels={labelsRef}
                    taskLabels={taskLabelsRef}
                    projectID={projectID}
                  />,
                );
              }}
            />
          )}
        />
      </>
    );
  }
  return <div>Error</div>;
};

export default Project;
