from flask import (Flask, request, render_template, flash, session, jsonify, abort)
from model import *
from sqlalchemy import desc
#for facebook environmental variable
import os
import facebook


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

##### Used in many routes ####
def format_todo(todo):
    return {
        "content": todo.content,
        "id": todo.id,
        "created_at": todo.created_at
    }