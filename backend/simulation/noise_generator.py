import numpy as np
import scipy.stats as stats
import logging

logger = logging.getLogger("app.noise_generator")

class NoiseGenerator:
    def __init__(self, seed, noise_variance, noise_max):
        self.seed = seed
        self.noise_variance = noise_variance
        self.noise_max = noise_max
        self.rng = np.random.default_rng(seed=seed)

    def generate_noise(self):
        # truncated normal with numpy generator (scipy has some wanky api for using different random seeds)
        for i in range(1000):  # make sure no endless loops occour even with wrong parameters
            noise = self.rng.normal(0, self.noise_variance)
            if abs(noise) < self.noise_max:
                return noise
        logger.warning(f"noise generation failed noise_variance={self.noise_variance} noise_max={self.noise_max}")
        return 0.

    def should_pull(self, p):
        return self.rng.uniform() < p
        # return self.rng.beta(a=1, b=0.1) < p