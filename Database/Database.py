from pony.orm import *

db = pony.orm.Database()

db.bind(provider='sqlite', filename="db.pyrobots", create_db=True)

class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    user_name = Required(str, unique=True)
    email = Required(str, unique=True)
    password = Required(str)
    verified = Required(bool)
    owned_matches = Set('Match', reverse='creator')
    ongoing_matches = Set('Match', reverse='participants')
    owned_robots = Set('Robot', reverse='owner')
    photo = Optional(str)

class Robot(db.Entity):
    id = PrimaryKey(int, auto=True)
    robot_name = Required(str)
    owner = Required(User, reverse='owned_robots')
    fights = Set('Match', reverse='fighters')

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
def create_match(match_name, password, game_quantity, round_quantity, min_players, max_players, creator_id, robot_id):
    new_match  = Match(name=match_name, password=password, started=False, game_quantity=game_quantity, round_quantity=round_quantity, current_players=1, min_players=min_players, max_players=max_players, creator=creator_id)
    new_match.participants.add(User[creator_id])
    new_match.fighters.add(Robot[robot_id])
    return new_match.id

@db_session
def check_user_quantity():
    return User.select().count()

@db_session
def check_robot_quantity():
    return Robot.select().count()

@db_session
def check_robot_ownership(robot_id, creator):
    return Robot[robot_id].owner != User[creator]

@db_session
def check_match_name_exists(match_name):
    return Match.exists(lambda m: m.name == match_name and m.started == False)

