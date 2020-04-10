## Authentication

Uses a refresh_token and access_token system.

The refresh_token is an opaque UUID based token. The access_token is a JWT
token containing several claims such as `sub` & `roles`

The refresh_token is stored in a database and is long lived (24 hours). It is sent to the client
as a cookie set to be `HttpOnly`.

The access_token is not stored in the database & is only stored in memory on the client side.
It is short lived (5 minutes).

The access_token is used to authenticate all endpoints except endpoints under /auth

The access_token is refreshed using the refresh_token through the /auth/refresh_token endpoint.
This endpoint takes in the refresh_token set VIA a cookie header & returns a new refresh_token & access_token
if the refresh_token is still valid. The old refresh_token is invalidated.
