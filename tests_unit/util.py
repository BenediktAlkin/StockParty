import datetime


def to_datetime(time, add_one_day=False):
    now = datetime.datetime.now()
    if add_one_day:
        date = now.date() + datetime.timedelta(days=1)
    else:
        date = now.date()
    time = datetime.datetime.strptime(time, '%H:%M').time()
    return datetime.datetime.combine(date, time)