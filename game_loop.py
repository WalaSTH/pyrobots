from Database.Database import *
from pydantic_models import *


@db_session
def run_simulation(sim: SimData):
    n_robots = len(sim.robot_names)
    robot_list = []
    missileList = []
    frame_list1 = []
    frame_list2 = []
    # load robots to robot list
    # for i in sim.robot_names:
    # load robots
    # initialize every robot
    for i in range(n_robots):
        # robot_list[i].initialize()
        continue
    # if i == 0:
    # frame_list.append({robot_list[i].x_position, robot_list[i].y_position})
    # loop for number of rounds
    for i in range(sim.n_rounds):
        print("Starting round N: " + str(i + 1) + "!")
        # respond for every robot
        for i in range(n_robots):
            # robot_list[i].respond()
            continue
        # scan for every robot
        for i in range(n_robots):
            # other_robots = robot_list.copy()
            # del other_robots[i]
            # print(other_robots)
            # robot_list[i].scan(other_robots)
            # launch missle for every robot
            continue
        for i in range(n_robots):
            # robot_list[i].shoot_cannon()
            continue
        # misil advance
        for i in range(n_robots):
            # robot_list[i].missile_advance()
            continue
        # move robots
        for i in range(n_robots):
            # robot_list[i].move()
            continue
        # check collisions
        # apply damage
        # calculate deaths
    return True


def load_robot(username, robot_name: str):

    return True
