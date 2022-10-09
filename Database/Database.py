from pony.orm import *
from datetime import datetime
from collections import deque
import random

db = pony.orm.Database()

db.bind('mysql', host='127.0.0.1', user='root', passwd='', db='PyRobots')
