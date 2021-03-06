import numpy as np
import datetime
from .point import Point

class Simulation:
    @staticmethod
    def from_kwargs(start_time, points, **kwargs):
        point_objs = [Point(start_time=start_time, **point) for point in points]
        return Simulation(points=point_objs, **kwargs)

    def __init__(self, name, points, noise_generator, tick_interval):
        self.name = name
        self.points = points
        self.tick_interval = tick_interval
        self.noise_generator = noise_generator

        # check points are in ascending time
        for i in range(1, len(points)):
            assert self.points[i].time > self.points[i - 1].time, "times have to be in ascending order"

        # calculate how many ticks are in each point
        self.point_ticks = [
            int((self.points[i].time - self.points[i - 1].time).seconds / (self.tick_interval / 1000))
            for i in range(1, len(points))
        ]

        # initialize sim
        self.values = [self.points[0].value]
        self.cur_point_idx = 0
        self.cur_point_tick = 1
        self.slope = self.get_slope(self.points[0], self.points[1])

        print(f"simulating {self.name} with tick_interval={self.tick_interval}")
        self.simulate()
        print(f"simulated {self.name} (len={len(self.values)})")

    def simulate(self):
        while not self.is_finished:
            self.tick()

    @property
    def start_time(self):
        return self.points[0].time

    @property
    def end_time(self):
        return self.points[-1].time

    @property
    def is_finished(self):
        return self.cur_point_idx >= len(self.point_ticks)

    def tick(self):
        if self.is_finished:
            return

        # generate noise
        noise = self.noise_generator.generate_noise()

        delta = self.slope * self.tick_interval / 1000 + noise
        proposed_price = self.get_price(self.values[-1] + delta)
        old_price = self.get_price(self.values[-1])

        # prevent price switch if next price is equal to current
        if self.cur_point_idx == 0 or \
                self.points[self.cur_point_idx].value == self.points[self.cur_point_idx - 1].value:
            # push price to current price if it is not (if noise in transition phase favours one side)
            if old_price != self.points[self.cur_point_idx].value:
                if delta * (self.points[self.cur_point_idx].value - old_price) < 0:
                    delta *= -1
            elif proposed_price != old_price:
                # prevent price switches
                delta *= -1

        # prevent oscilation around price thresholds
        # if slope is positive --> price cannot get lower
        # if slope is negative --> price cannot get higher
        #if (self.slope > 0 and old_price > proposed_price) or \
        #    (self.slope < 0 and old_price < proposed_price):
        #    delta *= -1

        new_value = self.values[-1] + delta

        self.values += [new_value]

        self.cur_point_tick += 1
        if self.cur_point_tick >= self.point_ticks[self.cur_point_idx]:
            self.cur_point_tick = 0
            self.cur_point_idx += 1
            self.slope = self.get_slope(self.points[self.cur_point_idx - 1], self.points[self.cur_point_idx])

    @staticmethod
    def get_slope(p1, p2):
        time_delta = p2.time - p1.time
        return (p2.value - p1.value) / time_delta.seconds

    @staticmethod
    def get_price(value):
        price = round(value * 2) / 2
        return price
