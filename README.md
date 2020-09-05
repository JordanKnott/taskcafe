<p align="center">
 <img width="450px" src="./.github/taskcafe-full.png" align="center" alt="Taskcafe logo" />
</p>
<p align="center">
  <a href="https://discord.gg/JkQDruh">
    <img alt="Discord" src="https://img.shields.io/discord/745396499613220955" />
  </a>
  <a href="https://github.com/JordanKnott/taskcafe/releases">
    <img alt="Releases" src="https://img.shields.io/github/v/release/JordanKnott/taskcafe" />
  </a>
  <a href="https://hub.docker.com/repository/docker/taskcafe/taskcafe">
    <img alt="Dockerhub" src="https://img.shields.io/docker/v/taskcafe/taskcafe?label=docker" />
  </a>
  <a href="https://goreportcard.com/report/github.com/JordanKnott/taskcafe">
    <img alt="Go Report Card" src="https://goreportcard.com/badge/github.com/JordanKnott/taskcafe" />
  </a>
</p>
<p align="center">
Was this project useful? Please consider <a href="https://www.buymeacoffee.com/jordanknott">donating</a> to help me improve it!
</p>

**Please note that this project is still in active development. Some options may not work yet! For updates on development, join the Discord server**

## Features

Currently Taskcafe only offers basic task tracking through a Kanban board.

Currently you can do the following to tasks:

- Task sorting & filtering
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

#### Install Golang
You'll need [Golang](https://golang.org/dl/) installed on your machine.

Follow [the instructions](https://golang.org/doc/install) on the installation page:

```bash
wget https://golang.org/dl/go1.15.1.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.14.3.linux-amd64.tar.gz
```

#### Clone the repository
Next, clone the repository:

``` bash
git clone https://github.com/JordanKnott/taskcafe && cd taskcafe
```

#### Build the front-end
Ensure that you have both `node` and `yarn` installed.

##### Install yarn
Install `yarn` with the following commands:

```bash
wget https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
npm update
npm install -y yarn
```

##### Install NodeJS
[NodeJS](https://nodejs.org) is used to build the static assets for the front-end.  We can install it through `nvm` on Linux.  Install the latest NodeJS version via [`nvm`](https://github.com/nvm-sh/nvm)

```bash
nvm install 14.9.0
nvm use 14.9.0
```

#### Build the Back-End
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

The newly created `taskcafe` binary can be found in the __dist__ folder.  However, we still need to configure the databse settings and tell `taskcafe` how to connect to it.

#### Install Postgres

Install `psql` (Postgres) on Linux:

```bash
apt-get install -y postgres
```

#### Edit the Default Configuaration
Within the `conf` folder of the cloned files, you will find an example config file can be found in `conf/app.example.toml`.  This file will get loaded by default when running the app via `./taskcafe web`.

Edit the file with your Postgres database credentials:

```toml
[database]
host = "localhost"
name = "taskcafe"
user = "postgres"
password = "taskcafe"
```

(Assuming you configured your default `postgres` user to have the password `taskcafe` via the `\password` command in `psql`)

Make sure to fill out the database section of the config in order to connect it to your database.

#### Perform Database Migrations
Then run the database migrations with `taskcafe migrate`.  **Note: this will overwrite any existing data in the database**.

#### Running `taskcafe`
Now you can run the web interface by running `taskcafe web`.

```bash
./taskcafe web
```

Alternatively, if you named your config `app.toml`, you can point it to that config like so:


```bash
./taskcafe web --config ../conf/app.toml
```

You can now visit the machine's local IP address, followed by the port `3333` (for example, `192.168.50.18:3333` where the machine's IP address is `192.168.50.18` on the local network).

## FAQ
### How is this different from X (Trello, NextCloud, etc)?

One of the primary goals of Taskcafe is to provide a project management tool that I personally enjoy using for my
own projects and fits my workflow.

During alpha development, the current plan is to build the "basic" features - features that are pretty much
standard across all kanban boards / project management tools.

Once Taskcafe is out of alpha, there are many features that I plan on adding that will differentiate it from other products (check out the [Roadmap](https://github.com/JordanKnott/taskcafe/wiki/Roadmap) for ideas on future plans).

## Contributing & Community

If you have questions regarding how to use Taskcafe, check out the [discord server](https://discord.gg/JkQDruh).

If you're interesting in contributing to Taskcafe, please read the [contribution guide first](https://github.com/JordanKnott/taskcafe/blob/master/CONTRIBUTING.md)!

There is also a [Code of Conduct](https://github.com/JordanKnott/taskcafe/blob/master/CODE_OF_CONDUCT.md) as well.

## License

[MIT License](LICENSE)
