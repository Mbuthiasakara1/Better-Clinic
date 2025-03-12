from flask import Flask,make_response,request,jsonify,session
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_restful import Resource,Api
from config import db

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usichizi.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] =False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] =True

bcrypt=Bcrypt(app)
api=Api(app)
migrate=Migrate(app,db)
db.init_app(app)

@app.route('/api')
def index():
    return '<h1>Index of Usichizi</h1>'
