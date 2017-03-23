from flask import (Flask, request, render_template, flash, session, jsonify, abort)
from model import *
from sqlalchemy import desc
#for facebook environmental variable
import os
import facebook

##### Google SignIn #####
def generate_state():
    """ Create state for google SignIn security enters to session returns none """ 
    state = hashlib.sha256(os.urandom(1024)).hexdigest()
    session['state'] = state
    

##### "/" #######
def gather_all_todos_from_db():
    """ Gather all notes """

    todos = Todo.query.all()

    if todos:

        return todos

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