import datetime

class Point:
    def __init__(self, start_time, time, value, now=None):
        now = now or datetime.datetime.now()
        cur_time = now.time()
        today = now.date()

        start_time = datetime.datetime.strptime(start_time, '%H:%M').time()
        time = datetime.datetime.strptime(time, '%H:%M').time()
        if time >= start_time:
            self.time = datetime.datetime.combine(today, time)
        else:
            tomoroow = today + datetime.timedelta(days=1)
            self.time = datetime.datetime.combine(tomoroow, time)

        # correct dates in case it is restarted after 0:00
        if cur_time < start_time:
            self.time -= datetime.timedelta(days=1)

        self.value = value

    def __repr__(self):
        return str(self)

    def __str__(self):
        return f"{self.time.strftime(f'%H:%M')} {self.value}"