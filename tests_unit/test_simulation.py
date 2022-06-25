import unittest
from simulation.point import Point
from simulation.simulation import Simulation
from .util import to_datetime

class TestSimulation(unittest.TestCase):


    def test_simple(self):
        start_time = "14:00"
        points = [
            Point(start_time=start_time, time="14:00", value=1.5),
            Point(start_time=start_time, time="14:15", value=2.0),
        ]
        sim = Simulation("Wüstenwasser", points, tick_interval=1000)

        self.assertEqual(to_datetime("14:00"), sim.start_time)
        self.assertEqual(to_datetime("14:15"), sim.end_time)
        self.assertEqual([15*60], sim.point_ticks)