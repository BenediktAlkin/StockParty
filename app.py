import sys
import yaml
from flask import Flask
import simulation
from container import container
import logging

app = Flask(__name__)


@app.route("/get_data")
def get_data():
    return {
        i: dict(
            id=i,
            name=sim.name,
            tick_interval=sim.tick_interval,
            start_time=sim.start_time,
            end_time=sim.end_time,
            prices=sim.values,
        )
        for i, sim in enumerate(container.sims)
    }

@app.route("/get_config_ui")
def get_config_ui():
    return container.config_ui

@app.route("/get_config_simulation")
def get_config_simulation():
    return container.config_simulation

def setup_logging():
    stdout_handler = logging.StreamHandler(stream=sys.stdout)
    formatter = logging.Formatter(
        fmt='%(asctime)s %(levelname).1s %(message)s',
        datefmt='%m-%d %H:%M:%S'
    )
    stdout_handler.setFormatter(formatter)
    app.logger.setLevel(logging.INFO)
    stdout_handler.setLevel(logging.INFO)
    app.logger.handlers.clear()
    app.logger.addHandler(stdout_handler)

def main():
    setup_logging()
    with open("config_simulation.yaml") as f:
        config_simulation = yaml.safe_load(f)
    container.config_simulation = config_simulation
    container.sims = simulation.from_config(**config_simulation)
    with open("config_ui.yaml") as f:
        config_ui = yaml.safe_load(f)
    container.config_ui = config_ui
    app.run()


if __name__ == "__main__":
    main()