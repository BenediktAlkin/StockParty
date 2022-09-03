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
    logger.setLevel(logging.DEBUG)
    logger.addHandler(stdout_handler)
    logging.getLogger('matplotlib').setLevel(logging.WARNING)


def main():
    ng = simulation.NoiseGenerator(seed=6, noise_variance=0.01, noise_max=0.2)
    start_time = "14:00"
    points = [
        Point(start_time=start_time, time="14:00", value=2.5),
        Point(start_time=start_time, time="14:50", value=2.5),
        Point(start_time=start_time, time="15:00", value=3.5),
        Point(start_time=start_time, time="15:50", value=3.5),
        Point(start_time=start_time, time="16:00", value=2.0),
        Point(start_time=start_time, time="17:00", value=1.5),
        Point(start_time=start_time, time="18:00", value=1.5),
        Point(start_time=start_time, time="20:00", value=3.5),
    ]
    sim = simulation.Simulation(name="drink", noise_generator=ng, points=points, tick_interval=2000)
    plt.plot(range(len(sim.values)), sim.values)
    plt.xticks([0] + list(np.cumsum(sim.point_ticks)))
    plt.yticks(np.arange(1.25, 4.0, 0.25))
    plt.grid()
    plt.show()


if __name__ == "__main__":
    setup_logging()
    main()