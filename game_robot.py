from cmath import pi
from Database.Database import *
from pydantic_models import *
import math

TABLE_HORIZONTAL_LENGHT = 1000
TABLE_VERTICAL_LENGHT = 1000


CANNON_COOLDOWN_DEFAULT = 4
MISSILE_LIFE = 4
MISSILE_SPEED = 2


SPEED_100_PERCENT = 30
FRAMES_FOR_CHANGE = 5
SN = 5


class gameRobot:
    robot_id: int
    robot_name: str
    x_position: int
    y_position: int
    health: int

    # aux
    counter: int

    def __init__(self, id):
        self.robot_id = id
        self.robot_name = get_robot_name_by_id(id)
        self.health = 100

    def set_position(self, x, y):
        self.x_position = x
        self.y_position = y

    def move(self):
        return True

    ###### User accesible methods

    # Cannon

    def is_cannon_ready(self):
        return True

    def cannon(self, degree, distance):
        return True

    # Scan
    def point_scanner(self, direction, resolution_in_degrees):
        return True

    def scanned(self):
        return True

    # Drive
    def drive(self, direction, velocity):
        return True

    # Status
    def get_directions():
        return "here you go"

    def get_velocity():
        return "here you go"

    def get_position():
        return "here you go"

    def get_damage(self):
        return self.health


def load_robot(username, robot_name: str):
    # code = Robot[i].code

    # get_robot_code_by_name
    code = get_code_by_robotname(username, robot_name)
    classname: str = get_robot_by_name(username, robot_name).robot_class_name
    user = get_user(username)
    robot_id = get_id_robot(robot_name, user)
    size = len(classname)
    classname = classname[: size - 3]
    classname = classname.replace("_", " ").title().replace(" ", "")
    exec_str = "newRobot = " + classname + "(" + str(robot_id) + ")"
    # exec_str = code + exec_str.encode()  -> use this to load code instead of custom file
    exec(open("super_robot_copy.py").read(), globals())
    exec(exec_str, globals())
    return newRobot  # newRobot is defined in exec_str
