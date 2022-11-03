import math
from cmath import pi

## Auxilar functions

### Gets an angle as a value between 0 and 359
def get_angle(angle):
    if angle < 0:
        angle = 360 + angle
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


def get_cathetus(angle, hypotenuse):
    return math.sin(angle) * hypotenuse
