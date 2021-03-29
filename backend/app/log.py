import json
import logging
import random
import string
import sys

from loguru import logger

from settings import conf


def gcloud_serializer(message):
    """
    Serializer for tweaking log record so it can be parsed by Google Cloud
    """
    # https://github.com/Delgan/loguru/issues/203
    record = message.record
    severity = record["level"].name
    if severity == "EXCEPTION":
        severity = "CRITICAL"

    google_trace_id = record["extra"].pop("google_trace_id", None)

    log_data = {
        "severity": severity,
        "raw": record["message"],
        "message": record["message"] + " | " + str(record["extra"]),
        "extra": record["extra"],
        "time": record["time"],
    }
    if google_trace_id:
        log_data[
            "logging.googleapis.com/trace"
        ] = f"projects/{conf.GCLOUD_PROJECT}/traces/{google_trace_id}"

    serialized = json.dumps(log_data, default=str)
    print(serialized, file=sys.stderr)


async def inject_request_id_middleware(request, call_next):
    """
    FastAPI middleware for injecting request_id and Google Trace ID if exists.
    Usage: `app.middleware("http")(inject_request_id_middleware)`
    """
    request_id = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
    context = {"request_id": request_id}
    trace_header = request.headers.get("X-Cloud-Trace-Context")
    if trace_header:
        context["google_trace_id"] = trace_header.split("/")[0]
    with logger.contextualize(**context):
        return await call_next(request)


class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:  # pragma: no cover
        logger_opt = logger.opt(depth=7, exception=record.exc_info)
        logger_opt.log(record.levelname, record.getMessage())


def init_logging(logger_, local_env: bool):
    """
    Set up logging handlers. Output format is applied based on running environment

    :param logger_: Logger instance
    :param local_env: Whether current environment is local
    """

    # https://pawamoy.github.io/posts/unify-logging-for-a-gunicorn-uvicorn-app/
    # intercept everything at the root logger
    logging.root.handlers = [InterceptHandler()]

    # remove every other logger's handlers and propagate to root logger
    for name in logging.root.manager.loggerDict.keys():
        logging.getLogger(name).handlers = []
        logging.getLogger(name).propagate = True

    logger_.remove()
    if local_env:
        logger_.add(
            sys.stdout,
            format=(
                "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
                "<level>{level: <8}</level> <level>{message}</level> | {extra}"
            ),
            colorize=True,
            level=logging.DEBUG,
        )
    else:
        logger_.add(gcloud_serializer, format="{message}", level=logging.INFO)


init_logging(logger, conf.is_local_env())
