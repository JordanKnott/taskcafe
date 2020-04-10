package router

type ErrExpiredToken struct{}

func (r *ErrExpiredToken) Error() string {
	return "token is expired"
}

type ErrMalformedToken struct{}

func (r *ErrMalformedToken) Error() string {
	return "token is malformed"
}
