from flask import (Flask, request, render_template, flash, session, jsonify, abort)
from model import *
from sqlalchemy import desc
#for facebook environmental variable
import os
import facebook

##### session helper functions #####
def current_user():
    """ Return the user object if in session """

    if 'current_user' in session:

        return User.query.get(session['current_user'])

    else:

        return None


###### facebook sign in helper functions #####
def facebook_app_id():
    """ Retrieve app_id from local environment """

    app_id=os.environ["APP_ID"]

    return app_id

##### "/" #######
def gather_all_todos_from_db():
    """ Gather all notes """

    todos = Todo.query.all()

    if todos:

        return todos

##### 'POST /notes' helper functions #####
def load_user(access_token):
    """ Use facebook access token to gather information """

    token = access_token
    graph = facebook.GraphAPI(token)
    args = {'fields': 'id, name, email'}
    profile = graph.get_object('me', **args)
    facebook_id = profile['id']

    #if profile_id in the database then sign them in if not load this information
    user = User.query.filter_by(facebook_id=facebook_id).one_or_none()

    if not user:

        user = User(facebook_id=facebook_id, name=profile['name'], email=profile['email'])
        db.session.add(user)
        db.session.commit()

    session['current_user'] = user.id
    session['access_token'] = access_token

    return 

##### /todo POST #######
def commit_todo_to_db(content):
    """ Take in todo content and add to DB 
        Return database info on new submission
    """

    todo = Todo(content=content)

    db.session.add(todo)
    db.session.commit()

    return todo

##### /todo/<id> DELETE #########
def remove_todo_from_db(id):
    """ Take in todo id and remove it from DB 
    Return None
    """

    Todo.query.filter_by(id=id).delete()
    db.session.commit()

    return

##### /todo/<id> PUT #######
def get_or_abort(model, object_id, code=404):
    """ Get an object with given id or an abort error with 404 default"""

    result = model.query.get(object_id)

    return result or abort(code)

def add_checkmark_to_db(id, isChecked):
    """ Take in todo id and add checkmark True in DB 
    Return None
    """
    todo = get_or_abort(Todo, id)
    todo.isChecked = isChecked
    
    db.session.commit()

    

##### Used in many routes ####
def format_todo(todo):
    return {
        "content": todo.content,
        "id": todo.id,
        "created_at": todo.created_at,
        "isChecked" : todo.isChecked
    }