generate:
	rm graph/schema.graphqls
	for f in graph/schema/*.gql; do cat $f; echo; done > graph/schema.graphqls

start:
	docker container start test-db
	go run cmd/citadel/main.go
