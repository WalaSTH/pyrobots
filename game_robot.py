from cmath import pi
import math
from enum import Enum
from Database.Database import *
from pydantic_models import *
from game_auxilar_functions import *


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
    # engine
    engine_direction: int
    engine_previous_direction: int
    engine_velocity: int
    engine_request: bool
    current_speed_level: int
    frames_on_vel: int
    # aux
    counter: int

    def __init__(self, id):
        self.robot_id = id
        self.robot_name = get_robot_name_by_id(id)
        self.health = 100
        # engine inits
        self.engine_direction = 0
        self.engine_previous_direction = 0
        self.engine_velocity = 0
        self.engine_request = False
        self.current_speed_level = 1
        self.frames_on_vel = 0

    def set_position(self, x, y):
        self.x_position = x
        self.y_position = y

    def get_actual_velocity(self):
        return (
            SPEED_100_PERCENT
            * self.engine_velocity
            / 100
            * self.current_speed_level
            * 20
            / 100
        )

    def get_turn_kind(self):
        kind: Enum("Mild", "Moderate", "Severe")
        if self.engine_direction <= 20 or self.engine_direction >= 340:
            kind = "Mild"
        elif self.engine_direction < 45 or self.engine_direction > 315:
            kind = "Moderate"
        else:
            kidn = "Severe"

    def set_speed_level(self):
        if self.engine_request:
            print("Turn occured for" + str(self.robot_name) + "!")
            turn_kind = self.get_turn_kind()
            match turn_kind:
                case "Mild":
                    self.current_speed_level -= 1 if self.current_speed_level > 1 else 1
                case "Moderate":
                    self.current_speed_level -= 2 if self.current_speed_level > 2 else 1
                case "Severe":
                    self.current_speed_level = 1
            print(
                "Current speed level for "
                + str(self.robot_name)
                + "is "
                + str(self.current_speed_level)
            )
            self.engine_request = False
        elif self.frames_on_vel == FRAMES_FOR_CHANGE:
            self.current_speed_level += 1 if self.current_speed_level + 1 <= SN else SN
            self.frames_on_vel = 0
        else:
            self.frames_on_vel += 1

    def move(self):
        # set velocity
        self.set_speed_level()
        current_velocity = self.get_actual_velocity()
        # get new coordinates
        newy = int(get_cathetus(self.engine_direction, current_velocity))
        newx = int(get_cathetus(180 - 90 - self.engine_direction, current_velocity))
        # move bot
        self.x_position = (
            self.x_position + newx
            if self.x_position + newx < TABLE_HORIZONTAL_LENGHT
            else TABLE_HORIZONTAL_LENGHT
        )
        if self.x_position < 0:
            self.x_position = 0
        self.y_position = (
            self.y_position + newy
            if self.y_position + newy < TABLE_VERTICAL_LENGHT
            else TABLE_VERTICAL_LENGHT
        )
        if self.y_position < 0:
            self.y_position = 0

        if newx > 0 or newy > 0:
            print(
                str(self.robot_name)
                + " has moved! New direction is ("
                + str(self.x_position)
                + ", "
                + str(self.y_position)
                + ")."
            )

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
        self.engine_previous_direction = self.engine_direction
        self.engine_direction = get_angle(direction)
        self.engine_velocity = velocity
        if self.engine_previous_direction != direction:
            self.engine_request = True

    # Status
    def get_directions():
        return "here you go"

    def get_velocity():
        return "here you go"

    def get_position():
        return "here you go"

    def get_damage(self):
        return self.health
