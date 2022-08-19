import numpy as np
import datetime
from .point import Point
import logging

logger = logging.getLogger("app.simulation")

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
        self.times = [self.points[0].time]
        self.cur_point_idx = 0
        self.cur_point_tick = 1
        self.slope = self.get_slope(self.points[0], self.points[1])

        logger.info(f"simulating {self.name} with tick_interval={self.tick_interval}")
        self.simulate()
        logger.info(f"simulated {self.name} (len={len(self.values)} min={min(self.values)} max={max(self.values)})")

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

    @property
    def _should_prevent_price_switch(self):
        # first price should never switch
        if self.cur_point_idx == 0:
            return True
        cur_value = self.points[self.cur_point_idx].value
        prev_value = self.points[self.cur_point_idx - 1].value
        if cur_value == prev_value:
            return True
        return False

    def tick(self):
        if self.is_finished:
            return

        # generate noise
        noise = self.noise_generator.generate_noise()
        delta = self.slope * self.tick_interval / 1000 + noise

        # prevent price switch if next price is equal to current
        if self._should_prevent_price_switch:
            proposed_price = self.get_price(self.values[-1] + delta)
            old_price = self.get_price(self.values[-1])
            # push price to current price if it is not (if noise in transition phase favours one side)
            cur_value = self.points[self.cur_point_idx].value
            if old_price != cur_value:
                if delta * (cur_value - old_price) < 0:
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

        self.values.append(new_value)
        self.times.append(self.times[0] + datetime.timedelta(milliseconds=self.tick_interval * (len(self.times) - 1)))

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
