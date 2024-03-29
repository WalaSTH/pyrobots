import math
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
    # default attributes
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

    def set_speed_level(self):
        turn_kind = get_turn_kind(self.engine_previous_direction, self.engine_direction)
        if self.engine_turn_request and turn_kind != "Despicable":
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

    def move(self):
        if self.engine_activated:
            self.set_speed_level()
            current_velocity = get_actual_velocity(SPEED_100_PERCENT, self.engine_velocity, self.current_speed_level)
            y_add = get_y_add(current_velocity, self.engine_direction)
            x_add = get_x_add(current_velocity, self.engine_direction)
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
                # check if robot is on angle range
                if enemy_distance <= self.scan_len and enemy_distance < self.scan_result:
                    enemy_angle = calculate_angle(
                        self.x_position,
                        self.y_position,
                        x_enemy,
                        y_enemy,
                        enemy_distance,
                    )
                    if upper_angle > lower_angle:
                        if enemy_angle >= lower_angle and enemy_angle <= upper_angle:
                            self.scan_result = enemy_distance
                    elif y_enemy >= self.y_position:
                        if enemy_angle <= lower_angle and enemy_angle <= upper_angle:
                            self.scan_result = enemy_distance
                    else:
                        if enemy_angle >= lower_angle and enemy_angle >= upper_angle:
                            self.scan_result = enemy_distance
            self.scan_setted = False
        else:
            self.scan_result = math.inf

    def shoot_cannon(self):
        if self.cannon_cooldown == 0 and self.cannon_setted:
            self.cannon_cooldown = CANNON_COOLDOWN_DEFAULT
            self.cannon_setted = False
            ## Get target x y
            y_target = get_y_add(self.cannon_distance, self.cannon_direction)
            x_target = get_x_add(self.cannon_distance, self.cannon_direction)
            
            if self.x_position + x_target < 1:
                x_target = 1
            else:
                x_target = self.x_position + x_target
            if x_target > TABLE_HORIZONTAL_LENGHT -1:
                x_target = TABLE_HORIZONTAL_LENGHT -1

            if self.y_position + y_target < 1:
                y_target = 1
            else:
                y_target = self.y_position + y_target
            if y_target > TABLE_VERTICAL_LENGHT - 2:
                y_target = TABLE_VERTICAL_LENGHT - 2

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
            res= [x_target, y_target, new_missile.x_target, new_missile.y_target]
        else:
            res = []
            self.cannon_cooldown = (
                self.cannon_cooldown - 1 if self.cannon_cooldown - 1 > 0 else 0
            )
        self.cannon_setted = False
        return res
    def missile_advance(self, explotion_list):
        n_missiles = len(self.missiles)
        for i in range(n_missiles):
            missile_direction = self.missiles[i].direction
            # Get x and y to add
            y_add = get_y_add(MISSILE_SPEED, missile_direction)
            x_add = get_x_add(MISSILE_SPEED, missile_direction)

            # Add them
            #self.missiles[i].x_position = self.missiles[i].x_position + x_add
            if self.missiles[i].x_position + x_add < 1:
                self.missiles[i].x_position = 1
                self.missiles[i].remains = -1
            else:
                self.missiles[i].x_position = self.missiles[i].x_position + x_add
            if self.missiles[i].x_position > TABLE_HORIZONTAL_LENGHT -1:
                self.missiles[i].x_position = TABLE_HORIZONTAL_LENGHT -1
                self.missiles[i].remains = -1

            if self.missiles[i].y_position + y_add < 1:
                self.missiles[i].y_position = 1
                self.missiles[i].remains = -1
            else:
                self.missiles[i].y_position = self.missiles[i].y_position + y_add
            if self.missiles[i].y_position > TABLE_VERTICAL_LENGHT -2:
                self.missiles[i].y_position = TABLE_VERTICAL_LENGHT -2
                self.missiles[i].remains = -1
            # Check if it has to explote
            self.missiles[i].remains = self.missiles[i].remains - 1 if self.missiles[i].remains - 1 > 0 else 0
            if self.missiles[i].remains == 0:
                # Explote missile
                new_explotion = Explotion(self.robot_id, self.game_id_robot, self.missiles[i].x_target, self.missiles[i].y_target)
                explotion_list.append(new_explotion)
                self.missiles.remove(self.missiles[i])
            elif self.missiles[i].remains == -1:
                # Explote missile
                new_explotion = Explotion(self.robot_id, self.game_id_robot, self.missiles[i].x_position,
                                            self.missiles[i].y_position)
                explotion_list.append(new_explotion)
                self.missiles.remove(self.missiles[i])

    def deal_damage(self, damage):
        self.health = self.health - damage if self.health - damage > 0 else 0

    ###### Player methods

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
        self.engine_activated = True

    # Status
    def get_directions(self):
        return self.engine_direction

    def get_velocity(self):
        return self.engine_velocity

    def get_position(self):
        return [self.x_position, self.y_position]

    def get_damage(self):
        return 100 - self.health