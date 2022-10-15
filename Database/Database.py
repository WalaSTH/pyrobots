from pony.orm import *

db = pony.orm.Database()

db.bind('mysql', host='127.0.0.1', user='root', passwd='', db='PyRobots')

class User(db.Entity):
    id = PrimaryKey(int, auto=True)
    user_name = Required(str, unique=True)
    email = Required(str, unique=True)
    password = Required(str)
    verified = Required(bool)
    owned_matches = Set('Match', reverse='creator')
    ongoing_matches = Set('Match', reverse='participants')
    photo = Optional(str)


class Match(db.Entity):
    id = PrimaryKey(int, auto=True)
    name = Required(str)
    password = Optional(str)
    game_quantity = Required(int)
    round_quantity = Required(int)
    min_players = Required(int)
    max_players = Required(int)
    creator = Required(User, reverse='owned_matches')
    participants = Set(User, reverse='ongoing_matches')

db.generate_mapping(create_tables=True)

@db_session
def create_match(match_name, password, game_quantity, round_quantity, min_players, max_players, creator_id):
    new_match  = Match(name=match_name, password=password, game_quantity=game_quantity, round_quantity=round_quantity,  min_players=min_players, max_players=max_players, creator=creator_id)
    new_match.participants.add(creator_id)

"""
@db_session
def join_match(match_id, user_id):
    match_to_join = Match.get(id = match_id)
    match_to_join.participants.add(user_id)
"""
