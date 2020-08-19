![Taskcafe](./.github/taskcafe-full.png)

[![Discord](https://img.shields.io/discord/745396499613220955?style=flat-square)](https://discord.gg/JkQDruh)


## Overview

![Taskcafe](./.github/taskcafe_preview.png)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FJordanKnott%2Ftaskcafe.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FJordanKnott%2Ftaskcafe?ref=badge_shield)

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
docker-compose -p taskcafe -f docker-compose.yml -f docker-compose.migrate.yml run --rm migrate
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
- Compile the final exectuable binary

The newly created `taskcafe` binary can be found in the __dist__ folder.

It contains everything neccessary to run except the config file. An example config file can be found in `conf/app.example.toml`

The config will need to be copied to a `conf/app.toml` in the same place the binary is.

Make sure to fill out the database section of the config in order to connect it to your database.

Then run the database migrations with `taskcafe migrate`.

Now you can run the web interface by running `taskcafe web`

## How is this different from X (Trello, NextCloud, etc)?

One of the primary goal's of Taskcafe is to provide a project management tool that I personally enjoy using for my
own projects and fits my workflow.

During alpha developement, the current plan is to build the "basic" features - features that are pretty much
standard across all kanban boards / project management tools.

Once Taskcafe is out of alpha, there are many features that I plan on adding that will differentiate it from other products (checkout the Roadmap for ideas on future plans).

## Contributing & community

If you have questions regarding how to use Taskcafe, check out the [discord server](https://discord.gg/JkQDruh).

If you're interesting in contributing to Taskcafe, please read the [contribution guide first](https://github.com/JordanKnott/taskcafe/blob/master/CONTRIBUTING.md)!

There is also a [Code of Conduct](https://github.com/JordanKnott/taskcafe/blob/master/CODE_OF_CONDUCT.md) as well.

## Roadmap

This is a list of features that will eventually be added to Taskcafe in no particular order:

- Add a calender tab overview of task due dates
- Add lists tab overview of tasks (alternative view to Kanban )
- Add gantt timeline view (with swimlanes)
- Implemention list actions (copy, mass delete, etc)
- Task sorting, filtering, and search
- Custom fields
- Automation rules
- Wiki tab
- Progress tab
- Archive tasks, then option to delete instead of only being able to delete tasks
- Keyboard shortcuts
- Custom project backgrounds
- Custom project colors
- Portfolio view

## License

[MIT License](LICENSE)



[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FJordanKnott%2Ftaskcafe.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FJordanKnott%2Ftaskcafe?ref=badge_large)