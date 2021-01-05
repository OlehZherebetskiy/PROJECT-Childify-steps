import requests
from flask import Flask, request, jsonify, make_response
import couchdb
from flask_swagger_ui import get_swaggerui_blueprint
import config as cfg


user = cfg.db['user']
password = cfg.db['password']
host = cfg.db['host']
couch = couchdb.Server("http://%s:%s@%s/" % (user, password, host))


app = Flask(__name__)


""" swagger specific """
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "test"
    }
)
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)
""" end swagger specific """


"""
PROFILES

ip/resources/profiles/              (GET)       - return all profiles with username 
                                                    begins with {username}, username must be in body
ip/resources/profiles/              (POST)      - add new profile
ip/resources/profiles/{id}          (PUT/GET)   - update/get profile
"""

# TODO <username> should be in body of request

# return all profiles with username begins with {username}
@app.route('/resources/profiles/', methods=['GET'])
def get_profiles_with_username():
    return make_response(jsonify('Not ready yet'), 500)


# TODO link image to db
# TODO problem - don't know how I get it from app


@app.route('/resources/profiles/', methods=['POST'])
def create_profile():
    try:
        db = couch['resources/profiles']
        uuid = requests.get('http://127.0.0.1:5984/_uuids').json()['uuids'][0]

        profile = {
            'name': request.json['name'],
            'username': request.json['username'],
            'age_status': request.json['age_status'],
            'birthday': request.json['birthday'],
            'point': 0
        }

        db[uuid] = profile

        return uuid
    except KeyError:
        return make_response(jsonify('name username age_status birthday are obligatory'), 500)


@app.route('/resources/profiles/<user_id>', methods=['GET'])
def get_profile(user_id):
    try:
        return jsonify(couch['resources/profiles'][user_id])
    except couchdb.http.ResourceNotFound:
        return make_response(jsonify('user id not found'), 404)


@app.route('/resources/profiles/<user_id>', methods=['PUT'])
def update_profile(user_id):
    try:
        db = couch['resources/profiles']
        profile = db[user_id]

        for key, value in request.json.items():
            profile[key] = value

        db.save(profile)

        return 'Updated'
    except couchdb.http.ResourceNotFound:
        return make_response(jsonify('user id not found'), 404)


"""
TASKS

ip/resources/tasks/{user_id}        (GET/POST)          - get all tasks/add new task
ip/resources/tasks/{user_id}/{id}   (PUT/DELETE/GET)    - update/delete/get task
"""


@app.route('/resources/tasks/<user_id>', methods=['GET'])
def get_tasks(user_id):
    try:
        return jsonify(couch['resources/tasks'][user_id])
    except couchdb.http.ResourceNotFound:
        return make_response(jsonify('user id not found'), 404)


# TODO deadline is string like '12:52 24.12.1745' should be datetime ?
@app.route('/resources/tasks/<user_id>', methods=['POST'])
def create_task(user_id):
    try:
        db = couch['resources/tasks']
        uuid = requests.get('http://127.0.0.1:5984/_uuids').json()['uuids'][0]

        task = {
            'name': request.json['name'],
            'deadline': request.json['deadline'],
            'value': request.json['value'],
            'status': request.json['status'],
            'category': request.json['category'],
            'family_id': request.json['family_id']
        }

        tasks = db[user_id]
        tasks[uuid] = task
        db.save(tasks)

        return uuid
    except KeyError:
        return make_response(jsonify('name deadline value status category family_id are obligatory'), 500)
    except couchdb.http.ResourceNotFound:
        return make_response(jsonify('user id not found'), 404)


@app.route('/resources/tasks/<user_id>/<task_id>', methods=['GET'])
def get_task(user_id, task_id):
    try:
        return jsonify(couch['resources/tasks'][user_id][task_id])
    except couchdb.http.ResourceNotFound:
        return make_response(jsonify('user or task id not found'), 404)


@app.route('/resources/tasks/<user_id>/<task_id>', methods=['PUT'])
def update_task(user_id, task_id):
    try:
        db = couch['resources/tasks']
        tasks = db[user_id]

        for key, value in request.json.items():
            tasks[task_id][key] = value

        db.save(tasks)

        return 'Updated'
    except couchdb.http.ResourceNotFound:
        return make_response(jsonify('user or task id not found'), 404)


@app.route('/resources/tasks/<user_id>/<task_id>', methods=['DELETE'])
def delete_task(user_id, task_id):
    try:
        db = couch['resources/tasks']
        tasks = db[user_id]

        del tasks[task_id]
        db.save(tasks)

        return "Deleted"
    except couchdb.http.ResourceNotFound:
        return make_response(jsonify('user or task id not found'), 404)


"""
FAMILY

ip/resources/families/                  (POST)              - add new family
ip/resources/families/{id}              (PUT/GET)           - update/get family
ip/resources/families/{id}/{user_id}    (DELETE)            - delete user from family
"""


@app.route('/resources/families/', methods=['POST'])
def create_family():
    try:
        db = couch['resources/families']
        uuid = requests.get('http://127.0.0.1:5984/_uuids').json()['uuids'][0]

        creator = request.json['creator_id']
        family = {
            'creator': creator,
            'with_rights': [],
            'w_o_rights': []
        }

        db[uuid] = family

        # set family_id to creator's profile
        db = couch['resources/profiles']
        profile = db[creator]
        profile['family_id'] = uuid
        db.save(profile)

        return uuid
    except KeyError:
        return make_response(jsonify('creator id is obligatory'), 500)


@app.route('/resources/families/<family_id>', methods=['GET'])
def get_family(family_id):
    try:
        return jsonify(couch['resources/families'][family_id])
    except couchdb.http.ResourceNotFound:
        return make_response(jsonify('family id not found'), 404)


@app.route('/resources/families/<family_id>', methods=['PUT'])
def update_family(family_id):
    try:
        db = couch['resources/families']
        profiles = couch['resources/profiles']
        family = db[family_id]

        for key, value in request.json.items():
            family[key].append(value)
            profile = profiles[value]
            profile['family_id'] = family_id
            profiles.save(profile)

        db.save(family)

        return 'Updated'
    except couchdb.http.ResourceNotFound:
        return make_response(jsonify('family id not found'), 404)


@app.route('/resources/families/<family_id>/<user_id>', methods=['DELETE'])
def delete_user_from_family(family_id, user_id):
    try:
        db = couch['resources/families']
        profiles = couch['resources/profiles']

        family = db[family_id]

        if user_id in family['with_rights']:
            family['with_rights'].remove(user_id)
        elif user_id in family['w_o_rights']:
            family['w_o_rights'].remove(user_id)
        else:
            return make_response(jsonify('wrong user id'), 500)

        profile = profiles[user_id]
        del profile['family_id']
        profiles.save(profile)

        db.save(family)

        return 'Deleted'
    except couchdb.http.ResourceNotFound:
        return make_response(jsonify('family id not found'), 404)


if __name__ == '__main__':
    app.run(debug=True)
