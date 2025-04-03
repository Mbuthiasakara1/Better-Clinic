from flask import Flask,make_response,request,jsonify,session, request
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
import requests

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

PAYPAL_CLIENT_ID =  os.getenv('PAYPAL_CLIENT_ID')
PAYPAL_SECRET =  os.getenv('PAYPAL_SECRET')
PAYPAL_API_URL =  os.getenv('PAYPAL_API_URL')  # Change to live PayPal URL in production

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

def get_paypal_access_token():
    response = requests.post(
        f"{PAYPAL_API_URL}/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET),
        data={"grant_type": "client_credentials"},
    )
    return response.json().get("access_token")
@app.route("/api/orders", methods=["POST"])
def create_order():
    data = request.get_json()
    access_token = get_paypal_access_token()
    
    order_payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {
                    "currency_code": "KES",  
                    "value": "100.00",
                },
                "description": f"{data.get('membership')} Membership",
            }
        ],
    }

    response = requests.post(
        f"{PAYPAL_API_URL}/v2/checkout/orders",
        json=order_payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        },
    )
    return jsonify(response.json())

@app.route("/api/orders/<orderID>/capture", methods=["POST"])
def capture_order(orderID):
    access_token = get_paypal_access_token()
    
    response = requests.post(
        f"{PAYPAL_API_URL}/v2/checkout/orders/{orderID}/capture",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        },
    )
    
    order_data = response.json()
    if order_data.get("status") == "COMPLETED":
        # Here, save the payment info to a database (not shown)
        return jsonify({"success": True, "message": "Payment captured successfully"})
    
    return jsonify({"success": False, "message": "Payment capture failed"}), 400
@app.route('/api')
def index():
    return '<h1>Index of Usichizi</h1>'


class RegisterUser(Resource):
    def get(self):
        users=User.query.all()
        return {"users": [user.to_dict() for user in users]}
    
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
            return {"message": "User created", "user_id": new_user.id}, 201
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
            session_id = data["session_id"]

            # Store responses
            for response in responses:
                new_response = Response(
                    session_id=session_id,
                    question_id=response["question_id"],
                    response_value=response["selected_option"]
                )
                db.session.add(new_response)
                
            db.session.flush()  
            db.session.commit()  
<<<<<<< HEAD
            session = db.session.get(Session, session_id)
            db.session.refresh(session)  

            if not session:
                return {"message": "Session not found"}, 404
=======

            session = db.session.get(Session, session_id)
            db.session.refresh(session) 

            if not session:
                return {"message": "Session not found"}, 404
        
>>>>>>> 529fb015216a95cc3f8c6d95aa8ca286c3cc3b24

            # Get assessment results
            assessment_result = session.get_assessment_result()
            session.score = assessment_result["score"]  

            db.session.commit()  

            return {"message": "Responses recorded", "assessment_result": assessment_result}, 201
        except Exception as e:
            db.session.rollback()  
            return {"message": "Error processing responses", "error": str(e)}, 500
   
class ResponseById(Resource):
    def get(self, session_id):
        session = Session.query.filter_by(id=session_id).first()
        if not session:
            return {"message": "Session not found"}, 404
        responses = Response.query.filter_by(session_id=session_id).all()
        return jsonify([response.to_dict() for response in responses])
        
        

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
            return {"message": "Session created successfully","id":new_session.id}, 201
        except Exception as e:
            return {"message": "Error creating session", "error": str(e)}, 500

api.add_resource(RegisterUser, '/api/user')
api.add_resource(GetSessionUser, "/sessionuser")
api.add_resource(UserById, '/api/<int:id>/user')
api.add_resource(Questions, '/api/questions')
api.add_resource(Responses, '/api/responses')
api.add_resource(ResponseById, '/api/<int:session_id>/response')
api.add_resource(Sessions, '/api/sessions')
# api.add_resource(SessionById, '/api/<int:user_id>/session')

if __name__ == '__main__':
    app.run(debug=True)