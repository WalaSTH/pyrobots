import math
from enum import Enum
from cmath import pi

"""  Auxilar functions """

####---- Trigonometry related functions  ----####

### Gets an angle as a value between 0 and 359
def get_angle(angle):
    angle_old = angle
    if angle < 0:
        angle = angle_old + ( abs(int(angle_old / 360)) + 1 ) * 360
    return angle - (int(angle / 360) * 360)

### Gets distance between two points in a plane
def calculate_distance(x, y, x_enemy, y_enemy):
    return math.sqrt((x_enemy - x) ** 2 + (y_enemy - y) ** 2)


### Gets angle between a given point and another point relative to the x axys
def calculate_angle(x, y, x_enemy, y_enemy, hypotenuse):
    if x_enemy == x and y_enemy > y:
        a = 90
    elif x_enemy < x and y == y_enemy:
        a = 180
    elif x_enemy == x and y_enemy < y:
        a = 270
    elif x_enemy > x and y_enemy == y:
        a = 0
    else:
        hypotenuse = hypotenuse if hypotenuse != 0 else 1
        o_cathetus = abs(y_enemy - y)
        sina = o_cathetus / hypotenuse
        a = math.asin(sina)
        a = a * (180 / pi)
        if x_enemy - x > 0 and y_enemy - y > 0:
            a = a
        elif x_enemy - x < 0 and y_enemy - y > 0:
            a = 180 - a
        elif x_enemy - x < 0 and y_enemy - y < 0:
            a = 180 + a
        elif x_enemy - x > 0 and y_enemy - y < 0:
            a = 360 - a
    return a

### Gets cathetus from angle and hypotenuse
def get_cathetus(angle, hypotenuse):
    return math.sin(math.radians(angle)) * hypotenuse

### Translates angle to a 0-90 angle (moves it to first quadrant)
def get_first_quadrant_angle(angle):
    a = angle
    if angle <= 90:
        a = a
    elif angle > 90 and angle <=180:
        a = 180-a
    elif angle >180 and angle < 270:
        a = 180 + a
    else:
        a = 360 - a
    return a

### Gets an angle's (0-359) quadrant from first to fourth
def get_quadrant(angle):
    if angle <= 90:
        quadrant = "first"
    elif angle > 90 and angle <=180:
        quadrant = "second"
    elif angle >180 and angle < 270:
        quadrant = "third"
    else:
        quadrant = "fourth"
    return quadrant

### Gets y point to move to given a distance and 360 angle (assuming we are at (0,0))
def get_y_add(hypotenuse, angle_threesixty):
    fq_angle = get_first_quadrant_angle(angle_threesixty)
    quadrant = get_quadrant(angle_threesixty)
    y_add = int(get_cathetus(fq_angle, hypotenuse))
    match quadrant:
        case "third":
            y_add = y_add * (-1)
        case "fourth":
            y_add = y_add * (-1)
        case _:
            pass
    return y_add

### Gets x point to move to given a distance and 360 angle (assuming we are at (0,0))
def get_x_add(hypotenuse, angle_threesixty):
    fq_angle = get_first_quadrant_angle(angle_threesixty)
    quadrant = get_quadrant(angle_threesixty)
    x_add = int(get_cathetus(90 - fq_angle, hypotenuse))
    match quadrant:
        case "second":
            x_add = x_add * (-1)
        case "third":
            x_add = x_add * (-1)
        case _:
            pass
    return x_add

### Determinates how pronunciated is a turn based on previous direction
def get_turn_kind(previous_direction, direction):
    kind: Enum("Despicable", "Mild", "Moderate", "Severe")
    difference = abs(previous_direction - direction)
    if difference > 180:
        difference = 360 - difference
    if difference <=10:
        kind = "Despicable"
    elif difference <= 20:
        kind = "Mild"
    elif difference <= 45 :
        kind = "Moderate"
    else:
        kind = "Severe"
    return kind


def get_actual_velocity(speed, engine_velocity, current_speed_level):
        return (
            speed * (engine_velocity   / 100)  * current_speed_level * 20 / 100
        )

####---- Scanner related functions  ----####
def limit_res(res):
    if abs(res) > 10:
        res = 10
    return int(res)

####---- Cannon and missile related functions  ----####
def rounds_to_explote(distance, speed):
    return int(math.ceil(distance / speed))