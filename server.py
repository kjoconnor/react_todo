from flask import (Flask, request, render_template, redirect, flash, session, jsonify)

from flask_debugtoolbar import DebugToolbarExtension

from sqlalchemy import (asc, desc) 

from model import *

from helper_functions import *

#for searlizing sqlalchemy objects
from flask_marshmallow import Marshmallow

#for facebook sign in
import facebook
#for environmental variables for facebook API
import os


app = Flask(__name__)
#for marshmellow searliazer to work
ma = Marshmallow(app)

app.secret_key = "pouring monday"


@app.route('/todo', methods=['POST'])
def new_todo():
    """ Add a new todo to the DB return all todo to javascript """

    pass

@app.route('/todo/<id>', methods=['DELETE'])
def remove_todo():
    """ Remove a todo by id from the DB return nothing """

    pass

@app.route('/todo/check_mark/<id>', methods=['PUTS'])
def check_mark_todo():
    """ Checkmark a todo by id, update DB return nothing """

    pass







if __name__ == "__main__":

    app.debug = True

    connect_to_db(app)

    DebugToolbarExtension(app)

    app.run(host="0.0.0.0", port=5000)