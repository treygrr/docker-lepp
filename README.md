# How to use this docker project

## Quick Notes:

Most configuration can be modified in the .env file of this projects root directory. I tried following a naming convention if it was a docker environment variable that follows as such:

> DOCKER_APPLICATIONNAME_VARIABLENAME=

## Docker compose

> docker-compose up

- This command will run the containers according to how they configured in the docker-compose.yml file in the root of the project folder.

> docker-compose up -d

- This command will do the same as the above but will detach the docker process from the active terminal window.

> docker-compose ps

- This command will list all the currently running containers

> docker-compose down

- This command will take down the currently running containers

> docker-compose rmi

### If you need to update the container images:

> ```
> docker-compose stop
> docker-compose rm -f
> docker-compose pull   
> docker-compose up -d
> ```

## Docker build

> docker build .

- This command will build the dockerfile in your current working directory.

> docker build -t username/reponame:latest .

- This command builds your dockerfile in your cwd and tags it because of the '-t' flag.

  - username - is your docker community username: in my case treydwg
  - reponame - is the repo that this image belongs to: ex. nginx
  - :latest - is the tag or version: ex. stable, latest, 1.2, alpine, etc.

  - ```docker build -t treydwg/nginx:latest``` for example

>  docker images

- This command will list out all the currently built images

> docker tag oldname newname

- Follow the same naming convention as build, this command will rename the image.  In doing this the image is cloned with the new name and the old image still remains.

> docker rmi oldname

- This command can be used to clean up the old container from the previous command.

## Getting Started with a new Application

1. Copy .example.env and rename it to .env (If you are in windows you must do this in powershell or in vscode because windows doesn't like files that start with symbols)
    - 1.a Change ```DOCKER_CONTAINER_PREFIX``` to a shortname of your app. This will stop docker containers from interacting with each other and ensure that they all have their own instance.
    - 1.b If you plan on running multiple projects at one time you should shift each port to a new unused port number. For ex: in docker-compose.yml change 
2. Change ```DOCKER_NGINX_HOST=testsite.test``` to what ever url you would like for example ```DOCKER_NGINX_HOST=dieselapi.net```
    - 2.a If you are on a windows machine add the domain you assigned to the env variable DOCKER_NGINX_HOST to your windows hosts file. This is usually located at ```C:\Windows\System32\drivers\etc```
        - ex: ```127.0.0.1 dieselapi.net```
    - 2.b Add this as well for local development purposes:
      - ex: ```127.0.0.1 ${DOCKER_CONTAINER_PREFIX}-postgres``` would be ```127.0.0.1 testsite-postgres``` or what ever you set the prefix to.
3. If you choose to modify your postgres db credentials you can modify them in the .env file under the DOCKER_POSTGRES_* environment variables.
4. By default Nginx will look for your project file according to the root declaration in the Nginx site configuration file located in ```./nginx/siteconfig.conf``` file. 
    - If you are building a laravel application be sure to change the path of the root inside the nginx site configuration file to the path of your laravel project. 
    - 4.a Open the file from the project root directory with /nginx/siteconfigServer.conf. From here look towards line 32 for ```fastcgi_pass vin-php:9000;```
    vin-php:9000; needs to match your docker container name for PHP and it's port that was set eariler. So in this instance it looks like above.
5. Run the command ```docker compose up -d```

## Database

By default the database in configured to port forward local connections to the containers internal network based on the standard postgres port of 5432. This can be changed inside of the .env file at ```DOCKER_POSTGRES_LOCAL_PORT``` if you desire a different functioning local machine port.

# Overview of database management

In this docker project there is a visual database management software bundled into the compose file called pgAdmin. Once you are up and running, you can connect to the docker container that is holding our postgres database via it's container name. For ex: vin-postgres or {prefix}-postgres

The username will be what you set it as in the .env variable in the root of this project. This will be the same scenario for your Port, Database name, and Password.

You can export and import backup files from this UI as well as create tables if you prefer a GUI. 

If you prefer doing so from the command line see below!

## SSH to docker container

```docker exec -it [container-name] /bin/bash```
Executing this above command will put you into a bash shell for the specified container.

```docker exec -it vin-nginx /bin/bash```

To exit bash shell or leave containers command line simply type ```exit``` on a new line and hit return.

## Dropping a database from docker

SSH into the docker container for postgres like above. An example will be:

```docker exec -it vin-postgres /bin/bash```

Once you are in the container to drop your database you should know the db name 
Example stripped:

```PGPASSWORD="yourpasswordhere" pg_dump -U postgresusernamehere yourdatabasenametodump > /path/toyour/file.sql```

A functioning example for this project is:

```PGPASSWORD="password" pg_dump -U postgres testdb > /backups/backupfile.sql```

## Restoring from a dumped file

Again SSH into the postgres container. From here you should then run the following command:

```PGPASSWORD="password" psql -U postgres testdb < /backups/backupfile.sql```


## How do I get the backupfile from and into the container?

In order for your backup to save properly to your machine. Make sure that you are pg_dumping to the /backups root directory on the virtual machine. This docker project has a system link that will allow anything in the /backups folder in the virtual machine to save to your local machine to the postgres-data-dump directory in the root of this project. In addition to the above functionality it goes in reverse as well. You can drag and drop a database dump file to postgres-data-dump and it will be available in the /backups folder in the virtual machine for you to run a psql restore (see Restoring from a dumped file).
