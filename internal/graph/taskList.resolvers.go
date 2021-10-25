package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/google/uuid"
	"github.com/jordanknott/taskcafe/internal/db"
)

func (r *taskGroupResolver) ID(ctx context.Context, obj *db.TaskGroup) (uuid.UUID, error) {
	return obj.TaskGroupID, nil
}

func (r *taskGroupResolver) ProjectID(ctx context.Context, obj *db.TaskGroup) (string, error) {
	return obj.ProjectID.String(), nil
}

func (r *taskGroupResolver) Tasks(ctx context.Context, obj *db.TaskGroup) ([]db.Task, error) {
	tasks, err := r.Repository.GetTasksForTaskGroupID(ctx, obj.TaskGroupID)
	return tasks, err
}

// TaskGroup returns TaskGroupResolver implementation.
func (r *Resolver) TaskGroup() TaskGroupResolver { return &taskGroupResolver{r} }

type taskGroupResolver struct{ *Resolver }
