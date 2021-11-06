import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components/macro';
import GlobalTopNavbar from 'App/TopNavbar';
import Details from 'Projects/Project/Details';
import {
  useMyTasksQuery,
  MyTasksSort,
  MyTasksStatus,
  useCreateTaskMutation,
  MyTasksQuery,
  MyTasksDocument,
  useUpdateTaskNameMutation,
  useSetTaskCompleteMutation,
  useUpdateTaskDueDateMutation,
} from 'shared/generated/graphql';

import { Route, useRouteMatch, useHistory, RouteComponentProps } from 'react-router-dom';
import { usePopup, Popup } from 'shared/components/PopupMenu';
import updateApolloCache from 'shared/utils/cache';
import produce from 'immer';
import NOOP from 'shared/utils/noop';
import { Sort, Cogs, CaretDown, CheckCircle, CaretRight, CheckCircleOutline } from 'shared/icons';
import Select from 'react-select';
import { editorColourStyles } from 'shared/components/Select';
import useOnOutsideClick from 'shared/hooks/onOutsideClick';
import DueDateManager from 'shared/components/DueDateManager';
import dayjs from 'dayjs';
import useStickyState from 'shared/hooks/useStickyState';
import { StaticContext } from 'react-router';
import MyTasksSortPopup from './MyTasksSort';
import MyTasksStatusPopup from './MyTasksStatus';
import TaskEntry from './TaskEntry';

type TaskRouteProps = {
  taskID: string;
};

function prettyStatus(status: MyTasksStatus) {
  switch (status) {
    case MyTasksStatus.All:
      return 'All tasks';
    case MyTasksStatus.Incomplete:
      return 'Incomplete tasks';
    case MyTasksStatus.CompleteAll:
      return 'All completed tasks';
    case MyTasksStatus.CompleteToday:
      return 'Completed tasks: today';
    case MyTasksStatus.CompleteYesterday:
      return 'Completed tasks: yesterday';
    case MyTasksStatus.CompleteOneWeek:
      return 'Completed tasks: 1 week';
    case MyTasksStatus.CompleteTwoWeek:
      return 'Completed tasks: 2 weeks';
    case MyTasksStatus.CompleteThreeWeek:
      return 'Completed tasks: 3 weeks';
    default:
      return 'unknown tasks';
  }
}

function prettySort(sort: MyTasksSort) {
  if (sort === MyTasksSort.None) {
    return 'Sort';
  }
  return `Sort: ${sort.charAt(0) + sort.slice(1).toLowerCase().replace(/_/gi, ' ')}`;
}

type Group = {
  id: string;
  name: string | null;
  tasks: Array<Task>;
};
const DueDateEditorLabel = styled.div`
  align-items: center;
  color: ${(props) => props.theme.colors.text.primary};

  font-size: 11px;
  padding: 0 8px;
  flex: 0 1 auto;
  min-width: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  flex-flow: row wrap;
  white-space: pre-wrap;
  height: 35px;
`;

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

const ProjectActionWrapper = styled.div<{ disabled?: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: ${(props) => props.theme.colors.text.primary};

  &:not(:last-of-type) {
    margin-right: 16px;
  }

  &:hover {
    color: ${(props) => props.theme.colors.text.secondary};
  }
  ${(props) =>
    props.disabled &&
    css`
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
    `}
`;

const ProjectActionText = styled.span`
  padding-left: 4px;
`;

type ProjectActionProps = {
  onClick?: (target: React.RefObject<HTMLElement>) => void;
  disabled?: boolean;
};

const ProjectAction: React.FC<ProjectActionProps> = ({ onClick, disabled = false, children }) => {
  const $container = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (onClick) {
      onClick($container);
    }
  };
  return (
    <ProjectActionWrapper ref={$container} onClick={handleClick} disabled={disabled}>
      {children}
    </ProjectActionWrapper>
  );
};

const EditorPositioner = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${(p) => p.top}px;
  justify-content: flex-end;
  margin-left: -100vw;
  z-index: 10000;
  align-items: flex-start;
  display: flex;
  font-size: 13px;
  height: 0;
  position: fixed;
  width: 100vw;
  left: ${(p) => p.left}px;
`;

const EditorPositionerContents = styled.div`
  position: relative;
`;

const EditorContainer = styled.div<{ width: number }>`
  border: 1px solid ${(props) => props.theme.colors.primary};
  background: ${(props) => props.theme.colors.bg.secondary};
  position: relative;
  width: ${(p) => p.width}px;
`;

const EditorCell = styled.div<{ width: number }>`
  display: flex;
  width: ${(p) => p.width}px;
`;

// TABLE
const VerticalScoller = styled.div`
  contain: strict;
  flex: 1 1 auto;
  overflow-x: hidden;
  padding-bottom: 1px;
  position: relative;

  min-height: 1px;
  overflow-y: auto;
`;

const VerticalScollerInner = styled.div`
  min-height: 100%;
  overflow-y: hidden;
  min-width: 1px;
  overflow-x: auto;
`;

const VerticalScollerInnerBar = styled.div`
  display: flex;
  margin: 0 24px;
  margin-bottom: 1px;
  border-top: 1px solid #414561;
`;

const TableContents = styled.div`
  box-sizing: border-box;
  display: inline-block;
  margin-bottom: 32px;
  min-width: 100%;
`;

const TaskGroupContainer = styled.div``;

const TaskGroupHeader = styled.div`
  height: 50px;
  width: 100%;
`;

const TaskGroupItems = styled.div`
  overflow: unset;
`;

const ProjectPill = styled.div`
  background-color: ${(props) => props.theme.colors.bg.primary};
  text-overflow: ellipsis;
  border-radius: 10px;
  box-sizing: border-box;
  display: block;
  font-size: 12px;
  font-weight: 400;
  height: 20px;
  line-height: 20px;
  overflow: hidden;
  padding: 0 8px;
  text-align: left;
  white-space: nowrap;
`;

const ProjectPillContents = styled.div`
  align-items: center;
  display: flex;
`;

const ProjectPillName = styled.span`
  flex: 0 1 auto;
  min-width: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.text.primary};
`;

const ProjectPillColor = styled.svg`
  overflow: hidden;
  flex: 0 0 auto;
  margin-right: 4px;
  fill: #0064fb;
  height: 12px;
  width: 12px;
`;

const SingleValue = ({ children, ...props }: any) => {
  return (
    <ProjectPill>
      <ProjectPillContents>
        <ProjectPillColor viewBox="0 0 24 24" focusable={false}>
          <path d="M10.4,4h3.2c2.2,0,3,0.2,3.9,0.7c0.8,0.4,1.5,1.1,1.9,1.9s0.7,1.6,0.7,3.9v3.2c0,2.2-0.2,3-0.7,3.9c-0.4,0.8-1.1,1.5-1.9,1.9s-1.6,0.7-3.9,0.7h-3.2c-2.2,0-3-0.2-3.9-0.7c-0.8-0.4-1.5-1.1-1.9-1.9c-0.4-1-0.6-1.8-0.6-4v-3.2c0-2.2,0.2-3,0.7-3.9C5.1,5.7,5.8,5,6.6,4.6C7.4,4.2,8.2,4,10.4,4z" />
        </ProjectPillColor>
        <ProjectPillName>{children}</ProjectPillName>
      </ProjectPillContents>
    </ProjectPill>
  );
};

const OptionWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 40px;
  padding: 0 16px;
  cursor: pointer;
  &:hover {
    background: #414561;
  }
`;

const OptionLabel = styled.div`
  align-items: baseline;
  display: flex;
  min-width: 1px;
`;

const OptionTitle = styled.div`
  min-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const OptionSubTitle = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 11px;
  margin-left: 8px;
  min-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Option = ({ innerProps, data }: any) => {
  return (
    <OptionWrapper {...innerProps}>
      <OptionLabel>
        <OptionTitle>{data.label}</OptionTitle>
        <OptionSubTitle>{data.label}</OptionSubTitle>
      </OptionLabel>
    </OptionWrapper>
  );
};

const TaskGroupHeaderContents = styled.div<{ width: number }>`
  width: ${(p) => p.width}px;
  left: 0;
  position: absolute;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  margin-left: 24px;
  line-height: 20px;
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  min-height: 30px;
  padding-right: 32px;
  position: relative;
  border-bottom: 1px solid transparent;
  border-top: 1px solid transparent;
`;

const TaskGroupMinify = styled.div`
  height: 28px;
  min-height: 28px;
  min-width: 28px;
  width: 28px;
  border-radius: 6px;
  user-select: none;

  margin-right: 4px;

  align-items: center;
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  transition-duration: 0.2s;
  transition-property: background, border, box-shadow, fill;
  cursor: pointer;
  svg {
    fill: ${(props) => props.theme.colors.text.primary};
    transition-duration: 0.2s;
    transition-property: background, border, box-shadow, fill;
  }

  &:hover svg {
    fill: ${(props) => props.theme.colors.text.secondary};
  }
`;
const TaskGroupName = styled.div`
  flex-grow: 1;
  align-items: center;
  display: flex;
  height: 50px;
  min-width: 1px;
  color: ${(props) => props.theme.colors.text.secondary};
  font-weight: 400;
`;

// HEADER
const ScrollContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 1px;
  position: relative;
  width: 100%;
`;

const Row = styled.div`
  box-sizing: border-box;
  flex: 0 0 auto;
  height: 37px;
  position: relative;
`;

const RowHeaderLeft = styled.div<{ width: number }>`
  width: ${(p) => p.width}px;

  align-items: stretch;
  display: flex;
  flex-direction: column;
  height: 37px;
  left: 0;
  position: absolute;
  z-index: 100;
`;
const RowHeaderLeftInner = styled.div`
  align-items: stretch;
  color: ${(props) => props.theme.colors.text.primary};
  display: flex;
  flex: 1 0 auto;
  font-size: 12px;
  margin-right: -1px;
  padding-left: 24px;
`;
const RowHeaderLeftName = styled.div`
  position: relative;
  align-items: center;
  border-right: 1px solid #414561;
  border-top: 1px solid #414561;
  border-bottom: 1px solid #414561;
  display: flex;
  flex: 1 0 auto;
  justify-content: space-between;
`;

const RowHeaderLeftNameText = styled.div`
  align-items: center;
  display: flex;
`;

const RowHeaderRight = styled.div<{ left: number }>`
  left: ${(p) => p.left}px;
  right: 0px;
  height: 37px;
  position: absolute;
`;

const RowScrollable = styled.div`
  min-width: 1px;
  overflow-x: auto;
  overflow-y: hidden;
  width: 100%;
`;

const RowScrollContent = styled.div`
  align-items: center;
  display: inline-flex;
  height: 37px;
  width: 100%;
`;

const RowHeaderRightContainer = styled.div`
  padding-right: 24px;

  align-items: stretch;
  display: flex;
  flex: 1 0 auto;
  height: 37px;
  justify-content: flex-end;
  margin: -1px 0;
`;

const ItemWrapper = styled.div<{ width: number }>`
  width: ${(p) => p.width}px;
  align-items: center;
  border: 1px solid #414561;
  border-bottom: 0;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 12px;
  justify-content: space-between;
  margin-right: -1px;
  padding: 0 8px;
  position: relative;
  color: ${(props) => props.theme.colors.text.primary};
  border-bottom: 1px solid #414561;
  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.text.secondary};
  }
`;
const ItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  & ${ItemWrapper}:last-child {
    border-right: 0;
  }
`;

const ItemName = styled.div`
  align-items: center;
  display: flex;
  overflow: hidden;
`;
type DateEditorState = {
  open: boolean;
  pos: { top: number; left: number } | null;
  task: null | Task;
};

type ProjectEditorState = {
  open: boolean;
  pos: { top: number; left: number } | null;
  task: null | Task;
};
const RIGHT_ROW_WIDTH = 327;

const Projects = () => {
  const leftRow = window.innerWidth - RIGHT_ROW_WIDTH;
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useStickyState<{ sort: MyTasksSort; status: MyTasksStatus }>(
    { sort: MyTasksSort.None, status: MyTasksStatus.All },
    'my_tasks_filter',
  );
  const { data } = useMyTasksQuery({
    variables: { sort: filters.sort, status: filters.status },
    fetchPolicy: 'cache-and-network',
  });
  const [dateEditor, setDateEditor] = useState<DateEditorState>({ open: false, pos: null, task: null });
  const onEditDueDate = (task: Task, $target: React.RefObject<HTMLElement>) => {
    if ($target && $target.current && data) {
      const pos = $target.current.getBoundingClientRect();
      setDateEditor({
        open: true,
        pos: {
          top: pos.top,
          left: pos.right,
        },
        task,
      });
    }
  };
  const [newTask, setNewTask] = useState<{ open: boolean }>({ open: false });
  const match = useRouteMatch();
  const history = useHistory();
  const [projectEditor, setProjectEditor] = useState<ProjectEditorState>({ open: false, pos: null, task: null });
  const onEditProject = ($target: React.RefObject<HTMLElement>) => {
    if ($target && $target.current) {
      const pos = $target.current.getBoundingClientRect();
      setProjectEditor({
        open: true,
        pos: {
          top: pos.top,
          left: pos.right,
        },
        task: null,
      });
    }
  };
  const { showPopup, hidePopup } = usePopup();
  const [updateTaskDueDate] = useUpdateTaskDueDateMutation();
  const $editorContents = useRef<HTMLDivElement>(null);
  const $dateContents = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (dateEditor.open && $dateContents.current && dateEditor.task) {
      showPopup(
        $dateContents,
        <Popup tab={0} title={null}>
          <DueDateManager
            task={dateEditor.task}
            onCancel={() => null}
            onDueDateChange={(task, dueDate, hasTime) => {
              if (dateEditor.task) {
                hidePopup();
                updateTaskDueDate({
                  variables: {
                    taskID: dateEditor.task.id,
                    dueDate,
                    hasTime,
                    deleteNotifications: [],
                    updateNotifications: [],
                    createNotifications: [],
                  },
                });
                setDateEditor((prev) => ({
                  ...prev,
                  task: { ...task, dueDate: { at: dueDate.toISOString(), notifications: [] }, hasTime },
                }));
              }
            }}
            onRemoveDueDate={(task) => {
              if (dateEditor.task) {
                hidePopup();
                updateTaskDueDate({
                  variables: {
                    taskID: dateEditor.task.id,
                    dueDate: null,
                    hasTime: false,
                    deleteNotifications: [],
                    updateNotifications: [],
                    createNotifications: [],
                  },
                });
                setDateEditor((prev) => ({ ...prev, task: { ...task, hasTime: false } }));
              }
            }}
          />
        </Popup>,
        { onClose: () => setDateEditor({ open: false, task: null, pos: null }) },
      );
    }
  }, [dateEditor]);

  const [createTask] = useCreateTaskMutation({
    update: (client, newTaskData) => {
      updateApolloCache<MyTasksQuery>(
        client,
        MyTasksDocument,
        (cache) =>
          produce(cache, (draftCache) => {
            if (newTaskData.data) {
              draftCache.myTasks.tasks.unshift(newTaskData.data.createTask);
            }
          }),
        { status: MyTasksStatus.All, sort: MyTasksSort.None },
      );
    },
  });

  const [setTaskComplete] = useSetTaskCompleteMutation();
  const [updateTaskName] = useUpdateTaskNameMutation();
  const [minified, setMinified] = useStickyState<Array<string>>([], 'my_tasks_minified');
  useOnOutsideClick(
    $editorContents,
    projectEditor.open,
    () =>
      setProjectEditor({
        open: false,
        task: null,
        pos: null,
      }),
    null,
  );
  if (data) {
    const groups: Array<Group> = [];
    if (filters.sort === MyTasksSort.None) {
      groups.push({
        id: 'recently-assigned',
        name: 'Recently Assigned',
        tasks: data.myTasks.tasks.map((task) => ({
          ...task,
          labels: [],
          position: 0,
        })),
      });
    } else {
      let { tasks } = data.myTasks;
      if (filters.sort === MyTasksSort.DueDate) {
        const group: Group = { id: 'due_date', name: null, tasks: [] };
        data.myTasks.tasks.forEach((task) => {
          if (task.dueDate) {
            group.tasks.push({ ...task, labels: [], position: 0 });
          }
        });
        groups.push(group);
        tasks = tasks.filter((t) => t.dueDate === null);
      }
      const projects = new Map<string, Array<Task>>();
      data.myTasks.projects.forEach((p) => {
        if (!projects.has(p.projectID)) {
          projects.set(p.projectID, []);
        }
        const prev = projects.get(p.projectID);
        const task = tasks.find((t) => t.id === p.taskID);
        if (prev && task) {
          projects.set(p.projectID, [...prev, { ...task, labels: [], position: 0 }]);
        }
      });
      for (const [id, pTasks] of projects) {
        const project = data.projects.find((c) => c.id === id);
        if (pTasks.length === 0) continue;
        if (project) {
          groups.push({
            id,
            name: project.name,
            tasks: pTasks.sort((a, b) => {
              if (a.dueDate === null && b.dueDate === null) return 0;
              if (a.dueDate === null && b.dueDate !== null) return 1;
              if (a.dueDate !== null && b.dueDate === null) return -1;
              const first = dayjs(a.dueDate.at);
              const second = dayjs(b.dueDate.at);
              if (first.isSame(second, 'minute')) return 0;
              if (first.isAfter(second)) return -1;
              return 1;
            }),
          });
        }
      }
      groups.sort((a, b) => {
        if (a.name === null && b.name === null) return 0;
        if (a.name === null) return -1;
        if (b.name === null) return 1;
        return a.name.localeCompare(b.name);
      });
    }
    return (
      <>
        <GlobalTopNavbar onSaveProjectName={NOOP} projectID={null} name={null} />
        <ProjectBar>
          <ProjectActions />
          <ProjectActions>
            <ProjectAction
              onClick={($target) => {
                showPopup(
                  $target,
                  <MyTasksStatusPopup
                    status={filters.status}
                    onChangeStatus={(status) => {
                      setFilters((prev) => ({ ...prev, status }));
                      hidePopup();
                    }}
                  />,
                  { width: 185 },
                );
              }}
            >
              <CheckCircleOutline width={13} height={13} />
              <ProjectActionText>{prettyStatus(filters.status)}</ProjectActionText>
            </ProjectAction>
            <ProjectAction
              onClick={($target) => {
                showPopup(
                  $target,
                  <MyTasksSortPopup
                    sort={filters.sort}
                    onChangeSort={(sort) => {
                      setFilters((prev) => ({ ...prev, sort }));
                      hidePopup();
                    }}
                  />,
                  { width: 185 },
                );
              }}
            >
              <Sort width={13} height={13} />
              <ProjectActionText>{prettySort(filters.sort)}</ProjectActionText>
            </ProjectAction>
            <ProjectAction disabled>
              <Cogs width={13} height={13} />
              <ProjectActionText>Customize</ProjectActionText>
            </ProjectAction>
          </ProjectActions>
        </ProjectBar>
        <ScrollContainer>
          <Row>
            <RowHeaderLeft width={leftRow}>
              <RowHeaderLeftInner>
                <RowHeaderLeftName>
                  <RowHeaderLeftNameText>Task name</RowHeaderLeftNameText>
                </RowHeaderLeftName>
              </RowHeaderLeftInner>
            </RowHeaderLeft>
            <RowHeaderRight left={leftRow}>
              <RowScrollable>
                <RowScrollContent>
                  <RowHeaderRightContainer>
                    <ItemsContainer>
                      <ItemWrapper width={120}>
                        <ItemName>Due date</ItemName>
                      </ItemWrapper>
                      <ItemWrapper width={120}>
                        <ItemName>Project</ItemName>
                      </ItemWrapper>
                      <ItemWrapper width={50} />
                    </ItemsContainer>
                  </RowHeaderRightContainer>
                </RowScrollContent>
              </RowScrollable>
            </RowHeaderRight>
          </Row>
          <VerticalScoller>
            <VerticalScollerInner>
              <TableContents>
                {groups.map((group) => {
                  const isMinified = minified.find((m) => m === group.id) ?? false;
                  return (
                    <TaskGroupContainer key={group.id}>
                      {group.name && (
                        <TaskGroupHeader>
                          <TaskGroupHeaderContents width={leftRow}>
                            <TaskGroupMinify
                              onClick={() => {
                                setMinified((prev) => {
                                  if (isMinified) {
                                    return prev.filter((c) => c !== group.id);
                                  }
                                  return [...prev, group.id];
                                });
                              }}
                            >
                              {isMinified ? (
                                <CaretRight width={16} height={16} />
                              ) : (
                                <CaretDown width={16} height={16} />
                              )}
                            </TaskGroupMinify>
                            <TaskGroupName>{group.name}</TaskGroupName>
                          </TaskGroupHeaderContents>
                        </TaskGroupHeader>
                      )}
                      <TaskGroupItems>
                        {!isMinified &&
                          group.tasks.map((task) => {
                            const projectID = data.myTasks.projects.find((t) => t.taskID === task.id)?.projectID;
                            const projectName = data.projects.find((p) => p.id === projectID)?.name;
                            return (
                              <TaskEntry
                                key={task.id}
                                complete={task.complete ?? false}
                                onToggleComplete={(complete) => {
                                  setTaskComplete({ variables: { taskID: task.id, complete } });
                                }}
                                onTaskDetails={() => {
                                  history.push(`${match.url}/c/${task.id}`);
                                }}
                                onRemoveDueDate={() => {
                                  updateTaskDueDate({
                                    variables: {
                                      taskID: task.id,
                                      dueDate: null,
                                      hasTime: false,
                                      deleteNotifications: [],
                                      updateNotifications: [],
                                      createNotifications: [],
                                    },
                                  });
                                }}
                                project={projectName ?? 'none'}
                                dueDate={task.dueDate.at}
                                hasTime={task.hasTime ?? false}
                                name={task.name}
                                onEditName={(name) => updateTaskName({ variables: { taskID: task.id, name } })}
                                onEditProject={onEditProject}
                                onEditDueDate={($target) =>
                                  onEditDueDate({ ...task, position: 0, labels: [] }, $target)
                                }
                              />
                            );
                          })}
                      </TaskGroupItems>
                    </TaskGroupContainer>
                  );
                })}
              </TableContents>
            </VerticalScollerInner>
          </VerticalScoller>
        </ScrollContainer>
        {dateEditor.open && dateEditor.pos !== null && dateEditor.task && (
          <EditorPositioner left={dateEditor.pos.left} top={dateEditor.pos.top}>
            <EditorPositionerContents ref={$dateContents}>
              <EditorContainer width={120}>
                <EditorCell width={120}>
                  <DueDateEditorLabel>
                    {dateEditor.task.dueDate
                      ? dayjs(dateEditor.task.dueDate.at).format(
                          dateEditor.task.hasTime ? 'MMM D [at] h:mm A' : 'MMM D',
                        )
                      : ''}
                  </DueDateEditorLabel>
                </EditorCell>
              </EditorContainer>
            </EditorPositionerContents>
          </EditorPositioner>
        )}
        {projectEditor.open && projectEditor.pos !== null && (
          <EditorPositioner left={projectEditor.pos.left} top={projectEditor.pos.top}>
            <EditorPositionerContents ref={$editorContents}>
              <EditorContainer width={300}>
                <EditorCell width={300}>
                  <Select
                    components={{ SingleValue, Option }}
                    autoFocus
                    styles={editorColourStyles}
                    options={[{ label: 'hello', value: '1' }]}
                    onInputChange={(query, { action }) => {
                      if (action === 'input-change') {
                        setMenuOpen(true);
                      }
                    }}
                    onChange={() => setMenuOpen(false)}
                    onBlur={() => setMenuOpen(false)}
                    menuIsOpen={menuOpen}
                  />
                </EditorCell>
              </EditorContainer>
            </EditorPositionerContents>
          </EditorPositioner>
        )}
        <Route
          path={`${match.path}/c/:taskID`}
          render={() => {
            return (
              <Details
                refreshCache={NOOP}
                availableMembers={[]}
                projectURL={`${match.url}`}
                onTaskNameChange={(updatedTask, newName) => {
                  updateTaskName({ variables: { taskID: updatedTask.id, name: newName } });
                }}
                onTaskDescriptionChange={(updatedTask, newDescription) => {
                  /*
                updateTaskDescription({
                  variables: { taskID: updatedTask.id, description: newDescription },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    updateTaskDescription: {
                      __typename: 'Task',
                      id: updatedTask.id,
                      description: newDescription,
                    },
                  },
                });
                */
                }}
                onDeleteTask={(deletedTask) => {
                  // deleteTask({ variables: { taskID: deletedTask.id } });
                  history.push(`${match.url}`);
                }}
                onOpenAddLabelPopup={(task, $targetRef) => {
                  /*
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
                */
                }}
              />
            );
          }}
        />
      </>
    );
  }
  return null;
};

export default Projects;
