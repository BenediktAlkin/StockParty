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


def main():
    ng = simulation.NoiseGenerator(seed=5, noise_variance=0.01, noise_max=0.2)
    start_time = "14:00"
    points = [
        Point(start_time=start_time, time="14:00", value=2.5),
        Point(start_time=start_time, time="15:00", value=3.5),
        Point(start_time=start_time, time="16:00", value=2.0),
        Point(start_time=start_time, time="17:00", value=1.5),
    ]
    sim = simulation.Simulation(name="drink", noise_generator=ng, points=points, tick_interval=2000)
    plt.plot(range(len(sim.values)), sim.values)
    plt.grid()
    plt.show()


if __name__ == "__main__":
    setup_logging()
    main()