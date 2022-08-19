import yaml
import numpy as np
import logging
import simulation
from simulation.point import Point
import matplotlib.pyplot as plt
import sys

def setup_logging():
    stdout_handler = logging.StreamHandler(stream=sys.stdout)
    formatter = logging.Formatter(
        fmt='%(asctime)s %(levelname).1s %(message)s',
        datefmt='%m-%d %H:%M:%S'
    )
    stdout_handler.setFormatter(formatter)
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    logger.addHandler(stdout_handler)
    logging.getLogger('matplotlib').setLevel(logging.WARNING)


def main():
    with open("config_simulation.yaml", encoding="utf-8") as f:
        config_simulation = yaml.safe_load(f)
    sims = simulation.from_config(**config_simulation)
    for sim in sims:
        plt.plot(range(len(sim.values)), sim.values)
        plt.xticks([0] + list(np.cumsum(sim.point_ticks)))
        plt.yticks(np.arange(1.25, 4.0, 0.25))
        plt.title(sim.name)
        plt.grid()
        plt.show()


if __name__ == "__main__":
    setup_logging()
    main()