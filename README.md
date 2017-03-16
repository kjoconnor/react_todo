#React Todo List

##Project Description:

A simple flask app with react front end that allows a user to create, view, check, and delete todo items. One page fully dynamic. A simple building block application for future projects to be built on-top of.

## Getting Started:

##Prerequisites:

1) Download the project in a directory of its own. Navigate into the new directory and type in the following command.  

    $ git clone https://github.com/laurengordonfahn/react_todo

2) Create a virtual environment using virtualenv to house the required frameworks if you are unsure you have this capacity visit https://virtualenv.pypa.io/en/stable/: 

```
$ virtualenv env
$ source env/bin/activate
```

3) Pip install will enable installation of the project requirements
If you are uncertain if you have pip install visit the website : https://pip.pypa.io/en/stable/installing/

4) Make sure you are in the first level of your newly created directory then pip install the requirements, the file will be read into the environment automatically:

```
$ pip install -r requirements.txt
```

5) For your information these are the project requirements found in the requirements.txt file

```
blinker==1.4
click==6.6
-e git+https://github.com/mobolic/facebook-sdk.git@43b609ee034195c794521e23792532471551c383#egg=facebook_sdk
Flask==0.12
Flask-DebugToolbar==0.10.0
flask-marshmallow==0.7.0
Flask-SQLAlchemy==2.1
itsdangerous==0.24
Jinja2==2.8.1
MarkupSafe==0.23
marshmallow==2.12.2
pkg-resources==0.0.0
psycopg2==2.6.2
pytz==2016.10
requests==2.13.0
six==1.10.0
SQLAlchemy==1.1.4
Werkzeug==0.11.15
```

## Installing:
1) create a database using postgres and source the database
``` 
    $ createdb todolist
    $ python model.py
```
2) create secrets file and source secrets 
    a) go to google and set up a developer acount to recieve ids
    b) create a secrets.sh file in the main directory
    ```
    $ touch secrets.sh
    ```
    c) put the following code into the secrets.sh file
    ```
    export googleClientId="< your client id here >"
    export googleAPIKey="< your API key here >"
    export googleClientSecret= "< place your client secret here >"
    ```
    d) in the terminal source the secrets environmental varibales you just added
    ```
    $ source secrets.sh
    ```
4) To run the server file server.py :
``` 
    $ python server.py
```

## Built With:
* Python- Backend Language
* Flask - Python web frame work
* SqlAlchemy- Database Toolkit for python
* PostgreSQL- Object Relational Database System
* React- Frontend Javascript Library

## Current Features Completed/In-Progress:
* Add a new todo with automatic display (complete)
* Delete a todo (complete)
* Checkmark a todo (complete)
* Google OAuth2 Sign-In (in-progress)


## Author:
* Lauren Gordon-Fahn

## Acknowledgments:
* To Kevin O'Connor of Reddit for sitting down with me and making OAuth2 make sense!