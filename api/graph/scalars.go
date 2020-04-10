package graph

import (
	"io"

	"github.com/99designs/gqlgen/graphql"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"strconv"
)

func MarshalUUID(uuid uuid.UUID) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		w.Write([]byte(strconv.Quote(uuid.String())))
	})
}

func UnmarshalUUID(v interface{}) (uuid.UUID, error) {
	if uuidRaw, ok := v.(string); ok {
		return uuid.Parse(uuidRaw)
	}
	return uuid.UUID{}, errors.New("uuid must be a string")
}
