![Taskcafe](./.github/taskcafe-full.png)

[![Discord](https://img.shields.io/discord/745396499613220955)](https://discord.gg/JkQDruh)
[![Releases](https://img.shields.io/github/v/release/JordanKnott/taskcafe)](https://github.com/JordanKnott/taskcafe/releases)
[![Dockerhub](https://img.shields.io/docker/v/taskcafe/taskcafe?label=docker)](https://hub.docker.com/repository/docker/taskcafe/taskcafe)
[![Go Report Card](https://goreportcard.com/badge/github.com/JordanKnott/taskcafe)](https://goreportcard.com/report/github.com/JordanKnott/taskcafe)


## Overview

![Taskcafe](./.github/taskcafe_preview.png)

A free & open source alternative project management tool.

**Please note that this project is still in active development. Some options may not work yet!**
## Features

Currently Taskcafe only offers basic task tracking through a Kanban board.

Currently you can do the following to tasks:

- Add colors & named labels
- Add due dates
- Descriptions written in Markdown
- Assign members
- Checklists
- Mark tasks as complete

For a list of planned features, check out the [Roadmap](https://github.com/JordanKnott/taskcafe/wiki/Roadmap)!

## Installation

### With docker & docker-compose

You'll need both [docker](https://www.docker.com/) & [docker-compose](https://docs.docker.com/compose/install/) installed.

First clone the repository:

``` bash
git clone https://github.com/JordanKnott/taskcafe && cd taskcafe
```

Now do the following:

``` bash
docker-compose -p taskcafe up -d
```

This will start a postgres instance as well as a taskcafe instance.

The second command runs the database schema migrations.

If you visit [http://localhost:3333](http://localhost:3333), you will get redirected to the installation
screen so that you can create the first system user.

### From Source

You'll need [Golang](https://golang.org/dl/) installed on your machine.

Next, clone the repository:

``` bash
git clone https://github.com/JordanKnott/taskcafe && cd taskcafe
```

Next we need to build the binary. This project uses [Mage](https://magefile.org/) for its build tool.

``` bash
go run cmd/mage/main.go install
go run cmd/mage/main.go build
```

This will:

- Install all yarn packages for the frontend
- Build the React frontend
- Embed the React frontend in the binary
- Compile the final executable binary

The newly created `taskcafe` binary can be found in the __dist__ folder.

It contains everything neccessary to run except the config file. An example config file can be found in `conf/app.example.toml`.

The config will need to be copied to a `conf/app.toml` in the same place the binary is.

Make sure to fill out the database section of the config in order to connect it to your database.

Then run the database migrations with `taskcafe migrate`.

Now you can run the web interface by running `taskcafe web`.

## How is this different from X (Trello, NextCloud, etc)?

One of the primary goals of Taskcafe is to provide a project management tool that I personally enjoy using for my
own projects and fits my workflow.

During alpha development, the current plan is to build the "basic" features - features that are pretty much
standard across all kanban boards / project management tools.

Once Taskcafe is out of alpha, there are many features that I plan on adding that will differentiate it from other products (check out the [Roadmap](https://github.com/JordanKnott/taskcafe/wiki/Roadmap) for ideas on future plans).

## Contributing & community

If you have questions regarding how to use Taskcafe, check out the [discord server](https://discord.gg/JkQDruh).

If you're interesting in contributing to Taskcafe, please read the [contribution guide first](https://github.com/JordanKnott/taskcafe/blob/master/CONTRIBUTING.md)!

There is also a [Code of Conduct](https://github.com/JordanKnott/taskcafe/blob/master/CODE_OF_CONDUCT.md) as well.

## License

[MIT License](LICENSE)
