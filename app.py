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


def main():
    with open("config_simulation.yaml") as f:
        config = yaml.safe_load(f)
    container.sims = simulation.from_config(**config)
    app.run()


if __name__ == "__main__":
    main()