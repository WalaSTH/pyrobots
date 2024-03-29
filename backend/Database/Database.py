from pony.orm import *
import sys
from datetime import *
import scipy.stats as ss
from pathlib import Path
import numpy as np

db = pony.orm.Database()

if "pytest" in sys.modules:
    db.bind(provider="sqlite", filename=":sharedmemory:")
else:
    db.bind(provider="sqlite", filename="db.pyrobots", create_db=True)


class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    user_name = Required(str, unique=True)
    email = Required(str, unique=True)
    password = Required(str)
    verified = Required(bool)
    photo = Optional(bytes)
    owned_matches = Set("Match", reverse="creator")
    ongoing_matches = Set("Match", reverse="participants")
    owned_robots = Set("Robot", reverse="owner")
    matches_played = Required(int)
    matches_won = Required(int)


class Robot(db.Entity):
    id = PrimaryKey(int, auto=True)
    robot_name = Required(str)
    owner = Required(User, reverse="owned_robots")
    fights = Set("Match", reverse="fighters")
    code = Required(bytes)
    robot_class_name = Required(str)
    avatar = Optional(bytes)
    matches_played = Required(int)
    matches_won = Required(int)


class Match(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    password = Optional(str)
    started = Required(bool)
    game_quantity = Required(int)
    round_quantity = Required(int)
    current_players = Required(int)
    min_players = Required(int)
    max_players = Required(int)
    creator = Required(User, reverse="owned_matches")
    participants = Set(User, reverse="ongoing_matches")
    fighters = Set(Robot, reverse="fights")
    match_results = Optional("Result")


class Result(db.Entity):
    id = PrimaryKey(int, auto=True)
    ranking = Required(IntArray)
    won_games = Required(IntArray)
    match = Required(Match)
    date = Required(datetime)

db.generate_mapping(create_tables=True)


# --- Match Functions --- #


@db_session
def create_match(
    match_name,
    password,
    game_quantity,
    round_quantity,
    min_players,
    max_players,
    creator_id,
    robot_id,
):
    new_match = Match(
        name=match_name,
        password=password,
        started=False,
        game_quantity=game_quantity,
        round_quantity=round_quantity,
        current_players=1,
        min_players=min_players,
        max_players=max_players,
        creator=creator_id,
    )
    new_match.participants.add(User[creator_id])
    new_match.fighters.add(Robot[robot_id])
    return new_match.id


@db_session
def get_match_info(room_id):
    room = Match[room_id]

    participants_list = []
    for r in room.fighters:

        u_avatar = None
        if r.owner.photo is not None:
            u_avatar = r.owner.photo.decode()

        r_avatar = None
        if r.avatar is not None:
            r_avatar = r.avatar.decode()


        participants_list.append(({
            "robot_name": r.robot_name,
            "robot_avatar": r_avatar,
            "user_name": r.owner.user_name,
            "user_avatar": u_avatar
        }))
    data = {
        "name": room.name,
        "game_quantity": room.game_quantity,
        "round_quantity": room.round_quantity,
        "min_players": room.min_players,
        "max_players": room.max_players,
        "creator": room.creator.user_name,
        "participants": participants_list,
    }
    return data

@db_session
def get_match_max_players(match_id):
    return Match[match_id].max_players

@db_session
def get_match_min_players(match_id):
    return Match[match_id].min_players

@db_session
def get_match_robots_ids(match_id):
    robots = Match[match_id].fighters.select()[:]
    robots_ids = []
    for i in range(len(robots)):
        robots_ids.append(robots[i].id)
    return  robots_ids

@db_session
def set_match_state(match_id, state):
    Match[match_id].started = state

@db_session
def get_match_rounds(match_id):
    return Match[match_id].round_quantity

@db_session
def get_match_games(match_id):
    return Match[match_id].game_quantity


@db_session
def get_match_list(name, filter):
    match filter:
        case "available":
            match_list = Match.select(
                lambda m: (not m.started) and m.current_players < m.max_players
            )[:]

        case "public":
            match_list = Match.select(
                lambda m: (not m.started)
                and m.current_players < m.max_players
                and m.password == ""
            )[:]

        case "private":
            match_list = Match.select(
                lambda m: (not m.started)
                and m.current_players < m.max_players
                and m.password != ""
                )[:]

        case "hosted":
            match_list = Match.select(
                lambda m: (not m.started)
                and m.creator.user_name == name
                )[:]

        case "joined":
            u_id = get_user_id(name)
            match_list = select(m for m in User[u_id].ongoing_matches if not m.started)[:]

        case "finished":
            u_id = get_user_id(name)
            match_list = select(m for m in User[u_id].ongoing_matches if m.started)[:]

        case _:
            return ["no_valid_filter"]

    res_list = []

    for m in match_list:
        participants_list = []
        for u in m.participants:
            participants_list.append(u.user_name)

        if (filter == "finished"):
            res_list.append(
                (
                    m.id,
                    m.password != "",
                    m.name,
                    m.current_players,
                    m.game_quantity,
                    m.round_quantity,
                    m.min_players,
                    m.max_players,
                    participants_list,
                    m.match_results.date
                )
            )
        else:
            res_list.append(
                (
                    m.id,
                    m.password != "",
                    m.name,
                    m.current_players,
                    m.game_quantity,
                    m.round_quantity,
                    m.min_players,
                    m.max_players,
                    participants_list
                )
            )

    return res_list


@db_session
def check_match_existance(match_id):
    return Match.exists(id=match_id)


@db_session
def delete_match(match_id):
    Match[match_id].delete()


@db_session
def get_last_match_id():
    return int(max(m.id for m in Match) or 0)


@db_session
def check_full_match(match_id):
    return Match[match_id].current_players == Match[match_id].max_players


@db_session
def check_match_name_exists(match_name):
    return Match.exists(lambda m: m.name == match_name and m.started == False)


@db_session
def check_match_password(match, pwd):
    if pwd == None: pwd = ""
    return Match[match].password == pwd


@db_session
def check_user_connected(match_id, username):
    return (Match[match_id].participants).select(lambda u: u.user_name == username)[:] != []


@db_session
def check_match_quantity():
    return Match.select().count()


@db_session
def join_match(m_id, u_id, r_id):
    Match[m_id].participants.add(User[u_id])
    Match[m_id].fighters.add(Robot[r_id])
    Match[m_id].current_players += 1

@db_session
def leave_match(m_id, u_id):
    if Match[m_id].creator.id == u_id:
        return False
    rob = get(r for r in Match[m_id].fighters if r.owner.id == u_id)
    Match[m_id].participants.remove(User[u_id])
    Match[m_id].fighters.remove(rob)
    Match[m_id].current_players -= 1
    return True

@db_session
def get_match_creator(match_id):
    return Match[match_id].creator.id

@db_session
def get_match_started(match_id):
    return Match[match_id].started

# --- Result fucntions ---


@db_session
def create_result(ranking, won_games, match):
    new_result = Result(ranking = ranking, won_games = won_games, match = Match[match], date = datetime.now())
    for r_id in ranking:
        Robot[r_id].matches_played += 1
        Robot[r_id].owner.matches_played += 1
    if won_games[0] != won_games[1]:
        Robot[ranking[0]].matches_won += 1
        Robot[ranking[0]].owner.matches_won += 1

@db_session
def get_match_results(match_id):
    match_result = Match[match_id].match_results
    res = []

    positions = ss.rankdata(a=match_result.won_games, method='max').astype(int)
    position = np.empty(len(positions))
    for i in range(len(positions)):
        position[i] = len(positions) - positions[i] + 1


    for r_id in range(len(match_result.ranking)):
        robot_i = Robot[match_result.ranking[r_id]]

        r_avatar = None
        if robot_i.avatar is not None:
            r_avatar = robot_i.avatar.decode()

        robot_dict = {
            "name": robot_i.robot_name,
            "avatar": r_avatar,
            "username": robot_i.owner.user_name,
            "victories": match_result.won_games[r_id],
            "loses": Match[match_id].game_quantity - match_result.won_games[r_id],
            "position": position[r_id]
        }

        res.append(robot_dict)

    result = {
        "robot_list": res,
        "date": match_result.date
    }

    return result

# --- Robot functions ---


@db_session
def create_robot(robot_name, creator, code, avatar):
    if type(code) == str:
        robot_code = open(code, "rb").read()
        class_name = str(Path(code).stem) + ".py"
    else:
        robot_code = code.file.read()
        class_name = code.filename
    new_robot = Robot(
        robot_name=robot_name,
        code=robot_code,
        robot_class_name=class_name,
        owner=creator,
        matches_played=0,
        matches_won=0
    )
    if avatar != None:
        new_robot.avatar = avatar.encode()
    else:
        new_robot.avatar = None


@db_session
def get_robot_list(owner_name, detailed):
    robot_list = Robot.select(lambda r: r.owner.user_name == owner_name)[:]
    res_list = []

    for r in robot_list:
        r_avatar = None
        if r.avatar is not None:
            r_avatar = r.avatar.decode()
        if detailed:
            res_list.append([r.id, r.robot_name, r.code, r.matches_played, r.matches_won, r_avatar])
        else:
            res_list.append([r.id, r.robot_name, r_avatar])

    return res_list


@db_session
def get_last_robot_id():
    return int(max(r.id for r in Robot) or 0)


@db_session
def delete_robot(robot_id):
    Robot[robot_id].delete()


@db_session
def check_robot_quantity():
    return Robot.select().count()


@db_session
def check_robot_existance(robot_id):
    return Robot.exists(id=robot_id)


@db_session
def check_robot_ownership(robot_id, creator):
    return Robot[robot_id].owner != User[creator]


@db_session
def get_robot_owner_id(rob_id):
    return Robot[rob_id].owner.id


@db_session
def robot_exists(name_robot, creator_user):
    if Robot.exists(robot_name=name_robot, owner=creator_user):
        return True


@db_session
def get_id_robot(robot, creator):
    if robot_exists(robot, creator):
        return Robot.get(robot_name=robot, owner=creator).id
    else:
        return None


@db_session
def robot_in_game(robot_id):
    return Robot[robot_id].fights.exists()


@db_session
def robot_in_that_match(robot_id, match_name):
    return match_name in Robot[robot_id].fights.name


@db_session
def user_has_robot(username, robot_name):
    user = get_user(username)
    return robot_exists(robot_name, user)


@db_session
def get_robot_by_id(id: int):
    return Robot.get(id=id)


@db_session
def get_code_by_robotname(username, robot_name):
    user = get_user(username)
    return Robot.get(robot_name=robot_name, owner=user).code

@db_session
def get_code_by_robot_id(robot_id):
    return Robot.get(id = robot_id).code

@db_session
def get_robot_classname(robot_id):
    return Robot.get(id=robot_id).robot_class_name

@db_session
def get_robot_by_name(username, robot_name):
    user = get_user(username)
    return Robot.get(robot_name=robot_name, owner=user)

@db_session
def get_robot_id_by_name(username, robot_name):
    user = get_user(username)
    robot = Robot.get(robot_name=robot_name, owner=user)
    return robot.id

@db_session
def get_robot_name_by_id(id):
    return Robot.get(id=id).robot_name


# --- User Functions ---


@db_session
def create_user(user_name, email, password, avatar):
    new_user = User(
        user_name=user_name, email=email, password=password, verified=False, photo=None, matches_played=0, matches_won=0
    )
    if avatar != None:
        new_user.photo = avatar.encode()
    else:
        new_user.photo = None


@db_session
def get_user(user_name):
    return User.get(user_name=user_name) or None

@db_session
def get_user_by_id(id: int):
    return User.get(id=id)


@db_session
def get_user_by_email(email):
    return User.get(email=email)


@db_session
def upload_photo_db(user_name, photo):
    user = get_user(user_name)
    user.photo = photo.encode()


@db_session
def get_photo(user_name):
    user = get_user(user_name)

    photo = None
    if user.photo is not None:
        photo = user.photo.decode()

    return photo


@db_session
def email_exists(email_address):
    return User.exists(email=email_address)


@db_session
def confirm_password(pw):
    return User.exists(password=pw)


@db_session
def user_exists(user_name):
    return User.exists(user_name=user_name)


@db_session
def check_user_existance(user_id):
    return User.exists(id=user_id)


@db_session
def user_is_verified(user_name):
    return User.get(user_name=user_name).verified


@db_session
def delete_user(user_name):
    user = get_user(user_name)
    User.delete(user)


@db_session
def get_user_photo(user_name):
    return User.get(user_name=user_name).photo


@db_session
def user_have_photo(user_name):
    return User.get(user_name=user_name).photo != ""


@db_session
def delete_user_photo(user_name):
    user = get_user(user_name)
    user.photo = ""


@db_session
def get_last_user_id():
    return int(max(u.id for u in User) or 0)


@db_session
def get_user_id(user_name):
    return User.get(user_name=user_name).id


@db_session
def check_user_quantity():
    return User.select().count()


@db_session
def get_user_name_by_id(user_id):
    return User[user_id].user_name

@db_session
def set_user_verified(username):
    user = User.get(user_name=username)
    user.verified = True

@db_session
def update_user_password(name, new_pwd):
    user = get_user(name)
    user.password = new_pwd


@db_session
def update_user_avatar(name, picture):
    user = get_user(name)
    user.photo = picture.encode() if picture != None else None

    return picture


@db_session
def get_user_pwd(username):
    user = get_user(username)
    return user.password


@db_session
def calculate_user_stats(username):
    user = get_user(username)

    stats = {
        "played_matches" : user.matches_played,
        "victories" : user.matches_won
    }

    return stats
