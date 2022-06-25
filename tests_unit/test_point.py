import unittest
from simulation.point import Point
from .util import to_datetime

class TestSim(unittest.TestCase):
    def test_time_after_starttime(self):
        point = Point(start_time="14:00", time="14:00", value=1.5)
        self.assertEqual(to_datetime("14:00"), point.time)
        self.assertEqual(1.5, point.value)

    def test_time_before_starttime(self):
        point = Point(start_time="14:00", time="13:00", value=1.5)
        self.assertEqual(to_datetime("13:00", add_one_day=True), point.time)
        self.assertEqual(1.5, point.value)

    def test_restart_after_midnight(self):
        restart_time = to_datetime("00:00", add_one_day=True)
        point = Point(start_time="14:00", time="13:00", value=1.5, now=restart_time)
        self.assertEqual(to_datetime("13:00", add_one_day=True), point.time)