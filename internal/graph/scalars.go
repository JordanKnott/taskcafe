package graph

import (
	"io"

	"strconv"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/pkg/errors"
)

// MarshalUUID converts a UUID to JSON string
func MarshalUUID(uuid uuid.UUID) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		w.Write([]byte(strconv.Quote(uuid.String())))
	})
}

// UnmarshalUUID converts a String to a UUID
func UnmarshalUUID(v interface{}) (uuid.UUID, error) {
	if uuidRaw, ok := v.(string); ok {
		return uuid.Parse(uuidRaw)
	}
	return uuid.UUID{}, errors.New("uuid must be a string")
}
