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

1. Copy .example.env to .env (If you are in windows you must do this in powershell or in vscode)
2. Change ```DOCKER_NGINX_HOST=testsite.test``` to what ever url you would like for example ```DOCKER_NGINX_HOST=dieselapi.net```
    - 2.a If you are on a windows machine add the domain you assigned to the env variable DOCKER_NGINX_HOST to your windows hosts file. This is usually located at ```C:\Windows\System32\drivers\etc```
        - ex: ```127.0.0.1 dieselapi.net```
3. If you choose to modify your postgres db credentials you can modify them in the .env file under DOCKER_POSTGRES_*
4. 