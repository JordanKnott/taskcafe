FROM node:14.5-alpine as frontend
RUN apk --no-cache add curl
WORKDIR /usr/src/app
COPY frontend .
RUN yarn install
RUN yarn build

FROM golang:1.14.5-alpine as backend
WORKDIR /usr/src/app
COPY . .
COPY --from=frontend /usr/src/app/build .
RUN go run cmd/mage/main.go backend:genFrontend backend:build

FROM alpine:latest
WORKDIR /root/
COPY --from=backend /usr/src/app/dist/citadel .
COPY --from=backend /usr/src/app/conf/app.example.toml conf/app.toml
CMD ["./citadel", "web"]
