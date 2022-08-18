import unittest
from simulation.point import Point
from simulation.simulation import Simulation
from simulation.noise_generator import NoiseGenerator
from datetime import datetime

class TestSimulation(unittest.TestCase):
    def test_simple(self):
        start_time = "14:00"
        now = datetime(2022, 1, 1, 14, 5)
        points = [
            Point(start_time=start_time, time="14:00", value=1.5, now=now),
            Point(start_time=start_time, time="14:15", value=2.0, now=now),
        ]
        ng = NoiseGenerator(seed=1, noise_variance=0.01, noise_max=0.2)
        sim = Simulation("Wüstenwasser", points, tick_interval=1000, noise_generator=ng)

        self.assertEqual(datetime(2022, 1, 1, 14, 0), sim.start_time)
        self.assertEqual(datetime(2022, 1, 1, 14, 15), sim.end_time)
        self.assertEqual([15*60], sim.point_ticks)
        self.assertLessEqual(1.25, min(sim.values))
        self.assertLessEqual(max(sim.values), 2.25)

    def test_ranges(self):
        start_time = "14:00"
        now = datetime(2022, 1, 1, 14, 5)
        point_tuples = [
            ("14:00", 3.0),
            ("23:50", 3.0),
            ("00:00", 2.0),
            ("00:30", 2.0),
            ("00:40", 3.0),
            ("03:00", 3.0),
        ]
        points = [
            Point(start_time=start_time, time=time, value=value, now=now)
            for time, value in point_tuples
        ]
        ng = NoiseGenerator(seed=1, noise_variance=0.01, noise_max=0.2)
        sim = Simulation("Wüstenwasser", points, tick_interval=2000, noise_generator=ng)

        self.assertEqual(datetime(2022, 1, 1, 14, 0), sim.start_time)
        self.assertEqual(datetime(2022, 1, 2, 3, 0), sim.end_time)
        self.assertEqual([590*30, 10*30, 30*30, 10*30, 140*30], sim.point_ticks)
        self.assertLessEqual(1.75, min(sim.values))
        self.assertLessEqual(max(sim.values), 3.25)
