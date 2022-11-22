from Database.Database import *
from pydantic_models import *
from game_robot import *
from game_auxilar_functions import *
import random
import signal

@db_session
def run_game(robots, n_rounds, is_sim: bool, syscalls = True):
    n_robots = len(robots)
    robot_list = []
    robot_frame_list = []
    frame_list = []
    explotion_list = []
    explotion_frame_list = []
    missile_frame_list = []
    dead_list = []
    # Load robots to robot list
    for i in range(n_robots):
        robot_list.append(load_robot(robots[i]))
    # Initialize every robot
    for i in range(n_robots):
        set_position_by_index(robot_list[i])
        robot_list[i].game_id_robot = i
        # Try to execute initialize
        if syscalls:
            signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(3)
        try:
            robot_list[i].initialize()
        except:
            dead_list.append(robot_list[i])
            print("Robot " +str(robot_list[i].robot_name)+ " killed due to bad code.")
        finally:
            if syscalls:
                signal.alarm(0)
        # Add robot to frame
        add_robot_to_frame(robot_list[i], robot_frame_list)
    frame = {"robots": robot_frame_list.copy(), "missiles": [], "explotions": []}
    robot_frame_list = []
    frame_list.append(frame)

    # Main game loop
    k = 0
    while k < (n_rounds) and len(robot_list) > 1:
        # Try to respond for every robot
        for i in range(n_robots):
            if syscalls:
                signal.signal(signal.SIGALRM, timeout_handler)
                signal.alarm(3)
            try:
                robot_list[i].respond()
            except:
                print("Robot " +str(robot_list[i].robot_name)+ " killed due to bad code.")
                dead_list.append(robot_list[i])
            finally:
                if syscalls:
                    signal.alarm(0)

        # Scan for every robot
        for i in range(n_robots):
            other_robots = robot_list.copy()
            del other_robots[i]
            robot_list[i].scan(other_robots)

        # Move robots
        for i in range(n_robots):
            robot_list[i].move()
            if is_sim:
                add_robot_to_frame(robot_list[i], robot_frame_list)

        # Activate cannon and shoot missile
        for i in range(n_robots):
            robot_list[i].shoot_cannon()

        # Advance missiles
        for i in range(n_robots):
            robot_list[i].missile_advance(explotion_list)
            for j in range(len(robot_list[i].missiles)):
                if is_sim:
                    add_missile_to_frames(robot_list[i], j, missile_frame_list)

        # Deal explotion damage
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
            if is_sim:
                add_explotion_to_frames(explotion_list[i], explotion_frame_list)

        # Deal collide damage
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

        # Calculate deaths
        for i in range(n_robots):
            if robot_list[i].health == 0:
                # Add to to-kill list
                dead_list.append(robot_list[i])
        for i in range(len(dead_list)):
            try:
                # Kill robots
                robot_list.remove(dead_list[i])
                n_robots = len(robot_list)
            except:
                pass

        # Append frames and set next round
        if is_sim:
            frame = {"robots": robot_frame_list.copy(), "missiles": missile_frame_list.copy(),
                    "explotions": explotion_frame_list.copy()}
            missile_frame_list = []
            robot_frame_list = []
            explotion_frame_list = []
            frame_list.append(frame)
        dead_list.clear()
        k = k + 1
        explotion_list.clear()

    # Get winner if any
    if len(robot_list) == 1:
        add_robot_to_frame(robot_list[0], robot_frame_list)
        frame = {"robots": robot_frame_list.copy(), "missiles": missile_frame_list.copy(),
                    "explotions": explotion_frame_list.copy()}
        frame_list.append(frame)
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

def run_match(match_id, syscalls = True):
    n_rounds = get_match_rounds(match_id)
    m_games = get_match_games(match_id)
    robots = get_match_robots_ids(match_id)
    ranking = robots.copy()
    n_robots = len(robots)
    won_games = [0]*n_robots
    for i in range(m_games):
        winner_id = run_game(robots, n_rounds, False, syscalls)
        if winner_id != -1:
            for j in range(n_robots):
                if ranking[j] == winner_id:
                    won_games[j] += 1
    # Sort won_games and sort ranking with it
    print("Ranking before sort:" + str(ranking))
    print("Won games before sort:" + str(won_games))
    sort_results(ranking, won_games)
    create_result(ranking, won_games, match_id)
    set_match_state(match_id, True)

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

def add_robot_to_frame(robot_element, robot_frame_list):
    robot_for_frame = {
            "id": robot_element.game_id_robot,
            "robotName": robot_element.robot_name,
            "robotPosition": {
                "x": robot_element.x_position,
                "y": 999 - robot_element.y_position,
            },
            "health": robot_element.health,
        }
    robot_frame_list.append(robot_for_frame)

def add_missile_to_frames(robot_element, j, missile_frame_list):
    missile_for_frame = {
        "id": robot_element.game_id_robot,
        "missilePosition": {
            "x": robot_element.missiles[j].x_position,
            "y": 999 - robot_element.missiles[j].y_position,
        }
    }
    missile_frame_list.append(missile_for_frame)

def add_explotion_to_frames(explotion_element, explotion_frame_list):
    explotion_to_frame = {
        "id": explotion_element.game_id_robot,
        "explotionPosition": {
            "x": explotion_element.x_position,
            "y": 999 - explotion_element.y_position,
        }
    }
    explotion_frame_list.append(explotion_to_frame)

def sort_results(ranking, won_games):
    n_robots = len(ranking)
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

def timeout_handler(num, stack):
    raise Exception("robot_timeout")