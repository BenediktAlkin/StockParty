import numpy as np
from .sim import Sim


class Simulations:
    @staticmethod
    def from_config(drinks, seed, **kwargs):
        rng = np.random.default_rng(seed=seed)

        # make sure no duplicate sim_seed
        sim_seeds = []
        for _ in range(len(drinks)):
            while True:
                seed = rng.integers(low=1, high=9999999)
                if seed not in sim_seeds:
                    sim_seeds.append(seed)
                    break

        sims = [Sim(seed=seed, **drink_kwargs) for seed, drink_kwargs in zip(sim_seeds, drinks)]
        return Simulations(sims, seed, **kwargs)

    def __init__(self, sims, seed):
        self.sims = sims
        self.seed = seed

    @property
    def sims_count(self):
        return len(self.sims)