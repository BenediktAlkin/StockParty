import matplotlib
import matplotlib.pyplot as plt
import datetime
import PIL
import io
import numpy as np

class Point:
    def __init__(self, config, config_dict):
        now = datetime.datetime.now()
        cur_time = now.time()
        today = now.date()
        tomoroow = today + datetime.timedelta(days=1)

        start_time = datetime.datetime.strptime(config["startTime"], '%H:%M').time()
        time = datetime.datetime.strptime(config_dict["time"], '%H:%M').time()
        if time >= start_time:
            self.time = datetime.datetime.combine(today, time)
        else:
            self.time = datetime.datetime.combine(tomoroow, time)

        # correct dates in case it is restarted after 0:00
        if cur_time < start_time:
            self.time -= datetime.timedelta(days=1)

        self.value = config_dict["value"]

class Sim:
    def __init__(self, config):
        self.config = config
        np.random.seed(config["noise"]["seed"])

        self.drink_sims = [DrinkSim(self.config, drink_config) for drink_config in self.config["drinks"]]

    def plots(self, width, height):
        time = datetime.datetime.now()
        ret = [drink_sim.plot(width, height, time) for drink_sim in self.drink_sims]
        return ret

    def save_images(self, width, height):
        cur_time = self.drink_sims[0].points[0].time
        while cur_time <= self.drink_sims[0].points[-1].time:
            name = cur_time.strftime("%H.%M.%S")
            path = f"images/{name}.png"
            print(f"generating {path}")
            plots = [drink_sim.plot(width, height, cur_time) for drink_sim in self.drink_sims]
            white = (255, 255, 255)
            image = PIL.Image.new("RGB", (width, height), white)
            for i, plot in enumerate(plots):
                row = i // self.drink_sims[0].columns
                column = i % self.drink_sims[0].columns
                image.paste(plot, (column * plot.width, row * plot.height))
            image.save(path)
            cur_time += datetime.timedelta(seconds=self.drink_sims[0].tick_interval // 1000)


    @property
    def sim_count(self):
        return len(self.drink_sims)

class DrinkSim:
    def __init__(self, config, drink_config):
        self.config = config
        self.plot_config = config["plot"]
        self.tick_interval = config["tickInterval"]
        self.name = drink_config["name"]

        # set fig size constants
        self.columns = config["display"]["columns"]
        self.rows = len(config["drinks"]) // self.columns
        if len(config["drinks"]) % self.columns != 0: self.rows += 1

        # drink config
        self.points = [Point(config, config_dict) for config_dict in drink_config["points"]]


        # total ticks for plotting
        self.show_n_ticks = self.plot_config["showNTicks"]
        self.total_ticks = int((self.points[-1].time - self.points[0].time).seconds / (self.tick_interval / 1000))

        # noise
        self.variance = self.config["noise"]["variance"]
        self.max_noise = self.config["noise"]["max"]

        # initialize sim
        self.cur_time = self.points[0].time
        self.values = [self.points[0].value]
        self.times = [self.points[0].time.strftime("%H:%M:%S")]
        self.i = 1
        self.slope = self.get_slope(self.points[0], self.points[1])

        # sim
        while not self.is_finished:
            self.tick()

        # get hour labels
        self.hour_labels = [self.points[0].time.strftime("%H:%M")]
        if self.show_n_ticks == 0:
            delta = datetime.timedelta(hours=1)
            time = self.points[0].time + delta
            while time <= self.points[-1].time:
                self.hour_labels.append(time.strftime("%H:%M"))
                time += delta

    @property
    def is_finished(self):
        return self.i >= len(self.points)

    def tick(self):
        if self.is_finished: return

        # generate noise
        while True:
            noise = np.random.normal(0, self.variance)
            if abs(noise) < self.max_noise:
                break

        delta = self.slope * self.tick_interval / 1000 + noise
        proposed_price = self.get_price(self.values[-1] + delta)
        old_price = self.get_price(self.values[-1])

        # prevent price switch if next price is equal to current
        if self.i == 0 or self.points[self.i].value == self.points[self.i-1].value:
            # push price to current price if it is not (if noise in transition phase favours one side)
            if old_price != self.points[self.i].value:
                if delta * (self.points[self.i].value - old_price) < 0:
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
        self.cur_time += datetime.timedelta(milliseconds=self.tick_interval)
        self.times += [self.cur_time.strftime("%H:%M:%S")]

        if self.cur_time > self.points[self.i].time:
            self.i += 1
            if self.i >= len(self.points): return
            self.slope = self.get_slope(self.points[self.i - 1], self.points[self.i])

    def plot(self, width, height, time):
        # calculate tick from time
        if time > self.points[-1].time or self.show_n_ticks == 0:
            cur_tick = self.total_ticks
        elif time < self.points[0].time:
            cur_tick = 1
        else:
            cur_tick = int((time - self.points[0].time).seconds * 1000 / self.tick_interval)


        matplotlib.rc('font', family='Arial')
        plt.clf()

        # set figure size
        if width == 1:
            width = self.config["display"]["width"]
        if height == 1:
            height = self.config["display"]["height"]
        dpi = 100
        fig_width = (width // self.columns) / dpi
        fig_height = (height // self.rows) / dpi
        plt.figure(figsize=(fig_width, fig_height), dpi=dpi)

        # plot line
        if self.show_n_ticks == 0:
            plt.plot(range(cur_tick), self.values[:cur_tick])
        else:
            # plot last n ticks
            n_ticks = min(cur_tick, self.show_n_ticks)
            if n_ticks > 0:
                values = np.zeros(n_ticks)
                values[:cur_tick][-n_ticks:] = self.values[:cur_tick][-n_ticks:]
                plt.plot(range(n_ticks), values)


        # shades
        for i, lb in enumerate(np.arange(self.plot_config["ymin"]-0.25, self.plot_config["ymax"], 0.5)):
            ub = lb + 0.5
            color = self.plot_config["shadeColors"][i % len(self.plot_config["shadeColors"])]
            alpha = self.plot_config["shadeActiveAlpha"] if lb < self.values[:cur_tick][-1] < ub else self.plot_config["shadePassiveAlpha"]
            plt.fill_between(range(self.total_ticks + 1), lb, ub, alpha=alpha, color=color)

        # title
        plt.title(f"{self.name} {self.get_price(self.values[:cur_tick][-1]):.2f}€")
        # y axis
        plt.ylim(self.plot_config["ymin"], self.plot_config["ymax"])
        yticks = np.arange(self.plot_config["ymin"], self.plot_config["ymax"]+0.01, 0.5)
        plt.yticks(yticks, map(lambda y: f"{y:.2f}€", yticks))
        # x axis
        plt.xlim(0, self.total_ticks if self.show_n_ticks == 0 else self.show_n_ticks)
        if self.show_n_ticks == 0:
            # plot all full hours
            x = range(0, self.total_ticks + 1, int(3600 / (self.tick_interval / 1000)))
            plt.xticks(x, self.hour_labels)
            if len(x) > 2:
                plt.vlines(x[1:-1], self.plot_config["ymin"], self.plot_config["ymax"], alpha=0.4)
        else:
            # plot moving full hours
            ticks = []
            labels = []
            n_ticks = max(cur_tick, self.show_n_ticks)
            for i in range(self.show_n_ticks):
                time_label = self.times[:n_ticks][-self.show_n_ticks:][i]
                #if time_label.endswith(":00:00") or time_label.endswith(":30:00") or time_label.endswith(":15:00") or time_label.endswith(":45:00"):
                if time_label.endswith("5:00") or time_label.endswith("0:00"):
                    ticks.append(i)
                    labels.append(time_label[:-3])
            plt.xticks(ticks, labels)
            plt.vlines(ticks, self.plot_config["ymin"], self.plot_config["ymax"], alpha=0.4)

        # generate image
        buf = io.BytesIO()
        plt.savefig(buf)
        buf.seek(0)
        image = PIL.Image.open(buf)
        plt.close()
        return image

    @staticmethod
    def get_slope(p1, p2):
        time_delta = p2.time - p1.time
        return (p2.value - p1.value) / time_delta.seconds

    @staticmethod
    def get_price(value):
        price = round(value * 2) / 2
        return price
