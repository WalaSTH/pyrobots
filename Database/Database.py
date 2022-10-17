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
def get_match_list():
    match_list = Match.select()[:]
    res_list = []

    for m in match_list:
        if not m.started:
            res_list.append((m.name, m.current_players, (m.creator).user_name))

    return res_list