import yaml
import simulation
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime, timedelta

def main():
    with open("config_simulation.yaml", encoding="utf-8") as f:
        config_simulation = yaml.safe_load(f)
    config_simulation = config_simulation
    sims = simulation.from_config(**config_simulation)

    sim0 = sims[0]
    values = [[] for _ in range(len(sims))]
    time0 = sim0.times[0]
    party_start = datetime(time0.year, time0.month, time0.day, 20, 30)
    party_end = datetime(time0.year, time0.month, time0.day, 2, 15) + timedelta(days=1)
    start_tick = int((party_start - time0).total_seconds() / (sim0.tick_interval / 1000)) + 1
    end_tick = int((party_end - time0).total_seconds() / (sim0.tick_interval / 1000)) + 1
    for tick in range(start_tick, end_tick + 1):
        for i in range(len(sims)):
            values[i].append(simulation.Simulation.get_price(sims[i].values[tick]))

    avg_values = [np.mean(values[i]) for i in range(len(sims))]
    min_values = [min(values[i]) for i in range(len(sims))]
    max_values = [max(values[i]) for i in range(len(sims))]
    deltas = [max_ - min_ for max_, min_ in zip(max_values, min_values)]

    plt.barh(range(len(sims)), deltas, left=min_values)
    plt.vlines(avg_values, np.array(range(len(sims))) - 0.4, np.array(range(len(sims))) + 0.4, colors="red")
    plt.yticks(range(len(sims)), [sim.name for sim in sims])
    plt.subplots_adjust(left=0.25)
    plt.show()


if __name__ == "__main__":
    main()