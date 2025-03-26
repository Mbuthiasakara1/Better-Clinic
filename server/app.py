from flask import Flask,make_response,request,jsonify,session
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_restful import Resource,Api
from flask_sqlalchemy import SQLAlchemy
from models import db
from models.user import User
from models.session import Session
from models.payment import Payment
from models.response import Response
from models.questions import Question
import os
from datetime import datetime, timedelta

from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usichizi.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] =False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] =True
app.config['SECRET_KEY'] = b'02667d64003f1664068fb200f220e89c3aba8c64289a520d3c61b05fcf8f80f4f903a4d3e2c46a73fcbdc7f4764a0028d096ddab9fc1e710'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] =  False
app.config['SESSION_PERMANENT'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

CORS(app, supports_credentials=True, resources={r"/*": {
    "origins": "http://localhost:5173",
    "allow_headers": ["Content-Type", "Authorization"],
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    # "supports_credentials": True
}})

db.init_app(app)  
migrate = Migrate(app, db) 
bcrypt = Bcrypt(app)
api = Api(app)


@app.route('/api')
def index():
    return '<h1>Index of Usichizi</h1>'

from flask import request, session, jsonify
from flask_restful import Resource
from app import db
from models import User

class RegisterUser(Resource):
    def post(self):
        try:
            data = request.get_json()
            print("Received data:", data)  

            # Ensure required fields exist
            required_fields = ["gender", "age_group", "relationship_status"]
            for field in required_fields:
                if field not in data:
                    return {"message": f"Missing field: {field}"}, 400

            new_user = User(
                gender=data["gender"],
                age_group=data["age_group"],
                relationship_status=data["relationship_status"],
            )
            db.session.add(new_user)
            db.session.commit()

            session["user_id"] = new_user.id
            print("Session data after user creation:", jsonify(session))
            response = make_response(jsonify({"message": "User created successfully"}), 201)
            response.set_cookie("session", str(new_user.id), httponly=True)  
            return response

        except Exception as e:
            return {"message": "Error creating user", "error": str(e)}, 500
  
class GetSessionUser(Resource):
    def get(self):
        user_id = session.get("user_id") 
        if not user_id:
            return {"message": "No active session"}, 401  
        
        user = User.query.get(user_id)  
        if not user:
            return {"message": "User not found"}, 404 

        return {
            "user_id": user.id,
            "gender": user.gender,
            "age_group": user.age_group,
            "relationship_status": user.relationship_status,
        }, 200


class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        response = make_response(jsonify(user.to_dict()))
         
        return response

class Questions(Resource):
    def get(self):
        questions = Question.query.all()
        return jsonify([question.to_dict() for question in questions])
    def post(self):
        data = request.get_json()
        try:
            new_question = Question(
                question_text=data['question_text'],
                category=data['category'],
                options=data['options'],
            )
            db.session.add(new_question)
            db.session.commit()
            return {"message": "Question created successfully"}, 201  
        except Exception as e:
            return {"message": "Error creating question", "error": str(e)}, 500
        
class Responses(Resource):
    def get(self):
        responses = Response.query.all()
        return jsonify([response.to_dict() for response in responses])
    def post(self):
        data = request.get_json()
        try:
            responses = data.get("responses", [])  
            for response in responses:
                new_response = Response(
                    session_id=data["session_id"],
                    question_id=response["question_id"],
                    response_value=response["selected_option"]
                )
                db.session.add(new_response)
            db.session.commit()
            return {"message": "Responses created successfully"}, 201
        except Exception as e:
            return {"message": "Error creating responses", "error": str(e)}, 500
   


class Sessions(Resource):
    def get(self):
        sessions = Session.query.all()
        return jsonify([session.to_dict() for session in sessions])
      
    def post(self):  
        data = request.get_json()
        try:
            new_session = Session(
                user_id=data["user_id"],
                score=data['score'],
                paid=data['paid'],
                result_sent=data['result_sent']  
            )
            db.session.add(new_session)
            db.session.commit()
            return {"message": "Session created successfully"}, 201
        except Exception as e:
            return {"message": "Error creating session", "error": str(e)}, 500
api.add_resource(RegisterUser, '/api/user')
api.add_resource(GetSessionUser, "/sessionuser")
api.add_resource(UserById, '/api/<int:id>/user')
api.add_resource(Questions, '/api/questions')
api.add_resource(Responses, '/api/responses')
api.add_resource(Sessions, '/api/sessions')
# api.add_resource(SessionById, '/api/<int:user_id>/session')

if __name__ == '__main__':
    app.run(debug=True)
