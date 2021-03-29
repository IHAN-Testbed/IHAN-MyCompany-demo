# IHAN My Company application

This repository contains IHAN My Company demo app

### Structure

- `./backend` - contains `FastAPI` application
- `./frontend` - contains `create-react-app` applications `./frontend/accountant` and
  `./frontend/my-company`
- `./nginx` - contains Nginx configuration files and templates

## Development

Generic pre-requisites for development

- [Pre-commit](https://pre-commit.com/#install)
- [Docker](https://docs.docker.com/install/)

To set up the `pre-commit` hooks, run `pre-commit install` in the repo. After it you can
manually run `pre-commit` only for your changes or `pre-commit run --all-files` for all
files.

### Backend

### Running Firestore emulator

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/downloads-interactive)

To prepare `gcloud` to be able to run the Firestore emulator that is necessary:

```bash
gcloud components install cloud-firestore-emulator
```

Run the Google Cloud Firestore Emulator with a predictable port:

```bash
./start_emulator.sh
# or on Windows run the .bat file
start_emulator
```

See `./backend/README.md`

### Frontend

See `./frontend/<app>/README.md`

## Local testing in Docker

This application is served by Nginx. It forwards requests to python backend or returns
static frontend files. In order to test how image will be running in production, you
might want to use following snippet:

```shell script
export DOCKER_BUILDKIT=1  # optional
docker build -t ihan-mycompany .

# Firestore credentials will be set automatically when running on GCR
# But for local testing, please run the emulator on `localhost:8686` first
docker run --rm -p 8080:8080 -p 8686:8686 --env ENV=my-env --env FIRESTORE_EMULATOR_HOST=127.0.0.1:8686 --env OPENID_CONNECT_CLIENT_ID=clientid --env OPENID_CONNECT_CLIENT_SECRET=topsecret --name ihan-mycompany ihan-mycompany
```

You can now access the interfaces on http://localhost:8080/accountant/ and
http://localhost:8080/my-company/
