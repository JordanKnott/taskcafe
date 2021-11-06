import dayjs from 'dayjs';

export enum TaskSortingType {
  NONE,
  COMPLETE,
  DUE_DATE,
  MEMBERS,
  LABELS,
  TASK_TITLE,
}

export enum TaskSortingDirection {
  ASC,
  DESC,
}

export type TaskSorting = {
  type: TaskSortingType;
  direction: TaskSortingDirection;
};

export function sortString(a: string, b: string) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

export function sortTasks(a: Task, b: Task, taskSorting: TaskSorting) {
  if (taskSorting.type === TaskSortingType.TASK_TITLE) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
  if (taskSorting.type === TaskSortingType.DUE_DATE) {
    if (a.dueDate && !b.dueDate) {
      return -1;
    }
    if (b.dueDate && !a.dueDate) {
      return 1;
    }
    return dayjs(a.dueDate.at).diff(dayjs(b.dueDate.at));
  }
  if (taskSorting.type === TaskSortingType.COMPLETE) {
    if (a.complete && !b.complete) {
      return -1;
    }
    if (b.complete && !a.complete) {
      return 1;
    }
    return 0;
  }
  if (taskSorting.type === TaskSortingType.LABELS) {
    // sorts non-empty labels by name, then by empty label color name
    let aLabels = [];
    let bLabels = [];
    let aLabelsEmpty = [];
    let bLabelsEmpty = [];
    if (a.labels) {
      for (const aLabel of a.labels) {
        if (aLabel.projectLabel.name && aLabel.projectLabel.name !== '') {
          aLabels.push(aLabel.projectLabel.name);
        } else {
          aLabelsEmpty.push(aLabel.projectLabel.labelColor.name);
        }
      }
    }
    if (b.labels) {
      for (const bLabel of b.labels) {
        if (bLabel.projectLabel.name && bLabel.projectLabel.name !== '') {
          bLabels.push(bLabel.projectLabel.name);
        } else {
          bLabelsEmpty.push(bLabel.projectLabel.labelColor.name);
        }
      }
    }
    aLabels = aLabels.sort((aLabel, bLabel) => sortString(aLabel, bLabel));
    bLabels = bLabels.sort((aLabel, bLabel) => sortString(aLabel, bLabel));
    aLabelsEmpty = aLabelsEmpty.sort((aLabel, bLabel) => sortString(aLabel, bLabel));
    bLabelsEmpty = bLabelsEmpty.sort((aLabel, bLabel) => sortString(aLabel, bLabel));
    if (aLabelsEmpty.length !== 0 || bLabelsEmpty.length !== 0) {
      if (aLabelsEmpty.length > bLabelsEmpty.length) {
        if (bLabels.length !== 0) {
          return 1;
        }
        return -1;
      }
    }
    if (aLabels.length < bLabels.length) {
      return 1;
    }
    if (aLabels.length > bLabels.length) {
      return -1;
    }
    return 0;
  }
  if (taskSorting.type === TaskSortingType.MEMBERS) {
    let aMembers = [];
    let bMembers = [];
    if (a.assigned) {
      for (const aMember of a.assigned) {
        if (aMember.fullName) {
          aMembers.push(aMember.fullName);
        }
      }
    }
    if (b.assigned) {
      for (const bMember of b.assigned) {
        if (bMember.fullName) {
          bMembers.push(bMember.fullName);
        }
      }
    }
    aMembers = aMembers.sort((aMember, bMember) => sortString(aMember, bMember));
    bMembers = bMembers.sort((aMember, bMember) => sortString(aMember, bMember));
    if (aMembers.length < bMembers.length) {
      return 1;
    }
    if (aMembers.length > bMembers.length) {
      return -1;
    }
    return 0;
  }
  return 0;
}
