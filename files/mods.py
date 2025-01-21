from files.config import CONFIG_DATA
import os
from files import beam
from files.log import *

def convert_to_modname(file_path: str):
    try:
        return os.path.basename(file_path).split(".")[0]
    except:
        return file_path

def get_mods_list():
    try:
        return [convert_to_modname(mod) for mod in beam.get_mods()]
    except Exception as e:
        log_err(f"Exception at get_mods_list: {e}")

def is_mod_enabled(mod_file: str):
    try:
        if not os.path.isfile(mod_file):
            log_err(f"[is_mod_enabled] Mod '{convert_to_modname(mod_file)}' does not exist!")
            return None

        return mod_file.endswith(".disabled")
    except Exception as e:
        log_err(f"Exception at is_mod_enabled: {e}")
        return None

def enable_mod(mod_file: str, disable_mod: bool):
    try:
        if not os.path.isfile(mod_file):
            log_err(f"[enable_mod] Mod '{convert_to_modname(mod_file)}' does not exist!")
            return
        
        is_disabled = mod_file.endswith(".disabled")

        if disable_mod and not is_disabled:
            new_name = mod_file + ".disabled"
            os.rename(mod_file, new_name)
            log_info("Disabled mod " + convert_to_modname(mod_file))
            return new_name
        
        if not disable_mod and is_disabled:
            new_name = mod_file.replace(".disabled", "")
            log_info("Enabled mod " + convert_to_modname(mod_file))
            os.rename(mod_file, new_name)
            return new_name
        
        return None
    except Exception as e:
        log_err(f"Exception at enable_mod: {e}")
        return None