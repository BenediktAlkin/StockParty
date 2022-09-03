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
    mins = []
    maxs = []
    avgs = []
    time0 = sim0.times[0]
    party_start = datetime(time0.year, time0.month, time0.day, 20, 30)
    party_end = datetime(time0.year, time0.month, time0.day, 3, 0) + timedelta(days=1)
    start_tick = int((party_start - time0).total_seconds() / (sim0.tick_interval / 1000)) + 1
    end_tick = int((party_end - time0).total_seconds() / (sim0.tick_interval / 1000)) + 1
    every_n_ticks = 30
    for tick in range(start_tick, end_tick + 1, every_n_ticks):
        values = [simulation.Simulation.get_price(sim.values[tick]) for sim in sims]
        mins.append(min(values))
        maxs.append(max(values))
        avgs.append(np.mean(values))
        # print(f"{timesteps[tick]}: {min(values):.2f}-{max(values):.2f}")

    # creat plot
    plt.plot(range(len(mins)), mins, label="min")
    plt.plot(range(len(mins)), maxs, label="max")
    plt.plot(range(len(mins)), avgs, label="avg")
    xticks_interval = 60
    x = list(range(start_tick, end_tick + 1, every_n_ticks * xticks_interval))
    plt.xticks(range(0, len(mins), xticks_interval), [sim0.times[i].time().strftime("%H:%M") for i in x])
    plt.show()


if __name__ == "__main__":
    main()