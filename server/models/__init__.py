#__init__.py 
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from models.user import User
from models.session import Session
from models.payment import Payment
from models.response import Response
from models.questions import Question
from models.admin import Admin