from Database.Database import *
from pydantic_models import *
from game_robot import *
from game_auxilar_functions import *
import random

@db_session
def run_game(robots, n_rounds, is_sim: bool):
    #robots contains robot ids
    n_robots = len(robots)
    robot_list = []
    robot_frame_list = []
    frame_list = []
    explotion_list = []
    explotion_frame_list = []
    missile_frame_list = []
    dead_list = []
    # load robots to robot list
    for i in range(n_robots):
        robot_list.append(load_robot(robots[i]))
    # initialize every robot
    for i in range(n_robots):
        set_position_by_index(robot_list[i])
        robot_list[i].game_id_robot = i
        robot_list[i].initialize()
        set_position_by_index(robot_list[i])
        robot_for_frame = {
            "id": i,
            "robotName": robot_list[i].robot_name,
            "robotPosition": {
                "x": robot_list[i].x_position,
                "y": 999 -robot_list[i].y_position,
            },
            "health": robot_list[i].health,
        }
        robot_frame_list.append(robot_for_frame)
    frame = {"robots": robot_frame_list.copy(), "missiles": [], "explotions": []}
    robot_frame_list = []
    frame_list.append(frame)
    k = 0
    while k < (n_rounds) and len(robot_list) > 1:
        # respond for every robot
        for i in range(n_robots):
            robot_list[i].respond()
        # scan for every robot
        for i in range(n_robots):
            other_robots = robot_list.copy()
            del other_robots[i]
            robot_list[i].scan(other_robots)
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
                "id": robot_list[i].game_id_robot,
                "robotName": robot_list[i].robot_name,
                "robotPosition": {
                    "x":  robot_list[i].x_position,
                    "y": 999 - robot_list[i].y_position,
                },
                "health": robot_list[i].health,
            }
            if is_sim:
                robot_frame_list.append(robot_for_frame)
        # activate cannon and shoot missile
        for i in range(n_robots):
            robot_list[i].shoot_cannon()
        # advance missile
        for i in range(n_robots):
            robot_list[i].missile_advance(explotion_list)
            for j in range(len(robot_list[i].missiles)):
                missile_for_frame = {
                    "id": robot_list[i].game_id_robot,
                    "missilePosition": {
                        "x": robot_list[i].missiles[j].x_position,
                        "y": 999 - robot_list[i].missiles[j].y_position,
                    }
                }
                if is_sim:
                    missile_frame_list.append(missile_for_frame)
        # deal explotion damage
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
                elif distance_to_explotion <= EXPLOTION_DAMAGE_FAR + ROBOT_HITBOX_OFFSET:
                    robot_list[j].deal_damage(EXPLOTION_DAMAGE_MID)
            explotion_to_frame = {
                "id": explotion_list[i].game_id_robot,
                "explotionPosition": {
                    "x": explotion_list[i].x_position,
                    "y": 999 - explotion_list[i].y_position,
                }
            }
            if is_sim:
                explotion_frame_list.append(explotion_to_frame)

        # deal collide damage
        for i in range(n_robots):
            other_robots = robot_list.copy()
            del other_robots[i]
            for j in range(n_robots-1):
                if (robot_list[i].x_position == other_robots[j].x_position \
                and robot_list[i].y_position == other_robots[j].y_position)\
                or (robot_list[i].x_position + ROBOT_HITBOX_OFFSET >= TABLE_HORIZONTAL_LENGHT-1 \
                or robot_list[i].x_position - ROBOT_HITBOX_OFFSET <= 0 \
                or robot_list[i].y_position + ROBOT_HITBOX_OFFSET >= TABLE_VERTICAL_LENGHT -1 \
                or robot_list[i].y_position - ROBOT_HITBOX_OFFSET <= 0):
                    robot_list[i].deal_damage(COLLITION_DAMAGE)
        # calculate deaths
        for i in range(n_robots):
            if robot_list[i].health == 0:
                #kill robot
                dead_list.append(robot_list[i])
                #robot_list.remove(robot_list[i])
        for i in range(len(dead_list)):
            robot_list.remove(dead_list[i])
            n_robots = len(robot_list)
        # append frames and set next round
        if is_sim:
            frame = {"robots": robot_frame_list.copy(), "missiles": missile_frame_list.copy(), "explotions": explotion_frame_list.copy()}
            missile_frame_list = []
            robot_frame_list = []
            explotion_frame_list = []
            frame_list.append(frame)
        dead_list.clear()
        k = k + 1
        explotion_list.clear()
    if len(robot_list) == 1:
        winner = robot_list[0].robot_id
        winner_name = get_robot_name_by_id(winner)
    else:
        winner = -1
        winner_name = None
    print("Winner is " + str(winner_name))
    if is_sim:
        result = {"winner": winner_name, "frames": frame_list}
    else:
        result = winner
    return result

def run_match(match_id):
    n_rounds = get_match_rounds(match_id)
    m_games = get_match_games(match_id)
    robots = get_match_robots_ids(match_id)
    ranking = robots.copy()
    n_robots = len(robots)
    won_games = [0]*n_robots
    for i in range(m_games):
        winner_id = run_game(robots, n_rounds, False)
        if winner_id != -1:
            for j in range(n_robots):
                if ranking[j] == winner_id:
                    won_games[j] += 1
    #sort won_games and sort ranking with it
    #we will do simple insertion sort
    print("Ranking before sort:" + str(ranking))
    print("Won games before sort:" + str(won_games))
    for i in range(n_robots):
        max = -1
        for j in range(i, n_robots):
            if won_games[j] > max:
                max = won_games[j]
                max_index = j
        old = won_games[i]
        old_rob = ranking[i]
        won_games[i] = max
        ranking[i] = ranking[max_index]
        won_games[max_index] = old
        ranking[max_index] = old_rob
    create_result(ranking, won_games, match_id)
    set_match_state(match_id, True)


def load_robotold(username, robot_name: str):
    code = get_code_by_robotname(username, robot_name)
    classname: str = get_robot_by_name(username, robot_name).robot_class_name
    user = get_user(username)
    robot_id = get_id_robot(robot_name, user)
    size = len(classname)
    classname = classname[: size - 3]
    classname = classname.replace("_", " ").title().replace(" ", "")
    exec_str = "newRobot = " + classname + "(" + str(robot_id) + ")"
    exec_str = code + exec_str.encode()
    exec(exec_str, globals())
    return newRobot  # newRobot is defined in exec_str

def load_robot(robot_id):
    code = get_code_by_robot_id(robot_id)
    classname: str = get_robot_classname(robot_id)
    size = len(classname)
    classname = classname[: size - 3]
    classname = classname.replace("_", " ").title().replace(" ", "")
    exec_str = "\nnewRobot = " + classname + "(" + str(robot_id) + ")"
    exec_str = code + exec_str.encode()
    exec(exec_str, globals())
    return newRobot  # newRobot is defined in exec_str

def set_position_by_index(gameRobot):
        x = random.randint(10, 990)
        y = random.randint(10, 990)
        gameRobot.set_position(x, y)


