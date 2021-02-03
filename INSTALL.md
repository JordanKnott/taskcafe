# Installation (from source)
## Installation of dependencies
First, you'll need [Golang](https://golang.org/dl/). If you never installed it, you can install it using the following commands:

```bash
wget https://golang.org/dl/go1.15.7.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.15.7.linux-amd64.tar.gz
echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc
source ~/.bashrc
rm go1.15.7.linux-amd64.tar.gz
```

Then we can install [NodeJS](https://nodejs.org/).

```bash
wget https://nodejs.org/dist/v14.15.4/node-v14.15.4-linux-x64.tar.xz
tar xvf node-v14.15.4-linux-x64.tar.xz
mv node*/ /usr/local/node/
echo "export PATH=$PATH:/usr/local/node/bin/" >> ~/.bashrc
source ~/.bashrc
rm node-v14.15.4-linux-x64.tar.xz
```

We also need to install the database.

```bash
sudo apt install -y postgresql
```

Finally, we can install [Yarn](https://yarnpkg.com/).

```bash
npm install -g yarn
```

## Get the source code
We can now download the source code of `taskcafe`.

```bash
git clone https://github.com/JordanKnott/taskcafe
cd taskcafe/
```

Then, we can install the other dependencies and build the binary using those two commands:

```bash
go run cmd/mage/main.go install
go run cmd/mage/main.go build
```

Note the second command can last a while if you don't have a lot of memory.

## Setup and migrate the database
Let's enter the database.

```bash
sudo -u postgres psql
```

And now, we need to create the database, create a user and grant superuser rights to that user:

```sql
CREATE DATABASE taskcafe;
CREATE USER taskcafe WITH ENCRYPTED PASSWORD '<put a secure password here>';
ALTER USER taskcafe WITH superuser;
EXIT;
```

Now we can migrate the database.

```bash
TASKCAFE_DATABASE_PASSWORD="<the database password>" ./dist/taskcafe migrate
```

## Create a systemd service for `taskcafe`
Let's start by creating a startup script,

```bash
nano start
```

And paste the following code (just replace the path to the directory and the password of the database)

```bash
#!/bin/bash
TASKCAFE_DATABASE_PASSWORD="<password>" /path/to/taskcafe/dist/taskcafe web
```

Now you need to define the script as an executable

```bash
chmod +x start
```

You can now create a new service file

```bash
nano /etc/systemd/system/taskcafe.service
```

And paste the following configuration (and replace the path):

```
[Unit]
Description=Taskcafe
After=network.target

[Service]
Restart=always
RestartSec=1
ExecStart=/path/to/taskcafe/start

[Install]
WantedBy=multi-user.target
```

Finally, you can start the new service.

```bash
systemctl daemon-reload
systemctl enable taskcafe
systemctl restart taskcafe
systemctl status taskcafe
```
