from pony.orm import *
import sys

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


class Robot(db.Entity):
    id = PrimaryKey(int, auto=True)
    robot_name = Required(str)
    owner = Required(User, reverse="owned_robots")
    fights = Set("Match", reverse="fighters")
    code = Required(bytes)
    robot_class_name = Required(str)
    avatar = Optional(bytes)


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
        participants_list.append(
            ({"robot_name": r.robot_name, "user_name": r.owner.user_name})
        )
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
                lambda m: (not m.started) and m.creator.user_name == name
            )[:]

        case "joined":
            u_id = get_user_id(name)
            match_list = select(m for m in User[u_id].ongoing_matches if not m.started)[
                :
            ]

        case "finished":
            u_id = get_user_id(name)
            match_list = select(m for m in User[u_id].ongoing_matches if m.started)[:]
            print(match_list)

        case _:
            return ["no_valid_filter"]

    res_list = []

    for m in match_list:
        participants_list = []
        for u in m.participants:
            participants_list.append(u.user_name)

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
def check_match_name_exists(match_name):
    return Match.exists(lambda m: m.name == match_name and m.started == False)


@db_session
def check_match_quantity():
    return Match.select().count()


# --- Robot functions ---


@db_session
def create_robot(robot_name, creator, code, avatar):
    new_robot = Robot(
        robot_name=robot_name,
        code=code.file.read(),
        robot_class_name=code.filename,
        owner=creator,
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
        if detailed:
            res_list.append([r.id, r.robot_name, r.code])
        else:
            res_list.append([r.id, r.robot_name])

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


# --- User Functions ---


@db_session
def create_user(user_name, email, password, avatar):
    new_user = User(
        user_name=user_name, email=email, password=password, verified=False, photo=None
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
