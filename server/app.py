import sys
import os
import time
sys.path.append(os.path.dirname(os.path.abspath(__file__)))  
import base64
import json
import traceback
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
from datetime import datetime, timedelta
from dotenv import load_dotenv
import requests
from paypalpayment import create_order
from base64 import b64encode
from base64 import b64encode
import re
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///usichizi.db'
# app.config['SQLALCHEMY_DATABASE_URI']=os.getenv("DATABASE")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] =False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] =True
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] =  True
app.config['SESSION_PERMANENT'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)

CORS(app,
     supports_credentials=True,
     resources={r"/*": {
         "origins": [
             "http://localhost:5173"
         ]
     }},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
)


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

class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"message": "User not found"}, 404
        
        response = make_response(jsonify(user.to_dict()))
         
        return response
      
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

    def delete(self, session_id):
        session = db.session.get(Session, session_id)

        if not session:
            return {"message": "Session not found"}, 404

        try:
            db.session.delete(session)
            db.session.commit()
            return {"message": "Session deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"An error occurred: {str(e)}"}, 500


@app.route("/api/sessions/<session_id>/invalidate", methods=["POST"])
def invalidate_session(session_id):
    session = Session.query.filter_by(id=session_id).first()
    if session:
        session.is_active = False
        db.session.commit()
        return jsonify({"message": "Session invalidated"})
    return jsonify({"error": "Session not found"}), 404
        
@app.route("/pay", methods=["POST"])
def pay():
    try:
        data = request.get_json()

        amount = data.get("amount", "1.99")
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
        return jsonify({"error": str(e)}), 500

@app.route("/pay/confirm", methods=["POST"])
def confirm_paypal_payment():
    try:
        data = request.get_json()

        session_id = data.get("session_id")
        amount = data.get("amount")
        currency = data.get("currency")
        transaction_id = data.get("transaction_id")  
        email_address=data.get("email_address")
        payment_date = datetime.utcnow()

        if not session_id or not transaction_id:
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
            existing_payment.email_address = email_address
            db.session.commit()

            return jsonify({"message": "Payment confirmed and updated successfully"})
        
       
        payment = Payment(
            session_id=session_id,
            amount=amount,
            currency=currency,
            transaction_id=transaction_id,
            email_address=email_address,
            status="completed",
            payment_date=payment_date,
            created_at=datetime.utcnow()
        )

        db.session.add(payment)
        db.session.commit()

        return jsonify({"message": "Payment recorded successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/check-payment/<int:session_id>", methods=["GET"])
def check_payment(session_id):
    session = Session.query.get(session_id)
    if not session:
        return jsonify({"paid": False, "message": "Session not found"}), 404
        
    return jsonify({"paid": session.paid})    

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
    
@app.route("/admin/session-table")
def session_table():
    try:
        sessions = Session.query.join(User).outerjoin(Payment).all()
        session_data = []
        for sess in sessions:
            user = sess.user
            payment = sess.payment[0] if sess.payment else None
            result = sess.get_assessment_result()

            session_data.append({
                "session_id": sess.id,
                "user_id": user.id,
                "gender": user.gender,
                "age_group": user.age_group,
                "relationship_status": user.relationship_status,
                "score": sess.score,
                "severity": result.get("severity") if result else "N/A",
                "category": result.get("category") if result else "N/A",
                "paid": sess.paid,
                "payment_status": payment.status if payment else "No Payment",
                "receipt": payment.transaction_id if payment else "N/A",
                "amount": float(payment.amount) if payment else 0.00,
                "currency": payment.currency if payment else "KES",
                "phone": payment.phone_number if payment else "N/A",
                "email": payment.email_address if payment else "N/A",
                "date": payment.payment_date.strftime("%Y-%m-%d %H:%M:%S") if payment and payment.payment_date else "N/A"
            })

        return jsonify(session_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


class MpesaGateWay:
    shortcode = None
    consumer_key = None
    passKey = None
    consumer_secret = None
    access_token_url = None
    access_token = None
    access_token_expiration = None
    checkout_url = None
    timestamp = None

    def __init__(self):
          
        now = datetime.now()
        self.shortcode = os.getenv('business_shortcode')
        # print(f"1. shortcode {self.shortcode}")

        self.consumer_key = os.getenv('CONSUMER_KEY')
        # print(f"1.1. consumer_key outside method call {self.consumer_key}")
        self.consumer_secret = os.getenv('CONSUMER_SECRET')
        # print(f"1.2. consumer_secret outside method call {self.consumer_secret}")

        self.passKey = os.getenv('passkey')
        self.access_token_url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        # print(f"2. access_token_url {self.access_token_url}")

        self.password = self.generate_password()
        # print(f"4. password {self.password}")

        self.c2b_callback = "https://a459-102-2-122-255.ngrok-free.app/callback_payment"
        self.checkout_url = (
            "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        )
   
        try:
            # print(f"*** PREPARE ACCESS TOKEN *****")
            self.access_token = self.getAccessToken()
            # print(f"6. access_token {self.access_token}")
            if self.access_token is None:
                # print(f"7. Request for access token failed.")
                raise Exception("Request for access token failed.")
        except Exception as e:
            print(f"8. Error {e}")
            # logger.error("Error {}".format(e))
        else:
            self.access_token_expiration = time.time() + 3400
            # print(f"9. access_token_expiration {self.access_token_expiration}")

    def getAccessToken(self):
        try:
            # encode
            key_concat = str(self.consumer_key) + ":" + \
                str(self.consumer_secret)
            auth_string = key_concat.encode("ascii")
            auth_head = base64.b64encode(auth_string).decode("utf-8")

            payload = {}
            files = {}

            self.headers = {"Authorization": "Basic " + auth_head}

            res = requests.request(
                "GET", self.access_token_url, headers=self.headers, data=payload, files=files)

        except Exception as err:
            # logger.error("Error {}".format(err))
            raise err
        else:
            token = res.json()["access_token"]
            # print("Tokens"+str(token))
            self.headers = {"Content-Type": "application/json",
                        "Authorization": "Bearer %s" % token}
            return token

    class Decorators:
        @staticmethod
        def refreshToken(decorated):
            def wrapper(gateway, *args, **kwargs):
                if (
                    gateway.access_token_expiration
                    and time.time() > gateway.access_token_expiration
                ):
                    token = gateway.getAccessToken()
                    gateway.access_token = token
                return decorated(gateway, *args, **kwargs)

            return wrapper

    def generate_password(self):
        """Generates mpesa api password using the provided shortcode and passkey"""
        now = datetime.now()
        self.timestamp = now.strftime("%Y%m%d%H%M%S")
        # print(f"timestamp => {self.timestamp}")
        password_str = str(self.shortcode) + \
            str(self.passKey) + str(self.timestamp)
        password_bytes = password_str.encode("ascii")
        # print(f"3. password_bytes==>{password_bytes}")
        return base64.b64encode(password_bytes).decode("utf-8")

    @Decorators.refreshToken
    def stk_push_request(self, payload):
        # Get the actual request object if available, otherwise use None
        request_obj = payload.get("request")
        data = payload["data"]
        amount = data["amount"]
        phone_number = data["phone_number"]
     
        reference = data["reference"]
        description = data["description"]

        req_data = {
            "BusinessShortCode": self.shortcode,
            "Password": self.password,
            "Timestamp": self.timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": 1,  # Fixed: Use the actual amount instead of hardcoded 1
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": self.c2b_callback,
            "AccountReference": reference,
            "TransactionDesc": description,
        }
        # print(req_data)

        res = requests.post(
            self.checkout_url, json=req_data, headers=self.headers, timeout=30
        )

        res_data = res.json()
        
        # logger.info("Mpesa request data {}".format(payload))
        # logger.info("Mpesa response info {}".format(res_data))
        # print("Res Status",res.ok)
        
        # print("Res Data",res_data)

        if res.ok:
            # Only try to access remote_addr if request_obj is a valid Flask request
            if request_obj and hasattr(request_obj, 'remote_addr'):
                data["ip"] = request_obj.remote_addr
            else:
                data["ip"] = "unknown"  # Fallback value if no valid request
                
            data["checkout_request_id"] = res_data["CheckoutRequestID"]
            # Util.send_email(send_mail_data)
        return res_data

def fetch_access_token():
    consumer_key = os.getenv('CONSUMER_KEY')
    consumer_secret = os.getenv('CONSUMER_SECRET')
    
    if not consumer_key or not consumer_secret:
        return None
    
    credentials = f"{consumer_key}:{consumer_secret}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()

    url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    headers = {"Authorization": f"Basic {encoded_credentials}"}

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json().get("access_token")
    except Exception as e:
        return f"Error fetching access token:", e
    return None

# ---------------------------
# Route: Return token (Optional)
# ---------------------------
@app.route('/access_token', methods=['GET'])
def get_access_token():
    token = fetch_access_token()
    if token:
        return jsonify({"access_token": token})
    return jsonify({"error": "Failed to get access token"}), 500

# ---------------------------
# Route: Initiate STK Push
# ---------------------------
@app.route('/make_payment', methods=['POST'])
def payment_prompt():
    try:
        access_token = fetch_access_token()
        if not access_token:
            return jsonify({"error": "Failed to retrieve access token"}), 500

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {access_token}'  
        }

        data = request.get_json()
        phone_number = re.sub(r'\D', '', data.get("phone_number"))
        session_id = data.get("session_id")

        if not phone_number or not session_id:
            return jsonify({"error": "Phone number and session ID are required"}), 400

        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        passkey = os.getenv("passkey")
        if not passkey:
            print("⚠️ Passkey is missing in env")
        else:
            print("Passkey exists")
        shortcode = "5552258"
        
        data_to_encode = shortcode + passkey + timestamp
        password = base64.b64encode(data_to_encode.encode()).decode('utf-8')

        payload = {
            "BusinessShortCode": shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline", 
            "Amount": 1,
            "PartyA": phone_number,
            "PartyB": shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": "https://6730-197-237-161-183.ngrok-free.app/callback_payment",
            "AccountReference": "ROYAL ASSETS LIMITED",
            "TransactionDesc": "Payment of health awareness"
        }

        url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        res_data = response.json()

        transaction_id = res_data.get("CheckoutRequestID")
        if not transaction_id:
            return jsonify({"error": "No CheckoutRequestID received"}), 500

        new_payment = Payment(
            session_id=session_id,
            amount=1,
            currency="KES",
            transaction_id=transaction_id,
            status="pending",
            created_at=datetime.utcnow()
        )

        db.session.add(new_payment)
        db.session.commit()

        return jsonify(res_data)

    except requests.exceptions.HTTPError as e:
        return jsonify({"error": f"HTTP error occurred: {str(e)}"}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Network error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


# ---------------------------
# Route: Callback URL
# ---------------------------
@app.route('/callback_payment', methods=['POST'])
def payment_callback():
    data = request.get_json()
    
    
    result = data.get("Body", {}).get("stkCallback", {})
    result_code = result.get("ResultCode")
    transaction_id = result.get("CheckoutRequestID")

    # Attempt to find the matching payment in the DB
    payment = Payment.query.filter_by(transaction_id=transaction_id).first()
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    # Parse CallbackMetadata safely
    metadata = result.get("CallbackMetadata", {}).get("Item", [])
    payment_data = {}
    try:
        for item in metadata:
            name = item.get("Name")
            value = item.get("Value")
            if name:
                payment_data[name] = value
    except Exception as e:
        return f"Error parsing CallbackMetadata:", e

    # Update payment record
    try:
        if result_code == 0:
            payment.status = "completed"

            # Update amount if present
            amount = payment_data.get("Amount")
            if amount is not None:
                payment.amount = amount

            # Update transaction date
            txn_date = str(payment_data.get("TransactionDate"))
            if txn_date and len(txn_date) == 14:
                try:
                    parsed_date = datetime.strptime(txn_date, "%Y%m%d%H%M%S")
                    payment.payment_date = parsed_date
                except Exception as date_error:
                    return f"Date parsing error:", date_error
            
            phone_number = payment_data.get("PhoneNumber")
            if phone_number:
                payment.phone_number = phone_number    

        else:
            payment.status = "failed"

        
        db.session.add(payment)
        db.session.commit()
        return jsonify({"message": "Payment status updated"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Server error updating payment"}), 500

@app.route('/payment_status', methods=['POST'])
def payment_status():
    try:
        # Get the transaction_id from the request body
        data = request.get_json()
        transaction_id = data.get('transaction_id')
        
        if not transaction_id:
            return jsonify({"error": "Transaction ID is required"}), 400

        # Query the database for the payment record
        payment = Payment.query.filter_by(transaction_id=transaction_id).first()
        
        if not payment:
            return jsonify({"error": "Payment not found"}), 404

        # Return the payment status in the response
        return jsonify({
            "status": payment.status, 
            "amount": payment.amount,
            "currency": payment.currency,
            "transaction_id": payment.transaction_id,
            "payment_date": payment.payment_date.strftime('%Y-%m-%d %H:%M:%S') if payment.payment_date else None,
        }), 200

    except Exception as e:
        # Catch any other errors
        return jsonify({"error": f"Error fetching payment status: {str(e)}"}), 500


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
    app.run(debug=True,  host="0.0.0.0", port=5000)