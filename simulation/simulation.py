import numpy as np
import datetime
from .point import Point
import logging


class Simulation:
    @staticmethod
    def from_kwargs(start_time, points, **kwargs):
        point_objs = [Point(start_time=start_time, **point) for point in points]
        return Simulation(points=point_objs, **kwargs)

    def __init__(self, name, points, noise_generator, tick_interval):
        self.logger = logging.getLogger("app.simulation")
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
        self.logger.debug(f"initial slope: {self.slope}")
        self.logger.debug(f"cur_point {self.points[0].value} -> next_point {self.points[1].value}")

        self.logger.info(f"simulating {self.name} with tick_interval={self.tick_interval}")
        self.simulate()
        self.logger.info(f"simulated {self.name} (len={len(self.values)} min={min(self.values)} max={max(self.values)})")

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
        # noise = self.noise_generator.generate_noise()
        # delta = self.slope * self.tick_interval / 1000 + noise
        delta = self.noise_generator.generate_noise()

        old_value = self.values[-1]
        self.logger.debug(f"old_value: {old_value:.4f}")
        self.logger.debug(f"proposed_delta: {delta:.4f}")
        old_price = self.get_price(old_value)
        #self.logger.debug(f"old_price: {old_price}")
        expected_price = self.points[self.cur_point_idx + 1].value
        self.logger.debug(f"expected_price: {expected_price}")

        # pull towards center (if price is what it's supposed to be)
        if old_price == expected_price:
            direction_to_center = np.sign(expected_price - old_value)
            if direction_to_center != 0:
                delta_direction = np.sign(delta)
                if direction_to_center != delta_direction:
                    # pull_factor in [0, 0.25]
                    # I tried pull_factor in [0, 1.0] but this is way too strong as for small slopes
                    # the value would collapse way faster then the slope to the last 0.5 price
                    # e.g. if transitioning from 2.0 to 1.5 within an hour it takes ~30min to move from
                    # 2.0 to 1.74 and then the price instantly gets pulled towards 1.5
                    pull_factor = abs(old_value - expected_price)
                    self.logger.debug(f"pull_factor: {pull_factor}")
                    # change direction with <pull_factor> probability
                    if self.noise_generator.should_pull(p=pull_factor):
                        self.logger.debug(f"pull")
                        delta *= -1

        # hard prevention on price switches (centerpull is only soft prevention)
        if old_price == expected_price:
            proposed_price = self.get_price(old_value + delta)
            if proposed_price != expected_price:
                self.logger.debug("prevent price switch")
                delta *= -1

        # prevent price from going into the opposite direction of the slope
        if old_price != expected_price:
            proposed_price = self.get_price(old_value + delta)
            price_direction = np.sign(proposed_price - old_price)
            if price_direction != 0. and price_direction != np.sign(self.slope):
                self.logger.debug("prevent opposite slope direction")
                delta *= -1

        self.logger.debug(f"delta: {delta:.4f}")
        new_value = self.values[-1] + self.slope + delta

        self.values.append(new_value)
        self.times.append(self.times[0] + datetime.timedelta(milliseconds=self.tick_interval * (len(self.times) - 1)))

        self.cur_point_tick += 1
        if self.cur_point_tick >= self.point_ticks[self.cur_point_idx]:
            self.cur_point_tick = 0
            self.cur_point_idx += 1
            if self.cur_point_idx + 1 < len(self.points):
                cur_point = self.points[self.cur_point_idx]
                next_point = self.points[self.cur_point_idx + 1]
                self.slope = self.get_slope(cur_point, next_point)
                self.logger.debug(f"new point {self.cur_point_idx} slope={self.slope}")
                self.logger.debug(f"cur_point {cur_point.value} -> next_point {next_point.value}")
            else:
                self.logger.debug(f"last point reached")

    def get_slope(self, p1, p2):
        time_delta = p2.time - p1.time
        return (p2.value - p1.value) / (time_delta.seconds * 1000 / self.tick_interval)

    @staticmethod
    def get_price(value):
        price = round(value * 2) / 2
        return price
