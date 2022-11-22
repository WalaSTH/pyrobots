from base64 import b64encode
from fastapi import File
from fastapi.testclient import TestClient
from Database.Database import *
from app import app
from Test.auxiliar_functions import *
from game_robot import *
import math

client = TestClient(app)

user_to_reg = {
    "username": "TestingGame",
    "password": "Password1",
    "email": (get_email()),
    "avatar": None,
    }
user = client.post("/user/signup", data=user_to_reg)
assert user.status_code == 200
id = get_last_user_id()

#Create robot 1
avatar = b64encode(open("Test/files/image.jpg", "rb").read())
new_robot_upl1 = {
    "robot_name": "Dummy1",
    "creator": id,
    "avatar": avatar,
}
code = open("Test/files/dummybot.py", "rb")
rob1 = client.post("/robot/create", data=new_robot_upl1, files={"code": code})
assert rob1.status_code == 200
rob1_id = get_robot_id_by_name("TestingGame", "Dummy1")

#Create robot 2
new_robot_upl2 = {
    "robot_name": "Dummy2",
    "creator": id,
    "avatar": avatar,
}
code = open("Test/files/dummybot.py", "rb")
rob2 = client.post("/robot/create", data=new_robot_upl2, files={"code": code})
assert rob2.status_code == 200
rob2_id = get_robot_id_by_name("TestingGame", "Dummy2")

robot1 = gameRobot(rob1_id)
robot2 = gameRobot(rob2_id)


other_robots=[robot2]

##### Test scan
"""
Scan Test 1:
As robot is in angle 0 and distance is 200, scan should return 200
"""
def test_scan1():
    robot1.set_position(0,0)
    robot2.set_position(200,0)
    robot1.point_scanner(1,10)
    robot1.scan(other_robots)
    res_scan = robot1.scan_result
    print(robot1.scan_direction)
    print(res_scan)
    assert res_scan == 200

"""
Scan Test 2:
Robot1 is in the middle and robot2 will be in a random position
Robot1 will start scaning anti-clockwise untill found.
If scan works properly, it should find it
"""
def test_scan_360():
    robot1.set_position(500,500)
    robot2.set_position(random.randint(10, 990),random.randint(10, 990))
    res_scan = 10000
    i = 0
    while res_scan >= 10000:
        robot1.point_scanner(i, 10)
        robot1.scan(other_robots)
        res_scan = robot1.scan_result
        i=i+1
    print(i)
    print(robot1.scan_direction)
    print(res_scan)
    assert res_scan < 1000

##### Test move
"""
Move 1
Robot 1 will move horizontally.
If drive and move work correctly, new x position should be greater than previous
"""
def test_move():
    robot1.set_position(0,0)
    robot1.drive(0,100)
    robot1.move()
    assert robot1.x_position > 0

"""
Move 2
Robot 1 will move verticaclly.
If drive and move work correctly, new y position should be greater than previous
"""
def test_move2():
    robot1.set_position(0,0)
    robot1.drive(90,100)
    robot1.move()
    assert robot1.y_position > 0

"""
Move 3
Robot 1 will move in an angle.
If drive and move work correctly, new x and y position should be greater than previous
"""
def test_move3():
    robot1.set_position(0,0)
    robot1.drive(45,100)
    robot1.move()
    assert robot1.x_position > 0 and robot1.y_position > 0

"""
Move 4
Robot 1 will move in an angle to the bottom left.
If drive and move work correctly, new x and y position should be less than previous
"""
def test_move4():
    robot1.set_position(500,500)
    robot1.drive(200,100)
    robot1.move()
    assert robot1.x_position < 500 and robot1.y_position < 500

##### Test cannon
"""
Cannon 1
Check if missile is created when calling cannon and shoot missile for the first time (when there is no cooldown)
Also check a second missile is not created if called cannon right away, since it has cooldown.
"""
def test_cannon():
    robot1.set_position(0,0)
    robot1.cannon(0,10)
    robot1.shoot_cannon()
    assert len(robot1.missiles) == 1
    robot1.cannon(0,10)
    robot1.shoot_cannon()
    assert len(robot1.missiles) == 1
    robot1.missiles.clear()

"""
Cannon 2
Check if missiles move. When shoot, missiles should advance
 """
def test_missile():
    explotions = []
    robot1.set_position(50,50)
    robot1.cannon_cooldown = 0
    robot1.game_id_robot = 0
    robot1.cannon(0,100)
    robot1.shoot_cannon()
    robot1.missile_advance(explotions)
    print(robot1.cannon_cooldown)
    print(robot1.missiles[0].x_position)
    assert len(robot1.missiles) == 1
    assert robot1.missiles[0].x_position > 50 and robot1.missiles[0].y_position == 50
    explotions.clear()
    robot1.missiles.clear()

##### Test damage
"""
When missile explotes close, a robot should recieve 10 damage points
"""
def test_missile_damage1():
    explotions = []
    robot1.missiles.clear()
    robot1.set_position(50,50)
    robot2.set_position(50 + MISSILE_SPEED + EXPLOTION_RANGE_CLOSE + ROBOT_HITBOX_OFFSET,50)
    robot2.health = 100
    robot1.cannon_cooldown = 0
    robot1.game_id_robot = 0
    robot1.cannon(0, MISSILE_SPEED)
    robot1.shoot_cannon()
    #print("Missile is in:" + str(robot1.missiles[0].x_position) + ", " + str(robot1.missiles[0].y_position) + ")" )
    robot1.missile_advance(explotions)
    deal_damage(explotions, 2, [robot1,robot2])
    assert robot2.health == 90
    robot1.missiles.clear()

"""
When missile explotes in mid range, a robot should recieve 5 damage points
"""
def test_missile_damage2():
    explotions = []
    robot1.missiles.clear()
    robot1.set_position(50,50)
    robot2.set_position(50 + MISSILE_SPEED + EXPLOTION_RANGE_MID + ROBOT_HITBOX_OFFSET , 50)
    print("Robot 2 is on " + str(50 + MISSILE_SPEED + 30) + ", " + str (50))
    robot2.health = 100
    robot1.cannon_cooldown = 0
    robot1.game_id_robot = 0
    robot1.cannon(0, MISSILE_SPEED)
    robot1.shoot_cannon()
    print("Missile is in:" + str(robot1.missiles[0].x_position) + ", " + str(robot1.missiles[0].y_position) + ")" )
    robot1.missile_advance(explotions)
    #print("Missile is in:" + str(robot1.missiles[0].x_position) + ", " + str(robot1.missiles[0].y_position) + ")" )
    print(explotions[0].x_position)
    distance = deal_damage(explotions, 2, [robot1,robot2])
    print("distance is " + str(distance))
    assert robot2.health == 95
    robot1.missiles.clear()

"""
When missile explotes in mid range, a robot should recieve 3 damage points
"""
def test_missile_damage3():
    explotions = []
    robot1.missiles.clear()
    robot1.set_position(50,50)
    robot2.set_position(50 + MISSILE_SPEED + EXPLOTION_RANGE_FAR + ROBOT_HITBOX_OFFSET , 50)
    print("Robot 2 is on " + str(50 + MISSILE_SPEED + 30) + ", " + str (50))
    robot2.health = 100
    robot1.cannon_cooldown = 0
    robot1.game_id_robot = 0
    robot1.cannon(0, MISSILE_SPEED)
    robot1.shoot_cannon()
    print("Missile is in:" + str(robot1.missiles[0].x_position) + ", " + str(robot1.missiles[0].y_position) + ")" )
    robot1.missile_advance(explotions)
    #print("Missile is in:" + str(robot1.missiles[0].x_position) + ", " + str(robot1.missiles[0].y_position) + ")" )
    print(explotions[0].x_position)
    distance = deal_damage(explotions, 2, [robot1,robot2])
    print("distance is " + str(distance))
    assert robot2.health == 97
    robot1.missiles.clear()

def deal_damage(explotion_list, n_robots, robot_list):
    for i in range(len(explotion_list)):
        for j in range(n_robots):
            x_exp = explotion_list[i].x_position
            y_exp = explotion_list[i].y_position
            x_rob = robot_list[j].x_position
            y_rob = robot_list[j].y_position
            distance_to_explotion = calculate_distance(x_exp, y_exp, x_rob, y_rob)
            if distance_to_explotion <= EXPLOTION_RANGE_CLOSE + ROBOT_HITBOX_OFFSET:
                robot_list[j].deal_damage(EXPLOTION_DAMAGE_CLOSE)
            elif distance_to_explotion <= EXPLOTION_RANGE_MID + ROBOT_HITBOX_OFFSET:
                robot_list[j].deal_damage(EXPLOTION_DAMAGE_MID)
            elif distance_to_explotion <= EXPLOTION_RANGE_FAR + ROBOT_HITBOX_OFFSET:
                robot_list[j].deal_damage(EXPLOTION_DAMAGE_FAR)
            else: distance_to_explotion = distance_to_explotion
    return distance_to_explotion