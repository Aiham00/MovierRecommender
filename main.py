import json
from flask import Flask
import Db as Db
app = Flask(__name__)


@app.route("/")
def send_users():
    return get_users()


@app.route("/<user_index>")
def send_user_by_id(user_index):
    return get_user(user_index)


@app.route("/<user_index>/<user_param>")
def send_user_param(user_index, user_param):
    return get_user_param(user_index, user_param)


@app.route("/<user_index>/todos/<todo_index>")
def send_todo(user_index, todo_index):
    return get_todo(user_index, todo_index)


@app.route("/<user_index>/todos/<todo_index>/<todo_param>")
def send_todo_param(user_index, todo_index, todo_param):
    return get_todo_param(user_index, todo_index, todo_param)


def get_users():
    with open("./data.json") as data:
        return json.load(data)


def get_user(user_index):
    jsonData = get_users()

    for index in range(len(jsonData)):
        if str(index) == user_index:
            return jsonData[index]

    return "User could not be found"


def get_user_param(user_index, user_param):
    user = get_user(user_index)

    for param in user:
        if param == user_param:
            return user[param]

    return 'Param "{}" could be found on user with index {}'.format(
        user_param,
        user_index,
    )


def get_todo(user_index, todo_index):
    user = get_user(user_index)

    todos = user["todos"]

    for index in range(len(todos)):
        if str(index) == todo_index:
            return todos[index]

    return "Todo of index {} could not be found on user with index {}".format(
        todo_index,
        user_index,
    )


def get_todo_param(user_index, todo_index, todo_param):
    todo = get_todo(user_index, todo_index)

    for param in todo:
        if param == todo_param:
            return str(todo[param])

    return "Could not find todo parameter {}".format(todo_param)


app.run()