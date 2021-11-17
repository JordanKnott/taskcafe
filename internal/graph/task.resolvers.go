package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"strconv"
	"time"

	mTasks "github.com/RichardKnop/machinery/v1/tasks"
	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/jinzhu/now"
	"github.com/jordanknott/taskcafe/internal/db"
	"github.com/jordanknott/taskcafe/internal/logger"
	log "github.com/sirupsen/logrus"
)

func (r *mutationResolver) CreateTaskChecklist(ctx context.Context, input CreateTaskChecklist) (*db.TaskChecklist, error) {
	createdAt := time.Now().UTC()
	taskChecklist, err := r.Repository.CreateTaskChecklist(ctx, db.CreateTaskChecklistParams{
		TaskID:    input.TaskID,
		CreatedAt: createdAt,
		Name:      input.Name,
		Position:  input.Position,
	})
	if err != nil {
		return &db.TaskChecklist{}, err
	}

	return &taskChecklist, nil
}

func (r *mutationResolver) DeleteTaskChecklist(ctx context.Context, input DeleteTaskChecklist) (*DeleteTaskChecklistPayload, error) {
	taskChecklist, err := r.Repository.GetTaskChecklistByID(ctx, input.TaskChecklistID)
	if err != nil {
		return &DeleteTaskChecklistPayload{Ok: false}, err
	}
	err = r.Repository.DeleteTaskChecklistByID(ctx, input.TaskChecklistID)
	if err != nil {
		return &DeleteTaskChecklistPayload{Ok: false}, err
	}
	return &DeleteTaskChecklistPayload{Ok: true, TaskChecklist: &taskChecklist}, nil
}

func (r *mutationResolver) UpdateTaskChecklistName(ctx context.Context, input UpdateTaskChecklistName) (*db.TaskChecklist, error) {
	checklist, err := r.Repository.UpdateTaskChecklistName(ctx, db.UpdateTaskChecklistNameParams{TaskChecklistID: input.TaskChecklistID, Name: input.Name})
	if err != nil {
		return &db.TaskChecklist{}, err
	}
	return &checklist, nil
}

func (r *mutationResolver) CreateTaskChecklistItem(ctx context.Context, input CreateTaskChecklistItem) (*db.TaskChecklistItem, error) {
	createdAt := time.Now().UTC()
	taskChecklistItem, err := r.Repository.CreateTaskChecklistItem(ctx, db.CreateTaskChecklistItemParams{
		TaskChecklistID: input.TaskChecklistID,
		CreatedAt:       createdAt,
		Name:            input.Name,
		Position:        input.Position,
	})
	if err != nil {
		return &db.TaskChecklistItem{}, err
	}

	return &taskChecklistItem, nil
}

func (r *mutationResolver) UpdateTaskChecklistLocation(ctx context.Context, input UpdateTaskChecklistLocation) (*UpdateTaskChecklistLocationPayload, error) {
	checklist, err := r.Repository.UpdateTaskChecklistPosition(ctx, db.UpdateTaskChecklistPositionParams{Position: input.Position, TaskChecklistID: input.TaskChecklistID})

	if err != nil {
		return &UpdateTaskChecklistLocationPayload{}, err
	}

	return &UpdateTaskChecklistLocationPayload{Checklist: &checklist}, nil
}

func (r *mutationResolver) UpdateTaskChecklistItemName(ctx context.Context, input UpdateTaskChecklistItemName) (*db.TaskChecklistItem, error) {
	task, err := r.Repository.UpdateTaskChecklistItemName(ctx, db.UpdateTaskChecklistItemNameParams{TaskChecklistItemID: input.TaskChecklistItemID,
		Name: input.Name,
	})
	if err != nil {
		return &db.TaskChecklistItem{}, err
	}
	return &task, nil
}

func (r *mutationResolver) SetTaskChecklistItemComplete(ctx context.Context, input SetTaskChecklistItemComplete) (*db.TaskChecklistItem, error) {
	item, err := r.Repository.SetTaskChecklistItemComplete(ctx, db.SetTaskChecklistItemCompleteParams{TaskChecklistItemID: input.TaskChecklistItemID, Complete: input.Complete})
	if err != nil {
		return &db.TaskChecklistItem{}, err
	}
	return &item, nil
}

func (r *mutationResolver) DeleteTaskChecklistItem(ctx context.Context, input DeleteTaskChecklistItem) (*DeleteTaskChecklistItemPayload, error) {
	item, err := r.Repository.GetTaskChecklistItemByID(ctx, input.TaskChecklistItemID)
	if err != nil {
		return &DeleteTaskChecklistItemPayload{
			Ok:                false,
			TaskChecklistItem: &db.TaskChecklistItem{},
		}, err
	}
	err = r.Repository.DeleteTaskChecklistItem(ctx, input.TaskChecklistItemID)
	if err != nil {
		return &DeleteTaskChecklistItemPayload{
			Ok:                false,
			TaskChecklistItem: &db.TaskChecklistItem{},
		}, err
	}
	return &DeleteTaskChecklistItemPayload{
		Ok:                true,
		TaskChecklistItem: &item,
	}, err
}

func (r *mutationResolver) UpdateTaskChecklistItemLocation(ctx context.Context, input UpdateTaskChecklistItemLocation) (*UpdateTaskChecklistItemLocationPayload, error) {
	currentChecklistItem, err := r.Repository.GetTaskChecklistItemByID(ctx, input.TaskChecklistItemID)

	checklistItem, err := r.Repository.UpdateTaskChecklistItemLocation(ctx, db.UpdateTaskChecklistItemLocationParams{TaskChecklistID: input.TaskChecklistID, TaskChecklistItemID: input.TaskChecklistItemID, Position: input.Position})
	if err != nil {
		return &UpdateTaskChecklistItemLocationPayload{}, err
	}
	return &UpdateTaskChecklistItemLocationPayload{PrevChecklistID: currentChecklistItem.TaskChecklistID, TaskChecklistID: input.TaskChecklistID, ChecklistItem: &checklistItem}, err
}

func (r *mutationResolver) CreateTaskComment(ctx context.Context, input *CreateTaskComment) (*CreateTaskCommentPayload, error) {
	userID, _ := GetUserID(ctx)
	createdAt := time.Now().UTC()
	comment, err := r.Repository.CreateTaskComment(ctx, db.CreateTaskCommentParams{
		TaskID:    input.TaskID,
		CreatedAt: createdAt,
		CreatedBy: userID,
		Message:   input.Message,
	})
	return &CreateTaskCommentPayload{Comment: &comment, TaskID: input.TaskID}, err
}

func (r *mutationResolver) DeleteTaskComment(ctx context.Context, input *DeleteTaskComment) (*DeleteTaskCommentPayload, error) {
	task, err := r.Repository.DeleteTaskCommentByID(ctx, input.CommentID)
	return &DeleteTaskCommentPayload{TaskID: task.TaskID, CommentID: input.CommentID}, err
}

func (r *mutationResolver) UpdateTaskComment(ctx context.Context, input *UpdateTaskComment) (*UpdateTaskCommentPayload, error) {
	updatedAt := time.Now().UTC()
	comment, err := r.Repository.UpdateTaskComment(ctx, db.UpdateTaskCommentParams{
		TaskCommentID: input.CommentID,
		UpdatedAt:     sql.NullTime{Valid: true, Time: updatedAt},
		Message:       input.Message,
	})
	return &UpdateTaskCommentPayload{Comment: &comment}, err
}

func (r *mutationResolver) CreateTaskGroup(ctx context.Context, input NewTaskGroup) (*db.TaskGroup, error) {
	createdAt := time.Now().UTC()
	project, err := r.Repository.CreateTaskGroup(ctx,
		db.CreateTaskGroupParams{input.ProjectID, createdAt, input.Name, input.Position})
	return &project, err
}

func (r *mutationResolver) UpdateTaskGroupLocation(ctx context.Context, input NewTaskGroupLocation) (*db.TaskGroup, error) {
	taskGroup, err := r.Repository.UpdateTaskGroupLocation(ctx, db.UpdateTaskGroupLocationParams{
		input.TaskGroupID,
		input.Position,
	})
	return &taskGroup, err
}

func (r *mutationResolver) UpdateTaskGroupName(ctx context.Context, input UpdateTaskGroupName) (*db.TaskGroup, error) {
	taskGroup, err := r.Repository.SetTaskGroupName(ctx, db.SetTaskGroupNameParams{TaskGroupID: input.TaskGroupID, Name: input.Name})
	if err != nil {
		return &db.TaskGroup{}, err
	}
	return &taskGroup, nil
}

func (r *mutationResolver) DeleteTaskGroup(ctx context.Context, input DeleteTaskGroupInput) (*DeleteTaskGroupPayload, error) {
	deletedTasks, err := r.Repository.DeleteTasksByTaskGroupID(ctx, input.TaskGroupID)
	if err != nil {
		return &DeleteTaskGroupPayload{}, err
	}
	taskGroup, err := r.Repository.GetTaskGroupByID(ctx, input.TaskGroupID)
	if err != nil {
		return &DeleteTaskGroupPayload{}, err
	}
	deletedTaskGroups, err := r.Repository.DeleteTaskGroupByID(ctx, input.TaskGroupID)
	if err != nil {
		return &DeleteTaskGroupPayload{}, err
	}
	return &DeleteTaskGroupPayload{true, int(deletedTasks + deletedTaskGroups), &taskGroup}, nil
}

func (r *mutationResolver) DuplicateTaskGroup(ctx context.Context, input DuplicateTaskGroup) (*DuplicateTaskGroupPayload, error) {
	createdAt := time.Now().UTC()
	taskGroup, err := r.Repository.CreateTaskGroup(ctx, db.CreateTaskGroupParams{ProjectID: input.ProjectID, Position: input.Position, Name: input.Name, CreatedAt: createdAt})
	if err != nil {
		return &DuplicateTaskGroupPayload{}, err
	}

	originalTasks, err := r.Repository.GetTasksForTaskGroupID(ctx, input.TaskGroupID)
	if err != nil && err != sql.ErrNoRows {
		return &DuplicateTaskGroupPayload{}, err
	}
	for _, originalTask := range originalTasks {
		task, err := r.Repository.CreateTaskAll(ctx, db.CreateTaskAllParams{
			TaskGroupID: taskGroup.TaskGroupID, CreatedAt: createdAt, Name: originalTask.Name, Position: originalTask.Position,
			Complete: originalTask.Complete, DueDate: originalTask.DueDate, Description: originalTask.Description})
		if err != nil {
			return &DuplicateTaskGroupPayload{}, err
		}
		members, err := r.Repository.GetAssignedMembersForTask(ctx, originalTask.TaskID)
		if err != nil {
			return &DuplicateTaskGroupPayload{}, err
		}
		for _, member := range members {
			_, err := r.Repository.CreateTaskAssigned(ctx, db.CreateTaskAssignedParams{
				TaskID: task.TaskID, UserID: member.UserID, AssignedDate: member.AssignedDate})
			if err != nil {
				return &DuplicateTaskGroupPayload{}, err
			}
		}
		labels, err := r.Repository.GetTaskLabelsForTaskID(ctx, originalTask.TaskID)
		if err != nil {
			return &DuplicateTaskGroupPayload{}, err
		}
		for _, label := range labels {
			_, err := r.Repository.CreateTaskLabelForTask(ctx, db.CreateTaskLabelForTaskParams{
				TaskID: task.TaskID, ProjectLabelID: label.ProjectLabelID, AssignedDate: label.AssignedDate})
			if err != nil {
				return &DuplicateTaskGroupPayload{}, err
			}
		}
		checklists, err := r.Repository.GetTaskChecklistsForTask(ctx, originalTask.TaskID)
		if err != nil {
			return &DuplicateTaskGroupPayload{}, err
		}
		for _, checklist := range checklists {
			newChecklist, err := r.Repository.CreateTaskChecklist(ctx, db.CreateTaskChecklistParams{
				TaskID: task.TaskID, Name: checklist.Name, CreatedAt: createdAt, Position: checklist.Position})
			if err != nil {
				return &DuplicateTaskGroupPayload{}, err
			}
			checklistItems, err := r.Repository.GetTaskChecklistItemsForTaskChecklist(ctx, checklist.TaskChecklistID)
			if err != nil {
				return &DuplicateTaskGroupPayload{}, err
			}
			for _, checklistItem := range checklistItems {
				item, err := r.Repository.CreateTaskChecklistItem(ctx, db.CreateTaskChecklistItemParams{
					TaskChecklistID: newChecklist.TaskChecklistID,
					CreatedAt:       createdAt,
					Name:            checklistItem.Name,
					Position:        checklist.Position,
				})
				if checklistItem.Complete {
					r.Repository.SetTaskChecklistItemComplete(ctx, db.SetTaskChecklistItemCompleteParams{TaskChecklistItemID: item.TaskChecklistItemID, Complete: true})
				}
				if err != nil {
					return &DuplicateTaskGroupPayload{}, err
				}
			}

		}
	}
	if err != nil {
		return &DuplicateTaskGroupPayload{}, err
	}
	return &DuplicateTaskGroupPayload{TaskGroup: &taskGroup}, err
}

func (r *mutationResolver) SortTaskGroup(ctx context.Context, input SortTaskGroup) (*SortTaskGroupPayload, error) {
	tasks := []db.Task{}
	for _, task := range input.Tasks {
		t, err := r.Repository.UpdateTaskPosition(ctx, db.UpdateTaskPositionParams{TaskID: task.TaskID, Position: task.Position})
		if err != nil {
			return &SortTaskGroupPayload{}, err
		}
		tasks = append(tasks, t)
	}
	return &SortTaskGroupPayload{Tasks: tasks, TaskGroupID: input.TaskGroupID}, nil
}

func (r *mutationResolver) DeleteTaskGroupTasks(ctx context.Context, input DeleteTaskGroupTasks) (*DeleteTaskGroupTasksPayload, error) {
	tasks, err := r.Repository.GetTasksForTaskGroupID(ctx, input.TaskGroupID)
	if err != nil && err != sql.ErrNoRows {
		return &DeleteTaskGroupTasksPayload{}, err
	}
	removedTasks := []uuid.UUID{}
	for _, task := range tasks {
		err = r.Repository.DeleteTaskByID(ctx, task.TaskID)
		if err != nil {
			return &DeleteTaskGroupTasksPayload{}, err
		}
		removedTasks = append(removedTasks, task.TaskID)
	}
	return &DeleteTaskGroupTasksPayload{TaskGroupID: input.TaskGroupID, Tasks: removedTasks}, nil
}

func (r *mutationResolver) AddTaskLabel(ctx context.Context, input *AddTaskLabelInput) (*db.Task, error) {
	assignedDate := time.Now().UTC()
	_, err := r.Repository.CreateTaskLabelForTask(ctx, db.CreateTaskLabelForTaskParams{input.TaskID, input.ProjectLabelID, assignedDate})
	if err != nil {
		return &db.Task{}, err
	}
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	return &task, nil
}

func (r *mutationResolver) RemoveTaskLabel(ctx context.Context, input *RemoveTaskLabelInput) (*db.Task, error) {
	taskLabel, err := r.Repository.GetTaskLabelByID(ctx, input.TaskLabelID)
	if err != nil {
		return &db.Task{}, err
	}
	task, err := r.Repository.GetTaskByID(ctx, taskLabel.TaskID)
	if err != nil {
		return &db.Task{}, err
	}
	err = r.Repository.DeleteTaskLabelByID(ctx, input.TaskLabelID)
	return &task, err
}

func (r *mutationResolver) ToggleTaskLabel(ctx context.Context, input ToggleTaskLabelInput) (*ToggleTaskLabelPayload, error) {
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		return &ToggleTaskLabelPayload{}, err
	}

	_, err = r.Repository.GetTaskLabelForTaskByProjectLabelID(ctx, db.GetTaskLabelForTaskByProjectLabelIDParams{TaskID: input.TaskID, ProjectLabelID: input.ProjectLabelID})
	createdAt := time.Now().UTC()

	if err == sql.ErrNoRows {
		logger.New(ctx).WithFields(log.Fields{"err": err}).Warning("no rows")
		_, err := r.Repository.CreateTaskLabelForTask(ctx, db.CreateTaskLabelForTaskParams{
			TaskID:         input.TaskID,
			ProjectLabelID: input.ProjectLabelID,
			AssignedDate:   createdAt,
		})
		if err != nil {
			return &ToggleTaskLabelPayload{}, err
		}
		payload := ToggleTaskLabelPayload{Active: true, Task: &task}
		return &payload, nil
	}

	if err != nil {
		return &ToggleTaskLabelPayload{}, err
	}

	err = r.Repository.DeleteTaskLabelForTaskByProjectLabelID(ctx, db.DeleteTaskLabelForTaskByProjectLabelIDParams{
		TaskID:         input.TaskID,
		ProjectLabelID: input.ProjectLabelID,
	})

	if err != nil {
		return &ToggleTaskLabelPayload{}, err
	}

	payload := ToggleTaskLabelPayload{Active: false, Task: &task}
	return &payload, nil
}

func (r *mutationResolver) CreateTask(ctx context.Context, input NewTask) (*db.Task, error) {
	createdAt := time.Now().UTC()
	logger.New(ctx).WithFields(log.Fields{"positon": input.Position, "taskGroupID": input.TaskGroupID}).Info("creating task")
	task, err := r.Repository.CreateTask(ctx, db.CreateTaskParams{input.TaskGroupID, createdAt, input.Name, input.Position})
	if err != nil {
		logger.New(ctx).WithError(err).Error("issue while creating task")
		return &db.Task{}, err
	}
	taskGroup, err := r.Repository.GetTaskGroupByID(ctx, input.TaskGroupID)
	if err != nil {
		logger.New(ctx).WithError(err).Error("issue while creating task")
		return &db.Task{}, err
	}
	data := map[string]string{
		"TaskGroup": taskGroup.Name,
	}
	userID, _ := GetUserID(ctx)
	d, err := json.Marshal(data)
	_, err = r.Repository.CreateTaskActivity(ctx, db.CreateTaskActivityParams{
		TaskID:         task.TaskID,
		Data:           d,
		CreatedAt:      createdAt,
		CausedBy:       userID,
		ActivityTypeID: 1,
	})

	if len(input.Assigned) != 0 {
		assignedDate := time.Now().UTC()
		for _, assigned := range input.Assigned {
			assignedTask, err := r.Repository.CreateTaskAssigned(ctx, db.CreateTaskAssignedParams{TaskID: task.TaskID, UserID: assigned, AssignedDate: assignedDate})
			logger.New(ctx).WithFields(log.Fields{
				"assignedUserID": assignedTask.UserID,
				"taskID":         assignedTask.TaskID,
				"assignedTaskID": assignedTask.TaskAssignedID,
			}).Info("assigned task")
			if err != nil {
				return &db.Task{}, err
			}
		}
	}

	if err != nil {
		logger.New(ctx).WithError(err).Error("issue while creating task")
		return &db.Task{}, err
	}
	return &task, nil
}

func (r *mutationResolver) DeleteTask(ctx context.Context, input DeleteTaskInput) (*DeleteTaskPayload, error) {
	logger.New(ctx).WithFields(log.Fields{
		"taskID": input.TaskID,
	}).Info("deleting task")
	err := r.Repository.DeleteTaskByID(ctx, input.TaskID)
	if err != nil {
		return &DeleteTaskPayload{}, err
	}
	return &DeleteTaskPayload{input.TaskID}, nil
}

func (r *mutationResolver) UpdateTaskDescription(ctx context.Context, input UpdateTaskDescriptionInput) (*db.Task, error) {
	task, err := r.Repository.UpdateTaskDescription(ctx, db.UpdateTaskDescriptionParams{input.TaskID, sql.NullString{String: input.Description, Valid: true}})
	return &task, err
}

func (r *mutationResolver) UpdateTaskLocation(ctx context.Context, input NewTaskLocation) (*UpdateTaskLocationPayload, error) {
	userID, _ := GetUserID(ctx)
	previousTask, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		return &UpdateTaskLocationPayload{}, err
	}
	task, _ := r.Repository.UpdateTaskLocation(ctx, db.UpdateTaskLocationParams{TaskID: input.TaskID, TaskGroupID: input.TaskGroupID, Position: input.Position})
	if previousTask.TaskGroupID != input.TaskGroupID {
		skipAndDelete := false
		lastMove, err := r.Repository.GetLastMoveForTaskID(ctx, input.TaskID)
		if err == nil {
			if lastMove.Active && lastMove.PrevTaskGroupID == input.TaskGroupID.String() {
				skipAndDelete = true
			}
		}
		if skipAndDelete {
			_ = r.Repository.SetInactiveLastMoveForTaskID(ctx, input.TaskID)
		} else {
			prevTaskGroup, _ := r.Repository.GetTaskGroupByID(ctx, previousTask.TaskGroupID)
			curTaskGroup, _ := r.Repository.GetTaskGroupByID(ctx, input.TaskGroupID)

			data := map[string]string{
				"PrevTaskGroup":   prevTaskGroup.Name,
				"PrevTaskGroupID": prevTaskGroup.TaskGroupID.String(),
				"CurTaskGroup":    curTaskGroup.Name,
				"CurTaskGroupID":  curTaskGroup.TaskGroupID.String(),
			}

			createdAt := time.Now().UTC()
			d, _ := json.Marshal(data)
			_, err = r.Repository.CreateTaskActivity(ctx, db.CreateTaskActivityParams{
				TaskID:         task.TaskID,
				Data:           d,
				CausedBy:       userID,
				CreatedAt:      createdAt,
				ActivityTypeID: 2,
			})
		}
	}
	return &UpdateTaskLocationPayload{Task: &task, PreviousTaskGroupID: previousTask.TaskGroupID}, err
}

func (r *mutationResolver) UpdateTaskName(ctx context.Context, input UpdateTaskName) (*db.Task, error) {
	task, err := r.Repository.UpdateTaskName(ctx, db.UpdateTaskNameParams{input.TaskID, input.Name})
	return &task, err
}

func (r *mutationResolver) SetTaskComplete(ctx context.Context, input SetTaskComplete) (*db.Task, error) {
	completedAt := time.Now().UTC()
	data := map[string]string{}
	activityType := TASK_MARK_INCOMPLETE
	if input.Complete {
		activityType = TASK_MARK_COMPLETE
	}
	createdAt := time.Now().UTC()
	userID, _ := GetUserID(ctx)
	d, err := json.Marshal(data)
	_, err = r.Repository.CreateTaskActivity(ctx, db.CreateTaskActivityParams{
		TaskID:         input.TaskID,
		Data:           d,
		CausedBy:       userID,
		CreatedAt:      createdAt,
		ActivityTypeID: activityType,
	})
	task, err := r.Repository.SetTaskComplete(ctx, db.SetTaskCompleteParams{TaskID: input.TaskID, Complete: input.Complete, CompletedAt: sql.NullTime{Time: completedAt, Valid: true}})
	if err != nil {
		return &db.Task{}, err
	}
	return &task, nil
}

func (r *mutationResolver) UpdateTaskDueDate(ctx context.Context, input UpdateTaskDueDate) (*db.Task, error) {
	userID, _ := GetUserID(ctx)
	prevTask, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		return &db.Task{}, err
	}
	isSame := false
	if prevTask.DueDate.Valid && input.DueDate != nil {
		if prevTask.DueDate.Time == *input.DueDate && prevTask.HasTime == input.HasTime {
			isSame = true
		}
	}
	log.WithFields(log.Fields{
		"isSame": isSame,
		"prev":   prevTask.HasTime,
		"new":    input.HasTime,
	}).Info("chekcing same")
	data := map[string]string{}
	var activityType = TASK_DUE_DATE_ADDED
	data["HasTime"] = strconv.FormatBool(input.HasTime)
	if input.DueDate == nil && prevTask.DueDate.Valid {
		activityType = TASK_DUE_DATE_REMOVED
		data["PrevDueDate"] = prevTask.DueDate.Time.String()
	} else if prevTask.DueDate.Valid {
		activityType = TASK_DUE_DATE_CHANGED
		data["PrevDueDate"] = prevTask.DueDate.Time.String()
		data["CurDueDate"] = input.DueDate.String()
	} else if input.DueDate != nil {
		data["DueDate"] = input.DueDate.String()
	}
	var dueDate sql.NullTime
	log.WithField("dueDate", input.DueDate).Info("before ptr!")
	if input.DueDate == nil {
		dueDate = sql.NullTime{Valid: false, Time: time.Now()}
	} else {
		dueDate = sql.NullTime{Valid: true, Time: *input.DueDate}
	}
	var task db.Task
	if !(input.DueDate == nil && !prevTask.DueDate.Valid) {
		task, err = r.Repository.UpdateTaskDueDate(ctx, db.UpdateTaskDueDateParams{
			TaskID:  input.TaskID,
			DueDate: dueDate,
			HasTime: input.HasTime,
		})
		reminders, err := r.Repository.GetDueDateRemindersForTaskID(ctx, input.TaskID)
		if err != nil {
			log.WithError(err).Error("error while getting due date reminders for task ID")
			return &db.Task{}, err
		}
		if input.DueDate != nil {
			for _, rem := range reminders {
				remindAt := now.With(*input.DueDate).BeginningOfDay()
				if input.HasTime {
					remindAt = *input.DueDate
				}
				switch rem.Duration {
				case "MINUTE":
					remindAt = remindAt.Add(time.Duration(-rem.Period) * time.Minute)
					break
				case "HOUR":
					remindAt = remindAt.Add(time.Duration(-rem.Period) * time.Hour)
					break
				case "DAY":
					remindAt = remindAt.AddDate(0, 0, int(-rem.Period))
					break
				case "WEEK":
					remindAt = remindAt.AddDate(0, 0, 7*int(-rem.Period))
					break
				}

				_, err := r.Repository.UpdateDueDateReminderRemindAt(ctx, db.UpdateDueDateReminderRemindAtParams{
					DueDateReminderID: rem.DueDateReminderID,
					RemindAt:          remindAt,
				})
				if err != nil {
					log.WithError(err).Error("error while updating due date reminder remind at")
					return &db.Task{}, err
				}
			}
		}
		createdAt := time.Now().UTC()
		d, _ := json.Marshal(data)
		if !isSame {
			_, err = r.Repository.CreateTaskActivity(ctx, db.CreateTaskActivityParams{
				TaskID:         task.TaskID,
				Data:           d,
				CausedBy:       userID,
				CreatedAt:      createdAt,
				ActivityTypeID: activityType,
			})
		}
	} else {
		task, err = r.Repository.GetTaskByID(ctx, input.TaskID)
	}

	return &task, err
}

func (r *mutationResolver) ToggleTaskWatch(ctx context.Context, input ToggleTaskWatch) (*db.Task, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		log.Error("user ID is missing")
		return &db.Task{}, errors.New("user ID is unknown")
	}
	_, err := r.Repository.GetTaskWatcher(ctx, db.GetTaskWatcherParams{UserID: userID, TaskID: input.TaskID})

	isWatching := true
	if err != nil {
		if err != sql.ErrNoRows {
			log.WithError(err).Error("error while getting task watcher")
			return &db.Task{}, err
		}
		isWatching = false
	}

	if isWatching {
		err := r.Repository.DeleteTaskWatcher(ctx, db.DeleteTaskWatcherParams{UserID: userID, TaskID: input.TaskID})
		if err != nil {
			log.WithError(err).Error("error while getting deleteing task watcher")
			return &db.Task{}, err
		}
	} else {
		now := time.Now().UTC()
		_, err := r.Repository.CreateTaskWatcher(ctx, db.CreateTaskWatcherParams{UserID: userID, TaskID: input.TaskID, WatchedAt: now})
		if err != nil {
			log.WithError(err).Error("error while creating task watcher")
			return &db.Task{}, err
		}
	}
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		log.WithError(err).Error("error while getting task by id")
		return &db.Task{}, err
	}
	return &task, nil
}

func (r *mutationResolver) AssignTask(ctx context.Context, input *AssignTaskInput) (*db.Task, error) {
	assignedDate := time.Now().UTC()
	assignedTask, err := r.Repository.CreateTaskAssigned(ctx, db.CreateTaskAssignedParams{input.TaskID, input.UserID, assignedDate})
	logger.New(ctx).WithFields(log.Fields{
		"assignedUserID": assignedTask.UserID,
		"taskID":         assignedTask.TaskID,
		"assignedTaskID": assignedTask.TaskAssignedID,
	}).Info("assigned task")
	if err != nil {
		log.WithError(err).Error("error while creating task assigned")
		return &db.Task{}, err
	}
	_, err = r.Repository.GetTaskWatcher(ctx, db.GetTaskWatcherParams{UserID: assignedTask.UserID, TaskID: assignedTask.TaskID})
	if err != nil {
		if err != sql.ErrNoRows {
			log.WithError(err).Error("error while fetching task watcher")
			return &db.Task{}, err
		}
		_, err = r.Repository.CreateTaskWatcher(ctx, db.CreateTaskWatcherParams{UserID: assignedTask.UserID, TaskID: assignedTask.TaskID, WatchedAt: assignedDate})
		if err != nil {
			log.WithError(err).Error("error while creating task assigned task watcher")
			return &db.Task{}, err
		}
	}

	userID, ok := GetUserID(ctx)
	if !ok {
		log.Error("error getting user ID")
		return &db.Task{}, errors.New("UserID is missing")
	}
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		log.WithError(err).Error("error while getting task by ID")
		return &db.Task{}, err
	}
	if userID != assignedTask.UserID {
		causedBy, err := r.Repository.GetUserAccountByID(ctx, userID)
		if err != nil {
			log.WithError(err).Error("error while getting user account in assign task")
			return &db.Task{}, err
		}
		project, err := r.Repository.GetProjectInfoForTask(ctx, input.TaskID)
		if err != nil {
			log.WithError(err).Error("error while getting project in assign task")
			return &db.Task{}, err
		}
		err = r.CreateNotification(ctx, CreateNotificationParams{
			ActionType:   ActionTypeTaskAssigned,
			CausedBy:     userID,
			NotifiedList: []uuid.UUID{assignedTask.UserID},
			Data: map[string]string{
				"CausedByUsername": causedBy.Username,
				"CausedByFullName": causedBy.FullName,
				"TaskID":           project.TaskShortID,
				"TaskName":         task.Name,
				"ProjectID":        project.ProjectShortID,
				"ProjectName":      project.Name,
			},
		})
	}
	if err != nil {
		return &task, err
	}

	// r.NotificationQueue.TaskMemberWasAdded(assignedTask.TaskID, userID, assignedTask.UserID)
	return &task, nil
}

func (r *mutationResolver) UnassignTask(ctx context.Context, input *UnassignTaskInput) (*db.Task, error) {
	task, err := r.Repository.GetTaskByID(ctx, input.TaskID)
	if err != nil {
		log.WithError(err).Error("error while getting task by ID")
		return &db.Task{}, err
	}
	log.WithFields(log.Fields{"UserID": input.UserID, "TaskID": input.TaskID}).Info("deleting task assignment")
	_, err = r.Repository.DeleteTaskAssignedByID(ctx, db.DeleteTaskAssignedByIDParams{TaskID: input.TaskID, UserID: input.UserID})
	if err != nil && err != sql.ErrNoRows {
		log.WithError(err).Error("error while deleting task by ID")
		return &db.Task{}, err
	}
	err = r.Repository.DeleteTaskWatcher(ctx, db.DeleteTaskWatcherParams{UserID: input.UserID, TaskID: input.TaskID})
	if err != nil {
		log.WithError(err).Error("error while creating task assigned task watcher")
		return &db.Task{}, err
	}
	return &task, nil
}

func (r *mutationResolver) CreateTaskDueDateNotifications(ctx context.Context, input []CreateTaskDueDateNotification) (*CreateTaskDueDateNotificationsResult, error) {
	reminders := []DueDateNotification{}
	if len(input) == 0 {
		return &CreateTaskDueDateNotificationsResult{}, nil
	}
	task, err := r.Repository.GetTaskByID(ctx, input[0].TaskID)
	if err != nil {
		log.WithError(err).Error("error while getting task by id")
		return &CreateTaskDueDateNotificationsResult{}, nil
	}
	for _, in := range input {
		remindAt := now.With(task.DueDate.Time).BeginningOfDay()
		if task.HasTime {
			remindAt = task.DueDate.Time
		}
		switch in.Duration {
		case "MINUTE":
			remindAt = remindAt.Add(time.Duration(-in.Period) * time.Minute)
			break
		case "HOUR":
			remindAt = remindAt.Add(time.Duration(-in.Period) * time.Hour)
			break
		case "DAY":
			remindAt = remindAt.AddDate(0, 0, int(-in.Period))
			break
		case "WEEK":
			remindAt = remindAt.AddDate(0, 0, 7*int(-in.Period))
			break
		}

		log.Info("task not found, sending task")

		n, err := r.Repository.CreateDueDateReminder(ctx, db.CreateDueDateReminderParams{
			TaskID:   in.TaskID,
			Period:   int32(in.Period),
			Duration: in.Duration.String(),
			RemindAt: remindAt,
		})
		signature := &mTasks.Signature{
			UUID: "due_date_reminder_" + n.DueDateReminderID.String(),
			Name: "dueDateNotification",
			ETA:  &remindAt,
			Args: []mTasks.Arg{{
				Type:  "string",
				Value: n.DueDateReminderID.String(),
			}, {
				Type:  "string",
				Value: in.TaskID.String(),
			}},
		}
		r.Job.Server.SendTask(signature)
		if err != nil {
			return &CreateTaskDueDateNotificationsResult{}, err
		}
		duration := DueDateNotificationDuration(n.Duration)
		if !duration.IsValid() {
			log.WithField("duration", n.Duration).Error("invalid duration found")
			return &CreateTaskDueDateNotificationsResult{}, errors.New("invalid duration")
		}
		reminders = append(reminders, DueDateNotification{
			ID:       n.DueDateReminderID,
			Period:   int(n.Period),
			Duration: duration,
		})
	}
	return &CreateTaskDueDateNotificationsResult{
		Notifications: reminders,
	}, nil
}

func (r *mutationResolver) UpdateTaskDueDateNotifications(ctx context.Context, input []UpdateTaskDueDateNotification) (*UpdateTaskDueDateNotificationsResult, error) {
	reminders := []DueDateNotification{}
	if len(input) == 0 {
		return &UpdateTaskDueDateNotificationsResult{}, nil
	}
	for _, in := range input {
		task, err := r.Repository.GetTaskForDueDateReminder(ctx, in.ID)
		if err != nil {
			log.WithError(err).Error("error while getting task by id")
			return &UpdateTaskDueDateNotificationsResult{}, nil
		}
		current, err := r.Repository.GetDueDateReminderByID(ctx, in.ID)
		if err != nil {
			log.WithError(err).Error("error while getting task by id")
			return &UpdateTaskDueDateNotificationsResult{}, nil
		}

		remindAt := now.With(task.DueDate.Time).BeginningOfDay()
		if task.HasTime {
			remindAt = task.DueDate.Time
		}
		switch in.Duration {
		case "MINUTE":
			remindAt = remindAt.Add(time.Duration(-in.Period) * time.Minute)
			break
		case "HOUR":
			remindAt = remindAt.Add(time.Duration(-in.Period) * time.Hour)
			break
		case "DAY":
			remindAt = remindAt.AddDate(0, 0, int(-in.Period))
			break
		case "WEEK":
			remindAt = remindAt.AddDate(0, 0, 7*int(-in.Period))
			break
		}

		n, err := r.Repository.UpdateDueDateReminder(ctx, db.UpdateDueDateReminderParams{
			DueDateReminderID: in.ID,
			Period:            int32(in.Period),
			Duration:          in.Duration.String(),
			RemindAt:          remindAt,
		})
		if err != nil {
			return &UpdateTaskDueDateNotificationsResult{}, err
		}
		etaNano := strconv.FormatInt(current.RemindAt.UnixNano(), 10)
		result, err := r.Redis.ZRangeByScore(ctx, "delayed_tasks", &redis.ZRangeBy{Max: etaNano, Min: etaNano}).Result()
		if err != nil {
			log.WithError(err).Error("error while getting due date reminder")
		}
		log.WithField("result", result).Info("result raw")
		if len(result) != 0 {
			r.Redis.ZRem(ctx, "delayed_tasks", result)
		}
		signature := &mTasks.Signature{
			UUID: "due_date_reminder_" + n.DueDateReminderID.String(),
			Name: "dueDateNotification",
			ETA:  &remindAt,
			Args: []mTasks.Arg{{
				Type:  "string",
				Value: n.DueDateReminderID.String(),
			}, {
				Type:  "string",
				Value: task.TaskID.String(),
			}},
		}
		r.Job.Server.SendTask(signature)
		duration := DueDateNotificationDuration(n.Duration)
		if !duration.IsValid() {
			log.WithField("duration", n.Duration).Error("invalid duration found")
			return &UpdateTaskDueDateNotificationsResult{}, errors.New("invalid duration")
		}
		reminders = append(reminders, DueDateNotification{
			ID:       n.DueDateReminderID,
			Period:   int(n.Period),
			Duration: duration,
		})
	}
	return &UpdateTaskDueDateNotificationsResult{
		Notifications: reminders,
	}, nil
}

func (r *mutationResolver) DeleteTaskDueDateNotifications(ctx context.Context, input []DeleteTaskDueDateNotification) (*DeleteTaskDueDateNotificationsResult, error) {
	ids := []uuid.UUID{}
	for _, n := range input {
		reminder, err := r.Repository.GetDueDateReminderByID(ctx, n.ID)
		err = r.Repository.DeleteDueDateReminder(ctx, n.ID)
		if err != nil {
			log.WithError(err).Error("error while deleting task due date notification")
			return &DeleteTaskDueDateNotificationsResult{}, err
		}
		etaNano := strconv.FormatInt(reminder.RemindAt.UnixNano(), 10)
		result, err := r.Redis.ZRangeByScore(ctx, "delayed_tasks", &redis.ZRangeBy{Max: etaNano, Min: etaNano}).Result()
		if err != nil {
			log.WithError(err).Error("error while getting due date reminder")
		}
		log.WithField("result", result).Info("result raw")
		if len(result) != 0 {
			r.Redis.ZRem(ctx, "delayed_tasks", result)
		}
		ids = append(ids, n.ID)
	}
	return &DeleteTaskDueDateNotificationsResult{Notifications: ids}, nil
}

func (r *queryResolver) FindTask(ctx context.Context, input FindTask) (*db.Task, error) {
	var taskID uuid.UUID
	var err error
	if input.TaskID != nil {
		taskID = *input.TaskID
	} else if input.TaskShortID != nil {
		taskID, err = r.Repository.GetTaskIDByShortID(ctx, *input.TaskShortID)
		if err != nil {
			return &db.Task{}, err
		}
	} else {
		return &db.Task{}, errors.New("FindTask requires either TaskID or TaskShortID to be set")
	}
	task, err := r.Repository.GetTaskByID(ctx, taskID)
	return &task, err
}

func (r *taskResolver) ID(ctx context.Context, obj *db.Task) (uuid.UUID, error) {
	return obj.TaskID, nil
}

func (r *taskResolver) TaskGroup(ctx context.Context, obj *db.Task) (*db.TaskGroup, error) {
	taskGroup, err := r.Repository.GetTaskGroupByID(ctx, obj.TaskGroupID)
	return &taskGroup, err
}

func (r *taskResolver) Description(ctx context.Context, obj *db.Task) (*string, error) {
	task, err := r.Repository.GetTaskByID(ctx, obj.TaskID)
	if err != nil {
		return nil, err
	}
	if !task.Description.Valid {
		return nil, nil
	}
	return &task.Description.String, nil
}

func (r *taskResolver) Watched(ctx context.Context, obj *db.Task) (bool, error) {
	userID, ok := GetUserID(ctx)
	if !ok {
		log.Error("user ID is missing")
		return false, errors.New("user ID is unknown")
	}
	_, err := r.Repository.GetTaskWatcher(ctx, db.GetTaskWatcherParams{UserID: userID, TaskID: obj.TaskID})
	if err != nil {
		if err == sql.ErrNoRows {
			return false, nil
		}
		log.WithError(err).Error("error while getting task watcher")
		return false, err
	}
	return true, nil
}

func (r *taskResolver) DueDate(ctx context.Context, obj *db.Task) (*DueDate, error) {
	nots, err := r.Repository.GetDueDateRemindersForTaskID(ctx, obj.TaskID)
	if err != nil {
		log.WithError(err).Error("error while fetching due date reminders")
		return &DueDate{}, err
	}
	reminders := []DueDateNotification{}
	for _, n := range nots {
		duration := DueDateNotificationDuration(n.Duration)
		if !duration.IsValid() {
			log.WithField("duration", n.Duration).Error("invalid duration found")
			return &DueDate{}, errors.New("invalid duration")
		}
		reminders = append(reminders, DueDateNotification{
			ID:       n.DueDateReminderID,
			Period:   int(n.Period),
			Duration: duration,
		})
	}
	var time *time.Time
	if obj.DueDate.Valid {
		time = &obj.DueDate.Time
	}

	return &DueDate{
		At:            time,
		Notifications: reminders,
	}, nil
}

func (r *taskResolver) CompletedAt(ctx context.Context, obj *db.Task) (*time.Time, error) {
	if obj.CompletedAt.Valid {
		return &obj.CompletedAt.Time, nil
	}
	return nil, nil
}

func (r *taskResolver) Assigned(ctx context.Context, obj *db.Task) ([]Member, error) {
	taskMemberLinks, err := r.Repository.GetAssignedMembersForTask(ctx, obj.TaskID)
	taskMembers := []Member{}
	if err != nil {
		return taskMembers, err
	}
	for _, taskMemberLink := range taskMemberLinks {
		user, err := r.Repository.GetUserAccountByID(ctx, taskMemberLink.UserID)
		if err != nil {
			return taskMembers, err
		}
		var url *string
		if user.ProfileAvatarUrl.Valid {
			url = &user.ProfileAvatarUrl.String
		}
		profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
		projectID, err := r.Repository.GetProjectIDForTask(ctx, obj.TaskID)
		if err != nil {
			return taskMembers, err
		}
		role, err := r.Repository.GetRoleForProjectMemberByUserID(ctx, db.GetRoleForProjectMemberByUserIDParams{UserID: user.UserID, ProjectID: projectID})

		if err != nil {
			if err == sql.ErrNoRows {
				role = db.Role{Code: "owner", Name: "Owner"}
			} else {
				logger.New(ctx).WithError(err).Error("get role for project member")
				return taskMembers, err
			}
		}
		taskMembers = append(taskMembers, Member{ID: taskMemberLink.UserID, FullName: user.FullName, ProfileIcon: profileIcon,
			Role: &role,
		})
	}
	return taskMembers, nil
}

func (r *taskResolver) Labels(ctx context.Context, obj *db.Task) ([]db.TaskLabel, error) {
	return r.Repository.GetTaskLabelsForTaskID(ctx, obj.TaskID)
}

func (r *taskResolver) Checklists(ctx context.Context, obj *db.Task) ([]db.TaskChecklist, error) {
	return r.Repository.GetTaskChecklistsForTask(ctx, obj.TaskID)
}

func (r *taskResolver) Badges(ctx context.Context, obj *db.Task) (*TaskBadges, error) {
	checklists, err := r.Repository.GetTaskChecklistsForTask(ctx, obj.TaskID)
	if err != nil {
		return &TaskBadges{}, err
	}
	comments, err := r.Repository.GetCommentCountForTask(ctx, obj.TaskID)
	if err != nil {
		return &TaskBadges{}, err
	}
	complete := 0
	total := 0
	for _, checklist := range checklists {
		items, err := r.Repository.GetTaskChecklistItemsForTaskChecklist(ctx, checklist.TaskChecklistID)
		if err != nil {
			return &TaskBadges{}, err
		}
		for _, item := range items {
			total++
			if item.Complete {
				complete++
			}
		}
	}
	var taskChecklist *ChecklistBadge
	if total != 0 {
		taskChecklist = &ChecklistBadge{Total: total, Complete: complete}
	}
	var taskComments *CommentsBadge
	if comments != 0 {
		taskComments = &CommentsBadge{Total: int(comments), Unread: false}
	}
	return &TaskBadges{Checklist: taskChecklist, Comments: taskComments}, nil
}

func (r *taskResolver) Activity(ctx context.Context, obj *db.Task) ([]db.TaskActivity, error) {
	activity, err := r.Repository.GetActivityForTaskID(ctx, obj.TaskID)
	if err == sql.ErrNoRows {
		return []db.TaskActivity{}, nil
	}
	return activity, err
}

func (r *taskResolver) Comments(ctx context.Context, obj *db.Task) ([]db.TaskComment, error) {
	comments, err := r.Repository.GetCommentsForTaskID(ctx, obj.TaskID)
	if err == sql.ErrNoRows {
		return []db.TaskComment{}, nil
	}
	return comments, err
}

func (r *taskActivityResolver) ID(ctx context.Context, obj *db.TaskActivity) (uuid.UUID, error) {
	return obj.TaskActivityID, nil
}

func (r *taskActivityResolver) Type(ctx context.Context, obj *db.TaskActivity) (ActivityType, error) {
	switch obj.ActivityTypeID {
	case 1:
		return ActivityTypeTaskAdded, nil
	case 2:
		return ActivityTypeTaskMoved, nil
	case 3:
		return ActivityTypeTaskMarkedComplete, nil
	case 4:
		return ActivityTypeTaskMarkedIncomplete, nil
	case 5:
		return ActivityTypeTaskDueDateChanged, nil
	case 6:
		return ActivityTypeTaskDueDateAdded, nil
	case 7:
		return ActivityTypeTaskDueDateRemoved, nil
	case 8:
		return ActivityTypeTaskChecklistChanged, nil
	case 9:
		return ActivityTypeTaskChecklistAdded, nil
	case 10:
		return ActivityTypeTaskChecklistRemoved, nil
	default:
		return ActivityTypeTaskAdded, errors.New("unknown type")
	}
}

func (r *taskActivityResolver) Data(ctx context.Context, obj *db.TaskActivity) ([]TaskActivityData, error) {
	var data map[string]string
	_ = json.Unmarshal(obj.Data, &data)
	activity := []TaskActivityData{}
	for name, value := range data {
		activity = append(activity, TaskActivityData{
			Name:  name,
			Value: value,
		})
	}
	return activity, nil
}

func (r *taskActivityResolver) CausedBy(ctx context.Context, obj *db.TaskActivity) (*CausedBy, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, obj.CausedBy)
	var url *string
	if user.ProfileAvatarUrl.Valid {
		url = &user.ProfileAvatarUrl.String
	}
	profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
	return &CausedBy{
		ID:          obj.CausedBy,
		FullName:    user.FullName,
		ProfileIcon: profileIcon,
	}, err
}

func (r *taskChecklistResolver) ID(ctx context.Context, obj *db.TaskChecklist) (uuid.UUID, error) {
	return obj.TaskChecklistID, nil
}

func (r *taskChecklistResolver) Items(ctx context.Context, obj *db.TaskChecklist) ([]db.TaskChecklistItem, error) {
	return r.Repository.GetTaskChecklistItemsForTaskChecklist(ctx, obj.TaskChecklistID)
}

func (r *taskChecklistItemResolver) ID(ctx context.Context, obj *db.TaskChecklistItem) (uuid.UUID, error) {
	return obj.TaskChecklistItemID, nil
}

func (r *taskChecklistItemResolver) DueDate(ctx context.Context, obj *db.TaskChecklistItem) (*time.Time, error) {
	if obj.DueDate.Valid {
		return &obj.DueDate.Time, nil
	}
	return nil, nil
}

func (r *taskCommentResolver) ID(ctx context.Context, obj *db.TaskComment) (uuid.UUID, error) {
	return obj.TaskCommentID, nil
}

func (r *taskCommentResolver) UpdatedAt(ctx context.Context, obj *db.TaskComment) (*time.Time, error) {
	if obj.UpdatedAt.Valid {
		return &obj.UpdatedAt.Time, nil
	}
	return nil, nil
}

func (r *taskCommentResolver) CreatedBy(ctx context.Context, obj *db.TaskComment) (*CreatedBy, error) {
	user, err := r.Repository.GetUserAccountByID(ctx, obj.CreatedBy)
	var url *string
	if user.ProfileAvatarUrl.Valid {
		url = &user.ProfileAvatarUrl.String
	}
	profileIcon := &ProfileIcon{url, &user.Initials, &user.ProfileBgColor}
	return &CreatedBy{
		ID:          obj.CreatedBy,
		FullName:    user.FullName,
		ProfileIcon: profileIcon,
	}, err
}

func (r *taskLabelResolver) ID(ctx context.Context, obj *db.TaskLabel) (uuid.UUID, error) {
	return obj.TaskLabelID, nil
}

func (r *taskLabelResolver) ProjectLabel(ctx context.Context, obj *db.TaskLabel) (*db.ProjectLabel, error) {
	projectLabel, err := r.Repository.GetProjectLabelByID(ctx, obj.ProjectLabelID)
	return &projectLabel, err
}

// Task returns TaskResolver implementation.
func (r *Resolver) Task() TaskResolver { return &taskResolver{r} }

// TaskActivity returns TaskActivityResolver implementation.
func (r *Resolver) TaskActivity() TaskActivityResolver { return &taskActivityResolver{r} }

// TaskChecklist returns TaskChecklistResolver implementation.
func (r *Resolver) TaskChecklist() TaskChecklistResolver { return &taskChecklistResolver{r} }

// TaskChecklistItem returns TaskChecklistItemResolver implementation.
func (r *Resolver) TaskChecklistItem() TaskChecklistItemResolver {
	return &taskChecklistItemResolver{r}
}

// TaskComment returns TaskCommentResolver implementation.
func (r *Resolver) TaskComment() TaskCommentResolver { return &taskCommentResolver{r} }

// TaskLabel returns TaskLabelResolver implementation.
func (r *Resolver) TaskLabel() TaskLabelResolver { return &taskLabelResolver{r} }

type taskResolver struct{ *Resolver }
type taskActivityResolver struct{ *Resolver }
type taskChecklistResolver struct{ *Resolver }
type taskChecklistItemResolver struct{ *Resolver }
type taskCommentResolver struct{ *Resolver }
type taskLabelResolver struct{ *Resolver }
