from cmath import pi
import math
from enum import Enum
from Database.Database import *
from pydantic_models import *
from game_auxilar_functions import *

### GAME PARAMETERS

TABLE_HORIZONTAL_LENGHT = 1000
TABLE_VERTICAL_LENGHT = 1000

ROBOT_HITBOX_OFFSET = 12

SCAN_LENGTH = 10000

CANNON_COOLDOWN_DEFAULT = 10
MISSILE_LIFE = 4
MISSILE_SPEED = 70
MISSILE_MAX_DISTANCE = 700
EXPLOTION_RANGE_FAR = 40
EXPLOTION_RANGE_MID = 20
EXPLOTION_RANGE_CLOSE = 5

EXPLOTION_DAMAGE_FAR = 3
EXPLOTION_DAMAGE_MID = 5
EXPLOTION_DAMAGE_CLOSE = 10
COLLITION_DAMAGE = 2

SPEED_100_PERCENT = 30
FRAMES_FOR_CHANGE = 5
SN = 5

### GAME CLASSES

class gameRobot:
    robot_id: int
    game_id_robot: int
    robot_name: str
    x_position: int
    y_position: int
    health: int
    # engine
    engine_direction: int
    engine_previous_direction: int
    engine_velocity: int
    engine_turn_request: bool
    current_speed_level: int
    frames_on_vel: int
    engine_activated:bool
    # scan
    scan_direction: int
    scan_resolution: int
    scan_result: int
    scan_len: int
    scan_setted: bool

    def __init__(self, id):
        self.robot_id = id
        self.robot_name = get_robot_name_by_id(id)
        self.health = 100
        # engine inits
        self.engine_direction = 0
        self.engine_previous_direction = 0
        self.engine_velocity = 0
        self.engine_turn_request = False
        self.current_speed_level = 1
        self.frames_on_vel = 0
        self.engine_activated = False
        # scan inits
        self.scan_len = SCAN_LENGTH
        self.scan_setted = False
        self.scan_result = math.inf

    def set_position(self, x, y):
        self.x_position = x
        self.y_position = y

    def get_actual_velocity(self):
        return (
            SPEED_100_PERCENT * (self.engine_velocity   / 100)  * self.current_speed_level * 20 / 100
        )

    def get_turn_kind(self):
        kind: Enum("Despicable", "Mild", "Moderate", "Severe")
        difference = abs(self.engine_previous_direction - self.engine_direction)
        if difference > 180:
            difference = 360 - difference
        print("Difference is " + str(difference))
        if difference <=10:
            kind = "Despicable"
        elif difference <= 20:
            kind = "Mild"
        elif difference <= 45 :
            kind = "Moderate"
        else:
            kind = "Severe"
        return kind

    def set_speed_level(self):
        turn_kind = self.get_turn_kind()
        print("Turn is " + str(turn_kind))
        if self.engine_turn_request and turn_kind != "Despicable":
            print("Turn occured for" + str(self.robot_name) + "!")
            turn_kind = self.get_turn_kind()
            match turn_kind:
                case "Mild":
                    self.current_speed_level = self.current_speed_level - 1 if self.current_speed_level > 1 else 1
                case "Moderate":
                    self.current_speed_level =self.current_speed_level - 2 if self.current_speed_level > 2 else 1
                case "Severe":
                    self.current_speed_level = 1
            self.engine_turn_request = False
        elif self.frames_on_vel == FRAMES_FOR_CHANGE:
            self.current_speed_level = self.current_speed_level+  1 if self.current_speed_level + 1 <= SN else SN
            self.frames_on_vel = 0
        else:
            self.frames_on_vel += 1
        print(
            "Current speed level for "
            + str(self.robot_name)
            + " is "
            + str(self.current_speed_level)
        )

    def move(self):
        if self.engine_activated:
            self.set_speed_level()
            current_velocity = self.get_actual_velocity()
            y_add = get_y_add(current_velocity, self.engine_direction)
            x_add = get_x_add(current_velocity, self.engine_direction)
            print("Current velocity for "+ str(self.robot_name) + "is " + str(current_velocity))
            if (self.robot_name == "Copy1"):
                print("SO, direction is: " + str(self.engine_direction) + " right?")
                print("HEY, we need to add to x: " + str(x_add))
                print("HEY, we need to add to y: " + str(y_add))
            self.x_position = (
                self.x_position + x_add
                if self.x_position + x_add < TABLE_HORIZONTAL_LENGHT -1
                else TABLE_HORIZONTAL_LENGHT -1
            )
            if self.x_position < 0:
                self.x_position = 0
            self.y_position = (
                self.y_position + y_add
                if self.y_position + y_add < TABLE_VERTICAL_LENGHT -1
                else TABLE_VERTICAL_LENGHT -1
            )
            if self.y_position < 0:
                self.y_position = 0
            self.engine_activated = False

    def scan(self, other_robots):
        # other robots only has the rest of robots
        n_robots = len(other_robots)
        if self.scan_setted:
            # only scan if scan was set last round
            main_angle = get_angle(self.scan_direction)
            upper_angle = get_angle(main_angle + (self.scan_resolution / 2))
            lower_angle = get_angle(main_angle - (self.scan_resolution / 2))
            self.scan_result = math.inf
            # check for collision
            for i in range(n_robots):
                # calculate robot distance
                x_enemy = other_robots[i].x_position
                y_enemy = other_robots[i].y_position
                enemy_distance = calculate_distance(
                    self.x_position, self.y_position, x_enemy, y_enemy
                )
                print("Distance calculated, is " + str(enemy_distance))
                # check if robot is on angle range
                if enemy_distance < self.scan_len and enemy_distance < self.scan_result:
                    enemy_angle = calculate_angle(
                        self.x_position,
                        self.y_position,
                        x_enemy,
                        y_enemy,
                        enemy_distance,
                    )
                    print("Enemy angle is "+ str(enemy_angle))
                    print("Upper angle is "+ str(upper_angle))
                    print("Lower angle is "+ str(lower_angle))
                    if upper_angle > lower_angle:
                        #regular case
                        print("Regular case")

                        if enemy_angle >= lower_angle and enemy_angle <= upper_angle:
                            print("enemy is on range and closer than previouse")
                            # enemy is on range and closer than previous
                            self.scan_result = enemy_distance
                            print("Enemy found on angle: " + str(enemy_angle))
                    elif y_enemy >= self.y_position:
                        #weird case and enemy is 1st quadrant
                        print("weird case and enemy is 1st quadrant")
                        if enemy_angle <= lower_angle and enemy_angle <= upper_angle:
                            self.scan_result = enemy_distance
                            print("Enemy found on angle: " + str(enemy_angle))
                    else:
                        print("other case")
                        if enemy_angle >= lower_angle and enemy_angle >= upper_angle:
                            self.scan_result = enemy_distance
                            print("Enemy found on angle: " + str(enemy_angle))
            self.scan_setted = False
            if self.scan_result == math.inf:
                print("Scan found 0 robots")
        else:
            self.scan_result = math.inf

    ###### User accesible methods

    # Cannon

    def is_cannon_ready(self):
        return True

    def cannon(self, degree, distance):
        return True


    # Scan
    def point_scanner(self, direction, resolution_in_degrees):
        self.scan_direction = direction
        self.scan_resolution = limit_res(resolution_in_degrees)
        self.scan_setted = True

    def scanned(self):
        return self.scan_result

    # Drive
    def drive(self, direction, velocity):
        self.engine_previous_direction = self.engine_direction
        self.engine_direction = get_angle(direction)
        self.engine_velocity = velocity
        self.engine_activated = True
        if self.engine_previous_direction != self.engine_direction:
            self.engine_turn_request = True

    # Status
    def get_directions():
        return "here you go"

    def get_velocity(self):
        return self.engine_velocity

    def get_position(self):
        return [self.x_position, self.y_position]

    def get_damage(self):
        return 100 - self.health
