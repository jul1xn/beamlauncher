import datetime
import os

log_path = "logs"
if not os.path.isdir(log_path):
    os.mkdir(log_path)

file_name = os.path.join(log_path, f"{datetime.datetime.now().strftime('%d.%m.%Y %H-%M-%S')}.txt")

def log_info(message):
    msg = f"[{datetime.datetime.now()}] [Info] {str(message)}"
    print(msg)
    with open(file_name, "a") as file:
        file.write(msg + "\n")

def log_warn(message):
    msg = f"[{datetime.datetime.now()}] [Warning] {str(message)}"
    print(msg)
    with open(file_name, "a") as file:
        file.write(msg + "\n")

def log_err(message):
    msg = f"[{datetime.datetime.now()}] [Error] {str(message)}"
    print(msg)
    with open(file_name, "a") as file:
        file.write(msg + "\n")

def get_log_file():
    with open(file_name, "r") as file:
        return file.read()