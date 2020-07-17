# Project Citadel - An open source project management tool

![Citadel](https://github.com/jordanknott/project-citadel/raw/master/.github/citadel_preview.png)

## Overview

A free & open source alternative project management tool.

## Features

Currently citadel only offers basic task tracking through a Kanban board.

Currently you can do the following to tasks:

- Add colors & named labels
- Add due dates
- Descriptions written in Markdown
- Assign members
- Checklists
- Mark tasks as complete

## Installation

### From Source

You'll need [Golang](https://golang.org/dl/) installed on your machine.

Next, clone the repository:

``` bash
git clone https://github.com/JordanKnott/project-citadel && cd project-citadel
```

Next we need to build the binary. This project uses [Mage](https://magefile.org/) for its build tool.

``` bash
go run cmd/mage/main.go build
```

This will:

- Install all yarn packages for the frontend
- Build the React frontend
- Embed the React frontend in the binary
- Compile the final exectuable binary

The newly created `citadel` binary can be found in the __dist__ folder.

It contains everything neccessary to run except the config file. An example config file can be found in `conf/app.example.toml`

## Roadmap

This is a list of features that will eventually be added to Citadel in no particular order:

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

