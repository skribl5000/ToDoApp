import json
import os
from datetime import datetime

from flask import Flask, abort, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

TASKS_JSON_FILE_NAME = 'tasks.json'
TASKS_JSON_FILE_PATH = os.path.join(os.getcwd(), TASKS_JSON_FILE_NAME)
HTML_FILE_PATH = os.path.join(os.getcwd(), 'index.html')
RESET_CSS_FILE_PATH = os.path.join(os.getcwd(), 'reset.css')
STYLE_CSS_FILE_PATH = os.path.join(os.getcwd(), 'style.css')
SCRIPT_JS_FILE_PATH = os.path.join(os.getcwd(), 'script.js')

@app.route('/')
def index():
    with open(HTML_FILE_PATH, 'r') as html:
     return html.read()

@app.route('/reset.css')
def reset():
    with open(RESET_CSS_FILE_PATH, 'r') as html:
     return html.read()

@app.route('/style.css')
def style():
    with open(STYLE_CSS_FILE_PATH, 'r') as html:
     return html.read()

@app.route('/script.js')
def script():
    with open(SCRIPT_JS_FILE_PATH, 'r') as html:
     return html.read()

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_active_tasks():
    with open(TASKS_JSON_FILE_PATH, 'r') as file:
        tasks = json.loads(file.read())
        tasks = {key: value for key, value in tasks.items() if not value['removed']}

        return jsonify({'tasks': tasks}), 200


@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task_id = str(task_id)

    with open(TASKS_JSON_FILE_PATH, 'r') as file:
        tasks = json.loads(file.read())
        task = tasks.get(task_id)

        return jsonify({'task': task}), 200


@app.route('/todo/api/v1.0/tasks', methods=['POST'])
def create_task():
    if not request.json or 'name' not in request.json or 'targetDate' not in request.json:
        abort(400)

    if request.json['name'] == '' or request.json['targetDate'] == '':
        abort(400)
    request_body = request.json
    task = {
        'createdDate': datetime.today().strftime('%Y-%m-%d'),
        'status': 'Active',
        'name': request_body['name'],
        'targetDate': request_body['targetDate'],
        'removed': 0
    }

    with open(TASKS_JSON_FILE_PATH, 'r') as file:
        tasks = json.loads(file.read())
        new_task_id = str(max([int(key) for key in tasks]) + 1)
        tasks[new_task_id] = task

    with open(TASKS_JSON_FILE_PATH, 'w') as file:
        file.write(json.dumps(tasks))
    return jsonify({'task': task}), 201


@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task_id = str(task_id)
    if not request.json:
        abort(400)

    request_body = request.json

    available_fields = ['id', 'createdDate', 'status', 'name', 'targetDate', 'removed', 'completedDate']

    for field in request_body:
        if field not in available_fields:
            print(field)
            abort(400)

    with open(TASKS_JSON_FILE_PATH, 'r') as file:
        tasks = json.loads(file.read())
        for field in request_body:
            tasks[task_id][field] = request_body[field]

    with open(TASKS_JSON_FILE_PATH, 'w') as file:
        file.write(json.dumps(tasks))
    return jsonify({'task': tasks[task_id]}), 200


@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task_id = str(task_id)

    with open(TASKS_JSON_FILE_PATH, 'r') as file:
        tasks = json.loads(file.read())
        tasks[task_id]['removed'] = 1

    with open(TASKS_JSON_FILE_PATH, 'w') as file:
        file.write(json.dumps(tasks))
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
