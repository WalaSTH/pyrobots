from Database.Database import *
from pydantic_models import *
from game_robot import *
from game_auxilar_functions import *


@db_session
def run_simulation(sim: SimData):
    n_robots = len(sim.robot_names)
    robot_list = []
    robot_frame_list = []
    frame_list = []
    missileList = []
    frame_list1 = []
    frame_list2 = []
    # load robots to robot list
    for i in sim.robot_names:
        robot_list.append(load_robot(sim.username, i))
    # initialize every robot
    for i in range(n_robots):
        robot_list[i].initialize()
        set_position_by_index(robot_list[i], i)
        robot_for_frame = {
            "id": i,
            "robotName": robot_list[i].robot_name,
            "robotPosition": {
                "x": robot_list[i].x_position,
                "y": robot_list[i].y_position,
            },
            "health": robot_list[i].health,
        }
        robot_frame_list.append(robot_for_frame)
    frame = {"robots": robot_frame_list.copy(), "missiles": {}}
    robot_frame_list = []
    frame_list.append(frame)
    for i in range(sim.n_rounds):
        print("Starting round N: " + str(i + 1) + "!")
        # respond for every robot
        for i in range(n_robots):
            robot_list[i].respond()
        # scan for every robot
        for i in range(n_robots):
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
            robot_list[i].move()
            robot_for_frame = {
                "id": i,
                "robotName": robot_list[i].robot_name,
                "robotPosition": {
                    "x": robot_list[i].x_position,
                    "y": robot_list[i].y_position,
                },
                "health": robot_list[i].health,
            }
            robot_frame_list.append(robot_for_frame)
        frame = {"robots": robot_frame_list.copy(), "missiles": {}}
        robot_frame_list = []
        frame_list.append(frame)
        # check collisions
        # apply damage
        # calculate deaths
    return frame_list


def load_robot(username, robot_name: str):
    code = get_code_by_robotname(username, robot_name)
    classname: str = get_robot_by_name(username, robot_name).robot_class_name
    user = get_user(username)
    robot_id = get_id_robot(robot_name, user)
    size = len(classname)
    print("\n\n\n", classname, "\n\n\n")
    classname = classname[: size - 3]
    print("\n\n\n", classname, "\n\n\n")
    classname = classname.replace("_", " ").title().replace(" ", "")
    print("\n\n\n", classname, "\n\n\n")
    exec_str = "newRobot = " + classname + "(" + str(robot_id) + ")"
    print("\n\n\n", exec_str, "\n\n\n")
    exec_str = code + exec_str.encode()
    print("\n\n\n", exec_str, "\n\n\n")
    exec(exec_str, globals())
    return newRobot  # newRobot is defined in exec_str


def set_position_by_index(gameRobot, index):
    match index:
        case 0:
            gameRobot.set_position(750, 250)
        case 1:
            gameRobot.set_position(250, 250)
        case 2:
            gameRobot.set_position(250, 750)
        case 3:
            gameRobot.set_position(750, 750)
