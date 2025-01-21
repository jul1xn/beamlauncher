import json
import os
import files.log as log
import sys

CONFIG_DATA = None

if os.path.isfile("config.json"):
    with open("config.json", "r") as file:
        CONFIG_DATA = json.load(file)
else:
    log.log_warn("Config file not found! Generating and restarting launcher...")
    log.log_info("Generating config file...")
    generated = {
        "paths": {
            "data": "",
            "game": "",
            "multiplayer": ""
        },
        "port": 5505,
        "debug": False,
    }
    with open("config.json", "w") as file:
        json.dump(generated, file, indent=3)

    log.log_info("Restarting...")
    import subprocess
    subprocess.run([sys.executable, "main.py"])
    sys.exit()


def save_new_config():
    global CONFIG_DATA
    with open("config.json", "w") as file:
        json.dump(CONFIG_DATA, file, indent=3)
        log.log_info("Updated config file.")