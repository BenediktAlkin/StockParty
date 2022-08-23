import unittest
from simulation.point import Point
from datetime import datetime

class TestSim(unittest.TestCase):
    def test_time_after_starttime_beforemidnight(self):
        point = Point(start_time="14:00", time="14:00", value=1.5, now=datetime(2022, 1, 5, 16, 10))
        self.assertEqual(datetime(2022, 1, 5, 14, 0), point.time)
        self.assertEqual(1.5, point.value)

    def test_time_after_starttime_aftermidnight(self):
        point = Point(start_time="14:00", time="14:00", value=1.5, now=datetime(2022, 1, 5, 1, 10))
        self.assertEqual(datetime(2022, 1, 4, 14, 0), point.time)
        self.assertEqual(1.5, point.value)

    def test_time_before_starttime_beforemidnight(self):
        point = Point(start_time="14:00", time="13:00", value=1.5, now=datetime(2022, 1, 5, 16, 10))
        self.assertEqual(datetime(2022, 1, 6, 13, 0), point.time)
        self.assertEqual(1.5, point.value)

    def test_time_before_starttime_aftermidnight(self):
        point = Point(start_time="14:00", time="13:00", value=1.5, now=datetime(2022, 1, 5, 1, 10))
        self.assertEqual(datetime(2022, 1, 5, 13, 0), point.time)
        self.assertEqual(1.5, point.value)

    def test_restart_after_midnight(self):
        restart_time = datetime(2022, 1, 5, 0, 10)  # 00:10
        point = Point(start_time="14:00", time="13:00", value=1.5, now=restart_time)
        self.assertEqual(datetime(2022, 1, 5, 13, 0), point.time)