package utils

// ContextKey represents a context key
type ContextKey string

const (
	// UserIDKey is the key for the user id of the authenticated user
	UserIDKey ContextKey = "userID"
	// ReqIDKey is the unique ID key for current request
	ReqIDKey ContextKey = "reqID"
	//RestrictedModeKey is the key for whether the authenticated user only has access to install route
	RestrictedModeKey ContextKey = "restricted_mode"
	// OrgRoleKey is the key for the organization role code of the authenticated user
	OrgRoleKey ContextKey = "org_role"
)
