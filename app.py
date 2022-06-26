import yaml
from flask import Flask
import simulation
from container import container

app = Flask(__name__)


@app.route("/")
def index():
    return "<p>Hello, World!</p>"

@app.route("/get_data")
def get_data():
    return dict(
        data={sim.name: sim.values for sim in container.sims},
        tick_interval=container.sims[0].tick_interval,
    )

@app.route("/get_config_ui")
def get_config_ui():
    return container.config_ui

@app.route("/get_config_simulation")
def get_config_simulation():
    return container.config_simulation

def main():
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