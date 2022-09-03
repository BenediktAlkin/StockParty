import yaml
import simulation
from container import container
import matplotlib.pyplot as plt
import numpy as np


def main():
    with open("config_simulation.yaml", encoding="utf-8") as f:
        config_simulation = yaml.safe_load(f)
    container.config_simulation = config_simulation
    container.sims = simulation.from_config(**config_simulation)

    ticks = len(container.sims[0].values)
    mins = []
    maxs = []
    timesteps = container.sims[0].times
    for tick in range(0, ticks):
        values = [simulation.Simulation.get_price(sim.values[tick]) for sim in container.sims]
        mins.append(min(values))
        maxs.append(max(values))
        # print(f"{timesteps[tick]}: {min(values):.2f}-{max(values):.2f}")

    # creat plot
    plt.fill_between(range(len(timesteps)), np.array(mins) - 0.25, np.array(maxs) + 0.25, alpha=0.5)
    x = range(0, len(timesteps), int(7200 / (container.sims[0].tick_interval / 1000)) + 1)
    plt.xticks(x, [timesteps[i].time().strftime("%H:%M") for i in x])
    plt.show()


if __name__ == "__main__":
    main()