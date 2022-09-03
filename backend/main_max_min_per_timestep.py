import yaml
import simulation
from container import container
import matplotlib.pyplot as plt


def main():
    with open("config_simulation.yaml", encoding="utf-8") as f:
        config_simulation = yaml.safe_load(f)
    container.config_simulation = config_simulation
    container.sims = simulation.from_config(**config_simulation)

    ticks = len(container.sims[0].values)
    for tick in range(0, ticks, 30):
        values = [simulation.Simulation.get_price(sim.values[tick]) for sim in container.sims]
        timestep = container.sims[0].times[tick]
        print(f"{timestep}: {min(values):.2f}-{max(values):.2f}")


if __name__ == "__main__":
    main()