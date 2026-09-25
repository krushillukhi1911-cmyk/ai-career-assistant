import logging
import sys


def setup_logging():
    log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    # Silence noisy loggers if needed
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


logger = logging.getLogger("ai_career_assistant")
