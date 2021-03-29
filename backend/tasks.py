from copy import deepcopy
from os import environ

import uvicorn
from invoke import task
from uvicorn.supervisors import ChangeReload

DEV_ENV = {"FIRESTORE_EMULATOR_HOST": "127.0.0.1:8686"}


@task
def dev(ctx):
    environ.update(DEV_ENV)
    port = environ.get("PORT", 8000)
    host = "0.0.0.0"  # nosec, it's not a mistake

    config = uvicorn.Config(app="main:app", host=host, port=int(port), debug=True)
    server = uvicorn.Server(config)

    from app.log import logger  # noqa, must be imported before running supervisor

    supervisor = ChangeReload(config, target=server.run, sockets=[config.bind_socket()])
    supervisor.run()


@task
def test(ctx):
    env = deepcopy(DEV_ENV)
    env["ENV"] = "unittest"
    ctx.run("python -m pytest -vvv", env=env)


@task
def serve(ctx):
    server = uvicorn.Server(
        uvicorn.Config(
            app="main:app",
            uds="/run/nginx/uvicorn.sock",
            forwarded_allow_ips="*",
        ),
    )
    server.run()
