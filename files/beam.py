import os
from files.config import CONFIG_DATA
import files.config as cfg
from files.log import *
import base64
import json
from files import mods
import psutil

DATA_PATH = None
MP_MODULE_ENABLED = False

def init():
    global DATA_PATH
    log_info("Starting BeamLauncher v0.1...")
    check_valid_paths()

    current_version = get_latest_version()
    dir_path = os.path.join(CONFIG_DATA['paths']['data'], current_version)
    if os.path.isdir(dir_path):
        log_info(f"Found version: {current_version}")
        DATA_PATH = dir_path

    if CONFIG_DATA.get("data", None) == None or CONFIG_DATA.get("data", None).get("version", None) != current_version:
        log_warn("Config not complete, generating it now.")
        generate_config(current_version)

def check_valid_paths():
    dirs_to_check = [
        {
            "name": "data",
            "value": CONFIG_DATA.get('paths', {}).get('data') or None
        },
        {
            "name": "game",
            "value": CONFIG_DATA.get('paths', {}).get('game') or None
        }
    ]

    for dir in dirs_to_check:
        if not os.path.isdir(str(dir['value'])):
            log_err(f"Directory for '{dir['name']}' is not valid! Please check the config.json file.")
            quit()


def is_game_running():
    target_name = "beamng"
    for proc in psutil.process_iter(['name']):
        try:
            # Use direct string comparison for efficiency
            if target_name in (proc.info['name'] or "").lower():
                return True
        except psutil.Error:
            # Catch all psutil-related errors (covers NoSuchProcess, AccessDenied, ZombieProcess)
            continue
    return False

def get_latest_version():
    versions = []

    for directory in os.listdir(CONFIG_DATA['paths']['data']):
        try:
            version = float(directory)
            versions.append(version)
        except:
            continue

    current_version = str(max(versions))
    return current_version

def kill_game():
    target_name = "beamng"
    for proc in psutil.process_iter(['name', 'pid']):
        try:
            if target_name in (proc.info['name'] or "").lower():
                proc.kill()
                log_info(f"Process '{target_name}' with PID {proc.info['pid']} was killed.")
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess) as e:
            continue

def generate_config(latest_version: str):
    mod_folder = os.path.join(DATA_PATH, "mods")
    settings_folder = os.path.join(DATA_PATH, "settings")
    configs_folder = os.path.join(DATA_PATH, "vehicles")

    CONFIG_DATA['data'] = {
        "version": latest_version,
        "mods": mod_folder,
        "settings": settings_folder,
        "configs": configs_folder
    }

    cfg.save_new_config()

def get_mods():
    mods = []
    for root, dirs, files in os.walk(CONFIG_DATA['data']['mods']):
        if 'unpacked' in root:
            continue

        for file in files:
            if file != "db.json":
                mods.append(os.path.join(root, file))

    return mods

def export_config(config_path):
    if not os.path.isfile(config_path):
        return None
    
    with open(config_path, "r") as file:
        file_data = base64.b64encode(file.read().encode('utf-8')).decode('utf-8')

    img_path = convert_config_to_image_path(config_path)
    if os.path.isfile(img_path):
        with open(img_path, "rb") as file:
            img_data = base64.b64encode(file.read()).decode("utf-8")
    else:
        img_data = None

    config_name = mods.convert_to_modname(config_path)
    config_folder = os.path.basename(os.path.dirname(config_path))
    obj = {"config_name": config_name, "config_folder": config_folder, "img_data": img_data, "config_data": file_data}
    return base64.b64encode(json.dumps(obj).encode('utf-8')).decode('utf-8')

def convert_config_to_image_path(config_path):
    try:
        return config_path.replace(".pc", ".jpg")
    except:
        return config_path

def get_configs():
    configs = []
    for root, dirs, files in os.walk(CONFIG_DATA['data']['configs']):
        if 'unpacked' in root:
            continue

        for file in files:
            if file.endswith(".pc"):
                configs.append(os.path.join(root, file))

    return configs

def start_beam_steam():
    log_info("Starting BeamNG via steam")
    os.system("start steam://rungameid/284160")

def start_beam_local():
    log_info("Starting BeamNG locally")
    exe_path = os.path.join(CONFIG_DATA['paths']['game'], "BeamNG.drive.exe").replace('\\\\', '\\')
    os.system(f"start {exe_path}")

def start_beam_mp():
    log_info("Starting BeamNG multiplayer")
    exe_path = os.path.join(CONFIG_DATA['paths']['multiplayer'], "BeamMP-Launcher.exe").replace('\\\\', '\\')
    os.system(f"start {exe_path}")