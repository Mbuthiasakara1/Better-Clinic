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
from models.admin import Admin
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
import requests
from paypalpayment import create_order, get_access_token


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
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    # "supports_credentials": True
}})

db.init_app(app)  
migrate = Migrate(app, db) 
bcrypt = Bcrypt(app)
api = Api(app)

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

class AdminRegister(Resource):
    def post(self):
        try:
            data = request.get_json()
            if "username" not in data or "password" not in data:
                return {"message": "Missing field: username or password"}, 400

            if Admin.query.filter_by(username=data["username"]).first():
                return {"message": "Admin already exists"}, 400

            new_admin = Admin(username=data["username"])
            new_admin.set_password(data["password"])

            db.session.add(new_admin)
            db.session.commit()

            return {"message": "Admin created"}, 201
        except Exception as e:
            return {"message": "Error creating admin", "error": str(e)}, 500

class AdminLogin(Resource):
    def post(self):
        try:
            data = request.get_json()
            admin = Admin.query.filter_by(username=data.get("username")).first()

            if admin and admin.check_password(data.get("password")):
                session["admin_id"] = admin.id
                return {"message": "Login successful", "admin": admin.to_dict()}, 200
            return {"message": "Invalid credentials"}, 401
        except Exception as e:
            return {"message": "Login failed", "error": str(e)}, 500

class AdminLogout(Resource):
    def post(self):
        try:
            session.pop("admin_id", None)  
            return {"message": "Logout successful"}, 200
        except Exception as e:
            return {"message": "Logout failed", "error": str(e)}, 500

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

            session = db.session.get(Session, session_id)
            db.session.refresh(session) 

            if not session:
                return {"message": "Session not found"}, 404
        

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


class SessionById(Resource):
    def get(self, session_id):
        session = Session.query.filter_by(id=session_id).first()
        if not session:
            return {"message": "Session not found"}, 404
        return jsonify(session.to_dict())
    def patch(self, session_id):
        data = request.get_json()
        paid_status = data.get("paid")

        if paid_status is None:
            return {"error": "Missing 'paid' in request body"}, 400

        session = db.session.get(Session, session_id)

        if not session:
            return {"error": "Session not found"}, 404

        session.paid = paid_status
        db.session.commit()

        return {"message": "Session updated", "session_id": session.id, "paid": session.paid}, 200


@app.route("/pay", methods=["POST"])
def pay():
    try:
        data = request.get_json()

        amount = data.get("amount", "0.77")
        currency = data.get("currency", "USD")
        session_id = data.get("session_id")
        
        if not session_id:
            return jsonify({"error": "Session ID is required"}), 400

        # Create PayPal order
        order_response = create_order(amount, currency)
        order_id = order_response["order_id"]

        # Save to database
        payment = Payment(
            session_id=session_id,
            amount=amount,
            currency=currency,
            transaction_id=order_id,  
            status="pending",         
            created_at=datetime.utcnow()
        )

        db.session.add(payment)
        db.session.commit()

        return jsonify(order_response)
    
    except Exception as e:
        print("PayPal Order Creation Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/pay/confirm", methods=["POST"])
def confirm_paypal_payment():
    try:
        data = request.get_json()

        session_id = data.get("session_id")
        amount = data.get("amount", "100.00")
        currency = data.get("currency", "KES")
        transaction_id = data.get("transaction_id")  
        payment_date = datetime.utcnow()

        if not session_id or not transaction_id:
            print("Missing fields:", session_id, transaction_id)
            return jsonify({"error": "Missing session_id or transaction_id"}), 400

        # Find the existing pending payment
        existing_payment = Payment.query.filter_by(session_id=session_id).first()

        if existing_payment:
            if existing_payment.status == "completed":
                return jsonify({"error": "Payment already completed for this session"}), 400
            
            # Update the existing pending payment
            existing_payment.transaction_id = transaction_id
            existing_payment.status = "completed"
            existing_payment.payment_date = payment_date
            db.session.commit()

            return jsonify({"message": "Payment confirmed and updated successfully"})
        
       
        payment = Payment(
            session_id=session_id,
            amount=amount,
            currency=currency,
            transaction_id=transaction_id,
            status="completed",
            payment_date=payment_date,
            created_at=datetime.utcnow()
        )

        db.session.add(payment)
        db.session.commit()

        return jsonify({"message": "Payment recorded successfully"})

    except Exception as e:
        print("Payment Confirmation Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/admin/stats")
def admin_stats():
    try:
        # Payments
        total_payments = Payment.query.count()
        completed_payments = Payment.query.filter_by(status='completed').count()
        pending_payments = Payment.query.filter_by(status='pending').count()

        # Sessions
        total_sessions = Session.query.count()
        paid_sessions = Session.query.filter_by(paid=True).count()
        unpaid_sessions = Session.query.filter_by(paid=False).count()
        completed_sessions = Session.query.filter(Session.completed_at.isnot(None)).count()

        # Severity Categories
        severity_data = {
            "Normal": 0,
            "Mild": 0,
            "Moderate": 0,
            "Severe": 0
        }
        sessions = Session.query.all()
        for sess in sessions:
            result = sess.get_assessment_result()
            if result and result['severity'] in severity_data:
                severity_data[result['severity']] += 1

        return jsonify({
            "payments": {
                "total": total_payments,
                "completed": completed_payments,
                "pending": pending_payments
            },
            "sessions": {
                "total": total_sessions,
                "paid": paid_sessions,
                "unpaid": unpaid_sessions,
                "completed": completed_sessions
            },
            "severity_distribution": severity_data
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500 


api.add_resource(RegisterUser, '/api/user')
api.add_resource(GetSessionUser, "/sessionuser")
api.add_resource(UserById, '/api/<int:id>/user')    
api.add_resource(AdminRegister, "/api/admin/register")
api.add_resource(AdminLogin, "/api/admin/login")
api.add_resource(AdminLogout, "/api/admin/logout")
api.add_resource(Questions, '/api/questions')
api.add_resource(Responses, '/api/responses')
api.add_resource(ResponseById, '/api/<int:session_id>/response')
api.add_resource(Sessions, '/api/sessions')
api.add_resource(SessionById, '/api/<int:session_id>/session')


if __name__ == '__main__':
    app.run(debug=True)