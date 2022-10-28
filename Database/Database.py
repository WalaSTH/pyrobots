from pony.orm import *

db = pony.orm.Database()

db.bind(provider='sqlite', filename='db.pyrobots', create_db=True)

class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    user_name = Required(str, unique=True)
    email = Required(str, unique=True)
    password = Required(str)
    verified = Required(bool)
    photo = Optional(bytes)
    owned_matches = Set('Match', reverse='creator')
    ongoing_matches = Set('Match', reverse='participants')
    owned_robots = Set('Robot', reverse='owner')

class Robot(db.Entity):
    id = PrimaryKey(int, auto=True)
    robot_name = Required(str)
    owner = Required(User, reverse='owned_robots')
    fights = Set('Match', reverse='fighters')
    code = Required(bytes)
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
    creator = Required(User, reverse='owned_matches')
    participants = Set(User, reverse='ongoing_matches')
    fighters = Set(Robot, reverse='fights')

db.generate_mapping(create_tables=True)

# Robot functions.

@db_session
def create_robot(robot_name,creator, code, avatar):
    new_robot = Robot(robot_name = robot_name,code = code.file.read(),  owner = creator)
    if avatar != None: 
        new_robot.avatar = avatar.file.read()
    else:
        new_robot.avatar = None

@db_session
def get_robot_list(owner_name):
    robot_list = Robot.select()[:]
    res_list = []

    for r in robot_list:
        if (r.owner).user_name == owner_name:
            res_list.append((r.id, r.robot_name, r.avatar))

    return res_list

@db_session
def delete_robot(robot_id):
    Robot[robot_id].delete()

@db_session
def check_robot_existance(robot_id):
    return Robot.exists(id = robot_id)

@db_session
def get_last_robot_id():
    return int(max(r.id for r in Robot) or 0)

@db_session
def check_robot_ownership(robot_id, creator):
    return Robot[robot_id].owner != User[creator]

@db_session
def get_robot_owner_id(rob_id):
    return Robot[rob_id].owner.id

# Match functions.

@db_session
def create_match(match_name, password, game_quantity, round_quantity, min_players, max_players, creator_id, robot_id):
    new_match  = Match(name=match_name, password=password, started=False, game_quantity=game_quantity, round_quantity=round_quantity, current_players=1, min_players=min_players, max_players=max_players, creator=creator_id)
    new_match.participants.add(User[creator_id])
    new_match.fighters.add(Robot[robot_id])
    return new_match.id

@db_session
def delete_match(match_id):
    Match[match_id].delete()

@db_session
def get_last_match_id():
    return int(max(m.id for m in Match) or 0)

@db_session
def check_match_name_exists(match_name):
    return Match.exists(lambda m: m.name == match_name and m.started == False)

# User functions.

@db_session
def create_user(user_name, email, password):
        User(user_name=user_name, email=email, password=password, verified=False, photo=None)

@db_session
def get_user(user_name):
    return User.get(user_name=user_name) or None

@db_session
def get_user_by_email(email):
    return User.get(email=email)

@db_session
def upload_photo_db(user_name, photo):
    user = get_user(user_name)
    user.photo = photo
    
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
    return User.exists(id = user_id)

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