from flask import Flask, Blueprint, render_template, request, make_response, jsonify, send_file, redirect
from files.config import CONFIG_DATA
from files import beam, mods
import files.log as flog
import requests
import logging

app = Flask(__name__)
log = logging.getLogger('werkzeug')
log.disabled = True
app.logger.disabled = True

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/api/mp/get_servers")
def api_mp_get_servers():
    flog.log_info("Requested server list")
    req = requests.get("https://backend.beammp.com/servers-info/")
    return req.json()

@app.route("/mp/servers")
def mp_servers():
    return render_template("mp_server.html")

@app.route("/mp/player-lookup")
def mp_lookup():
    return render_template("mp_lookup.html")

@app.route("/logs")
def logs():
    return render_template("logs.html")

@app.route("/configs")
def configs():
    return render_template("configs.html")

@app.route("/api/logs")
def api_logs():
    return flog.get_log_file()

@app.route("/api/mods/get_all", methods=["GET"])
def api_mods_getall():
    include_hashes = request.args.get("hashes", "false").lower()
    data = mods.get_mods(include_hashes)

    return jsonify(data)

@app.route("/api/mods/get_mod", methods=["GET"])
def api_mods_get_mod():
    mod_name = request.args.get("name", None)
    include_hashes = request.args.get("hashes", "false").lower()
    if not mod_name:
        return make_response("Please enter a mod name!", 400)
    
    mod_data = mods.get_mod(mod_name, include_hashes)
    if not mod_data:
        return make_response(f"Mod {mod_name} not found!", 404)
    
    return make_response(jsonify(mod_data), 200)

@app.route("/api/config/get_all")
def api_get_configs():
    return jsonify(beam.get_configs())

@app.route("/api/config/get_thumbnail", methods=["GET"])
def api_get_thumbnail_configs():
    name = request.args.get("config_name")
    folder = request.args.get("config_folder", "vehicles")
    if name == None or folder == None:
        return make_response("Invalid request!", 400)
    
    for config in beam.get_configs():
        config_name = mods.convert_to_modname(config)
        if config_name == name and folder in config:
            try:
                return send_file(beam.convert_config_to_image_path(config))
            except:
                return redirect("/static/img/unknown.png")
        
    return make_response("Mod image not found!", 404)

@app.route("/api/beam/kill", methods=["GET"])
def api_beam_kill():
    try:
        beam.kill_game()
        return make_response("Success", 200)
    except:
        return make_response("Error in script game_running!", 500)

@app.route("/api/game_running", methods=["GET"])
def api_game_running():
    try:
        return str(beam.is_game_running())
    except:
        return make_response("Error in script game_running!", 500)

@app.route("/api/config/export", methods=["GET"])
def api_export_config():
    name = request.args.get("config_name")
    folder = request.args.get("config_folder", "vehicles")
    if name == None or folder == None:
        return make_response("Invalid request!", 400)
    
    for config in beam.get_configs():
        config_name = mods.convert_to_modname(config)
        if config_name == name and folder in config:
            try:
                return beam.export_config(config)
            except:
                return make_response("Error whilst generating file data!", 500)
        
    return make_response("Mod not found!", 404)


@app.route("/api/beam/launch_mp")
def beam_launchmp():
    try:
        beam.start_beam_mp()
        return make_response("Success", 200)
    except:
        return make_response("Error starting locally", 500)

@app.route("/api/beam/launch_local")
def beam_launchlocal():
    try:
        beam.start_beam_local()
        return make_response("Success", 200)
    except:
        return make_response("Error starting locally", 500)
    
@app.route("/api/beam/launch_steam")
def beam_launchsteam():
    try:
        beam.start_beam_steam()
        return make_response("Success", 200)
    except:
        return make_response("Error starting with steam", 500)

def run_server():
    flog.log_info(f"Running server on 'http://localhost:{CONFIG_DATA['port']}'")
    app.run(port=CONFIG_DATA['port'], debug=CONFIG_DATA['debug'])