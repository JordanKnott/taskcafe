package db

import (
	"github.com/jmoiron/sqlx"
)

type Repository struct {
	*Queries
	db *sqlx.DB
}

// NewRepository returns an implementation of the Repository interface.
func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Queries: New(db.DB),
		db:      db,
	}
}
