from files.config import CONFIG_DATA
from files import beam
from files.log import *
import json
import os
import copy

MODS_DATA: dict = None
MOD_COUNT: int = None

def init():
    global MODS_DATA, MOD_COUNT
    db_file = os.path.join(CONFIG_DATA['data']['mods'], "db.json")

    with open(db_file, 'r') as file:
        MODS_DATA = json.load(file)

        mods: dict = MODS_DATA.get("mods")
        MOD_COUNT = len(mods.keys())

        log_info(f"Loaded {MOD_COUNT} mods from db.json.")

def get_mods(include_hashes: str):
    global MODS_DATA

    if include_hashes == "true":
        log_info("[get_mods()] Including hashes")
        return MODS_DATA
    elif include_hashes == "false":
        log_info("[get_mods()] Not including hashes")
        mod_data_copy = copy.deepcopy(MODS_DATA)

        for mod_key, mod_value in mod_data_copy['mods'].items():
            if "modData" in mod_value and "hashes" in mod_value['modData']:
                mod_value['modData']['hashes'] = None

        return mod_data_copy