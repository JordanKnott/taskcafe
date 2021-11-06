import { TaskMetaFilters, DueDateFilterType } from 'shared/components/Lists';
import dayjs from 'dayjs';

enum ShouldFilter {
  NO_FILTER,
  VALID,
  NOT_VALID,
}

function shouldFilter(cond: boolean) {
  return cond ? ShouldFilter.VALID : ShouldFilter.NOT_VALID;
}

export default function shouldMetaFilter(task: Task, filters: TaskMetaFilters) {
  let isFiltered = ShouldFilter.NO_FILTER;
  if (filters.taskName) {
    isFiltered = shouldFilter(task.name.toLowerCase().startsWith(filters.taskName.name.toLowerCase()));
  }
  if (filters.dueDate) {
    if (isFiltered === ShouldFilter.NO_FILTER) {
      isFiltered = ShouldFilter.NOT_VALID;
    }
    if (filters.dueDate.type === DueDateFilterType.NO_DUE_DATE) {
      isFiltered = shouldFilter(!(task.dueDate && task.dueDate !== null));
    }
    if (task.dueDate) {
      const taskDueDate = dayjs(task.dueDate.at);
      const today = dayjs();
      let start;
      let end;
      switch (filters.dueDate.type) {
        case DueDateFilterType.OVERDUE:
          isFiltered = shouldFilter(taskDueDate.isBefore(today));
          break;
        case DueDateFilterType.TODAY:
          isFiltered = shouldFilter(taskDueDate.isSame(today, 'day'));
          break;
        case DueDateFilterType.TOMORROW:
          isFiltered = shouldFilter(taskDueDate.isBefore(today.clone().add(1, 'day').endOf('day')));
          break;
        case DueDateFilterType.THIS_WEEK:
          start = today.clone().weekday(0).startOf('day');
          end = today.clone().weekday(6).endOf('day');
          isFiltered = shouldFilter(taskDueDate.isBetween(start, end));
          break;
        case DueDateFilterType.NEXT_WEEK:
          start = today.clone().weekday(0).add(7, 'day').startOf('day');
          end = today.clone().weekday(6).add(7, 'day').endOf('day');
          isFiltered = shouldFilter(taskDueDate.isBetween(start, end));
          break;
        case DueDateFilterType.ONE_WEEK:
          start = today.clone().startOf('day');
          end = today.clone().add(7, 'day').endOf('day');
          isFiltered = shouldFilter(taskDueDate.isBetween(start, end));
          break;
        case DueDateFilterType.TWO_WEEKS:
          start = today.clone().startOf('day');
          end = today.clone().add(14, 'day').endOf('day');
          isFiltered = shouldFilter(taskDueDate.isBetween(start, end));
          break;
        case DueDateFilterType.THREE_WEEKS:
          start = today.clone().startOf('day');
          end = today.clone().add(21, 'day').endOf('day');
          isFiltered = shouldFilter(taskDueDate.isBetween(start, end));
          break;
        default:
          isFiltered = ShouldFilter.NOT_VALID;
      }
    }
  }
  if (filters.members.length !== 0) {
    if (isFiltered === ShouldFilter.NO_FILTER) {
      isFiltered = ShouldFilter.NOT_VALID;
    }
    for (const member of filters.members) {
      if (task.assigned) {
        if (task.assigned.findIndex((m) => m.id === member.id) !== -1) {
          isFiltered = ShouldFilter.VALID;
        }
      }
    }
  }
  if (filters.labels.length !== 0) {
    if (isFiltered === ShouldFilter.NO_FILTER) {
      isFiltered = ShouldFilter.NOT_VALID;
    }
    for (const label of filters.labels) {
      if (task.labels) {
        if (task.labels.findIndex((m) => m.projectLabel.id === label.id) !== -1) {
          isFiltered = ShouldFilter.VALID;
        }
      }
    }
  }
  if (isFiltered === ShouldFilter.NO_FILTER) {
    return true;
  }
  if (isFiltered === ShouldFilter.VALID) {
    return true;
  }
  return false;
}
