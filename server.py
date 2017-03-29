from flask import (Flask, request, render_template, redirect, flash, session, jsonify)

import requests

from flask_debugtoolbar import DebugToolbarExtension

from sqlalchemy import (asc, desc) 

from model import *

from helper_functions import *

#for searlizing sqlalchemy objects
from flask_marshmallow import Marshmallow

from jinja2 import StrictUndefined

#for facebook sign in
import facebook
#for environmental variables for google/facebook API
import os
#for state
import datetime


app = Flask(__name__)
#for marshmellow searliazer to work
ma = Marshmallow(app)


app.secret_key = "pouring monday"

@app.route('/')
def index():
    """Render index.html"""
    
    return render_template("index.html")

@app.route('/API')
def api():
    """ Send API Info to Front End """

    googleClientId = os.environ["googleClientId"]
    googleAPIKey = os.environ["googleAPIKey"]
    state = datetime.datetime.now().microsecond
    
    session['state']=state


    return jsonify({"googleClientId": googleClientId, "googleAPIKey": googleAPIKey, "state": state })


@app.route('/signIn')
def signIn():
    """ Recieve and verify state and get code """
    state = request.args.get("state")
    
    code= request.args.get("code")
    
    if state != session['state']:
        session['saftyStatus'] = "Potentially Unsafe Connection"

        return redirect('/')

    else:

        payload = { 'code': code,
                'client_id': os.environ['googleClientId'] ,
                'client_secret': os.environ['googleClientSecret'] ,
                'redirect_uri': 'http://localhost:5000/token',
                'grant_type': authorization_code 
        }
    
        r = requests.get('https://www.googleapis.com/oauth2/v4/token', params=payload)

        output = r.json()

        print " output", output
        
       
    return redirect('/')

@app.route('/token')
def token():
    """ Send secrete and code to get token """

    print "token is running", request.args.get("acces_token")

@app.route('/todo')
def intial_todo():
    """ Send Intial Todos from DB to render opening page """
    
    todos = gather_all_todos_from_db()
    
    todo_array = []

    if todos:
        for todo in todos:
            todo_array.append(format_todo(todo))

    return jsonify(todo_array)


@app.route('/todo', methods=['POST'])
def new_todo():
    """ Add a new todo to the DB return all todo to javascript """

    content = request.form.get("content")

    todo = commit_todo_to_db(content)

    return jsonify(format_todo(todo))


@app.route('/todo/<id>', methods=['DELETE'])
def remove_todo(id):
    """ Remove a todo by id from the DB return json of None """

    response = remove_todo_from_db(id)

    return jsonify({response: response})


@app.route('/todo/<id>', methods=['PUT'])
def check_mark_todo(id):
    """ Checkmark a todo by id, update DB Return None """

    isChecked = request.form.get("isChecked")

    print "isChecked", type(isChecked), isChecked

    response = add_checkmark_to_db(id, isChecked)

    return jsonify({response: response})







if __name__ == "__main__":

    app.debug = True

    connect_to_db(app)

    DebugToolbarExtension(app)

    app.run(host="0.0.0.0", port=5000)