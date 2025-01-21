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
    try:
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
    except Exception as e:
        log_err(f"Exception at init: {e}")

def check_valid_paths():
    try:
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

        if os.path.isfile(os.path.join((CONFIG_DATA.get('paths', {}).get('multiplayer') or ""), "BeamMP-Launcher.exe")):
            global MP_MODULE_ENABLED
            MP_MODULE_ENABLED = True
            log_info("Multiplayer directory is valid, so enabling that module.")

        log_info("All directories under 'paths' are valid.")
    except Exception as e:
        log_err(f"Exception at check_valid_paths: {e}")


def is_game_running():
    try:
        target_name = "beamng"
        for proc in psutil.process_iter(['name']):
            try:
                if target_name in (proc.info['name'] or "").lower():
                    return True
            except psutil.Error:
                continue
        return False
    except Exception as e:
        log_err(f"Exception at is_game_running: {e}")
        return False

def get_latest_version():
    try:
        versions = []

        for directory in os.listdir(CONFIG_DATA['paths']['data']):
            try:
                version = float(directory)
                versions.append(version)
            except:
                continue

        current_version = str(max(versions))
        return current_version
    except Exception as e:
        log_err(f"Exception at get_latest_version: {e}")
        return None

def kill_game():
    try:
        target_name = "beamng"
        for proc in psutil.process_iter(['name', 'pid']):
            try:
                if target_name in (proc.info['name'] or "").lower():
                    proc.kill()
                    log_info(f"Process '{target_name}' with PID {proc.info['pid']} was killed.")
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess) as e:
                continue
    except Exception as e:
        log_err(f"Exception at kill_game: {e}")

def generate_config(latest_version: str):
    try:
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
    except Exception as e:
        log_err(f"Exception at generate_config: {e}")

def get_mods():
    try:
        mods = []
        for root, dirs, files in os.walk(CONFIG_DATA['data']['mods']):
            if 'unpacked' in root:
                continue

            for file in files:
                if file != "db.json":
                    mods.append(os.path.join(root, file))

        return mods
    except Exception as e:
        log_err(f"Exception at get_mods: {e}")
        return None

def export_config(config_path):
    try:
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
    except Exception as e:
        log_err(f"Exception at export_config: {e}")
        return None

def convert_config_to_image_path(config_path):
    try:
        return config_path.replace(".pc", ".jpg")
    except:
        return config_path

def get_configs():
    try:
        configs = []
        for root, dirs, files in os.walk(CONFIG_DATA['data']['configs']):
            if 'unpacked' in root:
                continue

            for file in files:
                if file.endswith(".pc"):
                    configs.append(os.path.join(root, file))

        return configs
    except Exception as e:
        log_err(f"Exception at get_configs: {e}")
        return None

def start_beam_steam():
    try:
        log_info("Starting BeamNG via steam")
        os.system("start steam://rungameid/284160")
    except Exception as e:
        log_err(f"Exception at start_beam_steam: {e}")

def start_beam_local():
    try:
        log_info("Starting BeamNG locally")
        exe_path = os.path.join(CONFIG_DATA['paths']['game'], "BeamNG.drive.exe").replace('\\\\', '\\')
        os.system(f"start {exe_path}")
    except Exception as e:
        log_err(f"Exception at start_beam_local: {e}")

def start_beam_mp():
    try:
        global MP_MODULE_ENABLED
        if not MP_MODULE_ENABLED:
            log_warn("Tried to start BeamNG multiplayer whilst module not enabled! This is because you haven't selected the directory in the config.json file for it. Head over to the documentation for more details.")
            return
        
        log_info("Starting BeamNG multiplayer")
        exe_path = os.path.join(CONFIG_DATA['paths']['multiplayer'], "BeamMP-Launcher.exe").replace('\\\\', '\\')
        os.system(f"start {exe_path}")
    except Exception as e:
        log_err(f"Exception at start_beam_mp: {e}")