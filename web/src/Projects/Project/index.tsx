// LOC830
import React, { useState, useRef, useContext, useEffect } from 'react';
import { MENU_TYPES } from 'shared/components/TopNavbar';
import updateApolloCache from 'shared/utils/cache';
import GlobalTopNavbar, { ProjectPopup } from 'App/TopNavbar';
import styled from 'styled-components/macro';
import { Bolt, ToggleOn, Tags, CheckCircle, Sort, Filter } from 'shared/icons';
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
  FindProjectQuery,
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
  const cacheData: FindProjectQuery = client.readQuery({
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
  target: React.RefObject<HTMLElement> | null;
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
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findProject.labels.push({ ...newLabelData.data.createProjectLabel });
          }),
        {
          projectId: projectID,
        },
      );
    },
  });
  const [updateProjectLabel] = useUpdateProjectLabelMutation();
  const [deleteProjectLabel] = useDeleteProjectLabelMutation({
    update: (client, newLabelData) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findProject.labels = cache.findProject.labels.filter(
              label => label.id !== newLabelData.data.deleteProjectLabel.id,
            );
          }),
        { projectId: projectID },
      );
    },
  });
  const labels = labelsRef.current ? labelsRef.current : [];
  const taskLabels = taskLabelsRef && taskLabelsRef.current ? taskLabelsRef.current : [];
  const [currentTaskLabels, setCurrentTaskLabels] = useState(taskLabels);
  console.log(taskLabels);
  const { setTab, hidePopup } = usePopup();
  return (
    <>
      <Popup title="Labels" tab={0} onClose={() => hidePopup()}>
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
      <Popup onClose={() => hidePopup()} title="Edit label" tab={1}>
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
      <Popup onClose={() => hidePopup()} title="Create new label" tab={2}>
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
  target: null,
};

const ProjectBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            const { previousTaskGroupID, task } = newTask.data.updateTaskLocation;
            if (previousTaskGroupID !== task.taskGroup.id) {
              const { taskGroups } = cache.findProject;
              const oldTaskGroupIdx = taskGroups.findIndex((t: TaskGroup) => t.id === previousTaskGroupID);
              const newTaskGroupIdx = taskGroups.findIndex((t: TaskGroup) => t.id === task.taskGroup.id);
              if (oldTaskGroupIdx !== -1 && newTaskGroupIdx !== -1) {
                draftCache.findProject.taskGroups[oldTaskGroupIdx].tasks = taskGroups[oldTaskGroupIdx].tasks.filter(
                  (t: Task) => t.id !== task.id,
                );
                draftCache.findProject.taskGroups[newTaskGroupIdx].tasks = [
                  ...taskGroups[newTaskGroupIdx].tasks,
                  { ...task },
                ];
              }
            }
          }),
        { projectId: projectID },
      );
    },
  });
  const [updateTaskGroupLocation] = useUpdateTaskGroupLocationMutation({});

  const [deleteTaskGroup] = useDeleteTaskGroupMutation({
    onCompleted: deletedTaskGroupData => {},
    update: (client, deletedTaskGroupData) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findProject.taskGroups = draftCache.findProject.taskGroups.filter(
              (taskGroup: TaskGroup) => taskGroup.id !== deletedTaskGroupData.data.deleteTaskGroup.taskGroup.id,
            );
          }),
        { projectId: projectID },
      );
    },
  });

  const [createTaskGroup] = useCreateTaskGroupMutation({
    onCompleted: newTaskGroupData => {},
    update: (client, newTaskGroupData) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache => {
          console.log(cache);
          return produce(cache, draftCache => {
            draftCache.findProject.taskGroups.push({ ...newTaskGroupData.data.createTaskGroup, tasks: [] });
          });
        },
        { projectId: projectID },
      );
    },
  });

  const [createTask] = useCreateTaskMutation({
    onCompleted: newTaskData => {},
    update: (client, newTaskData) => {
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            const { taskGroups } = cache.findProject;
            const idx = taskGroups.findIndex(taskGroup => taskGroup.id === newTaskData.data.createTask.taskGroup.id);
            if (idx !== -1) {
              draftCache.findProject.taskGroups[idx].tasks.push({ ...newTaskData.data.createTask });
            }
          }),
        { projectId: projectID },
      );
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
              name,
              complete: false,
              taskGroup: {
                __typename: 'TaskGroup',
                id: taskGroup.id,
                name: taskGroup.name,
                position: taskGroup.position,
              },
              badges: {
                checklist: null,
              },
              position,
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
    updateApolloCache<FindProjectQuery>(
      client,
      FindProjectDocument,
      cache =>
        produce(cache, draftCache => {
          const taskGroupIdx = cache.findProject.taskGroups.findIndex(t => t.id === droppedColumn.id);
          if (taskGroupIdx !== -1) {
            draftCache.findProject.taskGroups[taskGroupIdx].position = droppedColumn.position;
          }
        }),
      {
        projectId: projectID,
      },
    );
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
      updateApolloCache<FindProjectQuery>(
        client,
        FindProjectDocument,
        cache =>
          produce(cache, draftCache => {
            draftCache.findProject.name = newName.data.updateProjectName.name;
          }),
        { projectId: projectID },
      );
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
    const onQuickEditorOpen = ($target: React.RefObject<HTMLElement>, taskID: string, taskGroupID: string) => {
      if ($target && $target.current) {
        const pos = $target.current.getBoundingClientRect();
        const height = 120;
        if (window.innerHeight - pos.bottom < height) {
        }
      }
      const taskGroup = data.findProject.taskGroups.find(t => t.id === taskGroupID);
      const currentTask = taskGroup ? taskGroup.tasks.find(t => t.id === taskID) : null;
      if (currentTask) {
        setQuickCardEditor({
          target: $target,
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
          popupContent={<ProjectPopup history={history} name={data.findProject.name} projectID={projectID} />}
          menuType={MENU_TYPES.PROJECT_MENU}
          initialTab={0}
          projectMembers={data.findProject.members}
          projectID={projectID}
          name={data.findProject.name}
        />
        <ProjectBar>
          <ProjectActions>
            <ProjectAction>
              <CheckCircle width={13} height={13} />
              <ProjectActionText>All Tasks</ProjectActionText>
            </ProjectAction>
            <ProjectAction>
              <Filter width={13} height={13} />
              <ProjectActionText>Filter</ProjectActionText>
            </ProjectAction>
            <ProjectAction>
              <Sort width={13} height={13} />
              <ProjectActionText>Sort</ProjectActionText>
            </ProjectAction>
          </ProjectActions>
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
              <Popup
                title={null}
                onClose={() => {
                  hidePopup();
                }}
                tab={0}
              >
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
              <Popup title="List actions" tab={0} onClose={() => hidePopup()}>
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
        {quickCardEditor.isOpen && currentQuickTask && quickCardEditor.target && (
          <QuickCardEditor
            task={currentQuickTask}
            onCloseEditor={() => setQuickCardEditor(initialQuickCardEditorState)}
            onEditCard={(_taskGroupID: string, taskID: string, cardName: string) => {
              updateTaskName({ variables: { taskID, name: cardName } });
            }}
            onOpenMembersPopup={($targetRef, task) => {
              showPopup(
                $targetRef,
                <Popup title="Members" tab={0} onClose={() => hidePopup()}>
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
                <Popup title={null} onClose={() => hidePopup()} tab={0}>
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
                  updateApolloCache<FindProjectQuery>(
                    client,
                    FindProjectDocument,
                    cache =>
                      produce(cache, draftCache => {
                        draftCache.findProject.taskGroups = cache.findProject.taskGroups.map(taskGroup => ({
                          ...taskGroup,
                          tasks: taskGroup.tasks.filter(t => t.id !== cardId),
                        }));
                      }),
                    { projectId: projectID },
                  );
                },
              })
            }
            onOpenDueDatePopup={($targetRef, task) => {
              showPopup(
                $targetRef,
                <Popup title={'Change Due Date'} tab={0} onClose={() => hidePopup()}>
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
            target={quickCardEditor.target}
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
