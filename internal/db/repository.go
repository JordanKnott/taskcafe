package db

import "database/sql"

// Repository contains methods for interacting with a database storage
type Repository struct {
	*Queries
	db *sql.DB
}

// NewRepository returns an implementation of the Repository interface.
func NewRepository(db *sql.DB) *Repository {
	return &Repository{
		Queries: New(db),
		db:      db,
	}
}
