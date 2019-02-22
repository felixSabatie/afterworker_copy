# Afterworker
## Simple installation
Requirements :

- Docker
- Docker-compose

To run the project, go to the `docker` folder and run the following command :
- `docker-compose build && docker-compose up`

Additionally, if you don't have a `master.key` file in the config folder, or if 
the server has a 500 error when trying to create an account or log in, run the following command :
-  `docker exec -e EDITOR="nano" docker_rails rails credentials:edit`

It should create a `master.key` file and update the `credentials.yml.enc` file in the config folder. 
Please don't push this new credentials file, or it will break the gitlab and heroku servers.

If no errors are shown, you shoud be able to access the website at `localhost:3000`.

## App architecture
- The unit tests for the ruby on rails API are located in the `spec` folder
- The angular client is located in the `frontend folder`
