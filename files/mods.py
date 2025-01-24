from files.config import CONFIG_DATA
from files import beam
from files.log import *
import json
import os

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