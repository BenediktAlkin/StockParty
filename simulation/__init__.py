import numpy as np
from .noise_generator import NoiseGenerator
from .simulation import Simulation

def from_config(drinks, seed, noise_variance, noise_max, **kwargs):
    # generate seeds for each simulation using the seed form the config
    # make sure no duplicates are sampled
    rng = np.random.default_rng(seed=seed)
    sim_seeds = rng.choice(9999999, size=len(drinks), replace=False)

    sims = []
    for sim_seed, drink in zip(sim_seeds, drinks):
        ng = NoiseGenerator(seed, noise_variance, noise_max)
        sim = Simulation.from_kwargs(noise_generator=ng, **drink, **kwargs)
        sims.append(sim)
    return sims