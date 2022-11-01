from pydantic_models import *


def create_match_field_validation(match_data: TempMatch):
    str_valid = True
    for c in match_data.name + match_data.password:
        str_valid = str_valid and (c.isalnum() or c.isspace())

    num_valid = (
        match_data.min_players >= MIN_PLAYERS_PER_MATCH
        and match_data.min_players <= MAX_PLAYERS_PER_MATCH
        and match_data.max_players >= MIN_PLAYERS_PER_MATCH
        and match_data.max_players <= MAX_PLAYERS_PER_MATCH
        and match_data.games_per_match > 0
        and match_data.games_per_match <= MAX_GAMES_PER_MATCH
        and match_data.rounds > 0
        and match_data.rounds <= MAX_ROUNDS_PER_GAME
    )

    return str_valid and num_valid
