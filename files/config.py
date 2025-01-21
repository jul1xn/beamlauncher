import json
import files.log as log

CONFIG_DATA = None

with open("config.json", "r") as file:
    CONFIG_DATA: dict = json.load(file)

def save_new_config():
    global CONFIG_DATA
    with open("config.json", "w") as file:
        json.dump(CONFIG_DATA, file, indent=3)
        log.log_info("Updated config file.")