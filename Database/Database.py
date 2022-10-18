from pony.orm import *

db = pony.orm.Database()

db.bind(provider='sqlite', filename="db.pyrobots", create_db=True)

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

@db_session
def create_robot(robot_name,creator, code, avatar):
    new_robot = Robot(robot_name = robot_name,code = code.file.read(),  owner = creator)
    if avatar != None: 
        new_robot.avatar = avatar.file.read()
    else:
        new_robot.avatar = None
@db_session
def check_user_quantity():
    return User.select().count()