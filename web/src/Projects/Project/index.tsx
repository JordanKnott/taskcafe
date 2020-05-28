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
} from 'shared/generated/graphql';

import TaskAssignee from 'shared/components/TaskAssignee';
import QuickCardEditor from 'shared/components/QuickCardEditor';
import ListActions from 'shared/components/ListActions';
import MemberManager from 'shared/components/MemberManager';
import { LabelsPopup } from 'shared/components/PopupMenu/PopupMenu.stories';
import KanbanBoard from 'Projects/Project/KanbanBoard';
import { mixin } from 'shared/utils/styles';
import LabelManager from 'shared/components/PopupMenu/LabelManager';
import LabelEditor from 'shared/components/PopupMenu/LabelEditor';
import produce from 'immer';
import MiniProfile from 'shared/components/MiniProfile';
import Details from './Details';

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
const ProjectMembers = styled.div`
  display: flex;
  padding-left: 4px;
  padding-top: 4px;
  align-items: center;
`;

type LabelManagerEditorProps = {
  labels: React.RefObject<Array<Label>>;
  projectID: string;
  labelColors: Array<LabelColor>;
};

const LabelManagerEditor: React.FC<LabelManagerEditorProps> = ({ labels: labelsRef, projectID, labelColors }) => {
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
            setCurrentLabel(labelId);
            setTab(1);
          }}
        />
      </Popup>
      <Popup onClose={() => {}} title="Edit label" tab={1}>
        <LabelEditor
          labelColors={labelColors}
          label={labels.find(label => label.labelId === currentLabel) ?? null}
          onLabelEdit={(projectLabelID, name, color) => {
            if (projectLabelID) {
              updateProjectLabel({ variables: { projectLabelID, labelColorID: color.id, name } });
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
            createProjectLabel({ variables: { projectID, labelColorID: color.id, name } });
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

const initialState: BoardState = { tasks: {}, columns: {} };
const initialPopupState = { left: 0, top: 0, isOpen: false, taskGroupID: '' };
const initialQuickCardEditorState: QuickCardEditorState = { isOpen: false, top: 0, left: 0 };
const initialTaskDetailsState = { isOpen: false, taskID: '' };

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
  const { projectID } = useParams<ProjectParams>();
  const match = useRouteMatch();

  const [updateTaskDescription] = useUpdateTaskDescriptionMutation();
  const [listsData, setListsData] = useState(initialState);
  const [quickCardEditor, setQuickCardEditor] = useState(initialQuickCardEditorState);
  const [updateTaskLocation] = useUpdateTaskLocationMutation();
  const [updateTaskGroupLocation] = useUpdateTaskGroupLocationMutation();

  const [deleteTaskGroup] = useDeleteTaskGroupMutation({
    onCompleted: deletedTaskGroupData => {
      setListsData(BoardStateUtils.deleteTaskGroup(listsData, deletedTaskGroupData.deleteTaskGroup.taskGroup.id));
    },
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
    onCompleted: newTaskGroupData => {
      const newTaskGroup = {
        taskGroupID: newTaskGroupData.createTaskGroup.id,
        tasks: [],
        ...newTaskGroupData.createTaskGroup,
      };
      setListsData(BoardStateUtils.addTaskGroup(listsData, newTaskGroup));
    },
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
    variables: { projectId: projectID },
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

  const onCardDrop = (droppedTask: Task) => {
    updateTaskLocation({
      variables: {
        taskID: droppedTask.taskID,
        taskGroupID: droppedTask.taskGroup.taskGroupID,
        position: droppedTask.position,
      },
      optimisticResponse: {
        updateTaskLocation: {
          name: droppedTask.name,
          id: droppedTask.taskID,
          position: droppedTask.position,
          createdAt: '',
        },
      },
    });
    setListsData(BoardStateUtils.updateTask(listsData, droppedTask));
  };
  const onListDrop = (droppedColumn: TaskGroup) => {
    console.log(`list drop ${droppedColumn.taskGroupID}`);
    updateTaskGroupLocation({
      variables: { taskGroupID: droppedColumn.taskGroupID, position: droppedColumn.position },
      optimisticResponse: {
        updateTaskGroupLocation: {
          id: droppedColumn.taskGroupID,
          position: droppedColumn.position,
        },
      },
    });
    // setListsData(BoardStateUtils.updateTaskGroup(listsData, droppedColumn));
  };

  const onCreateList = (listName: string) => {
    const [lastColumn] = Object.values(listsData.columns)
      .sort((a, b) => a.position - b.position)
      .slice(-1);
    let position = 65535;
    if (lastColumn) {
      position = lastColumn.position * 2 + 1;
    }
    createTaskGroup({ variables: { projectID, name: listName, position } });
  };

  const [assignTask] = useAssignTaskMutation();

  const { showPopup, hidePopup } = usePopup();
  const $labelsRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<Array<Label>>([]);
  if (loading) {
    return (
      <>
        <GlobalTopNavbar name="Project" />
        <Title>Error Loading</Title>
      </>
    );
  }
  if (data) {
    console.log(data);
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
      setQuickCardEditor({
        top: e.top,
        left: e.left,
        isOpen: true,
        task: currentTask,
      });
    };

    labelsRef.current = data.findProject.labels.map(label => {
      return {
        labelId: label.id,
        name: label.name ?? '',
        labelColor: label.labelColor,
        active: false,
      };
    });
    return (
      <>
        <GlobalTopNavbar projectMembers={availableMembers} name={data.findProject.name} />
        <ProjectBar>
          <ProjectActions>
            <ProjectAction
              ref={$labelsRef}
              onClick={() => {
                showPopup(
                  $labelsRef,
                  <LabelManagerEditor labelColors={data.labelColors} labels={labelsRef} projectID={projectID} />,
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
        </ProjectBar>
        <KanbanBoard
          listsData={currentListsData}
          onCardDrop={onCardDrop}
          onListDrop={onListDrop}
          onCardCreate={onCardCreate}
          onCreateList={onCreateList}
          onCardMemberClick={($targetRef, taskID, memberID) => {
            showPopup(
              $targetRef,
              <Popup title={null} onClose={() => {}} tab={0}>
                <MiniProfile
                  profileIcon={availableMembers[0].profileIcon}
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
          onQuickEditorOpen={onQuickEditorOpen}
          onOpenListActionsPopup={($targetRef, taskGroupID) => {
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
            onOpenPopup={() => {}}
            onArchiveCard={(_listId: string, cardId: string) =>
              deleteTask({
                variables: { taskID: cardId },
                update: client => {
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
            labels={[]}
            top={quickCardEditor.top}
            left={quickCardEditor.left}
          />
        )}
        <Route
          path={`${match.path}/c/:taskID`}
          render={(routeProps: RouteComponentProps<TaskRouteProps>) => (
            <Details
              refreshCache={() => {}}
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
