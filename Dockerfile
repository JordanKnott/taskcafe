FROM node:14.5-alpine as frontend
RUN apk --no-cache add curl
WORKDIR /usr/src/app
COPY frontend .
RUN yarn install
RUN yarn build

FROM golang:1.14.5-alpine as backend
WORKDIR /usr/src/app
COPY go.mod go.mod
COPY go.sum go.sum
RUN go mod download
COPY . .
COPY --from=frontend /usr/src/app/build ./frontend/build
RUN go run cmd/mage/main.go backend:genFrontend backend:genMigrations backend:build

FROM alpine:latest
WORKDIR /root/
COPY --from=backend /usr/src/app/dist/taskcafe .
CMD ["./taskcafe", "web"]
