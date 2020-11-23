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
2. Change ```DOCKER_NGINX_HOST=testsite.test``` to what ever url you would like for example ```DOCKER_NGINX_HOST=dieselapi.net```
    - 2.a If you are on a windows machine add the domain you assigned to the env variable DOCKER_NGINX_HOST to your windows hosts file. This is usually located at ```C:\Windows\System32\drivers\etc```
        - ex: ```127.0.0.1 dieselapi.net```
    - 2.b Add this as well for local development purposes:
      - ex: ```127.0.0.1 postgres```
3. If you choose to modify your postgres db credentials you can modify them in the .env file under the DOCKER_POSTGRES_* environment variables.
4. By default Nginx will look for your project file according to the root declaration in the Nginx site configuration file located in ```./nginx/siteconfig.conf``` file. 
    - If you are building a laravel application be sure to change the path of the root inside the nginx site configuration file to the path of your laravel project. 
5. Run the command ```docker compose up -d```

## Database

By default the database in configured to port forward local connections to the containers internal network based on the standard postgres port of 5432. This can be changed inside of the .env file at ```DOCKER_POSTGRES_LOCAL_PORT``` if you desire a different functioning local machine port.

## Database admin

In order to log into the database admin panel included with this project (adminer) on your local machine you must use the container name for the server address. In this case the container is named postgres, so in the field fill it out as you normally would to log in. Using the credentials provided for your postgres database in the .env file you created. Where the form asks for server simply input postgres.