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
class Missile:
    x_position: int
    y_position: int
    x_target: int
    y_target: int
    direction: int
    distance: int
    remains: int
    def __init__(self, x_p,y_p,x_t,y_t, dir, dis, rem):
        self.x_position = x_p
        self.y_position = y_p
        self.x_target = x_t
        self.y_target = y_t
        self.direction = dir
        self.distance = dis
        self.remains = rem

class Explotion:
    id_robot: int
    game_id_robot: int
    x_position: int
    y_position: int
    def __init__(self, id, game_id, x, y):
        self.id_robot = id
        self.game_id_robot = game_id
        self.x_position = x
        self.y_position = y

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
    # cannon
    cannon_ready: bool
    cannon_setted: bool
    cannon_cooldown: int
    cannon_direction: int
    cannon_distance: int
    # missiles
    missiles: list[Missile]

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
        # cannon inits
        self.cannon_cooldown = 0
        self.cannon_ready = True
        self.cannon_setted = False
        self.missiles = []

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

    def shoot_cannon(self):
        if self.cannon_cooldown == 0 and self.cannon_setted:
            self.cannon_cooldown = CANNON_COOLDOWN_DEFAULT
            self.cannon_setted = False
            ## Get target x y
            y_target = get_y_add(self.cannon_distance, self.cannon_direction)
            x_target = get_x_add(self.cannon_distance, self.cannon_direction)
            x_target = (
                self.x_position + x_target
                if self.x_position + x_target < TABLE_HORIZONTAL_LENGHT
                else TABLE_HORIZONTAL_LENGHT
            )
            if x_target < 0:
                x_target = 0

            y_target  = (
                self.y_position + y_target
                if self.y_position + y_target  < TABLE_VERTICAL_LENGHT
                else TABLE_VERTICAL_LENGHT
            )
            if y_target  < 0:
                y_target  = 0

            new_missile = Missile(
                self.x_position,
                self.y_position,
                x_target,
                y_target,
                self.cannon_direction,
                self.cannon_distance,
                rounds_to_explote(self.cannon_distance, MISSILE_SPEED)
            )

            self.missiles.append(new_missile)
            print(
                str(self.robot_name)
                + " has fired a missle to direction "
                + str(self.cannon_direction)
                + " with distance "
                + str(self.cannon_distance)
            )
        else:
            self.cannon_cooldown = (
                self.cannon_cooldown - 1 if self.cannon_cooldown - 1 > 0 else 0
            )
        self.cannon_setted = False

    def missile_advance(self, explotion_list):
        n_missiles = len(self.missiles)
        for i in range(n_missiles):
            missile_direction = self.missiles[i].direction
            missile_distance = self.missiles[i].distance
            # calcular nuevo punto x,y para el misil
            y_add = get_y_add(MISSILE_SPEED, missile_direction)
            x_add = get_x_add(MISSILE_SPEED, missile_direction)
            # sumar y mover
            self.missiles[i].x_position = (
                self.missiles[i].x_position + x_add
                if self.missiles[i].x_position + x_add < TABLE_HORIZONTAL_LENGHT
                else TABLE_HORIZONTAL_LENGHT
            )
            if self.missiles[i].x_position < 0:
                self.missiles[i].x_position = 0

            self.missiles[i].y_position = (
                self.missiles[i].y_position + y_add
                if self.missiles[i].y_position + y_add < TABLE_VERTICAL_LENGHT
                else TABLE_VERTICAL_LENGHT
            )
            if self.missiles[i].y_position < 0:
                self.missiles[i].y_position = 0
            print("Missile is in (" + str(self.missiles[i].x_position) + ", "+str(self.missiles[i].y_position) + ").")
            # ver si explota
            self.missiles[i].remains = self.missiles[i].remains - 1 if self.missiles[i].remains - 1 > 0 else 0
            if self.missiles[i].remains == 0:
                # explotar misil
                new_explotion = Explotion(self.robot_id, self.game_id_robot, self.missiles[i].x_target, self.missiles[i].y_target)
                explotion_list.append(new_explotion)
                self.missiles.remove(self.missiles[i])
                print("Missile exploted")

    def deal_damage(self, damage):
        self.health = self.health - damage if self.health - damage > 0 else 0
        print("dealed "+str(damage)+ "to robot")
    ###### User accesible methods

    # Cannon

    def is_cannon_ready(self):
        return self.cannon_cooldown == 0

    def cannon(self, degree, distance):
        self.cannon_direction = get_angle(degree)
        if distance < 0:
            distance = 0
        elif distance > MISSILE_MAX_DISTANCE:
            distance = MISSILE_MAX_DISTANCE
        self.cannon_distance = distance
        self.cannon_setted = True


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