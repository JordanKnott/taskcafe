import produce from 'immer';

export const addTask = (currentState: BoardState, newTask: Task) => {
  return produce(currentState, (draftState: BoardState) => {
    draftState.tasks[newTask.taskID] = newTask;
  });
};

export const deleteTask = (currentState: BoardState, taskID: string) => {
  return produce(currentState, (draftState: BoardState) => {
    delete draftState.tasks[taskID];
  });
};

export const addTaskGroup = (currentState: BoardState, newTaskGroup: TaskGroup) => {
  return produce(currentState, (draftState: BoardState) => {
    draftState.columns[newTaskGroup.taskGroupID] = newTaskGroup;
  });
};

export const updateTaskGroup = (currentState: BoardState, newTaskGroup: TaskGroup) => {
  return produce(currentState, (draftState: BoardState) => {
    draftState.columns[newTaskGroup.taskGroupID] = newTaskGroup;
  });
};

export const updateTask = (currentState: BoardState, newTask: Task) => {
  return produce(currentState, (draftState: BoardState) => {
    draftState.tasks[newTask.taskID] = newTask;
  });
};

export const deleteTaskGroup = (currentState: BoardState, deletedTaskGroupID: string) => {
  return produce(currentState, (draftState: BoardState) => {
    delete draftState.columns[deletedTaskGroupID];
    const filteredTasks = Object.keys(currentState.tasks)
      .filter(taskID => currentState.tasks[taskID].taskGroup.taskGroupID !== deletedTaskGroupID)
      .reduce((obj: TaskState, key: string) => {
        obj[key] = currentState.tasks[key];
        return obj;
      }, {});
    draftState.tasks = filteredTasks;
  });
};

export const updateTaskName = (currentState: BoardState, taskID: string, newName: string) => {
  return produce(currentState, (draftState: BoardState) => {
    draftState.tasks[taskID].name = newName;
  });
};
